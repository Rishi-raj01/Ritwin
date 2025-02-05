const usermodel= require("../model/usermodel");
const ordermodel=require("../model/ordermodel")
const jwt=require("jsonwebtoken")
const {hashPassword, comparePassword} =require("../helpers/authhelper")
//const jwt_key="hvvgdxrrdxffcygvvgc";
const jwt_key=process.env.JWT_SECRET;
const {sendMail } =require("../config/Nodemailer")
const SendmailTransport =require("nodemailer/lib/sendmail-transport")

module.exports.signup = async function signup(req, res) {
    try {
        let { name, email, password, location, phone } = req.body;

        if (!name) {
            return res.send({ message: "name is required" });
        }
        if (!email) {
            return res.send({ message: "email is required" });
        }
        if (!password) {
            return res.send({ message: "password is required" });
        }
        if (!phone) {
            return res.send({ message: "phone is required" });
        }
        if (!location) {
            return res.send({ message: "location is required" });
        }

        let existinguser = await usermodel.findOne({ email });
        if (existinguser) {
            return res.status(400).send({
                success: false, 
                message: "user is already signed up",
            });
        } 

        const hashedpassword = await hashPassword(password); // `hashPassword` now executes
        const user = await new usermodel({name,email,phone, location, password: hashedpassword,}).save();
        // let dataobj=req.body;
        // let user=await usermodel.create(dataobj);
        sendMail("signup",user)
        res.status(201).send({
            success: true,
            message: "User signed up successfully",
            data: {name,email,phone, location}
        });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};

module.exports.login=async function login(req,res) {
    try {
         const {email,password}=req.body;
         if(!email ||!password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
         }
         //check user 
         const user=await usermodel.findOne({email});
         if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })
         }
         const match=await comparePassword(password,user.password)
         if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid password"
            })
         }
         //if found in database then create a token 
         const token =await jwt.sign({_id:user._id},jwt_key,{expiresIn:"15d"});
         res.status(200).send({
            success:true,
            message:"login successful",
            user:{
                name:user.name,
                _id:user._id,
                email:user.email,
                phone:user.phone,
                location:user.location,
                role:user.role,
                token:token}, token,
         })
        
    } catch (error) {
        console.log("error is ",error)
        res.status(500).send({
            success:false,
            message:" error in login",
            error
        })
        
    }
    
}

//testcontroller
module.exports.testcontroller= function testcontroller(req,res) {
     console.log("protected")
     res.send("protected route ")
}


module.exports.updateProfile = async function updateProfile(req, res) {
    try {
        const { name, email, password, location, phone } = req.body;

        // Find the user by ID
        const user = await usermodel.findById(req.user._id);

        // Validate password length if provided
        if (password && password.length < 4) {
            return res.status(400).json({
                error: "Password should be at least 4 characters long",
            });
        }

        // Hash the password if provided
        const hashedpassword = password ? await hashPassword(password) : undefined;

        // Update the user
        const updatedUser = await usermodel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedpassword || user.password,
                phone: phone || user.phone,
                location: location || user.location,
            },
            { new: true } // Return the updated document
        );

        // Respond with success
        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            updatedUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while updating profile",
            error,
        });
    }
};


module.exports.getorders=async function getorders(req,res) {
    try {
        const orders=await ordermodel.find({buyer:req.user._id}).populate("products").populate("buyer","name")  // populate("products",'-photo')
        res.json(orders)
    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
            message:"error while getting orders",
            error
         })
    }
}
module.exports.getAllorders=async function getAllorders(req,res) {
    try {
        const orders=await ordermodel.find({}).populate("products",'-photo').populate("buyer","name location  phone").sort({ createdAt: -1 }) // populate("products",'-photo')
        res.json(orders)
    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
            message:"error while all getting orders",
            error
         })
    }
}

module.exports.orderStatus=async function orderStatus(req,res) {
    try {
        const{orderId} =req.params
        const {status} =req.body;
        const orders=await ordermodel.findByIdAndUpdate(orderId,{status},{new:true})
     res.json()
    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
            message:"error while changing order status",
            error
         })
    }
    
}
module.exports.alluser = async function alluser(req, res) {
    try {
      // Fetch all users from the database
      
      const users = await usermodel.find({}, "-password"); // Exclude sensitive fields like 'password'
    //   console.log("user from db is ",users)
      // Send a success response
      res.status(200).send({
        success: true,
        users,
      });
    } catch (error) {
      console.error("Error while fetching users:", error.message);
  
      // Send a generic error response
      res.status(500).send({
        success: false,
        message: "An error occurred while retrieving users. Please try again later.",
      });
    }
  };
  module.exports.getAdminOrders = async function getAdminOrders(req, res) {
    try {
        const { userId } = req.params;

        const orders = await ordermodel
            .find({ buyer: userId })
            .populate('buyer', 'name email')
            .populate({ path: 'products', select: 'name price' });


        const enrichedOrders = orders.map(order => {
            const totalAmount = order.products.reduce(
                (sum, product) => sum + (product.price || 0), 
                0
            );
            return {
                ...order.toObject(),
                totalAmount,
            };
        });

       // console.log("Orders from backend: ", enrichedOrders);
        res.status(200).send({ success: true, orders: enrichedOrders });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error fetching user orders', error });
    }
};


module.exports.forgetpassword = async function forgetpassword(req, res) {
    let data = req.body;
    try {
        const user = await usermodel.findOne({ email: data.email });
        if (user) {
            const token = await user.createresettoken();
            //await nhi kia to promise return krega 
        
            
            const resetpasswordlink = `${req.protocol}://${req.get('Host')}/user/resetpassword/${token}`;
            console.log(resetpasswordlink);
            
            console.log("Reset token from createresettoken should match with database:", user.resettoken);
            let obj = {
                resetpasswordlink: resetpasswordlink,
                email: data.email
            };
            sendMail('resetpassword', obj);
            return res.send({
                success:true,
                message: "Reset password link sent to your email"
            });
        } else {
            return res.send({
                success:false,
                message: "Please sign up"
            });
        }
    } catch (err) {
        res.send({
            message: err.message
        });
    }
};


// module.exports.resetpassword = async function resetpassword(req, res) {
//     try {
        
//         const token = req.params.token; // Extract token from req.params
//         console.log("Token:", token); // You can now access the token
//         let { password, confirmpassword } = req.body;

//         // Find the user by reset token
//         const user = await usermodel.findOne({ resettoken: token });
//         console.log("user is :",user)
//         // Reset password if user found
//         if (user) {
//             user.resetpasswordhandler(password, confirmpassword);
//             user.resettoken = undefined; // Clear reset token after password reset
//             await user.save();
//             res.send({
//                 message: "Password reset successfully. Please login again."
//             });
//         } else {
//             res.send({
//                 message: "User not found"
//             });
//         }
//     } catch (err) {
//         res.send({
//             message: err.message
//         });
//     }
// };

module.exports.resetpassword = async function resetpassword(req, res) {
    try {
        const token = req.params.token; // Extract token from URL
        const { password, confirmPassword } = req.body;
   
        if (password !== confirmPassword) {
            console.log("password is ",password,"confirmpassword is ",confirmPassword)
            console.log("password didnt matched");
            return res.status(400).send({ message: "Passwords do not match" });
            
        }

        // Find the user by reset token
        const user = await usermodel.findOne({ resettoken: token });
        console.log("user is ",user)
        if (user) {
            // Use the resetpasswordhandler method to update the password
            await user.resetpasswordhandler(password, confirmPassword);
            await user.save(); // Save the updated user

            res.send({
                success:true,
                message: "Password reset successfully. Please login again."
            });
        } else {
            res.status(404).send({
                success:false,
                message: "Invalid or expired reset token"
            });
        }
    } catch (err) {
        res.status(500).send({
            success:false,
            message: err.message
        });
    }
};

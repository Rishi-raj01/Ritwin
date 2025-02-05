const express=require("express")
const authrouter=express.Router();
const {signup,login,testcontroller,updateProfile,getorders,getAllorders,orderStatus,alluser,getAdminOrders,forgetpassword,resetpassword} = require("../controller/authcontroller")
const{requireSignIn, isadmin} =require("../middlewares/authmiddleware");
const { isAdmin } = require("../helpers/authhelper");

authrouter.route("/signup")
.post(signup)
authrouter.route("/login")
.post(login)
authrouter.get("/test",requireSignIn,isadmin,  testcontroller)
//protected route 
authrouter.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  }); 

  authrouter.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  }); 

  authrouter.put('/profile',requireSignIn,updateProfile)

//orders
authrouter.get('/orders',requireSignIn,getorders)

authrouter.get('/orders/:userId',requireSignIn,isAdmin,getAdminOrders)


authrouter.get("/all-user",requireSignIn,isAdmin,alluser)

//orders
authrouter.get('/all-orders',requireSignIn,isAdmin,getAllorders)
//status update
authrouter.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatus)
//forget password
authrouter.post("/forgetpassword",forgetpassword)
authrouter.post("/resetpassword/:token",resetpassword)


module.exports=authrouter
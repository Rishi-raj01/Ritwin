const productmodel=require("../model/productmodel")
const categorymodel=require("../model/CategoryModel")
const reviewmodel =require("../model/reviewmodel")
const mongoose=require("mongoose")
const formidable=require("express-formidable")
const Razorpay=require("razorpay");
const crypto = require("crypto");
const fs=require("fs");
const cloudinary = require('cloudinary').v2
require("dotenv").config();
var braintree = require("braintree");
const path = require("path");
const slugify=require("slugify");
const ordermodel=require("../model/ordermodel")
const {sendMail } =require("../config/Nodemailer")
const SendmailTransport =require("nodemailer/lib/sendmail-transport")


module.exports.getallproducts=async function getallproducts(req,res){
    try {
        console.log("get all product called")
        let products=await productmodel.find().populate("category").select("-photo").limit(30).sort({createdAt:-1}); 
       // console.log("all product called found",products)
        if(products){
            return res.send({
                success:true,
                total:products.length,
                message:"all product retreived",
                data:products,
                 //not necessary to write "data" we can write anything here
              products
            })
        }
        else{
            console.log("nothing found here")
            return res.status(400).send({
                success:false,
                message:"no product found"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        
    }
}


// module.exports.createProduct = async function createProduct(req, res) {
//     try {
//         console.log("create product working");
//         const { name, description, price, category, quantity, shipping } = req.fields;
//         console.log(req.fields);
//         if (!name || !description || !price || !category || !quantity || !shipping) {
//             return res.status(400).send({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }
          
  
//         const { photo } = req.files;
//          // Validate photo size
//          if (photo && photo.size > 6 * 1024 * 1024) { // 6 MB in bytes
//             return res.status(400).send({
//                 success: false,
//                 message: "Photo size should not exceed 6 MB",
//             });
//         }
//         const product = new productmodel({ ...req.fields, slug: slugify(name) }); // Create a new product instance
  
//         if (photo) {
//             // Read the photo file and set it in the product model
//             product.photo.data = fs.readFileSync(photo.path);
//             product.photo.contentType = photo.type;
//         }
  
//         await product.save(); // Save the product to the database
//         res.status(200).send({
//             success: true,
//             message: "Product Created Successfully",
//             product, // Send the saved product in the response
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             error,
//             message: "Error in creating product",
//         });
//     }
//   };
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.createProduct = async function createProduct(req, res) {
  try {
      console.log("create product working");
      console.log("Files received:", req.files.photos); // Debugging log

      const { name, description, price, category, quantity, shipping } = req.fields;
      if (!name || !description || !price || !category || !quantity || !shipping) {
          return res.status(400).send({ success: false, message: "All fields are required" });
      }

      const product = new productmodel({ ...req.fields, slug: slugify(name) });

      // Ensure `req.files.photos` is an array
      const files = req.files.photos ? (Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos]) : [];

      if (files && files.length > 0) {
          const uploadedImages = await Promise.all(
              files.map(async (photo) => {
                  if (photo.size > 6 * 1024 * 1024) {
                      throw new Error("Photo size should not exceed 6 MB");
                  }

                  console.log("Uploading:", photo.path); // Debugging log

                  const result = await cloudinary.uploader.upload(photo.path, { folder: "products" });

                  return result.secure_url; // Store image URLs
              })
          );

          product.photos = uploadedImages; // Save URLs in MongoDB
      }

      await product.save();

      res.status(200).send({
          success: true,
          message: "Product Created Successfully",
          product,
      });
  } catch (error) {
      console.log("Error:", error);
      res.status(500).send({
          success: false,
          error: error.message || error,
          message: "Error in creating product",
      });
  }
};


module.exports.getproduct=async function getproduct(req,res){
    try {
       // console.log("get product called")
        let slug=req.params.slug;
       // console.log("slug from backend is ",slug)
        // Use findOne instead of findById
       const product = await productmodel.findOne({ slug: slug }).populate('category');
        // console.log("from backend product is",product)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            // product: {
            //     ...product._doc,
            //    // firstPhoto: product.photos.length > 0 ? product.photos[0] : null, // First image for homepage
            // }
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error while fetching product", error });
    }
}


// module.exports.updateproduct = async function updateproduct(req, res) {
//   try {
//     const fields = req.fields || {};
//     const { name, description, price, category, quantity, shipping } = fields;
//     const productId = req.params.id;

//     console.log("Received fields:", fields);
//     console.log("Received photo(s):", req.files);

//     // Update product details
//     const updatedProduct = await productmodel.findByIdAndUpdate(
//       productId,
//       { ...fields, slug: slugify(name || "") },
//       { new: true }
//     );

//     // Process uploaded photos
//     const photoFiles = req.files?.photo;
//     if (photoFiles) {
//       const photoUrls = [];

//       // Ensure `photoFiles` is treated as an array
//       const filesArray = Array.isArray(photoFiles) ? photoFiles : [photoFiles];

//       // Upload each file to Cloudinary
//       for (let file of filesArray) {
//         const result = await cloudinary.uploader.upload(file.path);
//         photoUrls.push(result.secure_url);
//       }

//       // Update product with new photo URLs
//       updatedProduct.photo = photoUrls;
//       await updatedProduct.save();
//     }

//     res.status(200).send({
//       success: true,
//       message: "Product updated successfully",
//       updatedProduct,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in updating product",
//     });
//   }
// };




module.exports.updateproduct = async function updateproduct(req, res) {
  try {
    const fields = req.fields || {};
    const { name, description, price, category, quantity, shipping } = fields;
    const productId = req.params.id;

    console.log("Received fields:", fields);
    console.log("Received files:", req.files);

    // Fetch existing product
    const existingProduct = await productmodel.findById(productId);
    if (!existingProduct) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    // Process uploaded photos
    let newPhotos = existingProduct.photos || []; // Keep existing photos
    if (req.files?.photo) {
      const photoFiles = Array.isArray(req.files.photo) ? req.files.photo : [req.files.photo];

      const uploadedUrls = await Promise.all(
        photoFiles.map(async (file) => {
          console.log("Uploading file to Cloudinary:", file.path);
          const result = await cloudinary.uploader.upload(file.path);
          console.log("Cloudinary Upload Result:", result);

          try {
            fs.unlinkSync(file.path); // Delete local file after upload
          } catch (err) {
            console.warn("Error deleting local file:", err);
          }

          return result.secure_url;
        })
      );

      newPhotos = [...newPhotos, ...uploadedUrls]; // Append new images
    }

    // Update product details
    const updatedProduct = await productmodel.findByIdAndUpdate(
      productId,
      { ...fields, slug: slugify(name || ""), photos: newPhotos },
      { new: true }
    );

    console.log("Updated product with photos:", updatedProduct);

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
    });
  }
};




module.exports.deleteproduct=async function deleteproduct(req,res){
    try {
        let product=await productmodel.findByIdAndDelete(req.params.id);
        if(product){
            return res.status(200).send({
            success:true,
              message:"product deleted successfully",
              product
            })
          }
    }catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
        });
     }
};

module.exports.getphoto=async function getphoto(req,res) {
  const { pid } = req.params;

    // Check if the pid is a valid ObjectId
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).send({
            success: false,
            message: "Invalid product ID",
        });
    }
    try {
        const product=await productmodel.findById(req.params.pid).select("photo")
        if(product?.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });  
    }
    
}

module.exports.productFilter=async function productFilter(req,res){
    try {
        const {checked,radio}=req.body;
        let args={}
        if(checked.length>0) args.category=checked
        if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
        const products=await productmodel.find(args)
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"error while filtering product",
            error
        })
    }
}

module.exports.productCount=async function productCount(req,res ){
try {
//const total=await productmodel.find({}.estimatedDocumentCount())
const total = await productmodel.countDocuments();
   res.status(200).send({
    success:true,
    total
   })
} catch (error) {
    console.log(error)
    res.status(400).send({
        message:"error in product count",
        error,
        success:false
    })
}
}

module.exports.productList=async function productList(req,res){
    try {
        const perPage=12;
        const page=req.params.page?req.params.page:1
        const products=await productmodel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:false,
            message:"error in per page ctrl "
        })
    }
}
module.exports.searchProduct=async function searchProduct(req,res){
    try {
     const {keyword}=req.params;
     const results = await productmodel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }).select("-photo");
      console.log(results)
     res.json(results)
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error,
            success:false,
            message:"error in searching product"
        })
        
    }
}
module.exports.getSimilarProduct=async function getSimilarProduct(req,res){
    try {
        const {pid,cid}=req.params;
        const products=await productmodel.find({
            category:cid,
            _id:{$ne:pid}
        }).limit(8).populate('category')
        res.status(200).send({
          success:true,
          products,
        })
       // console.log("products in backend is ",products);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in finding related product",
            error
        })
    }
}

module.exports.productCategory=async function productCategory(req,res){
    try {
        const  category=await categorymodel.findOne({slug:req.params.slug})
        const products=await productmodel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"something went wrong in fetching product category",
            error
        })
    }
}





var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // merchantId: "sbx93brp2ncgpfkn",
    // publicKey: "3rd4ycjy4gygkjht",
    // privateKey: "d13311816cc247f964785b7a66da030b",
    merchantId: "zm7jxgzhj4y6vvqn",
    publicKey: "5pb55p94mp6tnbpm",
    privateKey: "31c7ee57ecc098f6b17e733636bb10b9",
  });

  //payment gateway api
module.exports.braintreeToken=async function braintreeToken(req,res){
    try {
        console.log("create token called")
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    
    }
    }

    
module.exports.braintreepayment = async function braintreepayment(req, res) {
  try {
    console.log("braintreepayment is working");

    const { nonce, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid" });
    }

    let total = 0;
    cart.map((item) => {
      total += item.price;
    });

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async function (error, result) {
        if (error) {
          console.error("Braintree Transaction Error:", error);
          return res.status(500).json({ error: "Transaction failed" });
        }

        if (result) {
          try {
            const order = new ordermodel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            });
            await order.save();
            res.json({ ok: true });
          } catch (saveError) {
            console.error("Order Saving Error:", saveError);
            res.status(500).json({ error: "Failed to save order" });
          }
        } else {
          res.status(500).json({ error: "Unknown transaction error" });
        }
      }
    );
  } catch (error) {
    console.error("Braintree Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
      }


  module.exports.updatequantity=async function updatequantity(req,res) {
    const { cart } = req.body;

  try {
    for (const item of cart) {
      await productmodel.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }
    res.status(200).json({ success: true, message: "Product quantities updated" });
  } catch (error) {
    console.error("Error updating product quantities:", error);
    res.status(500).json({ success: false, message: "Failed to update quantities" });
  }
    
  }


  module.exports.reviews=async function reviews(req,res) {
    try {
      const {slug}=req.params;
      console.log("Slug from request of review:", slug);
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required', success: false });
      }
      const {page=1,limit=6}=req.query;
      const product = await productmodel.findOne({ slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found',success:false });
    }
     // Fetch reviews based on the product ID
     const reviews = await reviewmodel.find({ productId: product._id })
     .sort({ createdAt: -1 }) 
     .skip((page - 1) * limit)
     .limit(parseInt(limit)).populate({path:"userId",select:"name photo"});



  //    const reviews = await reviewmodel.find({ productId: product._id })
  // .sort({ createdAt: -1 }) // Latest reviews first
  // .skip((page - 1) * limit)
  // .limit(parseInt(limit))
  // .populate('userId', 'name email') // Populate userId with specific fields (e.g., name, email)


   // Count total reviews
   const totalReviews = await reviewmodel.countDocuments({ productId: product._id });

   res.status(200).json({ reviews, totalReviews,success:true });
  
    } catch (error) {
      res.status(500).send({ error: 'Server error',
        success:false,
       });
    }
    
  }


  module.exports.createReview = async function createReview(req, res) {
    try {
      const { slug } = req.params;
      console.log("Review slug is ", slug);
  
      if (!slug) {
        return res.status(400).json({ error: "Slug is required" });
      }
  
      const userId = req.user._id;
      console.log("user id is ", userId);
      const { rating, comment } = req.fields;
  
      if (!rating || !comment) {
        return res.status(400).send({
          success: false,
          message: "Rating and comment are required.",
        });
      }
  
      // Check if product exists
      const product = await productmodel.findOne({ slug });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
  
      const { photo } = req.files; // Use req.files for file fields
  
      let imageUrl = null; // Store uploaded image URL
  
      if (photo) {
        if (photo.size > 6 * 1024 * 1024) {
          return res.status(400).send({
            success: false,
            message: "Photo size should not exceed 6 MB.",
          });
        }
  
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(photo.path, {
          folder: "reviews",
          resource_type: "image",
        });
  
        imageUrl = result.secure_url; // Get Cloudinary image URL
      }
  
      // Create review object
      const review = new reviewmodel({
        productId: product._id,
        userId,
        rating,
        comment,
        photo: imageUrl, // Store Cloudinary URL
      });
  
      await review.save();
  
      res.status(201).send({
        success: true,
        message: "Review created successfully",
        review,
      });
  
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).send({
        success: false,
        message: "Server error",
      });
    }
  };
  

  module.exports.reviewPhoto=async function reviewPhoto(req,res) {
    try {
      const review = await reviewmodel.findById(req.params.id);
      if (!review || !review.photo) {
        return res.status(404).send({ error: "Photo not found" });
      }
  
      res.set("Content-Type", review.photo.contentType);
      res.status(200).send(review.photo.data);
    } catch (error) {
      console.error("Error fetching photo:", error);
      res.status(500).send({ error: "Server error" });
    }
  }


  //Razorpay

  
    // key_id:"rzp_test_xkZhbPPhzFGU8G"
    // key_secret:"qIqX0OQJj3rbtTJjHEoneYym"

    module.exports.getOrderId= async function getOrderId(req,res) {
      try {
       // console.log("getorder is called")
       // console.log("product in backend is  is ",req.body.product)
        const product = req.body.product;
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret:process.env.RAZORPAY_KEY_SECRET })
        var options = {
            amount: req.body.amount,
            currency: "INR",
            receipt: "TXN" + Date.now(),
            notes: {
              key1: req.body.auth.user.name || "N/A",
              key2: req.body.auth.user.email || "N/A",
              key3: req.body.auth.user.phone || "N/A",
              key4: req.body.auth.user.location || "N/A", // Use "N/A" or a default placeholder
              key5: (req.body.cart && req.body.cart.length > 0) 
        ? req.body.cart.map(item => `${item.name} (${item.quantity})`).join(", ")
        : `${product.name} (1)`,
            
              key6: req.body.auth.user.name || "Guest",
            }
        };

        instance.orders.create(options, function(err, order) {
          if (order) {
            //console.log("Order instance created:", order);
            // Send the entire order object to the frontend
            return res.status(200).json(order);
          } else {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error.message);
    }

    }

module.exports.paymentCallBack=async function paymentCallBack(req,res) {
  const {razorpay_signature, razorpay_payment_id, razorpay_order_id,cart,user} = req.body
  console.log("cart in paymentcallback ",cart ,"user is ",user)
  try {
      const string = `${razorpay_order_id}|${razorpay_payment_id}`;

      const generated_signature = crypto
      .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
      .update(string)
      .digest('hex');
      
      if (generated_signature == razorpay_signature) {
        const order = new ordermodel({
          products: Array.isArray(cart) && cart.length > 0 ? cart : [{ name: product.name, quantity: 1 }], // If it's Buy Now, treat it as an array with one item
          payment: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            success:true,
          },
          buyer: user._id,
        });
        await order.save();
        console.log(order);
        console.log('Order saved:');
        sendMail("orderPlaced", { ...user, cart });
          console.log('payment successfull')
          return res.status(200).json({ success: true, message: "Payment successful and order saved" });
        }
        else{
          return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }

}

module.exports.paymentCancel =async function paymentCancel (req,res) {
  try {
    return res.status(200).json({ success: false, message: "Payment was cancelled" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
}

// module.exports.deletephoto = async function deletephoto(req, res) {
//   try {
//     console.log("Delete product is called from backend");
//     const { productId, photoUrl } = req.params; // Use URL instead of photoId
//     console.log("ProductId:", productId, " PhotoUrl:", photoUrl);

//     // Decode the photo URL to handle encoded characters
//     const decodedPhotoUrl = decodeURIComponent(photoUrl);
//     console.log("Decoded Photo URL: ", decodedPhotoUrl);

//     // Find the product
//     const product = await productmodel.findById(productId);
//     if (!product) {
//       return res.status(404).send({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Find the photo to delete by matching the URL
//     const photoToDelete = product.photos.find(photo => photo.url === decodedPhotoUrl);
//     if (!photoToDelete) {
//       return res.status(404).send({
//         success: false,
//         message: "Photo not found",
//       });
//     }

//     const publicId = extractPublicId(decodedPhotoUrl); // Extract public_id from URL
//     console.log("Public ID extracted: ", publicId);

//     // Delete the image from Cloudinary using the public_id
//     const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
//     console.log("Cloudinary delete response: ", cloudinaryResponse);

//     if (cloudinaryResponse.result === 'ok') {
//       // Remove the specific photo from the product's photos array in MongoDB
//       const updatedProduct = await productmodel.findByIdAndUpdate(
//         productId,
//         { $pull: { photos: { url: decodedPhotoUrl } } },  // Remove photo by decoded URL
//         { new: true } // Return updated document
//       );

//       if (updatedProduct) {
//         res.status(200).send({
//           success: true,
//           message: "Photo deleted successfully from both Cloudinary and MongoDB",
//           updatedProduct, // Send updated product back
//         });
//       } else {
//         res.status(400).send({
//           success: false,
//           message: "Failed to update product",
//         });
//       }
//     } else {
//       res.status(500).send({
//         success: false,
//         message: "Failed to delete photo from Cloudinary",
//       });
//     }
//   } catch (error) {
//     console.log("Error in deleting the photo: ", error);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong in deleting the photo",
//       error,
//     });
//   }
// };

// // Helper function to extract the public_id from Cloudinary URL
// const extractPublicId = (url) => {
//   const parts = url.split("/");
//   const publicId = parts[parts.length - 2]; // The second-to-last part is the public_id
//   return publicId;
// };
module.exports.deletephoto = async function deletephoto(req, res) {
  try {
   // console.log("Delete product is called from backend");

    const { productId, photoUrl } = req.params;
    const decodedPhotoUrl = decodeURIComponent(photoUrl);
   // console.log("ProductId:", productId, " PhotoUrl:", decodedPhotoUrl);

    // Find the product
    const product = await productmodel.findById(productId);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

   // console.log("Product found:", product);

    // Extract filename for comparison
    const getFileName = (url) => url.substring(url.lastIndexOf("/") + 1);

    // ✅ Fix: Map directly since photos is an array of strings
    const storedFileNames = product.photos.map(photo => getFileName(photo));
    const receivedFileName = getFileName(decodedPhotoUrl);

    console.log("Stored Filenames:", storedFileNames);
    console.log("Received Filename:", receivedFileName);

    if (!storedFileNames.includes(receivedFileName)) {
      return res.status(404).send({ success: false, message: "Photo not found" });
    }

    // Extract public_id from Cloudinary URL
    const publicId = `products/${receivedFileName.split('.')[0]}`;

    // Delete image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete response: ", cloudinaryResponse);

    // Remove from MongoDB
    const updatedProduct = await productmodel.findByIdAndUpdate(
      productId,
      { $pull: { photos: decodedPhotoUrl } },  // ✅ Fix: Match the array of strings
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Photo deleted successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log("Error in deleting the photo:", error);
    res.status(500).send({ success: false, message: "Something went wrong", error });
  }
};

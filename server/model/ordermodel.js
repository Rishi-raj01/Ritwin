const mongoose=require("mongoose")
const orderschema=new mongoose.Schema({
    products: [
        {
          type: mongoose.ObjectId,
          ref: "productmodel",
        },
      ],
      payment: {
        razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String,
    success: { type: Boolean, default: false }, // Add this
      },
      buyer: {
        type: mongoose.ObjectId,
        ref: "usermodel",
      },
      status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
      },
    },
    { timestamps: true }
)
const ordermodel=mongoose.model("ordermodel",orderschema)
module.exports=ordermodel
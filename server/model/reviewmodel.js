const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId, // Preferred
        ref: 'productmodel',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        //required: true,
      },
      // photo: {
      //   data: Buffer,
      //   contentType: String,
      // },
      photo: { type: [String] },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})
const reviewmodel=mongoose.model("reviewmodel",reviewSchema);
module.exports=reviewmodel;
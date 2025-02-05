const mongoose=require("mongoose");
const productschema=new mongoose.Schema({
  name: {  type: String, required: true },
      slug: {
        type: String,
        required: [true,"it is a required feild"]
      },
      description: {
        type: String,
        required:  [true,"description is a required feild"],
      },
      price: {
        type: Number,
        required:  [true,"price is a required feild"],
      },
      category: {
        type: mongoose.ObjectId,
        ref: "category",   //YHA NAAM SAME RHNA CAAHIYE JIS NAAM SE CATEGORYMODEL ME CATEGORYMODEL KO BANAYA H const categoryModel=new mongoose.model("category",categorySchema);
        required:  [true,"category is a required feild"],
      },
      quantity: {
        type: Number,
        required:  [true,"quantity is a required feild"],
      },
      // photo: {
      //   data: Buffer,
      //   contentType: String,
      // },
      photos: { type: [String] },
      shipping: {
        type: Boolean,
      },
},
{ timestamps: true });
const productmodel=mongoose.model("productmodel",productschema)
module.exports=productmodel
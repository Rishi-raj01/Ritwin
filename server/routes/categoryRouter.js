const express=require("express");
const categoryRouter=express.Router();
const {requireSignIn,isadmin} =require( "../middlewares/authmiddleware")
const {createCategory,updateCategory,deleteCategory,getallcategory,getcategory}=require("../controller/Categorycontroller");
const { isAdmin } = require("../helpers/authhelper");


categoryRouter.route("/allcategory")
.get(getallcategory)

categoryRouter.route("/single-category/:slug")
.get(getcategory)
//router.post
categoryRouter.post('/create-category',requireSignIn,isadmin,createCategory);

// CRUD operations (update and delete) for a category by ID
categoryRouter
  .route("/crud-category/:id")
  .patch(requireSignIn, isAdmin, updateCategory) // Ensure middleware is used correctly
  .delete(requireSignIn, isAdmin, deleteCategory);



module.exports=categoryRouter
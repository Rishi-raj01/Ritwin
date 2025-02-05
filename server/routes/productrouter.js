const express = require("express");
const fs = require("fs");
const formidable = require("express-formidable");
const { requireSignIn, isadmin, requireSignInBearer } = require("../middlewares/authmiddleware");
const {getallproducts,getproduct,createProduct,updateproduct,deleteproduct,getphoto,productFilter,productCount,productList,searchProduct,getSimilarProduct,productCategory,
  //payment
  braintreeToken,braintreepayment,updatequantity,reviews,createReview,reviewPhoto,deletephoto,getOrderId,paymentCallBack,paymentCancel} = require("../controller/productcontroller");

const productrouter = express.Router();

// Routes
productrouter.route("/allproducts").get(getallproducts);
productrouter.route("/products/:slug").get(getproduct);
productrouter.route("/get-photos/:pid").get(getphoto);
productrouter.route("/create-product")
  .post(requireSignIn, isadmin, formidable({ multiples: true }), createProduct);

productrouter
  .route("/update-product/:id")
  .put(requireSignIn, isadmin, formidable({ multiples: true }), updateproduct);
productrouter
  .route("/delete-product/:id")
  .delete(requireSignIn, isadmin, deleteproduct);


  //filter product
  productrouter.route("/product-filters")
  .post(productFilter)

  //product count
  productrouter.route("/product-count")
  .get(productCount)
//product per page 
productrouter.route("/product-list/:page")
.get(productList)

productrouter.route("/search/:keyword")
.get(searchProduct)

//similar product
productrouter.route("/related-product/:pid/:cid")
.get(getSimilarProduct)

productrouter.route("/product-category/:slug")
.get(productCategory)

productrouter.route("/update-quantities")
.post(updatequantity)

// productrouter.route("/payment")
// .post(payment)

productrouter.route("/braintree/token")
.get(braintreeToken)

//payments
productrouter.route("/braintree/payment")
.post(requireSignIn,braintreepayment)

productrouter.route("/products/:productId/deletephoto/:photoUrl")
  .delete(deletephoto);


//here comes the review baby


productrouter
  .route("/products/:slug/reviews")
  .get(reviews) 
  .post(requireSignInBearer, formidable(), createReview); // Handle POST requests

productrouter.route("/review/photo/:id")
.get(reviewPhoto)

//razorpay
productrouter.route("/orders")
.post(getOrderId)

productrouter.route("/payment-callback")
.post(paymentCallBack)

productrouter.route("/payment-cancel")
.get(paymentCancel)

module.exports = productrouter;

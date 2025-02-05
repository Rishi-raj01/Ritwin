const mongoose=require("mongoose")
const emailValidator=require('email-validator')
const crypto=require("crypto")
const bcrypt=require("bcrypt")
async function hashPassword(password) {
    
  try {
      
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};








const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        required: [true,"enter valid email"],
        validate:function(){
            return emailValidator.validate(this.email);}
      },
      password: {
        type: String,
        required: true,
      },

      phone: {
        type: Number,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      profileimage:{
        type:String,
        default:'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Image.png'
      },
      resettoken:{
        type:String,
        default:"",
       },
      role: {
        type:String,
      enum:['admin','user','restaurentowner','deliveryboy'],
      default:'user',
      },
    },
    { timestamps: true }
  );
  userSchema.pre('save', function () {
    this.confirmpassword=undefined;
 
});
userSchema.methods.createresettoken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); 
  this.resettoken = resetToken; 
  this.resetExpires = Date.now() + 3600000; 
  await this.save(); 
  return resetToken; 
};

userSchema.methods.resetpasswordhandler = async function (password, confirmpassword) {
  if (password !== confirmpassword) {
      throw new Error("Passwords do not match");
  }
const hashedPassword = await hashPassword(password);
  this.password = hashedPassword;
  this.confirmpassword = undefined; // Optional: You typically don't store confirmpassword
  this.resettoken = undefined;
};
  const usermodel = mongoose.model('usermodel', userSchema);



  

  module.exports=usermodel;  
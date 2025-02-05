const bcrypt=require("bcrypt"); 
const usermodel= require("../model/usermodel");
module.exports.hashPassword= async function hashPassword(password) {
  
    try {
        
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };

  
  module.exports.comparePassword = async function comparePassword (password, hashedPassword)  {
    return bcrypt.compare(password, hashedPassword);
  };
    module.exports.isAdmin = async function isAdmin(req, res, next)  {
    try {
      const user = await usermodel.findById(req.user._id);
      if (user.role !== 'admin') {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };
const jwt=require("jsonwebtoken");
const usermodel = require("../model/usermodel");
//const jwt_key="hvvgdxrrdxffcygvvgc";
const jwt_key= process.env.JWT_SECRET;
//protected route ,token based 

module.exports.requireSignIn= async function requireSignIn(req,res,next) {
 try {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
     const decode=jwt.verify(req.headers.authorization,jwt_key);
     req.user = decode;
    next();
}
 catch (error) {
    console.log("error is ",error)
    
 }

}



module.exports.requireSignInBearer = async function requireSignIn(req, res, next) {
    try {
      // Ensure the token is sent correctly with the Bearer prefix
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // "Bearer <token>"
      if (!token) {
        return res.status(401).send({ success: false, message: 'No token provided' });
      }
  
      // Verify token with jwt_key
      const decoded = jwt.verify(token, jwt_key);
      req.user = decoded;  // Attach the decoded user info to the request object
      next();  // Proceed to the next middleware or route handler
    } catch (error) {
      console.log("Error verifying token:", error);
      return res.status(401).send({ success: false, message: 'Invalid or expired token' });
    }
  };
  

//admin access 
module.exports.isadmin = async function isadmin(req, res, next) {
    try {
        const user = await usermodel.findById(req.user._id); 
       // console.log("user is ", user);
        if (user.role !== "admin") {
            return res.status(401).send({
                success: false,
                message: "Unauthorized user",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

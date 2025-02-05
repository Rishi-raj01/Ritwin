
const nodemailer = require("nodemailer");
module.exports.sendMail=async function sendMail(str,data){
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "rishirajjnvr448@gmail.com",
    //pass: process.env.PASS,
    pass:"kpxuakzbigfppnrw"
  },
});
var Osubject,Otext,Ohtml;
if(str==="signup"){
    Osubject=`Thanks for signing in ${data.name}`
    Ohtml=`
    <h1>welcome to the Ritwin handmade gift website</h1>
    hope you are having a good time 
    Here are your details
    Name: ${data.name} <br>
    Email:${data.email}`
}
else if(str=="resetpassword")
{
    Osubject='resetpassword'
    Ohtml=`<h1>Ritwin handmade  gift website </h1>
    Here is the link for resetting your password
    ${data.resetpasswordlink}`
}
else if (str === "orderPlaced") {
  Osubject = "Order Confirmation - Ritwin Handmade Gifts";
  const totalAmount = data.cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  Ohtml = `
    <h1>Congratulations ${data.name}, Your Order Has Been Successfully Placed!</h1>
    <p>Your order is being prepared. It will take 5-7 days to complete. Please wait excitedly!</p> 
    <h3>Order Details:</h3>
    <ul>
      ${data.cart?.map((item) => `
          <li>
            <strong>Product:</strong> ${item.name} <br/>
            <strong>Quantity:</strong> ${item.quantity} <br/>
            <strong>Price:</strong> ₹${item.price.toFixed(2)} <br/>
          </li>`
        )
        .join("")}
    </ul>
     <h3>Total Amount paid: ₹${totalAmount.toFixed(2)}</h3>
    <p>We hope you enjoy your purchase!</p>
    <p>it will take few days(5-7) to prepare your order </p?
  `;
}


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Ritwin handmade company website" <rishirajjnvr448@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    text: Otext, // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

main().catch(console.error);
}
const razorpay = require("./razorpayClient");

const createPaymentLink = async (req, res) => {
  try {
    const { cart, user } = req.body;

    // Calculate total price
    let total = 0;
    cart?.forEach((item) => {
      total += item.price;
    });

    // Create payment link request object
    const paymentLinkRequest = {
      amount: total * 100, // Convert amount to paise (smallest currency unit)
      currency: "INR",
      name: user.name,
      contact: user.phone,
      email: user.email,
      notify: {
        sms: true,
        email: true,
      },
      callback_url: "http://localhost:3000", // Replace with actual callback URL in production
      callback_method:"get"
    };

    
    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    const paymentLinkId=paymentLink.id;
    const payment_link_url=paymentLink.short_url;
   
    return res.status(200).json({
      success: true,
      message: "Payment link created successfully",
      paymentLink,
      paymentLinkId
    });
  } catch (error) {
    console.error("Error creating payment link:", error);

   
    return res.status(500).json({
      success: false,
      message: "Failed to create payment link",
      error: error.message,
    });
  }
};

module.exports ={createPaymentLink,}

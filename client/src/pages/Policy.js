import React from 'react';
import Layout from '../components/Layout/Layout';

const Policies = () => {
  return (
    <Layout title="Policies - Terms & Privacy">
      <div className="container mt-4">
        <h1 className="text-center mb-4">Policies</h1>

        {/* Terms & Conditions Section */}
        <section className="mb-5">
          <h2>Terms & Conditions</h2>
          <p><strong>Introduction:</strong> Welcome to Ritwins. By accessing or using our website, you agree to abide by these terms.</p>
          <p><strong>Eligibility:</strong> You must be at least 18 years old to make purchases on our website.</p>
          <p><strong>Ordering & Payments:</strong> All orders are subject to availability and confirmation of payment.</p>
          <p><strong>Refund & Cancellation:</strong> Please refer to our <a href="#refund-policy">Refund Policy</a>.</p>
          <p><strong>Delivery Policy:</strong> Refer to our <a href="#delivery-policy">Delivery Policy</a> for estimated shipping times.</p>
          <p><strong>User Responsibilities:</strong> Users must not engage in fraudulent transactions or misuse our services.</p>
          <p><strong>Intellectual Property:</strong> All images, branding, and content on this website are owned by Ritwins.</p>
          <p><strong>Changes to Terms:</strong> We reserve the right to update these terms at any time.</p>
          <p><strong>Contact Us:</strong> For any inquiries, visit our <a href="/contact">Contact Us</a> page.</p>
        </section>

        {/* Privacy Policy Section */}
        <section className="mb-5">
          <h2>Privacy Policy</h2>
          <p><strong>Information Collection:</strong> We collect details such as name, email, address, and payment details for order processing.</p>
          <p><strong>How Data is Used:</strong> Your information is used for processing orders, customer support, and marketing purposes.</p>
          <p><strong>Data Sharing:</strong> We do not sell your data but may share it with payment providers like Razorpay.</p>
          <p><strong>Security Measures:</strong> We use SSL encryption and secure payment gateways for transactions.</p>
          <p><strong>User Rights:</strong> You can request to delete or modify your data by contacting us.</p>
          <p><strong>Cookies Policy:</strong> We use cookies to enhance user experience and track website analytics.</p>
        </section>

        {/* Refund Policy Section */}
        <section id="refund-policy" className="mb-5">
          <h2>Refund Policy</h2>
          <p>Refunds are applicable for defective or incorrect items. Requests must be made within 7 days.</p>
        
        <ul>
          <li>Refunds are applicable only to damaged, defective, or incorrect items received.</li>
          <li>Requests for refunds must be made within <strong>7 days</strong> of receiving the product.</li>
          <li>To initiate a refund, please contact our support team with your order details and relevant photos of the issue.</li>
          <li>Once the refund request is approved, the amount will be credited to your original payment method within <strong>5-7 working days</strong>.</li>
          <li>Customized or handmade products are non-refundable unless they arrive damaged or incorrect.</li>
        </ul>

        </section>

        {/* Delivery Policy Section */}
        <section id="delivery-policy" className="mb-5">
          <h2>Delivery Policy</h2>
          <p>Orders are typically delivered within 7-14 business days. Custom or bulk orders may take longer.</p>
        </section>
      </div>
    </Layout>
  );
};

export default Policies;

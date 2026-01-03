const SibApiV3Sdk = require('@sendinblue/client');

// Initialize Brevo client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

// Helper function to format currency
const formatCurrency = (amountInPaise) => {
    return `₹${(amountInPaise / 100).toLocaleString('en-IN')}`;
};

// Helper function to format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Send Donation Receipt Email
const sendDonationReceipt = async (donation, donor) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.BREVO_SENDER_NAME || 'Arul Trust',
            email: process.env.BREVO_SENDER_EMAIL
        };

        sendSmtpEmail.to = [
            {
                email: donor.email,
                name: donor.name
            }
        ];

        sendSmtpEmail.subject = `Thank You for Your Donation - Receipt #${donation.razorpay_order_id}`;

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .amount-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; }
    .amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
    .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-label { font-weight: bold; color: #666; }
    .detail-value { color: #333; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .impact-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🙏 Thank You for Your Donation!</h1>
      <p>Your generosity makes a difference</p>
    </div>
    
    <div class="content">
      <p>Dear <strong>${donor.name}</strong>,</p>
      
      <p>We are deeply grateful for your generous donation to ${process.env.TRUST_NAME || 'Arul Trust'}. Your contribution will help us continue our mission of providing quality education to underprivileged students.</p>
      
      <div class="amount-box">
        <div style="font-size: 18px;">Donation Amount</div>
        <div class="amount">${formatCurrency(donation.amount)}</div>
        <div style="font-size: 14px;">${donation.donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}</div>
      </div>
      
      <div class="impact-box">
        <strong>🌟 Your Impact:</strong> Your donation of ${formatCurrency(donation.amount)} will help provide educational resources, support teacher training programs, and create lasting positive change in our community.
      </div>
      
      <div class="details">
        <h3 style="margin-top: 0; color: #667eea;">Transaction Details</h3>
        <div class="detail-row">
          <span class="detail-label">Receipt Number:</span>
          <span class="detail-value">${donation.razorpay_order_id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment ID:</span>
          <span class="detail-value">${donation.razorpay_payment_id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount:</span>
          <span class="detail-value">${formatCurrency(donation.amount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method:</span>
          <span class="detail-value">${donation.paymentMethod.toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">${formatDate(donation.paidAt)}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Status:</span>
          <span class="detail-value" style="color: #28a745; font-weight: bold;">✓ Completed</span>
        </div>
      </div>
      
      ${donation.taxCertificateRequired ? `
      <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>📄 Tax Certificate (80G):</strong> Your tax exemption certificate will be sent to you within 3-5 business days.
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.TRUST_WEBSITE || 'https://arultrust.org'}" class="button">Visit Our Website</a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        This is an automated receipt for your donation. Please keep this email for your tax records.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;"><strong>${process.env.TRUST_NAME || 'Arul Education Trust'}</strong></p>
      <p style="margin: 5px 0;">${process.env.TRUST_ADDRESS || 'Trust Address'}</p>
      <p style="margin: 5px 0;">📧 ${process.env.TRUST_EMAIL || 'info@arultrust.org'} | 📞 ${process.env.TRUST_PHONE || '+91 123 456 7890'}</p>
      <p style="margin: 5px 0;">Registration No: ${process.env.TRUST_REGISTRATION || 'N/A'}</p>
      <p style="margin: 15px 0 5px 0; font-size: 12px;">
        © ${new Date().getFullYear()} ${process.env.TRUST_NAME || 'Arul Trust'}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

        // Send email
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Receipt email sent successfully:', result);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending receipt email:', error);
        throw error;
    }
};

// Send Tax Certificate Email
const sendTaxCertificate = async (donation, donor, certificateNumber) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.BREVO_SENDER_NAME || 'Arul Trust',
            email: process.env.BREVO_SENDER_EMAIL
        };

        sendSmtpEmail.to = [
            {
                email: donor.email,
                name: donor.name
            }
        ];

        sendSmtpEmail.subject = `80G Tax Exemption Certificate - ${certificateNumber}`;

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .certificate-box { background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
    .certificate-number { font-size: 24px; font-weight: bold; color: #2d3436; }
    .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 80G Tax Exemption Certificate</h1>
      <p>Income Tax Deduction Certificate</p>
    </div>
    
    <div class="content">
      <p>Dear <strong>${donor.name}</strong>,</p>
      
      <p>Thank you for your generous donation to ${process.env.TRUST_NAME || 'Arul Trust'}. This is to certify that we have received your donation, which is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.</p>
      
      <div class="certificate-box">
        <div style="font-size: 16px; margin-bottom: 10px;">Certificate Number</div>
        <div class="certificate-number">${certificateNumber}</div>
      </div>
      
      <div class="details">
        <h3 style="margin-top: 0; color: #11998e;">Donation Details</h3>
        <div class="detail-row">
          <strong>Donor Name:</strong> ${donor.name}
        </div>
        <div class="detail-row">
          <strong>PAN Number:</strong> ${donor.pan || 'Not Provided'}
        </div>
        <div class="detail-row">
          <strong>Amount Donated:</strong> ${formatCurrency(donation.amount)}
        </div>
        <div class="detail-row">
          <strong>Date of Donation:</strong> ${formatDate(donation.paidAt)}
        </div>
        <div class="detail-row">
          <strong>Receipt Number:</strong> ${donation.razorpay_order_id}
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <strong>Financial Year:</strong> ${new Date(donation.paidAt).getFullYear()}-${new Date(donation.paidAt).getFullYear() + 1}
        </div>
      </div>
      
      <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>ℹ️ Important Information:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>This certificate is valid for claiming deduction under Section 80G</li>
          <li>Registration Number: ${process.env.TRUST_REGISTRATION || 'N/A'}</li>
          <li>Please retain this certificate for your tax filing</li>
          <li>50% of the donated amount is eligible for deduction</li>
        </ul>
      </div>
      
      <p style="margin-top: 30px;">If you have any questions, please contact us at ${process.env.TRUST_EMAIL || 'info@arultrust.org'}</p>
      
      <p style="margin-top: 30px;">With warm regards,<br><strong>${process.env.TRUST_NAME || 'Arul Trust'}</strong></p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;"><strong>${process.env.TRUST_NAME || 'Arul Education Trust'}</strong></p>
      <p style="margin: 5px 0;">${process.env.TRUST_ADDRESS || 'Trust Address'}</p>
      <p style="margin: 5px 0;">📧 ${process.env.TRUST_EMAIL || 'info@arultrust.org'}</p>
      <p style="margin: 15px 0 5px 0; font-size: 12px;">
        © ${new Date().getFullYear()} ${process.env.TRUST_NAME || 'Arul Trust'}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Tax certificate email sent successfully:', result);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending tax certificate email:', error);
        throw error;
    }
};

// Send Welcome Email to New Donor
const sendWelcomeEmail = async (donor) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: process.env.BREVO_SENDER_NAME || 'Arul Trust',
            email: process.env.BREVO_SENDER_EMAIL
        };

        sendSmtpEmail.to = [
            {
                email: donor.email,
                name: donor.name
            }
        ];

        sendSmtpEmail.subject = `Welcome to ${process.env.TRUST_NAME || 'Arul Trust'} Family!`;

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🙏 Welcome to Our Family!</h1>
    </div>
    
    <div class="content">
      <p>Dear <strong>${donor.name}</strong>,</p>
      
      <p>Welcome to the ${process.env.TRUST_NAME || 'Arul Trust'} family! We are honored to have you as a supporter of our mission to provide quality education to underprivileged students.</p>
      
      <p>Your generosity will help us continue making a positive impact in the lives of countless students who dream of a better future through education.</p>
      
      <p>Stay connected with us to see the impact of your contribution and be part of our journey to transform lives through education.</p>
      
      <p style="margin-top: 30px;">With gratitude,<br><strong>${process.env.TRUST_NAME || 'Arul Trust'} Team</strong></p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;">${process.env.TRUST_EMAIL || 'info@arultrust.org'} | ${process.env.TRUST_PHONE || '+91 123 456 7890'}</p>
    </div>
  </div>
</body>
</html>
    `;

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Welcome email sent successfully:', result);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

module.exports = {
    sendDonationReceipt,
    sendTaxCertificate,
    sendWelcomeEmail
};

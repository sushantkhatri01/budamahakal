const nodemailer = require('nodemailer');

let transporter = null;

// Initialize transporter with credentials
function initializeTransporter(gmailUser, gmailPassword) {
    if (!gmailUser || !gmailPassword) {
        console.warn('⚠️ Gmail credentials not configured. Email notifications disabled.');
        return false;
    }
    
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPassword
            }
        });
        console.log('✅ Email service initialized with:', gmailUser);
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize email service:', error.message);
        return false;
    }
}

// Send booking confirmation email to admin
async function sendBookingEmail(bookingData, courseData) {
    if (!transporter) {
        console.warn('⚠️ Email service not configured. Skipping email notification.');
        return { success: true }; // Don't fail the booking
    }
    
    try {
        const courseInfo = courseData ? `${courseData.name} (₹${courseData.price})` : 'Unknown Course';
        const perDayPrice = courseData ? Math.round(courseData.price / courseData.duration) : 0;
        
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
            subject: `🎉 New Booking from ${bookingData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">📋 New Booking Received</h2>
                        
                        <div style="margin: 20px 0;">
                            <h3 style="color: #3498db; margin: 15px 0 5px 0;">Customer Information</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${bookingData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${bookingData.email}">${bookingData.email}</a></td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${bookingData.phone}">${bookingData.phone}</a></td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin: 20px 0;">
                            <h3 style="color: #3498db; margin: 15px 0 5px 0;">Course Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Course:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${courseInfo}</td>
                                </tr>
                                ${courseData ? `<tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Duration:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${courseData.duration} days</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Per Day Rate:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">₹${perDayPrice}/day</td>
                                </tr>` : ''}
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferred Date:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(bookingData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin: 20px 0; padding: 15px; background: #e7f3ff; border-left: 4px solid #3498db; border-radius: 4px;">
                            <p style="margin: 0; color: #2c3e50;">
                                <strong>⏰ Action Required:</strong> Please contact the customer to confirm the booking and arrange payment.
                            </p>
                        </div>

                        <div style="margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 4px; text-align: center; font-size: 12px; color: #666;">
                            <p style="margin: 5px 0;">BudaMahakal Driving School (BMK)</p>
                            <p style="margin: 5px 0;">Booking submitted: ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
            `,
            text: `
New Booking from ${bookingData.name}

Customer Information:
- Name: ${bookingData.name}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

Course: ${courseInfo}
Preferred Date: ${new Date(bookingData.date).toLocaleDateString()}

Please contact the customer to confirm the booking.
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        return { success: true, message: 'Email notification sent' };
    } catch (error) {
        console.error('❌ Email Error:', error);
        return { success: false, message: 'Failed to send email', error: error.message };
    }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(bookingData, courseData) {
    if (!transporter) {
        console.warn('⚠️ Email service not configured. Skipping customer email.');
        return { success: true }; // Don't fail the booking
    }
    
    try {
        const courseInfo = courseData ? `${courseData.name} (₹${courseData.price})` : 'Unknown Course';
        
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: bookingData.email,
            subject: '✅ Your Booking Confirmation - BudaMahakal Driving School',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; text-align: center;">🎉 Booking Confirmation</h2>
                        
                        <p style="color: #666; text-align: center; margin: 10px 0;">Thank you for choosing BudaMahakal Driving School!</p>

                        <div style="margin: 20px 0; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
                            <p style="margin: 0; color: #155724;">
                                <strong>✅ Your booking has been received!</strong>
                            </p>
                            <p style="margin: 5px 0; color: #155724;">We will contact you shortly to confirm the details and process payment.</p>
                        </div>

                        <div style="margin: 20px 0;">
                            <h3 style="color: #3498db;">Booking Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Course:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${courseInfo}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferred Date:</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(bookingData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin: 20px 0;">
                            <h3 style="color: #3498db;">Contact Us</h3>
                            <p style="color: #666;">
                                <strong>📞 Phone:</strong> <a href="tel:+977-9767654375">+977 9767654375</a><br>
                                <strong>📧 Email:</strong> <a href="mailto:Sushantkc97@gmail.com">Sushantkc97@gmail.com</a>
                            </p>
                        </div>

                        <div style="margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 4px; text-align: center; font-size: 12px; color: #666;">
                            <p style="margin: 5px 0;">BudaMahakal Driving School (BMK)</p>
                            <p style="margin: 5px 0;">Kathmandu, Nepal</p>
                        </div>
                    </div>
                </div>
            `,
            text: `
Booking Confirmation

Thank you for choosing BudaMahakal Driving School!

Your booking has been received. We will contact you shortly to confirm the details.

Course: ${courseInfo}
Preferred Date: ${new Date(bookingData.date).toLocaleDateString()}

Contact Us:
📞 Phone: +977 9767654375
📧 Email: Sushantkc97@gmail.com

BudaMahakal Driving School (BMK)
Kathmandu, Nepal
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Customer confirmation email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('⚠️ Customer email error (non-critical):', error.message);
        return { success: false }; // Non-critical, don't fail the booking
    }
}

module.exports = {
    initializeTransporter,
    sendBookingEmail,
    sendCustomerConfirmation
};

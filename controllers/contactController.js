const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (authenticated user)
            replyTo: email, // The user who filled the form
            to: 'salescanservices@gmail.com', // List of receivers
            subject: `New Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("EMAIL ERROR FULL:", error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

module.exports = {
    sendContactEmail,
};

import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Jelegs Real Estate Website" <${process.env.EMAIL_USER}>`,
            to: "jelegsrealestate@outlook.com", // ← Changed to new email
            replyTo: email,
            subject: `New Property Enquiry from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px;">
                    <h2 style="color:#0f766e;">New Contact Form Submission</h2>

                    <p><strong>Name:</strong> ${name}</p>

                    <p><strong>Email:</strong> ${email}</p>

                    <p><strong>Message:</strong></p>

                    <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
                        ${message}
                    </div>

                    <br>

                    <small>
                        This message was sent from the Jelegs Real Estate website.
                    </small>
                </div>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Email sent successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to send email.",
        });
    }
};
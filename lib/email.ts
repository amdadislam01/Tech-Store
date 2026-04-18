import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Verification Code - Tech Store",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; letter-spacing: -0.025em; margin: 0;">TECH <span style="color: #10b981;">STORE</span></h1>
        </div>
        <h2 style="color: #1e293b; font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 16px;">Verify your email</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          Use the 6-digit verification code below to complete your registration. This code will expire in 15 minutes.
        </p>
        <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; color: #10b981; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="color: #cbd5e1; font-size: 12px; margin: 0;">&copy; 2026 Tech Store Inc. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password - Tech Store",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; letter-spacing: -0.025em; margin: 0;">TECH <span style="color: #10b981;">STORE</span></h1>
        </div>
        <h2 style="color: #1e293b; font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          We received a request to reset your password. Use the 6-digit code below to set a new password. This code will expire in 15 minutes.
        </p>
        <div style="background-color: #f8fafc; border: 2px dashed #6366f1; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; color: #6366f1; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 0;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="color: #cbd5e1; font-size: 12px; margin: 0;">&copy; 2026 Tech Store Inc. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

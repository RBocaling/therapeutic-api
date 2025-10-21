import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"MindCare Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

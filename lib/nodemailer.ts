import nodemailer from "nodemailer";

const email = process.env.NEXT_PUBLIC_SMTP_EMAIL;
const pass = process.env.NEXT_PUBLIC_SMTP_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: email,
  to: email,
};

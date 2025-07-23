import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, invitationDetails } = await req.json();

    // Validate required fields
    if (!to) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Recipient email address is required",
        }),
        { status: 400 }
      );
    }

    if (!subject) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Subject is required",
        }),
        { status: 400 }
      );
    }

    if (!invitationDetails || !invitationDetails.teamId || !invitationDetails.acceptLink) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invitation details are required",
        }),
        { status: 400 }
      );
    }

    // Get email credentials from environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    // Check if credentials are set
    if (!emailUser || !emailPass) {
      console.error("Email credentials are missing in environment variables");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Server configuration error: Email credentials not set",
        }),
        { status: 500 }
      );
    }

    // Configure the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verify SMTP connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // HTML email content for team invitation with professional styling
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Invitation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
          color: #111827;
          line-height: 1.5;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .email-header {
          background-color: #4f46e5;
          padding: 24px;
          text-align: center;
        }
        .email-header h1 {
          color: #ffffff;
          font-size: 24px;
          margin: 0;
          font-weight: 600;
        }
        .email-content {
          padding: 32px 24px;
        }
        .team-info {
          margin-bottom: 24px;
          padding: 16px;
          background-color: #f3f4f6;
          border-radius: 6px;
        }
        .team-name {
          font-weight: 600;
          font-size: 18px;
          color: #111827;
        }
        .role-badge {
          display: inline-block;
          background-color: #e0e7ff;
          color: #4338ca;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          margin-top: 8px;
        }
        .invitation-message {
          margin-bottom: 32px;
          color: #374151;
          font-size: 16px;
        }
        .cta-button {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          text-align: center;
          margin: 16px 0;
        }
        .cta-button:hover {
          background-color: #4338ca;
        }
        .expiry-notice {
          font-size: 14px;
          color: #6b7280;
          margin-top: 24px;
        }
        .email-footer {
          padding: 16px 24px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
        }
        .email-footer a {
          color: #4f46e5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Team Invitation</h1>
        </div>
        <div class="email-content">
          <p>Hello,</p>
          <p class="invitation-message">
            You have been invited by <strong>${invitationDetails.invitedBy}</strong> to join a team on Code Agent.
          </p>
          
          <div class="team-info">
            <p class="team-name">${invitationDetails.teamName}</p>
            <div class="role-badge">${invitationDetails.role}</div>
          </div>
          
          <p>Please click the button below to accept this invitation and join the team:</p>
          
          <a href="${invitationDetails.acceptLink}" class="cta-button">Accept Invitation</a>
          
          <p class="expiry-notice">
            This invitation will expire in 7 days. If you have any questions, please contact the team owner.
          </p>
          
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} Code Agent. All rights reserved.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://code-agent.vercel.app'}">Visit our website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textContent = `
Team Invitation

Hello,

You have been invited by ${invitationDetails.invitedBy} to join a team on Code Agent.

Team: ${invitationDetails.teamName}
Role: ${invitationDetails.role}

To accept this invitation, please visit:
${invitationDetails.acceptLink}

This invitation will expire in 7 days. If you have any questions, please contact the team owner.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Code Agent. All rights reserved.
${process.env.NEXT_PUBLIC_APP_URL || 'https://code-agent.vercel.app'}
    `;

    // Send the email
    const mailOptions = {
      from: {
        name: process.env.EMAIL_SENDER_NAME || 'Code Agent',
        address: emailUser
      },
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent successfully",
        messageId: info.messageId
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send invitation",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
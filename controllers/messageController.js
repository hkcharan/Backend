import { Message } from "../models/messageSchema.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  const { name, email, message} = req.body;

  // Check if all required fields are present
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the required fields!",
    });
  }

  try {
    // Create a new message entry in the database
    const data = await Message.create({
      name,
      email,
      message,
    });

    //email sent to user
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Thank You for Visiting My Portfolio!",
      html: `
        <div style="background-color: #f5f5f5; padding: 2px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #4CAF50, #66BB6A); padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
            </div>
            
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Thank you for visiting my portfolio website and taking the time to connect with me. I truly appreciate your interest in my work.
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                I have received your message and will get back to you within <strong>24-48 hours</strong>. Looking forward to connecting with you!
              </p>
    
              <div style="text-align: center; margin: 30px 0;">
                <a href=` + process.env.FRONTEND_URL + ` 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Visit My Portfolio
                </a>
              </div>
              
              <p style="font-size: 16px; color: #333; margin-top: 30px;">
                Best Regards,<br/>
                <strong>H K Charan</strong><br/>
                (Personal Portfolio Website)
              </p>
            </div>
            
            <div style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
              [ This is an automated email. I'll respond personally soon. ]
            </div>
            
          </div>
        </div>
      `,
    };
    
    

    await transporter.sendMail(mailOptions);

    const mailOptions2 = {
      from: process.env.SMTP_MAIL,
      to: process.env.SMTP_MAIL,
      subject: "New Message from Your Portfolio Website",
      html: `
        <div style="background-color: #f4f4f4; padding: 2px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #4CAF50, #66BB6A); padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">📬 New Message from Portfolio</h2>
            </div>
            
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">
                <strong>Name:</strong> ${name}
              </p>
              <p style="font-size: 16px; color: #333;">
                <strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a>
              </p>
              <p style="font-size: 16px; color: #333;">
                <strong>Message:</strong>
              </p>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; color: #555;">
                ${message}
              </p>
    
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                <strong>Received on:</strong> ${new Date().toLocaleString()}
              </p>
    
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                  Reply to ${name}
                </a>
              </div>
            </div>
            
            <div style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
              [ Automated Notification | Portfolio Website ]
            </div>
            
          </div>
        </div>
      `,
    };
    
    

    await transporter.sendMail(mailOptions2);

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Message Sent",
      data,
    });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    // Fetch all messages from the database
    const messages = await Message.find();

    // Check if there are any messages
    if (!messages.length) {
      return res.status(404).json({
        success: false,
        message: "No messages found",
      });
    }

    // Send a success response with the data
    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the message by ID
    const message = await Message.findById(id);

    // If the message doesn't exist, return a 404 error
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Delete the message
    await message.deleteOne();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during deletion
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

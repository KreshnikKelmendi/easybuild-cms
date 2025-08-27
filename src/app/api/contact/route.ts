import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission started');
    
    const { name, email, message } = await request.json();
    console.log('Form data received:', { name, email, message: message ? 'present' : 'missing' });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Check environment variable
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    console.log('GMAIL_APP_PASSWORD check:', gmailPassword ? `Set (length: ${gmailPassword.length})` : 'Not set');
    
    if (!gmailPassword) {
      console.error('GMAIL_APP_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    console.log('Creating nodemailer transporter...');
    
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreplyeasybuild@gmail.com',
        pass: gmailPassword,
      },
    });

    console.log('Transporter created successfully');

    // Email content
    const mailOptions = {
      from: 'noreplyeasybuild@gmail.com',
      to: 'kreshnik.kelmendi1994@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DD4624;">New Contact Form Message</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #DD4624;">${message}</p>
          </div>
          <p style="color: #666; font-size: 14px;">This message was sent from the EasyBuild contact form.</p>
        </div>
      `,
    };

    console.log('Sending email...');
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

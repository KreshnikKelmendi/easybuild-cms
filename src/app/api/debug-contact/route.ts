import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Check environment variables
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('Debug Contact Form Environment:');
    console.log('GMAIL_APP_PASSWORD:', gmailPassword ? 'Set (length: ' + gmailPassword.length + ')' : 'Not set');
    console.log('NODE_ENV:', nodeEnv);
    
    // Test nodemailer configuration
    let transporterTest = null;
    let authTest = null;
    
    try {
      transporterTest = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noreplyeasybuild@gmail.com',
          pass: gmailPassword,
        },
      });
      authTest = 'Transporter created successfully';
    } catch (transporterError: any) {
      authTest = 'Transporter creation failed: ' + transporterError.message;
    }
    
    return NextResponse.json({
      status: 'success',
      environment: {
        gmailPassword: gmailPassword ? 'Set (length: ' + gmailPassword.length + ')' : 'Not set',
        nodeEnv: nodeEnv,
        gmailUser: 'noreplyeasybuild@gmail.com'
      },
      nodemailer: {
        transporterTest: authTest
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

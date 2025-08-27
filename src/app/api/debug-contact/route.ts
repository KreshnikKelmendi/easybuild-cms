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
    let authTest = null;
    
    try {
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noreplyeasybuild@gmail.com',
          pass: gmailPassword,
        },
      });
      authTest = 'Transporter created successfully';
    } catch (transporterError: unknown) {
      const errorMessage = transporterError instanceof Error ? transporterError.message : 'Unknown error occurred';
      authTest = 'Transporter creation failed: ' + errorMessage;
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
    
  } catch (error: unknown) {
    console.error('Debug endpoint error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

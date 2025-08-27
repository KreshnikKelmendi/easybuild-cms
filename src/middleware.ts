import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle large file uploads for API routes
  if (request.nextUrl.pathname.startsWith('/api/upload-image') || 
      request.nextUrl.pathname.startsWith('/api/upload-image-cloudinary')) {
    
    // Set headers for large file uploads
    const response = NextResponse.next();
    
    // Increase timeout for large uploads
    response.headers.set('Connection', 'keep-alive');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/upload-image/:path*',
    '/api/upload-image-cloudinary/:path*',
  ],
};

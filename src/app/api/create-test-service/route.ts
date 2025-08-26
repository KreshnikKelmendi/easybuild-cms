import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function POST() {
  try {
    await connectDB();
    
    // Check if any services exist
    const existingServices = await Service.find({}).limit(1);
    
    if (existingServices.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Services already exist. Use the debug endpoint to check their structure.',
        data: null
      });
    }
    
    // Create a test service with all required fields
    const testService = new Service({
      title: {
        en: 'Custom Home Construction',
        de: 'Individueller Hausbau',
        al: 'Ndërtimi i shtëpisë me porosi'
      },
      description: {
        en: 'Professional custom home construction services with attention to detail and quality craftsmanship.',
        de: 'Professionelle Dienstleistungen für individuellen Hausbau mit Liebe zum Detail und hochwertiger Handwerkskunst.',
        al: 'Shërbime profesionale për ndërtimin e shtëpisë me porosi me vëmendje ndaj detajeve dhe punëtorisë cilësore.'
      },
      description2: {
        en: 'From initial planning to final touches, we ensure your dream home becomes a reality with premium materials and expert construction.',
        de: 'Von der ersten Planung bis zu den letzten Handgriffen stellen wir sicher, dass Ihr Traumhaus mit Premium-Materialien und Expertenbau Wirklichkeit wird.',
        al: 'Nga planifikimi fillestar deri në prekjet përfundimtare, ne sigurojmë që shtëpia e ëndrrave tuaja të bëhet realitet me materiale premium dhe ndërtim ekspert.'
      },
      image: '/assets/image1.png',
      hoverImage: '/assets/image2.png',
      stepImages: [
        {
          image: '/assets/step1.png',
          titleKey: 'Planning & Consultation'
        },
        {
          image: '/assets/step2.png',
          titleKey: 'Construction & Implementation'
        },
        {
          image: '/assets/step3.png',
          titleKey: 'Completion & Final Touches'
        }
      ],
      isActive: true
    });
    
    await testService.save();
    
    return NextResponse.json({
      success: true,
      message: 'Test service created successfully with proper stepImages',
      data: testService
    });
    
  } catch (error) {
    console.error('Error creating test service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create test service',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

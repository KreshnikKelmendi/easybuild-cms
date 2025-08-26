import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectDB();
    
    // Get all services (including inactive ones) to see the full picture
    const allServices = await Service.find({}).lean();
    
    // Get active services
    const activeServices = await Service.find({ isActive: true }).lean();
    
    // Check what fields each service has
    const serviceAnalysis = allServices.map(service => ({
      _id: service._id,
      title: service.title,
      hasDescription: !!service.description,
      hasDescription2: !!service.description2,
      hasStepImages: !!service.stepImages,
      stepImagesCount: service.stepImages ? service.stepImages.length : 0,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        totalServices: allServices.length,
        activeServices: activeServices.length,
        serviceAnalysis: serviceAnalysis,
        sampleService: allServices[0] || null
      }
    });
    
  } catch (error) {
    console.error('Debug services error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Debug failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

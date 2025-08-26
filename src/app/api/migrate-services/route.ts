import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function POST() {
  try {
    await connectDB();
    
    // Find all services that don't have the new fields
    const servicesToUpdate = await Service.find({
      $or: [
        { description: { $exists: false } },
        { description2: { $exists: false } },
        { stepImages: { $exists: false } }
      ]
    });
    
    if (servicesToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All services are already up to date',
        data: []
      });
    }
    
    // Update each service with default values
    const updatePromises = servicesToUpdate.map(service => {
      const updateData: any = {};
      
      if (!service.description) {
        updateData.description = {
          en: 'Professional service description',
          de: 'Professionelle Dienstleistungsbeschreibung',
          al: 'Përshkrim profesionist i shërbimit'
        };
      }
      
      if (!service.description2) {
        updateData.description2 = {
          en: 'Additional service information',
          de: 'Zusätzliche Dienstleistungsinformationen',
          al: 'Informacione shtesë për shërbimin'
        };
      }
      
      if (!service.stepImages) {
        updateData.stepImages = [
          {
            image: '/assets/step1.png',
            titleKey: 'planning'
          },
          {
            image: '/assets/step2.png',
            titleKey: 'construction'
          },
          {
            image: '/assets/step3.png',
            titleKey: 'completion'
          }
        ];
      }
      
      return Service.findByIdAndUpdate(
        service._id,
        { $set: updateData },
        { new: true }
      );
    });
    
    const updatedServices = await Promise.all(updatePromises);
    
    return NextResponse.json({
      success: true,
      message: `${updatedServices.length} services updated successfully`,
      data: updatedServices
    });
    
  } catch (error) {
    console.error('Error migrating services:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to migrate services' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectDB();
    
    const services = await Service.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title?.en || !body.title?.de || !body.title?.al) {
      return NextResponse.json(
        { success: false, message: 'Title is required in all languages' },
        { status: 400 }
      );
    }
    
    if (!body.description?.en || !body.description?.de || !body.description?.al) {
      return NextResponse.json(
        { success: false, message: 'Description is required in all languages' },
        { status: 400 }
      );
    }
    
    if (!body.description2?.en || !body.description2?.de || !body.description2?.al) {
      return NextResponse.json(
        { success: false, message: 'Second description is required in all languages' },
        { status: 400 }
      );
    }
    
    if (!body.image) {
      return NextResponse.json(
        { success: false, message: 'Image is required' },
        { status: 400 }
      );
    }
    
    // Step images are optional - no validation needed
    
    // Create new service
    const service = new Service({
      title: body.title,
      description: body.description,
      description2: body.description2,
      image: body.image,
      hoverImage: body.hoverImage || '',
      stepImages: body.stepImages,
      exteriorWall: body.exteriorWall || false,
      interiorWall: body.interiorWall || false,
      exteriorWallImages: body.exteriorWallImages || [],
      interiorWallImages: body.interiorWallImages || [],
      customWalls: body.customWalls || [],
      isActive: true,
    });
    
    await service.save();
    
    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('PUT request - Service ID from query params:', id);
    
    if (!id) {
      console.log('PUT request - No service ID provided in query params');
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('PUT request - Body received:', body);
    
    const service = await Service.findById(id);
    
    if (!service) {
      console.log('PUT request - Service not found with ID:', id);
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }
    
    console.log('PUT request - Found service:', service._id);
    
    // Update fields
    if (body.title) service.title = body.title;
    if (body.description) service.description = body.description;
    if (body.description2) service.description2 = body.description2;
    if (body.image) service.image = body.image;
    if (body.hoverImage !== undefined) service.hoverImage = body.hoverImage;
    if (body.stepImages) service.stepImages = body.stepImages;
    if (body.exteriorWall !== undefined) service.exteriorWall = body.exteriorWall;
    if (body.interiorWall !== undefined) service.interiorWall = body.interiorWall;
    if (body.exteriorWallImages !== undefined) service.exteriorWallImages = body.exteriorWallImages;
    if (body.interiorWallImages !== undefined) service.interiorWallImages = body.interiorWallImages;
    if (body.customWalls !== undefined) service.customWalls = body.customWalls;
    if (body.isActive !== undefined) service.isActive = body.isActive;
    
    await service.save();
    console.log('PUT request - Service updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received for services');
    
    await connectDB();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Service ID to delete:', id);
    
    if (!id) {
      console.log('No service ID provided');
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    const service = await Service.findById(id);
    console.log('Found service:', service ? 'Yes' : 'No');
    
    if (!service) {
      console.log('Service not found in database');
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }
    
    console.log('Service before update:', {
      _id: service._id,
      title: service.title,
      isActive: service.isActive
    });
    
    // Soft delete by setting isActive to false
    // Handle case where isActive might not exist
    if (typeof service.isActive === 'undefined') {
      // Add the field if it doesn't exist
      service.set('isActive', false);
    } else {
      service.isActive = false;
    }
    
    try {
      await service.save();
      console.log('Service updated successfully, isActive set to:', service.isActive);
      
      return NextResponse.json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (saveError) {
      console.error('Error saving service after update:', saveError);
      
      // Try alternative approach - direct update
      try {
        const updateResult = await Service.findByIdAndUpdate(
          id,
          { $set: { isActive: false } },
          { new: true, runValidators: false }
        );
        
        if (updateResult) {
          console.log('Service updated using findByIdAndUpdate');
          return NextResponse.json({
            success: true,
            message: 'Service deleted successfully',
          });
        } else {
          throw new Error('Failed to update service using alternative method');
        }
      } catch (alternativeError) {
        console.error('Alternative update method also failed:', alternativeError);
        throw new Error(`Failed to save service: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, message: `Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

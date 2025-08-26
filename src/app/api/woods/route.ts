import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wood from '@/models/Wood';

export async function GET() {
  try {
    await connectDB();
    
    const woods = await Wood.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: woods,
    });
  } catch (error) {
    console.error('Error fetching woods:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch woods' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, imageUrl } = body;
    
    // Validate required fields
    if (!title?.en || !title?.de || !title?.al || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Get the highest order number
    const lastWood = await Wood.findOne().sort({ order: -1 });
    const newOrder = lastWood ? lastWood.order + 1 : 0;
    
    const wood = new Wood({
      title,
      imageUrl,
      order: newOrder,
    });
    
    await wood.save();
    
    return NextResponse.json({
      success: true,
      data: wood,
      message: 'Wood created successfully',
    });
  } catch (error) {
    console.error('Error creating wood:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create wood',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Wood ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { title, imageUrl, isActive, order } = body;
    
    const updatedWood = await Wood.findByIdAndUpdate(
      id,
      { title, imageUrl, isActive, order },
      { new: true, runValidators: true }
    );
    
    if (!updatedWood) {
      return NextResponse.json(
        { success: false, message: 'Wood not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedWood,
      message: 'Wood updated successfully',
    });
  } catch (error) {
    console.error('Error updating wood:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update wood' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Wood ID is required' },
        { status: 400 }
      );
    }
    
    const deletedWood = await Wood.findByIdAndDelete(id);
    
    if (!deletedWood) {
      return NextResponse.json(
        { success: false, message: 'Wood not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Wood deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting wood:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete wood' },
      { status: 500 }
    );
  }
}

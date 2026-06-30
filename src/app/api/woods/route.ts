import { NextRequest, NextResponse } from 'next/server';
import connectDB, { isMongoNotPrimaryError, withMongoWriteRetry } from '@/lib/mongodb';
import Wood from '@/models/Wood';

async function saveWoodUpdate(
  id: string,
  body: {
    title?: { en?: string; de?: string; al?: string };
    imageUrl?: string;
    isActive?: boolean;
    order?: number;
  }
) {
  await connectDB();

  const wood = await Wood.findById(id);

  if (!wood) {
    return null;
  }

  if (body.title) {
    wood.title = {
      en: body.title.en ?? wood.title.en,
      de: body.title.de ?? wood.title.de,
      al: body.title.al ?? wood.title.al,
    };
  }

  if (body.imageUrl !== undefined) {
    wood.imageUrl = body.imageUrl;
  }

  if (body.isActive !== undefined) {
    wood.isActive = body.isActive;
  }

  if (body.order !== undefined) {
    wood.order = body.order;
  }

  await wood.save();
  return wood;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    
    const woods = await Wood.find(admin ? {} : { isActive: true })
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
    const body = await request.json();
    const { title, imageUrl } = body;

    if (!title?.en || !title?.de || !title?.al || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const wood = await withMongoWriteRetry(async () => {
      await connectDB();

      const lastWood = await Wood.findOne().sort({ order: -1 });
      const newOrder = lastWood ? lastWood.order + 1 : 0;

      const newWood = new Wood({
        title,
        imageUrl,
        order: newOrder,
      });

      await newWood.save();
      return newWood;
    });

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
        message: isMongoNotPrimaryError(error)
          ? 'Database is temporarily unavailable for writes. Please try again in a few seconds.'
          : 'Failed to create wood',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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

    if (title && (!title.en || !title.de || !title.al)) {
      return NextResponse.json(
        { success: false, message: 'Title is required in all languages (English, German, Albanian)' },
        { status: 400 }
      );
    }

    if (imageUrl !== undefined && !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Image URL is required' },
        { status: 400 }
      );
    }

    const updatedWood = await withMongoWriteRetry(() =>
      saveWoodUpdate(id, { title, imageUrl, isActive, order })
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
      {
        success: false,
        message: isMongoNotPrimaryError(error)
          ? 'Database is temporarily unavailable for writes. Please try again in a few seconds.'
          : 'Failed to update wood',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Wood ID is required' },
        { status: 400 }
      );
    }

    const deletedWood = await withMongoWriteRetry(async () => {
      await connectDB();
      return Wood.findByIdAndDelete(id);
    });

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

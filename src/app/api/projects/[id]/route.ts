import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching project with ID:', id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, message: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const project = await Project.findById(id);
    console.log('Found project:', project ? 'Yes' : 'No');
    
    if (!project) {
      console.log('Project not found for ID:', id);
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    console.log('Returning project data');
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Updating project with ID:', id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    const { title, description, mainImage, additionalImages, isActive } = body;
    
    // Validate required fields
    if (title && (!title.en || !title.de || !title.al)) {
      return NextResponse.json(
        { success: false, message: 'Title is required in all languages' },
        { status: 400 }
      );
    }
    
    if (description && (!description.en || !description.de || !description.al)) {
      return NextResponse.json(
        { success: false, message: 'Description is required in all languages' },
        { status: 400 }
      );
    }
    
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (mainImage) project.mainImage = mainImage;
    if (additionalImages !== undefined) project.additionalImages = additionalImages;
    if (isActive !== undefined) project.isActive = isActive;
    
    await project.save();
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    );
  }
}
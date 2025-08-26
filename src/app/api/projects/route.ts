import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectDB()
    
    const projects = await Project.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { title, description, mainImage, additionalImages = [] } = body
    
    // Validate required fields
    if (!title?.en || !title?.de || !title?.al) {
      return NextResponse.json(
        { success: false, message: 'Title is required in all languages' },
        { status: 400 }
      )
    }
    
    if (!description?.en || !description?.de || !description?.al) {
      return NextResponse.json(
        { success: false, message: 'Description is required in all languages' },
        { status: 400 }
      )
    }
    
    if (!mainImage) {
      return NextResponse.json(
        { success: false, message: 'Main image is required' },
        { status: 400 }
      )
    }
    
    const project = new Project({
      title,
      description,
      mainImage,
      additionalImages,
      isActive: true
    })
    
    await project.save()
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const project = await Project.findByIdAndDelete(id)
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

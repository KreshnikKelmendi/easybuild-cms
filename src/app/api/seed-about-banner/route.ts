import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutBanner from '@/models/AboutBanner';

export async function POST() {
  try {
    console.log('🌱 Starting about banner seeding...');
    await connectDB();
    console.log('✅ Database connected');
    
    // Sample about banner data
    const sampleAboutBannerData = {
      title: {
        en: 'About Us',
        de: 'Über Uns',
        al: 'Rreth Nesh'
      },
      subtitle: {
        en: 'We are a leading construction company dedicated to building excellence and innovation in every project we undertake.',
        de: 'Wir sind ein führendes Bauunternehmen, das sich der Exzellenz und Innovation in jedem Projekt verschrieben hat.',
        al: 'Ne jemi një kompani ndërtimi kryesore e dedikuar për të ndërtuar shkëlqim dhe inovacion në çdo projekt që marrim.'
      },
      image: '/assets/aboutBannerImage.png',
      video: '/assets/EASY_BUILD_1 (1).mp4',
      isActive: true,
    };

    console.log('📊 Sample about banner data:', sampleAboutBannerData);

    // Create new about banner
    const newAboutBanner = new AboutBanner(sampleAboutBannerData);

    await newAboutBanner.save();
    console.log('✅ Sample about banner created successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Sample about banner created successfully',
      data: newAboutBanner 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating sample about banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create sample about banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

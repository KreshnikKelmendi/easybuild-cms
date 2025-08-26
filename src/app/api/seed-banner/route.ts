import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function POST() {
  try {
    await connectDB();
    
    // Check if banner already exists
    const existingBanner = await Banner.findOne({});
    
    if (existingBanner) {
      return NextResponse.json({ 
        success: false, 
        message: 'Banner data already exists' 
      });
    }

    // Create initial multi-language simple text banner
    const initialBanner = new Banner({
      title: {
        en: 'Building Dreams, Creating Reality',
        de: 'Träume bauen, Realität schaffen',
        al: 'Duke ndërtuar ëndrrat, duke krijuar realitet'
      },
      subtitle: {
        en: 'We specialize in transforming your vision into exceptional spaces. Our team of experts brings creativity, precision, and innovation to every project, ensuring your dream becomes a stunning reality.',
        de: 'Wir sind darauf spezialisiert, Ihre Vision in außergewöhnliche Räume zu verwandeln. Unser Expertenteam bringt Kreativität, Präzision und Innovation in jedes Projekt ein und sorgt dafür, dass Ihr Traum zu einer atemberaubenden Realität wird.',
        al: 'Ne specializohemi në transformimin e vizionit tuaj në hapësira të jashtëzakonshme. Ekipi ynë i ekspertëve sjell kreativitet, precizion dhe inovacion në çdo projekt, duke siguruar që ëndrra juaj të bëhet një realitet mahnitës.'
      },
      image: '/assets/image1.png',
      isActive: true,
    });

    await initialBanner.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Initial multi-language banner created successfully',
      data: initialBanner 
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed banner data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

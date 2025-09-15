import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutUs from '@/models/AboutUs';

export async function POST() {
  try {
    console.log('🌱 Starting about us seeding...');
    await connectDB();
    console.log('✅ Database connected');
    
    // Sample about us data
    const sampleAboutUsData = {
      title: {
        en: 'Building Excellence Through Innovation',
        de: 'Exzellenz durch Innovation aufbauen',
        al: 'Ndërtimi i Shkëlqimit përmes Inovacionit'
      },
      description: {
        en: 'We are a leading construction company dedicated to building excellence and innovation in every project we undertake. With years of experience and a commitment to quality, we deliver outstanding results that exceed expectations.',
        de: 'Wir sind ein führendes Bauunternehmen, das sich der Exzellenz und Innovation in jedem Projekt verschrieben hat. Mit jahrelanger Erfahrung und einem Engagement für Qualität liefern wir herausragende Ergebnisse, die die Erwartungen übertreffen.',
        al: 'Ne jemi një kompani ndërtimi kryesore e dedikuar për të ndërtuar shkëlqim dhe inovacion në çdo projekt që marrim. Me vite përvojë dhe një angazhim për cilësi, ne ofrojmë rezultate të shkëlqyeshme që tejkalojnë pritjet.'
      },
      missionDescription: {
        en: 'Our mission is to transform visions into reality through superior craftsmanship, innovative solutions, and unwavering commitment to client satisfaction. We believe in building not just structures, but lasting relationships.',
        de: 'Unsere Mission ist es, Visionen durch überlegene Handwerkskunst, innovative Lösungen und unerschütterliches Engagement für Kundenzufriedenheit in die Realität umzusetzen. Wir glauben daran, nicht nur Strukturen, sondern auch dauerhafte Beziehungen aufzubauen.',
        al: 'Misioni ynë është të transformojmë vizionet në realitet përmes zanafillës së shkëlqyer, zgjidhjeve inovative dhe angazhimit të pandryshueshëm për kënaqësinë e klientit. Ne besojmë në ndërtimin jo vetëm të strukturave, por edhe të marrëdhënieve të qëndrueshme.'
      },
      images: [
        '/assets/IMG_3864.JPG',
        '/assets/IMG_3865.png',
        '/assets/IMG_3866.JPG',
      ],
      isActive: true,
    };

    console.log('📊 Sample about us data:', sampleAboutUsData);

    // Create new about us section
    const newAboutUs = new AboutUs(sampleAboutUsData);

    await newAboutUs.save();
    console.log('✅ Sample about us section created successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Sample about us section created successfully',
      data: newAboutUs 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating sample about us section:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create sample about us section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function POST() {
  try {
    await connectDB();
    
    // Create sample team data
    const sampleTeamData = {
      title: {
        en: 'Our Team',
        de: 'Unser Team',
        al: 'Ekipi Ynë'
      },
      firstDescription: {
        en: 'We are a dedicated team of construction professionals committed to delivering exceptional results. Our expertise spans across various construction methodologies, ensuring that every project meets the highest standards of quality and innovation.',
        de: 'Wir sind ein engagiertes Team von Bauprofis, die sich der Erzielung außergewöhnlicher Ergebnisse verpflichtet haben. Unsere Expertise erstreckt sich über verschiedene Baumethoden und stellt sicher, dass jedes Projekt höchste Qualitäts- und Innovationsstandards erfüllt.',
        al: 'Ne jemi një ekip i dedikuar profesionistësh ndërtimi të angazhuar për të ofruar rezultate të jashtëzakonshme. Ekspertiza jonë shtrihet në metodologji të ndryshme ndërtimi, duke siguruar që çdo projekt të plotësojë standardet më të larta të cilësisë dhe inovacionit.'
      },
      secondDescription: {
        en: 'With years of combined experience in the construction industry, our team brings together diverse skills and knowledge to tackle complex projects. We believe in continuous learning and staying updated with the latest construction technologies and sustainable building practices.',
        de: 'Mit jahrelanger gemeinsamer Erfahrung in der Baubranche bringt unser Team vielfältige Fähigkeiten und Kenntnisse zusammen, um komplexe Projekte zu bewältigen. Wir glauben an kontinuierliches Lernen und bleiben auf dem neuesten Stand der neuesten Bautechnologien und nachhaltigen Baupraktiken.',
        al: 'Me vite përvojë të kombinuar në industrinë e ndërtimit, ekipi ynë bashkon aftësi dhe njohuri të ndryshme për të trajtuar projekte komplekse. Ne besojmë në mësimin e vazhdueshëm dhe në mbajtjen e përditësuar me teknologjitë më të fundit të ndërtimit dhe praktikat e qëndrueshme të ndërtimit.'
      },
      image: '/assets/ourteam1.png',
      isActive: true
    };

    // Create new team section
    const newTeam = new Team(sampleTeamData);
    await newTeam.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Sample team section created successfully',
      data: newTeam 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sample team:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create sample team section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

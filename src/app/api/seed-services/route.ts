import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function POST() {
  try {
    await connectDB();
    
    // Check if services already exist
    const existingServices = await Service.countDocuments();
    if (existingServices > 0) {
      return NextResponse.json({
        success: false,
        message: 'Services already exist in the database',
      });
    }
    
    // Sample services data
    const sampleServices = [
      {
        title: {
          en: 'Wooden Frame Construction',
          de: 'Holzrahmenbau',
          al: 'Ndërtimi i Kornizave Prej Druri',
        },
        description: {
          en: 'Professional wooden frame construction services for residential and commercial buildings. We specialize in creating durable, sustainable, and beautiful wooden structures.',
          de: 'Professionelle Holzrahmenbau-Dienstleistungen für Wohn- und Geschäftsgebäude. Wir sind auf die Schaffung langlebiger, nachhaltiger und schöner Holzkonstruktionen spezialisiert.',
          al: 'Shërbime profesionale të ndërtimit të kornizave prej druri për ndërtesa banimi dhe komerciale. Ne jemi të specializuar në krijimin e strukturave të qëndrueshme, të qëndrueshme dhe të bukura prej druri.',
        },
        description2: {
          en: 'Our experienced team ensures precision craftsmanship and attention to detail in every project, delivering exceptional results that exceed expectations.',
          de: 'Unser erfahrenes Team sorgt für präzise Handwerkskunst und Aufmerksamkeit für Details in jedem Projekt und liefert außergewöhnliche Ergebnisse, die die Erwartungen übertreffen.',
          al: 'Ekipi ynë me përvojë siguron artizanat të saktë dhe vëmendje ndaj detajeve në çdo projekt, duke ofruar rezultate të jashtëzakonshme që tejkalojnë pritjet.',
        },
        image: '/assets/image1.png',
        stepImages: [
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
        ]
      },
      {
        title: {
          en: 'Cross-Laminated Timber',
          de: 'Kreuzlagenholz',
          al: 'Druri i Laminuar në Kryq',
        },
        description: {
          en: 'Advanced cross-laminated timber solutions for modern construction projects. CLT offers superior strength, sustainability, and design flexibility.',
          de: 'Fortschrittliche Kreuzlagenholz-Lösungen für moderne Bauprojekte. CLT bietet überlegene Festigkeit, Nachhaltigkeit und Designflexibilität.',
          al: 'Zgjidhje të avancuara të drurit të laminuar në kryq për projektet moderne të ndërtimit. CLT ofron forcë superiore, qëndrueshmëri dhe fleksibilitet në dizajn.',
        },
        description2: {
          en: 'We provide expert consultation and implementation for CLT projects, ensuring optimal performance and environmental benefits.',
          de: 'Wir bieten fachkundige Beratung und Umsetzung für CLT-Projekte und sorgen für optimale Leistung und Umweltvorteile.',
          al: 'Ne ofrojmë konsultim dhe implementim ekspert për projektet CLT, duke siguruar performancë optimale dhe përfitime mjedisore.',
        },
        image: '/assets/banner-1755681378587.jpg',
        stepImages: [
          {
            image: '/assets/step1.png',
            titleKey: 'design'
          },
          {
            image: '/assets/step2.png',
            titleKey: 'fabrication'
          },
          {
            image: '/assets/step3.png',
            titleKey: 'installation'
          }
        ]
      },
      {
        title: {
          en: 'Modular Construction',
          de: 'Modularer Bau',
          al: 'Ndërtimi Modular',
        },
        description: {
          en: 'Innovative modular construction methods that reduce construction time and costs while maintaining high quality standards.',
          de: 'Innovative modulare Bauverfahren, die die Bauzeit und -kosten reduzieren und dabei hohe Qualitätsstandards einhalten.',
          al: 'Metoda inovative të ndërtimit modular që reduktojnë kohën dhe koston e ndërtimit duke ruajtur standarde të larta cilësie.',
        },
        description2: {
          en: 'Our modular approach ensures consistent quality, faster project completion, and reduced environmental impact.',
          de: 'Unser modularer Ansatz sorgt für konsistente Qualität, schnellere Projektabwicklung und reduzierte Umweltauswirkungen.',
          al: 'Qasja jonë modulare siguron cilësi konsistente, përfundim më të shpejtë të projektit dhe ndikim mjedisor të reduktuar.',
        },
        image: '/assets/banner-1755681398507.jpeg',
        stepImages: [
          {
            image: '/assets/step1.png',
            titleKey: 'planning'
          },
          {
            image: '/assets/step2.png',
            titleKey: 'manufacturing'
          },
          {
            image: '/assets/step3.png',
            titleKey: 'assembly'
          }
        ]
      },
    ];
    
    // Insert sample services
    const createdServices = await Service.insertMany(sampleServices);
    
    return NextResponse.json({
      success: true,
      message: `${createdServices.length} sample services created successfully`,
      data: createdServices,
    });
  } catch (error) {
    console.error('Error seeding services:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed services' },
      { status: 500 }
    );
  }
}

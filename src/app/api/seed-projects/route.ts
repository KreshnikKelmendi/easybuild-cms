import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function POST() {
  try {
    await connectDB()
    
    // Clear existing projects
    await Project.deleteMany({})
    
    const sampleProjects = [
      {
        title: {
          en: 'Modern Office Building',
          de: 'Modernes Bürogebäude',
          al: 'Ndërtesa Moderne e Zyrave'
        },
        description: {
          en: 'A state-of-the-art office complex featuring sustainable design, smart building technology, and modern amenities for the workforce of tomorrow.',
          de: 'Ein hochmodernes Bürokomplex mit nachhaltigem Design, intelligenter Gebäudetechnologie und modernen Annehmlichkeiten für die Arbeitskräfte von morgen.',
          al: 'Një kompleks zyrash ultra-modern me dizajnin e qëndrueshëm, teknologjinë e zgjuar të ndërtesave dhe komoditetet moderne për fuqinë punëtore të së nesërmes.'
        },
        mainImage: '/assets/image1.png',
        additionalImages: [
          '/assets/banner-1755681083952.jpg',
          '/assets/banner-1755681378587.jpg',
          '/assets/banner-1755681391505.jpg'
        ],
        isActive: true
      },
      {
        title: {
          en: 'Residential Complex',
          de: 'Wohnkomplex',
          al: 'Kompleksi i Banesave'
        },
        description: {
          en: 'Luxury residential development with premium finishes, community amenities, and beautiful landscaping for modern family living.',
          de: 'Luxuriöse Wohnanlage mit Premium-Ausstattung, Gemeinschaftseinrichtungen und schöner Landschaftsgestaltung für modernes Familienleben.',
          al: 'Zhvillimi luksoz i banesave me përfundime premium, komoditete komunitare dhe peizazh të bukur për jetimin modern të familjes.'
        },
        mainImage: '/assets/banner-1755681398507.jpeg',
        additionalImages: [
          '/assets/banner-1755681648070.png',
          '/assets/banner-1755681675600.png'
        ],
        isActive: true
      },
      {
        title: {
          en: 'Shopping Center',
          de: 'Einkaufszentrum',
          al: 'Qendra e Blerjeve'
        },
        description: {
          en: 'Contemporary retail space designed for optimal customer experience with modern architecture and sustainable building practices.',
          de: 'Zeitgemäßer Einzelhandelsraum, der für optimale Kundenerfahrung mit moderner Architektur und nachhaltigen Baupraktiken konzipiert wurde.',
          al: 'Hapësirë moderne e tregtisë me pakicë e projektuar për përvojën optimale të klientit me arkitekturë moderne dhe praktika të qëndrueshme ndërtimi.'
        },
        mainImage: '/assets/banner-1755687942749.png',
        additionalImages: [
          '/assets/banner-1755688136086.png',
          '/assets/banner-1755688441229.png',
          '/assets/banner-1755688678384.png'
        ],
        isActive: true
      },
      {
        title: {
          en: 'Industrial Warehouse',
          de: 'Industrielager',
          al: 'Depoja Industriale'
        },
        description: {
          en: 'Efficient industrial facility designed for maximum productivity with advanced logistics systems and sustainable energy solutions.',
          de: 'Effiziente Industrieanlage, die für maximale Produktivität mit fortschrittlichen Logistiksystemen und nachhaltigen Energielösungen konzipiert wurde.',
          al: 'Instalimi industrial efikas i projektuar për produktivitetin maksimal me sisteme të avancuara logjistike dhe zgjidhje të qëndrueshme energjie.'
        },
        mainImage: '/assets/banner-1755690282833.png',
        additionalImages: [
          '/assets/banner-1755690359616.png',
          '/assets/banner-1755690616556.jpg'
        ],
        isActive: true
      }
    ]
    
    const createdProjects = await Project.insertMany(sampleProjects)
    
    return NextResponse.json({
      success: true,
      message: `${createdProjects.length} sample projects created successfully`,
      data: createdProjects
    })
  } catch (error) {
    console.error('Error seeding projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed projects' },
      { status: 500 }
    )
  }
}

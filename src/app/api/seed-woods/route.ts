import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wood from '@/models/Wood';

const initialWoods = [
  {
    title: {
      en: 'KVH',
      de: 'KVH',
      al: 'KVH',
    },
    imageUrl: '/assets/image (10) (1).png',
    order: 1,
  },
  {
    title: {
      en: 'CLT',
      de: 'CLT',
      al: 'CLT',
    },
    imageUrl: '/assets/image (9) (1).png',
    order: 2,
  },
  {
    title: {
      en: 'Laminated Beams',
      de: 'Verleimte Balken',
      al: 'Trarë të Ngjitur',
    },
    imageUrl: '/assets/image (7) (1).png',
    order: 3,
  },
  {
    title: {
      en: 'Rockwool',
      de: 'Steinwolle',
      al: 'Lesh i Gurit',
    },
    imageUrl: '/assets/image (6) (1).png',
    order: 4,
  },
  {
    title: {
      en: 'Fiber Wood',
      de: 'Faserholz',
      al: 'Druri i Fibrave',
    },
    imageUrl: '/assets/image (5) (1).png',
    order: 5,
  },
  {
    title: {
      en: 'OSB',
      de: 'OSB',
      al: 'OSB',
    },
    imageUrl: '/assets/image (4) (1).png',
    order: 6,
  },
  {
    title: {
      en: 'Plywood',
      de: 'Sperrholz',
      al: 'Kompensatë',
    },
    imageUrl: '/assets/image (3) (1).png',
    order: 7,
  },
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing woods
    await Wood.deleteMany({});
    
    // Insert initial woods
    const createdWoods = await Wood.insertMany(initialWoods);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdWoods.length} woods`,
      data: createdWoods,
    });
  } catch (error) {
    console.error('Error seeding woods:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed woods' },
      { status: 500 }
    );
  }
}

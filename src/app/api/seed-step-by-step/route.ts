import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StepByStep from '@/models/StepByStep';

export async function POST() {
  try {
    console.log('🔵 Starting step by step seeding...');
    await connectDB();
    console.log('✅ Database connected');

    // Create sample step by step data
    const stepByStepData = {
      title: {
        en: "Step by Step",
        de: "Schritt für Schritt",
        al: "Hapë pas hapi"
      },
      description: {
        en: "From residential homes to commercial buildings and large-scale facilities, our projects showcase the versatility and efficiency of lightweight construction.",
        de: "Von Wohnhäusern über Gewerbebauten bis hin zu großen Anlagen zeigen unsere Projekte die Vielseitigkeit und Effizienz des Leichtbaus.",
        al: "Nga shtëpitë rezidenciale deri te ndërtesat tregtare dhe objektet e mëdha, projektet tona tregojnë shumëllojshmërinë dhe efikasitetin e ndërtimit të lehtë."
      },
      images: {
        step1: "/assets/step1.png",
        step2: "/assets/step2.png",
        step3: "/assets/step3.png"
      },
      isActive: true,
    };

    console.log('📊 Step by step data to save:', stepByStepData);

    // Create new step by step
    const newStepByStep = new StepByStep(stepByStepData);
    await newStepByStep.save();
    
    console.log('✅ Step by step seeded successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Step by step section seeded successfully',
      data: newStepByStep 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error seeding step by step:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed step by step section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

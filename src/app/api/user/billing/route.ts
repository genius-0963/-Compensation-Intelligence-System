import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await auth();
    // Return mock Enterprise billing data
    return NextResponse.json({ 
      success: true, 
      data: {
        plan: "Enterprise",
        status: "active",
        renewalDate: "2027-01-01T00:00:00.000Z",
        amount: 29900, // $299.00
        interval: "month",
        seats: 5,
        features: [
           "Unlimited API access",
           "Advanced export capabilities",
           "Dedicated account manager",
           "Custom compensation benchmarks"
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch billing' }, { status: 500 });
  }
}

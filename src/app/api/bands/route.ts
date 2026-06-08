import { NextResponse } from "next/server";
import { BandService } from "@/services/band.service";
import { bandSchema } from "@/lib/validators/band";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId') || undefined;
    const levelId = searchParams.get('levelId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;

    const bands = await BandService.getAll({ roleId, levelId, locationId });
    return NextResponse.json(bands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bandSchema.parse(json);
    const band = await BandService.create(data);
    return NextResponse.json(band, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Validation failed' }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { MarketDataService } from "@/services/market-data.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;
    const type = searchParams.get('type') || 'list';

    if (type === 'trends' && roleId && locationId) {
      const trends = await MarketDataService.getTrends(roleId, locationId);
      return NextResponse.json(trends);
    }

    const data = await MarketDataService.getAll({ roleId, locationId });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

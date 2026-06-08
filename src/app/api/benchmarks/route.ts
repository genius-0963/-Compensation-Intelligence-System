import { NextResponse } from "next/server";
import { BenchmarkService } from "@/services/benchmark.service";
import { benchmarkSchema } from "@/lib/validators/benchmark";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId') || undefined;
    const levelId = searchParams.get('levelId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;

    const benchmarks = await BenchmarkService.getAll({ roleId, levelId, locationId });
    return NextResponse.json(benchmarks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = benchmarkSchema.parse(json);
    const benchmark = await BenchmarkService.create(data);
    return NextResponse.json(benchmark, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Validation failed' }, { status: 400 });
  }
}

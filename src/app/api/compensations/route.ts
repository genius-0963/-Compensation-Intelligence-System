import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { compensationSubmissionSchema } from "@/lib/validators/compensation";
import { normalizeCompanyName, getNormalizedRank, calculateTC } from "@/lib/normalize";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = compensationSubmissionSchema.parse(body);

    const {
      companyName,
      roleFamilyName,
      levelName,
      location,
      baseSalary,
      bonus = 0,
      stock = 0,
      other = 0,
      currency,
      yearsExperience,
      yearsAtCompany,
      source,
    } = validatedData;

    // 1. Normalize Names
    const normCompanyName = normalizeCompanyName(companyName);
    const normRank = getNormalizedRank(levelName, normCompanyName);
    const totalComp = calculateTC(baseSalary, bonus, stock, other);

    // 2. Resolve/Create Entities
    // Note: In a real app, this should be a transaction or separate services
    
    // Company
    let company = await prisma.company.findUnique({
      where: { normalizedName: normCompanyName }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          normalizedName: normCompanyName,
        }
      });
    }

    // Role Family
    let roleFamily = await prisma.roleFamily.findUnique({
      where: { name: roleFamilyName }
    });

    if (!roleFamily) {
      roleFamily = await prisma.roleFamily.create({
        data: { name: roleFamilyName }
      });
    }

    // Location
    let loc = await prisma.location.findUnique({
      where: {
        city_state_country: {
          city: location.city,
          state: location.state || "",
          country: location.country,
        }
      }
    });

    if (!loc) {
      loc = await prisma.location.create({
        data: {
          city: location.city,
          state: location.state || "",
          country: location.country,
          currency: currency,
        }
      });
    }

    // Level (Company Specific)
    let level = await prisma.level.findFirst({
      where: {
        companyId: company.id,
        name: levelName,
      }
    });

    if (!level) {
      level = await prisma.level.create({
        data: {
          companyId: company.id,
          name: levelName,
          code: `${company.id}-${levelName.replace(/\s+/g, '-').toUpperCase()}`,
          normalizedLevelRank: normRank,
        }
      });
    }

    // 3. Create Compensation Entry
    const entry = await prisma.compensationEntry.create({
      data: {
        companyId: company.id,
        roleFamilyId: roleFamily.id,
        levelId: level.id,
        locationId: loc.id,
        baseSalary,
        bonus,
        stock,
        other,
        totalCompensation: totalComp,
        currency,
        yearsExperience,
        yearsAtCompany,
        source,
      },
      include: {
        company: true,
        level: true,
        location: true,
        roleFamily: true,
      }
    });

    return NextResponse.json(entry);
  } catch (error: any) {
    console.error("Compensation submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit compensation" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const role = searchParams.get("role");
    const levelRank = searchParams.get("levelRank");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const skip = (page - 1) * pageSize;

    const [entries, total] = await Promise.all([
      prisma.compensationEntry.findMany({
        where: {
          ...(company && { company: { name: { contains: company, mode: 'insensitive' } } }),
          ...(role && { roleFamily: { name: { contains: role, mode: 'insensitive' } } }),
          ...(levelRank && { level: { normalizedLevelRank: parseInt(levelRank) } }),
        },
        include: {
          company: true,
          level: true,
          location: true,
          roleFamily: true,
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.compensationEntry.count({
        where: {
          ...(company && { company: { name: { contains: company, mode: 'insensitive' } } }),
          ...(role && { roleFamily: { name: { contains: role, mode: 'insensitive' } } }),
          ...(levelRank && { level: { normalizedLevelRank: parseInt(levelRank) } }),
        },
      })
    ]);

    return NextResponse.json({
      entries,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch compensations" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import { employeeSchema } from "@/lib/validators/employee";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId') || undefined;
    const roleId = searchParams.get('roleId') || undefined;
    const levelId = searchParams.get('levelId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;
    const search = searchParams.get('search') || undefined;

    const employees = await EmployeeService.getAll({
      departmentId, roleId, levelId, locationId, search
    });
    
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = employeeSchema.parse(json);
    const employee = await EmployeeService.create(data);
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Validation failed' }, { status: 400 });
  }
}

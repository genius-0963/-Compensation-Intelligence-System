"use client";

import { useParams } from "next/navigation";
import { useEmployee } from "@/hooks/use-employees";
import PageHeader from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { employee, isLoading, isError } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-6 text-rose-400">
        Failed to load employee details.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title={`${employee.firstName} ${employee.lastName}`} 
        description={`Employee ID: ${employee.employeeId} • ${employee.role?.title}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-[#0B1020] border border-slate-800 rounded-xl">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Compensation Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-500 text-sm">Base Salary</p>
                        <p className="text-xl font-medium text-white">${employee.currentSalary.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm">Total Compensation</p>
                        <p className="text-xl font-medium text-white">${employee.totalCompensation.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="p-6 bg-[#0B1020] border border-slate-800 rounded-xl">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Details</h2>
                <dl className="space-y-2">
                    <div className="flex justify-between">
                        <dt className="text-slate-500">Department</dt>
                        <dd className="text-slate-200">{employee.department?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-slate-500">Location</dt>
                        <dd className="text-slate-200">{employee.location?.city}</dd>
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  );
}

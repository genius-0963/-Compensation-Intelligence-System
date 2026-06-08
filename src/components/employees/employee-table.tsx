import { EmployeeWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

export function EmployeeTable({ employees }: { employees: EmployeeWithRelations[] }) {
  if (!employees?.length) {
    return <div className="p-8 text-center text-slate-500 bg-[#0B1020] rounded-lg border border-slate-800">No employees found matching the criteria.</div>;
  }

  return (
    <Table className="border border-slate-800 rounded-lg bg-[#0B1020] overflow-hidden">
      <TableHeader className="bg-slate-950">
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Role & Level</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Base Salary</TableHead>
          <TableHead>Total Comp</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => {
          const name = `${emp.firstName} ${emp.lastName}`;
          return (
            <TableRow key={emp.id} className="cursor-pointer group">
              <TableCell>
                <Link href={`/employees/${emp.id}`} className="flex items-center gap-3 w-full">
                  <Avatar name={name} size="sm" />
                  <div>
                    <div className="font-medium text-slate-200 group-hover:text-violet-400 transition-colors">{name}</div>
                    <div className="text-xs text-slate-500">{emp.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-300">{emp.role?.title}</div>
                <div className="text-xs text-slate-500">{emp.level?.name}</div>
              </TableCell>
              <TableCell className="text-sm text-slate-400">
                {emp.department?.name}
              </TableCell>
              <TableCell className="text-sm text-slate-300">
                {formatCurrency(emp.currentSalary)}
              </TableCell>
              <TableCell className="text-sm font-medium text-emerald-400">
                {formatCurrency(emp.totalCompensation)}
              </TableCell>
              <TableCell>
                <Badge variant={emp.status === 'ACTIVE' ? 'default' : 'outline'} className={emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}>
                  {emp.status}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

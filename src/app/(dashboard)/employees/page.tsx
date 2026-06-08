"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/page-header";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import EmployeeForm from "@/components/employees/employee-form";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  
  const query = new URLSearchParams();
  if (debouncedSearch) query.append("search", debouncedSearch);
  
  const { employees, isLoading, isError, mutate } = useEmployees(query.toString());

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Employees" 
        description="Manage your organization's employee compensation data."
      >
        <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </PageHeader>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Employee"
      >
        <EmployeeForm 
            onSuccess={() => {
                setIsModalOpen(false);
                mutate();
            }}
        />
      </Modal>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#0B1020] border-slate-800 text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <div className="text-rose-400 p-4 border border-rose-400/20 bg-rose-400/10 rounded-lg">
          Failed to load employees.
        </div>
      ) : (
        <EmployeeTable employees={employees || []} />
      )}
    </div>
  );
}

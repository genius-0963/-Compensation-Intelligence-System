"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const employeeSchema = z.object({
  employeeId: z.string().min(1, "Required"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  currentSalary: z.coerce.number().positive(),
  totalCompensation: z.coerce.number().positive(),
});

interface Props {
  onSuccess: () => void;
}

export default function EmployeeForm({ onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: any) => {
    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) onSuccess();
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Employee ID" {...register("employeeId")} />
      {errors.employeeId && <p className="text-rose-400 text-sm">{errors.employeeId.message as string}</p>}
      
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="First Name" {...register("firstName")} />
        <Input placeholder="Last Name" {...register("lastName")} />
      </div>
      
      <Input placeholder="Email" {...register("email")} />
      <Input type="number" placeholder="Base Salary" {...register("currentSalary")} />
      <Input type="number" placeholder="Total Comp" {...register("totalCompensation")} />
      
      <Button type="submit" className="w-full bg-violet-600">Submit</Button>
    </form>
  );
}

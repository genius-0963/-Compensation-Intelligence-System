"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SavedCompaniesPage() {
  const { data: session } = useSession();
  const { data: savedCompanies, error, mutate } = useSWR(
    session ? '/api/saved-companies' : null,
    fetcher
  );

  const handleRemove = async (companyId: string) => {
    try {
      await fetch(`/api/saved-companies/${companyId}`, {
        method: 'DELETE',
      });
      // Re-fetch the data to update the UI
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Failed to load saved companies</div>;
  if (!savedCompanies) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Saved Companies</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Saved Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(savedCompanies as any[]).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.company.name}</TableCell>
              <TableCell>{item.company.industry}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleRemove(item.company.id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

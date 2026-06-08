"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ComparisonCard({ comparison, onDelete }: { comparison: any; onDelete: (id: string) => void }) {
  // The comparison.config will contain the details of the comparison.
  // I'm assuming a structure for the config object here.
  // This will need to be adjusted based on the actual structure of the comparison config.
  const { companies, levels, locations } = comparison.config || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{comparison.title}</CardTitle>
        <CardDescription>
          Created on: {new Date(comparison.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1 mb-4">
          {companies && <p><strong>Companies:</strong> {companies.join(', ')}</p>}
          {levels && <p><strong>Levels:</strong> {levels.join(', ')}</p>}
          {locations && <p><strong>Locations:</strong> {locations.join(', ')}</p>}
        </div>
        <p className="text-gray-700">{comparison.description}</p>
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button variant="destructive" size="sm" onClick={() => onDelete(comparison.id)}>Delete</Button>
        {/* Placeholder for other actions */}
        <Button variant="secondary" size="sm">View</Button>
        <Button variant="outline" size="sm">Edit</Button>
      </CardFooter>
    </Card>
  );
}


export default function SavedComparisonsPage() {
  const { data: session } = useSession();
  const { data: savedComparisons, error, mutate } = useSWR(
    session ? '/api/saved-comparisons' : null,
    fetcher
  );

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/saved-comparisons/${id}`, {
        method: 'DELETE',
      });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Failed to load saved comparisons</div>;
  if (!savedComparisons) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Saved Comparisons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(savedComparisons as any[]).map((comparison) => (
          <ComparisonCard key={comparison.id} comparison={comparison} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

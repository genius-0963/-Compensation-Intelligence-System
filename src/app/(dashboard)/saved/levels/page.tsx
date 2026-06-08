"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SavedLevelsPage() {
  const { data: session } = useSession();
  const { data: savedLevels, error, mutate } = useSWR(
    session ? '/api/saved-levels' : null,
    fetcher
  );

  const handleRemove = async (levelId: string) => {
    try {
      await fetch(`/api/saved-levels/${levelId}`, {
        method: 'DELETE',
      });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Failed to load saved levels</div>;
  if (!savedLevels) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Saved Levels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(savedLevels as any[]).map((item) => (
          <Card key={item.id}>
            <CardHeader>
                <CardTitle className="text-xl font-bold">{item.level.company.name} - {item.level.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-400">Saved on: {new Date(item.createdAt).toLocaleDateString()}</p>
                {/* Add more level details here as needed */}
            </CardContent>
            <CardFooter>
                <Button variant="destructive" size="sm" onClick={() => handleRemove(item.level.id)}>
                    Remove
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

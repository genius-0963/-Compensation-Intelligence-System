"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StatCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="block">
      <Card className="hover:bg-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function PersonalDashboardPage() {
  const { data: session } = useSession();
  
  // Fetch counts for saved metrics
  const { data: savedCompanies } = useSWR(session ? '/api/saved-companies' : null, fetcher);
  const { data: savedLevels } = useSWR(session ? '/api/saved-levels' : null, fetcher);
  const { data: savedLocations } = useSWR(session ? '/api/saved-locations' : null, fetcher);
  const { data: savedComparisons } = useSWR(session ? '/api/saved-comparisons' : null, fetcher);

  const user = session?.user;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Personal Dashboard</h1>

      {/* Section 1: Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {/* Add more profile details here */}
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Saved Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4">Saved Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard title="Saved Companies" value={savedCompanies?.length ?? 0} href="/saved/companies" />
          <StatCard title="Saved Levels" value={savedLevels?.length ?? 0} href="/saved/levels" />
          <StatCard title="Saved Locations" value={savedLocations?.length ?? 0} href="/saved/locations" />
          <StatCard title="Saved Comparisons" value={savedComparisons?.length ?? 0} href="/saved/comparisons" />
        </div>
      </div>

      {/* Placeholder sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recently Viewed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">[Recently viewed items will be displayed here]</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Watchlist Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">[Updates from your watchlist will be displayed here]</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">[Personalized recommendations will be displayed here]</p>
        </CardContent>
      </Card>

    </div>
  );
}

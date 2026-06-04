import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminReviewQueue() {
  const pendingSubmissions = await prisma.compensationSubmission.findMany({
    where: { status: 'SUBMITTED' },
    include: { user: true, company: true },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-6">Review Queue</h1>
      <div className="space-y-4">
        {pendingSubmissions.map((s) => (
          <Card key={s.id} className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold">{s.company.name}</p>
              <p className="text-sm text-gray-500">Submitted by: {s.user.email}</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline">Reject</Button>
               <Button>Approve</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

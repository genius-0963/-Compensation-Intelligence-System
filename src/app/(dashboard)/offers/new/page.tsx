'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function CreateOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    candidateId: '',
    roleId: '',
    levelId: '',
    locationId: '',
    baseSalary: 0,
    equityGrant: 0,
    signingBonus: 0,
    annualBonus: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/candidates').then(res => res.json()),
      fetch('/api/roles').then(res => res.json()),
      fetch('/api/levels').then(res => res.json()),
      fetch('/api/locations').then(res => res.json()),
    ]).then(([cData, rData, lData, locData]) => {
      setCandidates(Array.isArray(cData) ? cData : []);
      setRoles(Array.isArray(rData) ? rData : []);
      setLevels(Array.isArray(lData) ? lData : []);
      setLocations(Array.isArray(locData) ? locData : []);
    }).catch(console.error);
  }, []);

  const totalCompensation = 
    Number(formData.baseSalary) + 
    Number(formData.equityGrant) + 
    Number(formData.signingBonus) + 
    Number(formData.annualBonus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          baseSalary: Number(formData.baseSalary),
          equityGrant: Number(formData.equityGrant),
          signingBonus: Number(formData.signingBonus),
          annualBonus: Number(formData.annualBonus),
        })
      });
      
      const newOffer = await res.json();
      if (newOffer && newOffer.id) {
        router.push(`/offers/${newOffer.id}`);
      } else {
        alert("Failed to create offer");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating offer");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Create Offer" 
        description="Draft a new offer and get instant AI-powered negotiation insights." 
      />

      <Card className="bg-[#0B1020] border-slate-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Candidate & Role Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-100">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Candidate</Label>
                  <Select value={formData.candidateId} onValueChange={(v) => setFormData({...formData, candidateId: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300">
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.roleId} onValueChange={(v) => setFormData({...formData, roleId: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={formData.levelId} onValueChange={(v) => setFormData({...formData, levelId: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.name} ({l.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={formData.locationId} onValueChange={(v) => setFormData({...formData, locationId: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-300">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.city}, {l.country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Compensation Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-100">Compensation Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Base Salary</Label>
                  <Input 
                    type="number" 
                    value={formData.baseSalary || ''}
                    onChange={(e) => setFormData({...formData, baseSalary: Number(e.target.value)})}
                    className="bg-slate-950 border-slate-800 text-slate-300"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equity Grant (Total Value)</Label>
                  <Input 
                    type="number" 
                    value={formData.equityGrant || ''}
                    onChange={(e) => setFormData({...formData, equityGrant: Number(e.target.value)})}
                    className="bg-slate-950 border-slate-800 text-slate-300"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signing Bonus</Label>
                  <Input 
                    type="number" 
                    value={formData.signingBonus || ''}
                    onChange={(e) => setFormData({...formData, signingBonus: Number(e.target.value)})}
                    className="bg-slate-950 border-slate-800 text-slate-300"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Target Bonus</Label>
                  <Input 
                    type="number" 
                    value={formData.annualBonus || ''}
                    onChange={(e) => setFormData({...formData, annualBonus: Number(e.target.value)})}
                    className="bg-slate-950 border-slate-800 text-slate-300"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-4 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Calculated Total Compensation</span>
                <span className="text-xl font-bold text-emerald-400">
                  ${totalCompensation.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !formData.candidateId || !formData.roleId || !formData.levelId || !formData.locationId || !formData.baseSalary}
                className="bg-violet-600 hover:bg-violet-700 text-white min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Offer...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Analyze & Create Offer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

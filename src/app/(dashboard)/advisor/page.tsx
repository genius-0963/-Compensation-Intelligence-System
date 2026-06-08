import React from "react";
import { Metadata } from "next";
import AdvisorLayout from "@/components/advisor/AdvisorLayout";

export const metadata: Metadata = {
  title: "AI Compensation Advisor | CIS",
  description: "AI-powered compensation strategist fully integrated into the Compensation Intelligence Platform.",
};

export default function AdvisorPage() {
  return (
    <div className="h-[calc(100vh-64px)] -m-6 flex bg-slate-950/50">
      <AdvisorLayout />
    </div>
  );
}

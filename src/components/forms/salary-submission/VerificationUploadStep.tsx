'use client';

import React from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function VerificationUploadStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-2xl font-black text-white mb-2">Offer Verification</h2>
         <p className="text-sm text-slate-500 font-medium">Upload your offer letter, W2, or payslip to verify your submission.</p>
       </div>

       <div className="border-2 border-dashed border-border rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-all">
          <UploadCloud className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="font-bold text-white mb-2">Drag & Drop files</h3>
          <p className="text-xs text-gray-400 mb-6 font-medium">PDF, PNG, JPG up to 20MB</p>
          
          <UploadButton<OurFileRouter, "verificationDocs">
            endpoint="verificationDocs"
            onClientUploadComplete={(res) => {
              alert("Upload Completed");
              form.setValue('documents', res);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
       </div>

       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <FileText className="h-5 w-5 text-blue-600 shrink-0" />
          <p className="text-xs font-medium text-blue-800 leading-relaxed">
             <span className="font-black">Security First:</span> All documents are encrypted at rest and are only accessible by authorized Compensation Intelligence admins for verification purposes.
          </p>
       </div>
    </div>
  );
}

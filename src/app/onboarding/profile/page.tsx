"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Loader2, Building2, MapPin, Briefcase, FileText } from 'lucide-react';
import { Card } from "@/components/ui/card";

const steps = [
  { id: 1, title: 'Current Company', field: 'currentCompany', icon: Building2 },
  { id: 2, title: 'Experience', field: 'yearsExperience', icon: Briefcase },
  { id: 3, title: 'Location', field: 'location', icon: MapPin },
  { id: 4, title: 'Bio', field: 'bio', icon: FileText },
];

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    currentCompany: '',
    yearsExperience: '',
    location: '',
    bio: ''
  });

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/profile').then(r => r.json()).then(d => {
      if (d.success) setProfile(d.data);
    });
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (session) {
          await update({ ...session, user: { ...session.user, onboardingCompleted: true } });
        }
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return formData.currentCompany.trim().length > 0;
    if (currentStep === 2) return formData.yearsExperience !== '' && Number(formData.yearsExperience) >= 0;
    if (currentStep === 3) return formData.location.trim().length > 0;
    if (currentStep === 4) return formData.bio.trim().length > 0;
    return false;
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 bg-grid-white/[0.02]">
      <div className="w-full max-w-[800px]">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-down">
          {profile && (
             <div className="flex flex-col items-center justify-center mb-6">
                {profile.avatarUrl ? (
                   <img src={profile.avatarUrl} alt="Avatar" className="h-20 w-20 rounded-[28px] object-cover shadow-lg border-2 border-border mb-4" />
                ) : (
                   <div className="h-20 w-20 rounded-[28px] bg-blue-600/20 text-blue-500 border-2 border-blue-500/20 flex items-center justify-center text-xl font-black shadow-lg mb-4 uppercase">
                     {profile.name?.slice(0, 2) || profile.email?.slice(0, 2) || "U"}
                   </div>
                )}
                <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
                <p className="text-sm text-gray-400 font-medium">{profile.email}</p>
             </div>
          )}
          <h2 className="text-3xl font-black text-white mb-2">Complete Your Professional Profile</h2>
          <p className="text-gray-400 font-medium max-w-md mx-auto">Help us personalize compensation intelligence and recommendations.</p>
        </div>

        {/* Wizard Card */}
        <Card className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
           {/* Progress Bar */}
           <div className="h-1.5 w-full bg-white/5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
           </div>

           <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10">
                 <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">Step {currentStep} of {steps.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{Math.round(progress)}% Complete</div>
              </div>

              <div className="min-h-[200px] relative">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={currentStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0"
                   >
                     {currentStep === 1 && (
                       <div className="space-y-6">
                         <div className="flex items-center gap-4 mb-2">
                           <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                             <Building2 className="h-5 w-5" />
                           </div>
                           <h3 className="text-2xl font-black text-white">Current Company</h3>
                         </div>
                         <input 
                           autoFocus
                           type="text" 
                           placeholder="e.g. Google, Meta, Stripe"
                           value={formData.currentCompany}
                           onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                           className="w-full h-16 bg-[#0B1020] border border-white/10 rounded-2xl px-6 text-lg font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                         />
                       </div>
                     )}

                     {currentStep === 2 && (
                       <div className="space-y-6">
                         <div className="flex items-center gap-4 mb-2">
                           <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                             <Briefcase className="h-5 w-5" />
                           </div>
                           <h3 className="text-2xl font-black text-white">Years of Experience</h3>
                         </div>
                         <input 
                           autoFocus
                           type="number" 
                           min="0"
                           max="50"
                           step="0.5"
                           placeholder="e.g. 6.5"
                           value={formData.yearsExperience}
                           onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                           className="w-full h-16 bg-[#0B1020] border border-white/10 rounded-2xl px-6 text-lg font-bold text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                         />
                       </div>
                     )}

                     {currentStep === 3 && (
                       <div className="space-y-6">
                         <div className="flex items-center gap-4 mb-2">
                           <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                             <MapPin className="h-5 w-5" />
                           </div>
                           <h3 className="text-2xl font-black text-white">Location</h3>
                         </div>
                         <input 
                           autoFocus
                           type="text" 
                           placeholder="e.g. San Francisco, CA"
                           value={formData.location}
                           onChange={(e) => setFormData({...formData, location: e.target.value})}
                           className="w-full h-16 bg-[#0B1020] border border-white/10 rounded-2xl px-6 text-lg font-bold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                         />
                       </div>
                     )}

                     {currentStep === 4 && (
                       <div className="space-y-6">
                         <div className="flex items-center gap-4 mb-2">
                           <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                             <FileText className="h-5 w-5" />
                           </div>
                           <h3 className="text-2xl font-black text-white">Professional Bio</h3>
                         </div>
                         <textarea 
                           autoFocus
                           placeholder="Tell us about your background, expertise, and career goals."
                           maxLength={500}
                           value={formData.bio}
                           onChange={(e) => setFormData({...formData, bio: e.target.value})}
                           className="w-full h-32 bg-[#0B1020] border border-white/10 rounded-2xl p-6 text-base font-bold text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-gray-600 resize-none"
                         />
                         <div className="text-[10px] text-right font-black uppercase tracking-widest text-gray-500">
                           {formData.bio.length} / 500
                         </div>
                       </div>
                     )}
                   </motion.div>
                 </AnimatePresence>
              </div>

              <div className="pt-10 mt-10 border-t border-white/10 flex items-center justify-between">
                 <button 
                   onClick={handleBack}
                   className={`h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                     currentStep > 1 ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'opacity-0 pointer-events-none'
                   }`}
                 >
                   <ArrowLeft className="h-4 w-4" /> Back
                 </button>

                 {currentStep < steps.length ? (
                   <button 
                     onClick={handleNext}
                     disabled={!isCurrentStepValid()}
                     className="h-12 px-8 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     Continue <ArrowRight className="h-4 w-4" />
                   </button>
                 ) : (
                   <button 
                     onClick={handleFinish}
                     disabled={!isCurrentStepValid() || saving}
                     className="h-12 px-8 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                     Complete Profile
                   </button>
                 )}
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}

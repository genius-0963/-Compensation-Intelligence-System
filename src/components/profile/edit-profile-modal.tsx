'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Zod Schema matching database fields and validation constraints
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format (e.g. +1234567890)").optional().or(z.literal('')),
  currentCompany: z.string().optional().or(z.literal('')),
  roleFamily: z.string().optional().or(z.literal('')),
  level: z.string().optional().or(z.literal('')),
  yearsExperience: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0, "Must be at least 0").optional()
  ),
  location: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal('')),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onSaveSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, initialData, onSaveSuccess }: EditProfileModalProps) {
  const { data: session, update: updateSession } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      currentCompany: '',
      roleFamily: '',
      level: '',
      yearsExperience: 0,
      location: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      bio: '',
    }
  });

  const watchedFields = watch();

  // Pre-fill initialData or check for LocalStorage drafts
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('profileDraft');
      if (savedDraft) {
        try {
          const draftValues = JSON.parse(savedDraft);
          reset({ ...initialData, ...draftValues });
          return;
        } catch (e) {
          // fail silently and load initialData
        }
      }
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        currentCompany: initialData.currentCompany || '',
        roleFamily: initialData.roleFamily || '',
        level: initialData.level || '',
        yearsExperience: initialData.yearsExperience || 0,
        location: initialData.location || '',
        linkedinUrl: initialData.linkedinUrl || '',
        githubUrl: initialData.githubUrl || '',
        portfolioUrl: initialData.portfolioUrl || '',
        bio: initialData.bio || '',
      });
    }
  }, [isOpen, initialData, reset]);

  // Autosave draft to local storage when inputs change
  useEffect(() => {
    if (isDirty && isOpen) {
      localStorage.setItem('profileDraft', JSON.stringify(watchedFields));
    }
  }, [watchedFields, isDirty, isOpen]);

  const handleClose = () => {
    if (isDirty) {
      const confirmExit = window.confirm("You have unsaved changes. Are you sure you want to exit? Your progress will remain saved in drafts locally.");
      if (!confirmExit) return;
    }
    onClose();
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update profile parameters');
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
          currentCompany: values.currentCompany,
          location: values.location,
        }
      });

      localStorage.removeItem('profileDraft');
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'An error occurred while saving profile changes.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit User Profile" className="max-w-2xl overflow-y-auto max-h-[85vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-4">
        {/* Personal details row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</Label>
            <Input id="edit-name" {...register('name')} placeholder="John Doe" className="h-10 text-xs font-bold rounded-xl" />
            {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Email Address</Label>
            <Input id="edit-email" {...register('email')} placeholder="john.doe@company.com" className="h-10 text-xs font-bold rounded-xl" />
            {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Phone Number</Label>
            <Input id="edit-phone" {...register('phone')} placeholder="+1234567890" className="h-10 text-xs font-bold rounded-xl" />
            {errors.phone && <p className="text-red-500 text-[10px] font-bold">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-location" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Location</Label>
            <Input id="edit-location" {...register('location')} placeholder="Bangalore, India" className="h-10 text-xs font-bold rounded-xl" />
          </div>
        </div>

        <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-600 border-b border-border pb-1.5 pt-2">Professional Info</h4>
        
        {/* Professional Details row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-company" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Company</Label>
            <Input id="edit-company" {...register('currentCompany')} placeholder="Google" className="h-10 text-xs font-bold rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Role</Label>
            <Input id="edit-role" {...register('roleFamily')} placeholder="Software Engineer" className="h-10 text-xs font-bold rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-level" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Level</Label>
            <Input id="edit-level" {...register('level')} placeholder="L5" className="h-10 text-xs font-bold rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-exp" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Years of Experience</Label>
            <Input id="edit-exp" type="number" step="0.5" {...register('yearsExperience')} className="h-10 text-xs font-bold rounded-xl" />
            {errors.yearsExperience && <p className="text-red-500 text-[10px] font-bold">{errors.yearsExperience.message}</p>}
          </div>
        </div>

        <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-600 border-b border-border pb-1.5 pt-2">Bio & Portfolio Links</h4>
        
        <div className="space-y-1.5">
          <Label htmlFor="edit-bio" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Short Bio</Label>
          <textarea 
            id="edit-bio" 
            {...register('bio')} 
            rows={3} 
            placeholder="Tell us about yourself and your professional experience..."
            className="w-full bg-[#0B1020] border border-border rounded-xl p-3 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/10 focus:bg-card outline-none dark:bg-slate-900/50 transition-all placeholder:text-gray-400"
          />
          {errors.bio && <p className="text-red-500 text-[10px] font-bold">{errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-linkedin" className="text-[10px] font-black uppercase tracking-wider text-gray-400">LinkedIn URL</Label>
            <Input id="edit-linkedin" {...register('linkedinUrl')} placeholder="https://linkedin.com/in/username" className="h-10 text-xs font-bold rounded-xl" />
            {errors.linkedinUrl && <p className="text-red-500 text-[10px] font-bold">{errors.linkedinUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-github" className="text-[10px] font-black uppercase tracking-wider text-gray-400">GitHub URL</Label>
            <Input id="edit-github" {...register('githubUrl')} placeholder="https://github.com/username" className="h-10 text-xs font-bold rounded-xl" />
            {errors.githubUrl && <p className="text-red-500 text-[10px] font-bold">{errors.githubUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-portfolio" className="text-[10px] font-black uppercase tracking-wider text-gray-400">Portfolio URL</Label>
            <Input id="edit-portfolio" {...register('portfolioUrl')} placeholder="https://portfolio.com" className="h-10 text-xs font-bold rounded-xl" />
            {errors.portfolioUrl && <p className="text-red-500 text-[10px] font-bold">{errors.portfolioUrl.message}</p>}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 border-t border-border dark:border-slate-800/50">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleClose}
            className="h-11 px-6 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            {isDirty && (
              <span className="text-[10px] text-gray-400 font-bold self-center mr-2 animate-pulse">Draft Autosaved</span>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 active:scale-95"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

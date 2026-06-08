'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Camera, Upload, RotateCw, ZoomIn, ZoomOut, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (imageUrl: string) => void;
  currentAvatarUrl?: string | null;
}

export function AvatarCropModal({ isOpen, onClose, onUploadSuccess, currentAvatarUrl }: AvatarCropModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Crop & Transform States
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Clean up Object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Image Validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Unsupported format. Please upload JPG, PNG, WEBP, or AVIF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image is too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      
      // Reset transforms
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Unsupported format. Please upload JPG, PNG, WEBP, or AVIF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image is too large. Maximum size is 5MB.');
        return;
      }
      setSelectedFile(file);
      setImageSrc(URL.createObjectURL(file));
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Drag-to-Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const generateWebPBlob = (size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = imageRef.current;
      if (!img) return reject(new Error('Image not loaded'));

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not get canvas context'));

      // Draw circular clip path if needed, but standard avatars are saved as square WebP and rendered with rounded-full CSS
      ctx.clearRect(0, 0, size, size);

      // Translate coordinates to center of canvas
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Calculate translation based on viewport size (typically 250px container)
      const viewportSize = 250;
      const scaleMultiplier = size / viewportSize;
      
      // Calculate drawn image dimensions while maintaining aspect ratio
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const minDimension = Math.min(naturalWidth, naturalHeight);
      
      const drawWidth = (naturalWidth / minDimension) * viewportSize;
      const drawHeight = (naturalHeight / minDimension) * viewportSize;

      // Draw the image onto our canvas
      ctx.drawImage(
        img,
        -drawWidth / 2 + position.x,
        -drawHeight / 2 + position.y,
        drawWidth,
        drawHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob generation failed'));
        },
        'image/webp',
        0.92
      );
    });
  };

  const handleSave = async () => {
    if (!imageSrc) return;
    setIsUploading(true);
    setError(null);

    try {
      // Generate WebP variants for: small (64px), medium (256px), large (1024px)
      const smallBlob = await generateWebPBlob(64);
      const mediumBlob = await generateWebPBlob(256);
      const largeBlob = await generateWebPBlob(1024);

      const formData = new FormData();
      formData.append('small', smallBlob, 'avatar_small.webp');
      formData.append('medium', mediumBlob, 'avatar_medium.webp');
      formData.append('large', largeBlob, 'avatar_large.webp');

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload cropped avatar');
      }

      const data = await res.json();
      onUploadSuccess(data.imageUrl);
      
      // Clean up states
      setSelectedFile(null);
      setImageSrc(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
    setIsUploading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete photo");
      onUploadSuccess('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile Photo" className="max-w-md">
      <div className="space-y-6">
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {!imageSrc ? (
          /* Drag and Drop Zone */
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-slate-900/50 hover:border-blue-500 transition-colors flex flex-col items-center justify-center min-h-[260px] group"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-800/80 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            
            <p className="text-sm font-bold text-white dark:text-slate-200 mb-1">Drag and drop profile photo</p>
            <p className="text-xs text-gray-400 mb-6">Supports JPG, PNG, WEBP, or AVIF (Max 5MB)</p>
            
            <div className="flex gap-3 flex-wrap justify-center">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                size="sm"
                className="h-10 text-xs font-bold rounded-xl"
              >
                Choose Photo
              </Button>
              <Button 
                onClick={() => cameraInputRef.current?.click()} 
                variant="outline" 
                size="sm"
                className="h-10 text-xs font-bold rounded-xl md:hidden"
              >
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Take Photo
              </Button>
            </div>

            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            {/* Native camera trigger for mobile devices */}
            <input 
              ref={cameraInputRef} 
              type="file" 
              accept="image/*" 
              capture="user" 
              className="hidden" 
              onChange={handleFileChange} 
            />

            {currentAvatarUrl && (
              <button 
                onClick={handleRemovePhoto}
                className="mt-6 text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Current Photo
              </button>
            )}
          </div>
        ) : (
          /* Interactive Cropping Section */
          <div className="space-y-6 animate-fade-up">
            {/* Viewport container */}
            <div className="flex justify-center">
              <div 
                className="relative h-[250px] w-[250px] overflow-hidden rounded-full border border-border bg-[#111827] dark:bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop Preview"
                  className="max-w-none origin-center pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  }}
                />
                
                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500 pointer-events-none opacity-50 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]" />
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-4 bg-[#0B1020] dark:bg-slate-900/50 p-4 rounded-2xl border border-border dark:border-slate-800/50">
              {/* Zoom Control */}
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-gray-400" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <ZoomIn className="h-4 w-4 text-gray-400" />
                <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Rotation Control */}
              <div className="flex items-center gap-4">
                <RotateCw className="h-4 w-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <RotateCw className="h-4 w-4 text-gray-400" />
                <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{rotation}°</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setImageSrc(null);
                }}
                className="text-xs text-gray-400 hover:text-slate-400 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-3 text-xs font-bold rounded-xl border border-transparent hover:border-border dark:hover:border-slate-800">
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isUploading} 
                  size="sm"
                  className="h-9 px-5 text-xs font-black uppercase tracking-wider rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isUploading ? 'Saving...' : 'Save Photo'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

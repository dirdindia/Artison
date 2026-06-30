import React from 'react';
import { X } from 'lucide-react';

export default function ImageViewer({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-enter">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt="Full View" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

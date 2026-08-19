import React from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';

export default function Artworks() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">My Artworks</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio and listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Artwork
        </button>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center bg-canvas">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No artworks yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">Upload your first piece of art to start selling and showcasing your talent to the world.</p>
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            Upload Artwork
          </button>
        </div>
      </div>
    </div>
  );
}

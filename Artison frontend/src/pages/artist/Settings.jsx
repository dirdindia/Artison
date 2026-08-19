import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, Link as LinkIcon, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your artist profile and preferences</p>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Update your public details and contact info.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden border-4 border-background shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <button className="px-4 py-2 bg-secondary text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer">
              Change Avatar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" defaultValue={user?.name} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" defaultValue={user?.email} disabled className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" defaultValue={user?.phone} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Portfolio URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="url" placeholder="https://..." defaultValue={user?.portfolioUrl} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Artist Bio</label>
            <textarea rows="4" defaultValue={user?.bio} placeholder="Tell customers about yourself and your art..." className="w-full p-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-canvas flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

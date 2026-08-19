import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { name: "Total Revenue", value: "₹0.00", icon: DollarSign, trend: "+0%" },
    { name: "Active Artworks", value: "0", icon: Package, trend: "0 new" },
    { name: "Pending Orders", value: "0", icon: ShoppingCart, trend: "Needs attention" },
    { name: "Profile Views", value: "0", icon: TrendingUp, trend: "This week" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your studio today.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm w-fit cursor-pointer">
          Upload Artwork
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold font-display text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-background rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold font-display mb-4 text-foreground">Recent Orders</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">When customers buy your artwork, their orders will appear here.</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold font-display mb-4 text-foreground">Top Artworks</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
            <Package className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No artworks found</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload your first artwork to get started.</p>
            <button className="mt-4 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer border border-border">
              Add Artwork
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

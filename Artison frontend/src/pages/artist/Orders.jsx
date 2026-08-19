import React from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your customer orders</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors cursor-pointer w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center bg-canvas">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No orders found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">When customers purchase your artwork, their orders will appear here.</p>
        </div>
      </div>
    </div>
  );
}

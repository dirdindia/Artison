import React from 'react';
import { DollarSign, Download, TrendingUp, Calendar } from 'lucide-react';

export default function Earnings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">Overview of your revenue and payouts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer">
          <Download className="w-4 h-4" />
          Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium opacity-80 mb-1">Available Balance</p>
          <h3 className="text-3xl font-bold font-display">₹0.00</h3>
          <button className="mt-4 px-4 py-2 bg-background text-foreground rounded-xl text-sm font-semibold hover:bg-secondary transition-colors cursor-pointer w-full">
            Withdraw Funds
          </button>
        </div>
        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          </div>
          <h3 className="text-3xl font-bold font-display text-foreground">₹0.00</h3>
          <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
        </div>
        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-medium text-muted-foreground">Pending Clearance</p>
          </div>
          <h3 className="text-3xl font-bold font-display text-foreground">₹0.00</h3>
          <p className="text-xs text-muted-foreground mt-2">From recent sales</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
        <h2 className="text-lg font-bold font-display mb-4 text-foreground">Transaction History</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
          <DollarSign className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-foreground">No transactions yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Your sales and withdrawal history will appear here.</p>
        </div>
      </div>
    </div>
  );
}

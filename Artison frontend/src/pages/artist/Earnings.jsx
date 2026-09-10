import React, { useState, useEffect } from 'react';
import { DollarSign, Download, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import api from '@/api';
import { toast } from 'sonner';

export default function Earnings() {
  const [wallet, setWallet] = useState({ walletBalance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await api.get('/wallet');
      if (data.success) {
        setWallet(data.data);
      }
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const completedPayouts = wallet.transactions.filter(t => t.type === 'Credit' && t.status === 'Completed');
  
  const totalRevenue = completedPayouts.reduce((sum, t) => sum + t.amount, 0);
  const recentPayoutAmount = completedPayouts.length > 0 ? completedPayouts[0].amount : 0;
  const payoutsCount = completedPayouts.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">Overview of your revenue and payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium opacity-80 mb-1">Total Earnings</p>
          <h3 className="text-3xl font-bold font-display">₹{totalRevenue.toFixed(2)}</h3>
          <p className="text-xs mt-2 opacity-90">Total amount transferred to you</p>
        </div>
        
        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-sm font-medium text-muted-foreground">Recent Payout</p>
          </div>
          <h3 className="text-3xl font-bold font-display text-foreground">₹{recentPayoutAmount.toFixed(2)}</h3>
          <p className="text-xs text-muted-foreground mt-2">Latest received amount</p>
        </div>
        
        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
          </div>
          <h3 className="text-3xl font-bold font-display text-foreground">{payoutsCount}</h3>
          <p className="text-xs text-muted-foreground mt-2">Number of successful transfers</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
        <h2 className="text-lg font-bold font-display mb-4 text-foreground">Transaction History</h2>
        
        {wallet.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
            <DollarSign className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No transactions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Your sales and withdrawal history will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-4 font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-foreground">{tx.description}</td>
                    <td className={`px-4 py-4 font-medium ${tx.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

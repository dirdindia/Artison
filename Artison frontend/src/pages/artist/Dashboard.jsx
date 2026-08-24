import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import api from '../../api';

export default function Dashboard() {
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/dashboard/artist');
        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { 
      name: "Total Revenue", 
      value: `₹${(dashboardData?.totalRevenue || 0).toFixed(2)}`, 
      icon: DollarSign, 
      trend: "+0%" 
    },
    { 
      name: "Active Artworks", 
      value: (dashboardData?.activeArtworks || 0).toString(), 
      icon: Package, 
      trend: "Current" 
    },
    { 
      name: "Pending Orders", 
      value: (dashboardData?.pendingOrders || 0).toString(), 
      icon: ShoppingCart, 
      trend: "Needs attention" 
    },
    { 
      name: "Profile Views", 
      value: (dashboardData?.profileViews || 0).toString(), 
      icon: TrendingUp, 
      trend: "This week" 
    },
  ];

  return (
    <div className="space-y-8 pb-10">
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
        <div className="lg:col-span-2 bg-background rounded-2xl border border-border shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold font-display mb-4 text-foreground">Recent Orders</h2>
          
          {dashboardData?.recentOrders?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-base font-semibold text-foreground">No orders yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">When customers buy your artwork, their orders will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.user?.name || order.guestName || 'Guest'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold font-display mb-4 text-foreground">Top Artworks</h2>
          
          {dashboardData?.topArtworks?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-canvas">
              <Package className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-base font-semibold text-foreground">No artworks found</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload your first artwork to get started.</p>
              <button className="mt-4 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer border border-border">
                Add Artwork
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.topArtworks.map((artwork) => (
                <div key={artwork._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors border border-transparent hover:border-border">
                  <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                    {artwork.image ? (
                      <img src={artwork.image} alt={artwork.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{artwork.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">₹{artwork.price}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-secondary text-muted-foreground rounded">
                        {artwork.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

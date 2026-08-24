import React, { useState, useEffect } from 'react';
import { Palette, TrendingUp, Users, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#eae0d5] p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-[#3b2f2f] mb-1">{label}</p>
        <p className="text-[#c39a5c] font-bold">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/admin');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#c39a5c]" />
      </div>
    );
  }

  const stats = [
    { name: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, change: 'Current', icon: DollarSign },
    { name: 'Active Artworks', value: (data?.activeArtworks || 0).toString(), change: 'Current', icon: Palette },
    { name: 'New Customers', value: (data?.newCustomers || 0).toString(), change: 'Total', icon: Users },
    { name: 'Total Orders', value: (data?.totalOrders || 0).toString(), change: 'Lifetime', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Dashboard</h1>
        <p className="text-[#5a4d4d] mt-1">Welcome back to your studio, Artisan.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-2xl border border-[#eae0d5] p-6 hover:border-[#c39a5c] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5a4d4d] truncate">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-[#3b2f2f]">{stat.value}</p>
              </div>
              <div className="p-3 bg-[#fdfbf7] rounded-xl text-[#c39a5c]">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#3b2f2f]">Revenue Overview</h2>
          <p className="text-sm text-[#5a4d4d]">Your earnings over the last 7 months</p>
        </div>
        <div className="h-[400px] w-full">
          {data?.revenueData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c39a5c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c39a5c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae0d5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5a4d4d', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5a4d4d', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#c39a5c" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, fill: "#c39a5c", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No revenue data for the past 7 months.
            </div>
          )}
        </div>
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">Recent Orders</h3>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {data?.recentOrders?.length > 0 ? (
              data.recentOrders.map(order => (
                <div key={order._id} className="p-5 flex items-center justify-between hover:bg-[#fdfbf7]/50 transition-colors">
                  <div>
                    <p className="font-semibold text-[#3b2f2f] text-sm">#{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                    <p className="text-xs text-[#5a4d4d] mt-0.5">{order.user?.name || order.guestName || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3b2f2f] text-sm">₹{order.totalPrice}</p>
                    <p className={`text-xs mt-0.5 font-medium ${
                      order.orderStatus === 'Delivered' ? 'text-emerald-600' : 
                      order.orderStatus === 'Shipped' ? 'text-blue-600' : 'text-amber-600'
                    }`}>{order.orderStatus}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-gray-400 text-center">No recent orders</div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">New Customers</h3>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {data?.recentCustomers?.length > 0 ? (
              data.recentCustomers.map((customer) => (
                <div key={customer._id} className="p-5 flex items-center gap-3 hover:bg-[#fdfbf7]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#c39a5c]/10 text-[#c39a5c] flex items-center justify-center font-bold text-sm shrink-0">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3b2f2f] text-sm truncate">{customer.name}</p>
                    <p className="text-xs text-[#5a4d4d] truncate mt-0.5">{customer.email}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-gray-400 text-center">No recent customers</div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">Recent Tickets</h3>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {data?.recentTickets?.length > 0 ? (
              data.recentTickets.map(ticket => (
                <div key={ticket._id} className="p-5 flex items-start gap-3 hover:bg-[#fdfbf7]/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#3b2f2f] text-sm">#{ticket._id.substring(ticket._id.length - 6).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="font-medium text-[#3b2f2f] text-sm truncate">{ticket.subject}</p>
                    <p className="text-xs text-[#5a4d4d] mt-1">{ticket.user?.name || 'Customer'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-gray-400 text-center">No recent tickets</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Palette, TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { name: 'Total Revenue', value: '₹4,52,318', change: '+20.1%', icon: DollarSign },
  { name: 'Active Artworks', value: '142', change: '+12', icon: Palette },
  { name: 'New Customers', value: '+34', change: '+19%', icon: Users },
  { name: 'Sales Growth', value: '+573', change: '+201', icon: TrendingUp },
];

const revenueData = [
  { name: 'Jan', revenue: 40000 },
  { name: 'Feb', revenue: 30000 },
  { name: 'Mar', revenue: 55000 },
  { name: 'Apr', revenue: 45000 },
  { name: 'May', revenue: 60000 },
  { name: 'Jun', revenue: 85000 },
  { name: 'Jul', revenue: 75000 },
];

const recentOrders = [
  { id: '#ORD-092', customer: 'Rahul Sharma', amount: '₹15,000', status: 'Processing' },
  { id: '#ORD-091', customer: 'Anita Desai', amount: '₹8,500', status: 'Shipped' },
  { id: '#ORD-090', customer: 'Karan Singh', amount: '₹42,000', status: 'Delivered' },
];

const recentCustomers = [
  { name: 'Priya Patel', email: 'priya.p@email.com', date: '2 hrs ago' },
  { name: 'Vikram Mehta', email: 'vikram.m@email.com', date: '5 hrs ago' },
  { name: 'Neha Gupta', email: 'neha.g@email.com', date: '1 day ago' },
];

const recentTickets = [
  { id: '#TK-105', subject: 'Shipping Delay', customer: 'Rahul Sharma', priority: 'High' },
  { id: '#TK-104', subject: 'Custom Frame Request', customer: 'Sneha Rao', priority: 'Medium' },
  { id: '#TK-103', subject: 'Payment Failed', customer: 'Ajay Verma', priority: 'Low' },
];

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
              <span>{stat.change} from last month</span>
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
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
        </div>
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">Recent Orders</h3>
            <button className="text-sm text-[#c39a5c] font-medium hover:text-[#b0894f] flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {recentOrders.map(order => (
              <div key={order.id} className="p-5 flex items-center justify-between hover:bg-[#fdfbf7]/50 transition-colors">
                <div>
                  <p className="font-semibold text-[#3b2f2f] text-sm">{order.id}</p>
                  <p className="text-xs text-[#5a4d4d] mt-0.5">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#3b2f2f] text-sm">{order.amount}</p>
                  <p className={`text-xs mt-0.5 font-medium ${
                    order.status === 'Delivered' ? 'text-emerald-600' : 
                    order.status === 'Shipped' ? 'text-blue-600' : 'text-amber-600'
                  }`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">New Customers</h3>
            <button className="text-sm text-[#c39a5c] font-medium hover:text-[#b0894f] flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {recentCustomers.map((customer, idx) => (
              <div key={idx} className="p-5 flex items-center gap-3 hover:bg-[#fdfbf7]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#c39a5c]/10 text-[#c39a5c] flex items-center justify-center font-bold text-sm shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#3b2f2f] text-sm truncate">{customer.name}</p>
                  <p className="text-xs text-[#5a4d4d] truncate mt-0.5">{customer.email}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {customer.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
            <h3 className="font-bold text-[#3b2f2f]">Recent Tickets</h3>
            <button className="text-sm text-[#c39a5c] font-medium hover:text-[#b0894f] flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[#eae0d5] flex-1">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="p-5 flex items-start gap-3 hover:bg-[#fdfbf7]/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#3b2f2f] text-sm">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="font-medium text-[#3b2f2f] text-sm truncate">{ticket.subject}</p>
                  <p className="text-xs text-[#5a4d4d] mt-1">{ticket.customer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

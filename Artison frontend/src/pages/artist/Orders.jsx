import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Loader2, IndianRupee } from 'lucide-react';
import api from '@/api';
import { toast } from 'sonner';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/artist/myorders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-canvas">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">No orders found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">When customers purchase your artwork, their orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Your Earnings</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">
                      #{order._id.toString().substring(18)}
                    </td>
                    <td className="px-4 py-4">
                      {order.user ? order.user.name : 'Guest'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                            <span>{item.name} (x{item.qty})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-primary">
                      ₹{order.artistEarnings?.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
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

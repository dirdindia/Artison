import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Loader2, Eye, X } from 'lucide-react';
import api from '@/api';
import { toast } from 'sonner';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusBadge = (status) => {
  const styles = {
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-blue-100 text-blue-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this order's status to "${newStatus}"? The customer will see this update.`)) {
      return;
    }

    try {
      const { data } = await api.put(`/orders/${id}/artist-status`, { status: newStatus });
      if (data.success) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ 
            ...selectedOrder, 
            orderStatus: newStatus,
            isDelivered: newStatus === 'Delivered' ? true : selectedOrder.isDelivered,
            deliveredAt: newStatus === 'Delivered' ? data.data.deliveredAt : selectedOrder.deliveredAt 
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
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
                  <tr 
                    key={order._id} 
                    className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                <p className="text-sm text-muted-foreground">#{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {selectedOrder.user?.name || 'Guest'}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>{selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.postalCode}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">Payment Information</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedOrder.isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <p><span className="text-muted-foreground">Method:</span> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.razorpayOrderId && <p className="truncate"><span className="text-muted-foreground">Razorpay Order:</span> {selectedOrder.razorpayOrderId}</p>}
                  {selectedOrder.paymentId && <p className="truncate"><span className="text-muted-foreground">Payment ID:</span> {selectedOrder.paymentId}</p>}
                  {selectedOrder.isPaid && selectedOrder.paidAt && <p><span className="text-muted-foreground">Paid At:</span> {new Date(selectedOrder.paidAt).toLocaleString()}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 border-b border-border pb-2">Products from You</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty} × {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-bold text-foreground">
                        {formatPrice(item.qty * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Payout Status */}
              {selectedOrder.myPayout && (
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Your Payout Status</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Upfront (50% + Shipping)</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">
                          {formatPrice(
                            (selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 0.5) +
                            selectedOrder.orderItems.reduce((acc, item) => acc + ((item.product?.shippingCharge || 0) * item.qty), 0)
                          )}
                        </span>
                        {selectedOrder.myPayout.isUpfrontPaid ? (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                            Paid
                            {selectedOrder.myPayout.upfrontSlipUrl && <a href={selectedOrder.myPayout.upfrontSlipUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">Slip</a>}
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full font-semibold">Pending</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Final (30%)</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">
                          {formatPrice(selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 0.3)}
                        </span>
                        {selectedOrder.myPayout.isFinalPaid ? (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                            Paid
                            {selectedOrder.myPayout.finalSlipUrl && <a href={selectedOrder.myPayout.finalSlipUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">Slip</a>}
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full font-semibold">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
            
            <div className="p-6 border-t border-border bg-secondary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-3">
                 <div className="flex flex-col">
                   <label className="text-xs text-muted-foreground mb-1">Update Status</label>
                   <select 
                     value={selectedOrder.orderStatus || 'Processing'}
                     onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                     className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-r-[8px] border-transparent outline-none cursor-pointer ${getStatusBadge(selectedOrder.orderStatus || 'Processing')}`}
                   >
                     <option value="Processing">Processing</option>
                     <option value="Shipped">Shipped</option>
                     <option value="Out for Delivery">Out for Delivery</option>
                     <option value="Delivered">Delivered</option>
                     <option value="Cancelled">Cancelled</option>
                     <option value="Refunded">Refunded</option>
                   </select>
                 </div>
                 {selectedOrder.orderStatus === 'Delivered' && selectedOrder.deliveredAt && (
                   <span className="text-sm text-muted-foreground mt-5">on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}</span>
                 )}
               </div>
               <div className="text-right flex flex-col items-end">
                 <div className="w-full max-w-xs space-y-1 text-sm text-muted-foreground mb-3 border-b border-border pb-2 text-right">
                   <div className="flex justify-between">
                     <span>Subtotal:</span>
                     <span>{formatPrice(selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0))}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>GST (18%):</span>
                     <span>{formatPrice(selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 0.18)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Shipping:</span>
                     <span>{formatPrice(selectedOrder.orderItems.reduce((acc, item) => acc + ((item.product?.shippingCharge || 0) * item.qty), 0))}</span>
                   </div>
                   <div className="flex justify-between font-bold text-foreground mt-2 pt-1 border-t border-border">
                     <span>Total (Customer Paid):</span>
                     <span>{formatPrice(
                       selectedOrder.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 1.18 + 
                       selectedOrder.orderItems.reduce((acc, item) => acc + ((item.product?.shippingCharge || 0) * item.qty), 0)
                     )}</span>
                   </div>
                 </div>
                 <p className="text-sm text-muted-foreground">Your Earnings (80% of Subtotal)</p>
                 <p className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.artistEarnings)}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

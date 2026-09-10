import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, CheckCircle, Clock, Search, X, FileText, Download, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';
import { generateInvoice, downloadInvoice } from '../utils/invoice';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { confirm } = useConfirm();
  const [payoutModal, setPayoutModal] = useState({ isOpen: false, orderId: null, artistId: null, type: null, file: null, uploading: false });

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders?page=${page}&limit=10`);
      if (data.success) {
        setOrders(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const isConfirmed = await confirm({
      title: 'Update Order Status',
      message: `Are you sure you want to change this order's status to "${newStatus}"? The customer will see this update.`,
      confirmText: 'Yes, Update Status',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (isConfirmed) {
      try {
        const { data } = await api.put(`/orders/${id}/status`, { status: newStatus });
        if (data.success) {
          Alert.success('Success', `Order marked as ${newStatus}`);
          fetchOrders();
          setSelectedOrder(data.data);
        }
      } catch (error) {
        Alert.error('Error', error.response?.data?.message || 'Failed to update order');
      }
    }
  };

  const handlePayoutModalOpen = (id, artistId, type) => {
    setPayoutModal({ isOpen: true, orderId: id, artistId, type, file: null, uploading: false });
  };

  const handlePayoutModalClose = () => {
    setPayoutModal({ isOpen: false, orderId: null, artistId: null, type: null, file: null, uploading: false });
  };

  const handlePayoutModalSubmit = async () => {
    const { orderId, artistId, type, file } = payoutModal;
    setPayoutModal(prev => ({ ...prev, uploading: true }));
    try {
      let slipUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        slipUrl = uploadRes.data.data.url;
      }
      const { data } = await api.put(`/orders/${orderId}/payout/${artistId}`, { type, slipUrl });
      if (data.success) {
        Alert.success('Success', `Payout marked as released`);
        fetchOrders();
        setSelectedOrder(data.data);
        handlePayoutModalClose();
      }
    } catch (error) {
      Alert.error('Error', error.response?.data?.message || 'Failed to release payout');
      setPayoutModal(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    if (!order.isViewedByAdmin) {
      try {
        await api.put(`/orders/${order._id}/mark-viewed`);
        setOrders(orders.map(o => o._id === order._id ? { ...o, isViewedByAdmin: true } : o));
      } catch (error) {
        console.error('Failed to mark order as viewed', error);
      }
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Orders</h1>
          <p className="text-[#5a4d4d] mt-1">Manage and update customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b2f2f]/20 focus:border-[#3b2f2f]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fdfbf7] text-[#5a4d4d] font-medium border-b border-[#eae0d5]">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center"><Clock className="w-6 h-6 animate-spin" /></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${!order.isViewedByAdmin ? 'bg-[#fefce8]' : ''}`}
                    onClick={() => handleViewOrder(order)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#3b2f2f] flex items-center gap-2">
                        #{order._id.substring(18)}
                        {!order.isViewedByAdmin && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full tracking-wider animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#3b2f2f]">{order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#3b2f2f]">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-bold ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-bold ${getStatusBadge(order.orderStatus || 'Processing')}`}>
                        {order.orderStatus || 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-[#3b2f2f] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#eae0d5] bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[#5a4d4d] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#eae0d5]">
              <div>
                <h2 className="text-xl font-bold text-[#3b2f2f]">Order Details</h2>
                <p className="text-sm text-gray-500">#{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-[#3b2f2f] mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedOrder.user?.name}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedOrder.user?.email}</p>
                    <p><span className="text-gray-500">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-[#3b2f2f] mb-3">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>{selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.postalCode}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#3b2f2f]">Payment Information</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedOrder.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <p><span className="text-gray-500">Method:</span> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.razorpayOrderId && <p className="truncate"><span className="text-gray-500">Razorpay Order:</span> {selectedOrder.razorpayOrderId}</p>}
                  {selectedOrder.paymentId && <p className="truncate"><span className="text-gray-500">Payment ID:</span> {selectedOrder.paymentId}</p>}
                  {selectedOrder.isPaid && selectedOrder.paidAt && <p><span className="text-gray-500">Paid At:</span> {new Date(selectedOrder.paidAt).toLocaleString()}</p>}
                </div>
              </div>

              {/* Artist Payout Management */}
              {selectedOrder.artistPayouts && selectedOrder.artistPayouts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#3b2f2f] mb-3 border-b border-[#eae0d5] pb-2">Artist Payout Management</h3>
                  <div className="space-y-4">
                    {selectedOrder.artistPayouts.map((payout, idx) => {
                      // orderItems.artist could be populated or just ObjectId string. Safe check.
                      const artistIdStr = payout.artist?._id?.toString() || payout.artist?.toString();
                      const artistItems = selectedOrder.orderItems.filter(item => {
                        const itemArtistStr = item.artist?._id?.toString() || item.artist?.toString();
                        return itemArtistStr === artistIdStr;
                      });
                      
                      const artistSubtotal = artistItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
                      const artistShipping = artistItems.reduce((acc, item) => acc + ((item.product?.shippingCharge || 0) * item.qty), 0);
                      const upfrontAmount = (artistSubtotal * 0.5) + artistShipping;
                      const finalAmount = artistSubtotal * 0.3; // Total 80%, so 50% upfront, 30% final
                      
                      return (
                        <div key={idx} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-[#3b2f2f]">{payout.artist?.name || 'Artist'}</p>
                              <p className="text-sm text-gray-500">{payout.artist?.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 font-semibold mb-1">Bank Details</p>
                              {payout.artist?.bankDetails && (payout.artist.bankDetails.accountNumber || payout.artist.bankDetails.upiId) ? (
                                <div className="text-xs text-[#3b2f2f] text-left inline-block bg-white p-2 rounded border border-orange-100">
                                  {payout.artist.bankDetails.accountHolderName && <p><span className="text-gray-400">Name:</span> {payout.artist.bankDetails.accountHolderName}</p>}
                                  {payout.artist.bankDetails.accountNumber && <p><span className="text-gray-400">A/C:</span> {payout.artist.bankDetails.accountNumber}</p>}
                                  {payout.artist.bankDetails.ifscCode && <p><span className="text-gray-400">IFSC:</span> {payout.artist.bankDetails.ifscCode}</p>}
                                  {payout.artist.bankDetails.upiId && <p><span className="text-gray-400">UPI:</span> {payout.artist.bankDetails.upiId}</p>}
                                </div>
                              ) : (
                                <p className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Not provided</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Upfront (50% + Shipping)</p>
                              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-2">
                                <span className="font-bold text-[#3b2f2f]">{formatPrice(upfrontAmount)}</span>
                                {payout.isUpfrontPaid ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                    Paid on {new Date(payout.upfrontPaidAt).toLocaleDateString()}
                                    {payout.upfrontSlipUrl && <a href={payout.upfrontSlipUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">Slip</a>}
                                  </span>
                                ) : (
                                  <button onClick={() => handlePayoutModalOpen(selectedOrder._id, artistIdStr, 'upfront')} className="text-xs bg-[#c39a5c] hover:bg-[#b08b53] text-white px-4 py-2 rounded-lg transition-all font-bold whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Upfront Paid
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Final (30%)</p>
                              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-2">
                                <span className="font-bold text-[#3b2f2f]">{formatPrice(finalAmount)}</span>
                                {payout.isFinalPaid ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                    Paid on {new Date(payout.finalPaidAt).toLocaleDateString()}
                                    {payout.finalSlipUrl && <a href={payout.finalSlipUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">Slip</a>}
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handlePayoutModalOpen(selectedOrder._id, artistIdStr, 'final')} 
                                    disabled={selectedOrder.orderStatus !== 'Delivered'}
                                    className={`text-xs px-4 py-2 rounded-lg transition-all font-bold whitespace-nowrap flex items-center gap-2 ${selectedOrder.orderStatus === 'Delivered' ? 'bg-[#c39a5c] hover:bg-[#b08b53] text-white shadow-md hover:shadow-lg cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                                  >
                                    {selectedOrder.orderStatus === 'Delivered' ? 'Mark Final Paid' : 'Awaiting Delivery'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-[#3b2f2f] mb-3 border-b pb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#3b2f2f] truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.qty} × {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-bold text-[#3b2f2f]">
                        {formatPrice(item.qty * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-[#eae0d5] bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-3">
                 <div className="flex flex-col">
                   <label className="text-xs text-gray-500 mb-1">Update Status</label>
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
                   <span className="text-sm text-gray-500 mt-5">on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}</span>
                 )}
               </div>
               <div className="text-right flex flex-col items-end">
                 <div className="w-full max-w-xs space-y-1 text-sm text-[#5a4d4d] mb-3 border-b border-[#eae0d5] pb-2">
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
                   {selectedOrder.discountAmount > 0 && (
                     <div className="flex justify-between text-green-600">
                       <span>Discount:</span>
                       <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                     </div>
                   )}
                 </div>
                 <p className="text-sm text-gray-500">Total Amount</p>
                 <p className="text-2xl font-bold text-[#3b2f2f]">{formatPrice(selectedOrder.totalPrice)}</p>
                 <div className="flex gap-2 mt-3">
                   <button 
                     onClick={() => generateInvoice(selectedOrder)}
                     className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#eae0d5] hover:bg-gray-100 rounded-xl text-sm font-medium text-[#3b2f2f] transition-colors shadow-sm cursor-pointer"
                   >
                     <FileText className="w-4 h-4" />
                     Print
                   </button>
                   <button 
                     onClick={() => downloadInvoice(selectedOrder)}
                     className="flex items-center gap-1.5 px-4 py-2 bg-[#3b2f2f] hover:bg-[#5a4d4d] text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                   >
                     <Download className="w-4 h-4" />
                     Download PDF
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Upload Modal */}
      {payoutModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#3b2f2f]">Confirm Payout</h3>
              <button onClick={handlePayoutModalClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to mark this <strong>{payoutModal.type}</strong> payout as paid? Ensure you have transferred the amount externally.
              </p>
              <div>
                <label className="block text-sm font-medium text-[#3b2f2f] mb-2">Payment Slip (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPayoutModal(prev => ({ ...prev, file: e.target.files[0] }))}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#fdfbf7] file:text-[#c39a5c]
                    hover:file:bg-orange-50 cursor-pointer"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handlePayoutModalClose}
                disabled={payoutModal.uploading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handlePayoutModalSubmit}
                disabled={payoutModal.uploading}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#c39a5c] hover:bg-[#b08b53] text-white transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {payoutModal.uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {payoutModal.uploading ? 'Uploading...' : 'Confirm & Mark Paid'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};



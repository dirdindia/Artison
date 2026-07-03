import React, { useState, useEffect } from 'react';
import { Users, Eye, Search, X, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users?page=${page}&limit=10`);
      if (data.success) {
        setCustomers(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (userId, p = 1) => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get(`/orders/user/${userId}?page=${p}&limit=5`);
      if (data.success) {
        setOrders(data.data);
        if (data.pagination) {
          setOrdersTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to fetch order history');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOrdersPage(1);
    fetchCustomerOrders(customer._id, 1);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setOrders([]);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-1">Manage and view customer details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#eae0d5] flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b2f2f] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8f5f2] text-[#5a4d4d] font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center mb-2"><Users className="w-8 h-8 text-gray-300 animate-pulse" /></div>
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3b2f2f] text-white flex items-center justify-center font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#3b2f2f]">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{customer.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{customer.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{new Date(customer.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCustomer(customer);
                        }}
                        className="p-2 text-gray-400 hover:text-[#3b2f2f] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm text-[#5a4d4d] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-[#eae0d5] p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-[#3b2f2f]">Customer Details</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Overview */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-[#eae0d5]">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-full bg-[#3b2f2f] text-white flex items-center justify-center font-bold text-4xl shadow-md shrink-0">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#3b2f2f]">{selectedCustomer.name}</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-4 h-4 text-[#3b2f2f]" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-4 h-4 text-[#3b2f2f]" />
                          <span>{selectedCustomer.phone || 'No phone provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-4 h-4 text-[#3b2f2f]" />
                          <span>Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Saved Address</h4>
                      {selectedCustomer.address?.street ? (
                        <div className="flex items-start gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 text-[#3b2f2f] mt-1 shrink-0" />
                          <div>
                            <p>{selectedCustomer.address.street}</p>
                            <p>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postalCode}</p>
                            <p>{selectedCustomer.address.country}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">No address saved yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h3 className="text-xl font-bold text-[#3b2f2f] mb-4">Purchase History</h3>
                
                <div className="border border-[#eae0d5] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[#f8f5f2] text-[#5a4d4d] font-semibold border-b border-[#eae0d5]">
                        <tr>
                          <th className="px-6 py-3">Order ID</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Products</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eae0d5]">
                        {loadingOrders ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                          </tr>
                        ) : orders.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No purchase history found for this customer.</td>
                          </tr>
                        ) : (
                          orders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-[#3b2f2f]">#{order._id.substring(18)}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b2f2f]"></span>
                                      {item.name} <span className="text-gray-400">(x{item.qty})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                  order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-[#3b2f2f]">
                                {formatPrice(order.totalPrice)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {ordersTotalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-[#eae0d5] bg-gray-50">
                      <button
                        onClick={() => {
                          const newPage = Math.max(1, ordersPage - 1);
                          setOrdersPage(newPage);
                          fetchCustomerOrders(selectedCustomer._id, newPage);
                        }}
                        disabled={ordersPage === 1}
                        className="px-3 py-1.5 bg-white border border-[#eae0d5] rounded-lg text-xs font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="text-xs text-[#5a4d4d] font-medium">
                        Page {ordersPage} of {ordersTotalPages}
                      </span>
                      <button
                        onClick={() => {
                          const newPage = Math.min(ordersTotalPages, ordersPage + 1);
                          setOrdersPage(newPage);
                          fetchCustomerOrders(selectedCustomer._id, newPage);
                        }}
                        disabled={ordersPage === ordersTotalPages}
                        className="px-3 py-1.5 bg-white border border-[#eae0d5] rounded-lg text-xs font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

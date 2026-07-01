import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';
import CouponModal from '../components/CouponModal';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { confirm } = useConfirm();

  const fetchCoupons = async (currentPage = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/coupons?page=${currentPage}&limit=10&search=${search}`);
      if (response.data.success) {
        setCoupons(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
        setPage(response.data.pagination.page);
      }
    } catch (error) {
      Alert.error('Error', 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCoupons(page, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Coupon',
      message: 'Are you sure you want to delete this coupon? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/coupons/${id}`);
        Alert.success('Deleted', 'Coupon deleted successfully');
        if (coupons.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchCoupons(page, searchTerm);
        }
      } catch (error) {
        Alert.error('Error', 'Failed to delete coupon');
      }
    }
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Coupons</h1>
          <p className="text-[#5a4d4d] mt-1">Manage your discount codes ({totalItems} total)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by code..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-[#eae0d5] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdfbf7] border-b border-[#eae0d5] text-sm text-[#5a4d4d] uppercase font-semibold">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Applies To</th>
                <th className="px-6 py-4">Min. Spend</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No coupons found.</td></tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-[#fdfbf7]/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#c39a5c]" />
                        <span className="font-bold text-[#3b2f2f]">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a4d4d]">
                      <span className="font-semibold text-[#3b2f2f]">
                        {coupon.discountType === 'percentage' && `${coupon.discountValue}%`}
                        {coupon.discountType === 'fixed' && `₹${coupon.discountValue}`}
                        {coupon.discountType === 'freeship' && `Free Shipping`}
                      </span>
                      <span className="text-xs ml-1 text-gray-500 capitalize">({coupon.discountType})</span>
                    </td>
                    <td className="px-6 py-4 text-[#5a4d4d] capitalize">{coupon.applicability}</td>
                    <td className="px-6 py-4 text-[#5a4d4d]">{coupon.minSpend ? `₹${coupon.minSpend}` : 'None'}</td>
                    <td className="px-6 py-4 text-[#5a4d4d]">{formatDate(coupon.expiryDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(coupon); }}
                        className="p-2 text-[#5a4d4d] hover:text-[#c39a5c] transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-[#eae0d5] cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(coupon._id); }}
                        className="p-2 text-[#5a4d4d] hover:text-red-500 transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-[#eae0d5] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#eae0d5] flex items-center justify-between bg-white">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coupon={editingCoupon}
        onSuccess={() => fetchCoupons(page, searchTerm)}
      />
    </div>
  );
};

export default Coupons;

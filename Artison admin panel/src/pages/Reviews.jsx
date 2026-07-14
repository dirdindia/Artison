import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, Loader2, Filter } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useConfirm } from '../context/ConfirmContext';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/products/admin/reviews');
      setReviews(data.data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (productId, reviewId) => {
    setProcessingId(reviewId + '_verify');
    try {
      await api.put(`/products/${productId}/reviews/${reviewId}/verify`);
      toast.success('Review verified successfully');
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, isVerified: true } : r));
    } catch (error) {
      toast.error('Failed to verify review');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (productId, reviewId) => {
    const isConfirmed = await confirm({
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review?',
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!isConfirmed) return;
    
    setProcessingId(reviewId + '_delete');
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      toast.error('Failed to delete review');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reviews...</div>;
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === 'verified') return review.isVerified;
    if (filter === 'pending') return !review.isVerified;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Product Reviews</h1>
          <p className="text-[#5a4d4d] mt-1">Manage and verify customer feedback.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#eae0d5] rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-sm text-[#5a4d4d] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fdfbf7] border-b border-[#eae0d5]">
              <tr>
                <th className="px-6 py-4 font-bold text-[#3b2f2f]">Product</th>
                <th className="px-6 py-4 font-bold text-[#3b2f2f]">Customer</th>
                <th className="px-6 py-4 font-bold text-[#3b2f2f]">Rating</th>
                <th className="px-6 py-4 font-bold text-[#3b2f2f]">Comment</th>
                <th className="px-6 py-4 font-bold text-[#3b2f2f]">Status</th>
                <th className="px-6 py-4 font-bold text-[#3b2f2f] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map(review => (
                  <tr key={review._id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#3b2f2f] truncate max-w-[200px]">
                        {review.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#5a4d4d]">{review.userName}</div>
                      <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-amber-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#5a4d4d] truncate max-w-[300px]" title={review.comment}>
                        {review.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        review.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {review.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end space-x-2">
                      {!review.isVerified && (
                        <button
                          onClick={() => handleVerify(review.productId, review._id)}
                          disabled={processingId === review._id + '_verify'}
                          className="p-1.5 rounded-md transition-colors text-gray-500 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                          title="Verify Review"
                        >
                          {processingId === review._id + '_verify' ? (
                            <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 hover:text-green-600" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.productId, review._id)}
                        disabled={processingId === review._id + '_delete'}
                        className="p-1.5 rounded-md transition-colors text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50"
                        title="Delete Review"
                      >
                        {processingId === review._id + '_delete' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

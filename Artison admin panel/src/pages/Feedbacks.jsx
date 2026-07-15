import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { confirm } = useConfirm();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feedbacks');
      if (response.data.success) {
        setFeedbacks(response.data.data);
      }
    } catch (error) {
      Alert.error('Error', 'Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleApproval = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const response = await api.put(`/feedbacks/${id}/approve`);
      if (response.data.success) {
        Alert.success('Success', `Feedback ${!currentStatus ? 'approved' : 'unapproved'} successfully`);
        fetchFeedbacks();
      }
    } catch (error) {
      Alert.error('Error', 'Failed to update feedback status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Feedback',
      message: 'Are you sure you want to delete this feedback?',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      setUpdatingId(id);
      try {
        await api.delete(`/feedbacks/${id}`);
        Alert.success('Deleted', 'Feedback deleted successfully');
        fetchFeedbacks();
      } catch (error) {
        Alert.error('Error', 'Failed to delete feedback');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Site Feedbacks</h1>
          <p className="text-[#5a4d4d] mt-1">Manage public feedbacks submitted from the home page.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#5a4d4d]">
            <thead className="bg-[#fdfbf7] text-[#3b2f2f] uppercase text-xs font-semibold border-b border-[#eae0d5]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
              ) : feedbacks.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8">No feedbacks found.</td></tr>
              ) : (
                feedbacks.map((item) => (
                  <tr key={item._id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3b2f2f]">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < item.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={item.comment}>{item.comment}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleApproval(item._id, item.isApproved)} 
                          disabled={updatingId === item._id}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${item.isApproved ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={item.isApproved ? 'Unapprove' : 'Approve'}
                        >
                          {updatingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : item.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          disabled={updatingId === item._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
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
};

export default Feedbacks;

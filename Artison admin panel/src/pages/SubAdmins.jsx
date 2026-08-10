import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, UserCog, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Alert from '../utils/Alert';
import api from '../utils/api';
import { useConfirm } from '../context/ConfirmContext';
import SubAdminModal from '../components/SubAdminModal';
import { useNavigate } from 'react-router-dom';

export default function SubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if super admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      Alert.error('Access Denied', 'You do not have permission to view this page.');
      return;
    }
    fetchSubAdmins(1);
  }, [navigate]);

  const fetchSubAdmins = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/subadmins?page=${page}&limit=10`);
      if (res.data.success) {
        setSubAdmins(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to load subadmins');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setSelectedSubAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSubAdmin(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Subadmin',
      message: 'Are you sure you want to delete this subadmin? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/subadmins/${id}`);
        Alert.success('Success', 'Subadmin deleted successfully');
        fetchSubAdmins(pagination.page);
      } catch (error) {
        Alert.error('Error', 'Failed to delete subadmin');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3b2f2f] flex items-center gap-2">
            <UserCog className="w-6 h-6 text-[#c39a5c]" />
            Subadmin Management
          </h1>
          <p className="text-sm text-[#5a4d4d] mt-1">Manage secondary administrative accounts</p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#3b2f2f] text-[#fcf9f2] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2a2121] transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Subadmin
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-[#eae0d5] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c39a5c]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fdfbf7] border-b border-[#eae0d5]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#5a4d4d] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#5a4d4d] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#5a4d4d] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#5a4d4d] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae0d5]">
                {subAdmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#eae0d5] flex items-center justify-center text-[#3b2f2f] font-bold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#3b2f2f]">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#5a4d4d]">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5a4d4d]">
                          <Phone className="w-3 h-3" />
                          {admin.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#c39a5c]/10 text-[#c39a5c] border border-[#c39a5c]/20">
                        <Shield className="w-3 h-3" />
                        Subadmin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(admin)}
                          className="p-2 text-[#5a4d4d] hover:text-[#c39a5c] hover:bg-[#fdfbf7] rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(admin._id)}
                          className="p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {subAdmins.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#5a4d4d]">
                        <UserCog className="w-12 h-12 text-[#eae0d5] mb-3" />
                        <p className="text-base font-medium">No subadmins found</p>
                        <p className="text-sm mt-1">Click "Add Subadmin" to create one.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]">
              <div className="text-sm text-[#5a4d4d]">
                Showing page <span className="font-medium text-[#3b2f2f]">{pagination.page}</span> of <span className="font-medium text-[#3b2f2f]">{pagination.pages}</span> ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchSubAdmins(pagination.page - 1)}
                  className="p-2 rounded-lg border border-[#eae0d5] text-[#5a4d4d] hover:bg-white hover:text-[#3b2f2f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchSubAdmins(pagination.page + 1)}
                  className="p-2 rounded-lg border border-[#eae0d5] text-[#5a4d4d] hover:bg-white hover:text-[#3b2f2f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <SubAdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subAdmin={selectedSubAdmin}
        onSuccess={() => fetchSubAdmins(pagination.page)}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';
import SubCategoryModal from '../components/SubCategoryModal';
import ImageViewer from '../components/ImageViewer';

const SubCategories = () => {
  const [SubCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  const { confirm } = useConfirm();

  const fetchSubCategories = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/subcategories?page=${currentPage}&limit=10`);
      if (response.data.success) {
        setSubCategories(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
        setPage(response.data.pagination.page);
      }
    } catch (error) {
      Alert.error('Error', 'Failed to fetch SubCategories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories(page);
  }, [page]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete SubCategory',
      message: 'Are you sure you want to delete this SubCategory? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/subcategories/${id}`);
        Alert.success('Deleted', 'SubCategory deleted successfully');
        // If it's the last item on the page and not page 1, go to previous page
        if (SubCategories.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchSubCategories(page);
        }
      } catch (error) {
        Alert.error('Error', 'Failed to delete SubCategory');
      }
    }
  };

  const openAddModal = () => {
    setEditingSubCategory(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (SubCategory) => {
    setEditingSubCategory(SubCategory);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openViewModal = (SubCategory) => {
    setEditingSubCategory(SubCategory);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Sub-Categories</h1>
          <p className="text-[#5a4d4d] text-sm mt-1">Manage sub-categories linked to categories ({totalItems} total)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#5a4d4d] text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#3b2f2f] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Sub-Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#5a4d4d]">
            <thead className="bg-[#fdfbf7] text-[#3b2f2f] uppercase text-xs font-semibold border-b border-[#eae0d5]">
              <tr>
                <th className="px-6 py-4">Sub-Category Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
              ) : SubCategories.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8">No sub-categories found.</td></tr>
              ) : (
                SubCategories.map((SubCategory) => (
                  <tr key={SubCategory._id} className="border-b border-[#eae0d5]/50 hover:bg-[#fdfbf7]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3b2f2f] flex items-center gap-3">
                      {SubCategory.image ? (
                        <button 
                          type="button" 
                          onClick={() => setViewingImage(SubCategory.image)} 
                          className="focus:outline-none focus:ring-2 focus:ring-[#c39a5c] rounded-lg transition-transform hover:scale-105"
                        >
                          <img 
                            src={SubCategory.image} 
                            alt={SubCategory.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-[#eae0d5] cursor-pointer" 
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      {SubCategory.name}
                    </td>
                    <td className="px-6 py-4">{SubCategory.category?.name || '-'}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{SubCategory.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SubCategory.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {SubCategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openViewModal(SubCategory)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(SubCategory)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(SubCategory._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      <SubCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        SubCategory={editingSubCategory}
        onSuccess={() => fetchSubCategories(page)}
        isViewMode={isViewMode}
      />
      <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
    </div>
  );
};

export default SubCategories;

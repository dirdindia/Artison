import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';
import ProductModal from '../components/ProductModal';
import ImageViewer from '../components/ImageViewer';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  const { confirm } = useConfirm();

  const fetchProducts = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/products?page=${currentPage}&limit=10`);
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
        setPage(response.data.pagination.page);
      }
    } catch (error) {
      Alert.error('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        Alert.success('Deleted', 'Product deleted successfully');
        if (products.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchProducts(page);
        }
      } catch (error) {
        Alert.error('Error', 'Failed to delete product');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setEditingProduct(product);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Products</h1>
          <p className="text-[#5a4d4d] mt-1">Manage your artworks, prices, and inventory ({totalItems} total).</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search artworks..." 
              className="w-full bg-white border border-[#eae0d5] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#5a4d4d]">
            <thead className="bg-[#fdfbf7] text-[#3b2f2f] uppercase text-xs font-semibold border-b border-[#eae0d5]">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">SubCategory</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-[#fdfbf7]/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[#3b2f2f] flex items-center gap-3">
                      {product.image ? (
                        <button 
                          type="button" 
                          onClick={() => setViewingImage(product.image)} 
                          className="focus:outline-none focus:ring-2 focus:ring-[#c39a5c] rounded-lg transition-transform hover:scale-105"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-[#eae0d5] cursor-pointer" 
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <span className="max-w-[150px] truncate">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4">{product.subCategory?.name || '-'}</td>
                    <td className="px-6 py-4 font-medium">₹{product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openViewModal(product)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
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
          <div className="px-6 py-4 border-t border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]">
            <span className="text-sm text-[#5a4d4d]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-[#eae0d5] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-[#fdfbf7]"
              >
                <ChevronLeft className="w-5 h-5 text-[#5a4d4d]" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-[#eae0d5] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-[#fdfbf7]"
              >
                <ChevronRight className="w-5 h-5 text-[#5a4d4d]" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSuccess={() => fetchProducts(page)}
        isViewMode={isViewMode}
      />
      <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
    </div>
  );
};

export default Products;

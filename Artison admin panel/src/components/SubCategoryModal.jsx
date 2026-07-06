import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Alert from '../utils/Alert';
import api from '../utils/api';
import ImageViewer from './ImageViewer';

export default function SubCategoryModal({ isOpen, onClose, SubCategory, onSuccess, isViewMode = false }) {
  const [formData, setFormData] = useState({ name: '', description: '', url: '', image: '', category: '', isActive: true });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories?limit=100');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (SubCategory) {
      setFormData({
        name: SubCategory.name || '',
        description: SubCategory.description || '',
        url: SubCategory.url || '',
        image: SubCategory.image || '',
        category: SubCategory.category?._id || SubCategory.category || '',
        isActive: SubCategory.isActive !== false,
      });
    } else {
      setFormData({ name: '', description: '', url: '', image: '', category: '', isActive: true });
    }
  }, [SubCategory, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // NOTE: Our upload endpoint is not protected by auth middleware in backend, but we still use API instance
      const response = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.data.url }));
        Alert.success('Image Uploaded', 'Image successfully uploaded to Cloudinary');
      }
    } catch (error) {
      Alert.error('Upload Failed', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (SubCategory) {
        await api.put(`/subcategories/${SubCategory._id}`, formData);
        Alert.success('Updated', 'Sub-Category updated successfully');
      } else {
        await api.post('/subcategories', formData);
        Alert.success('Created', 'Sub-Category created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.error('Error', error.response?.data?.message || 'Failed to save sub-category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3b2f2f]/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg animate-enter border border-[#eae0d5] flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-[#3b2f2f]">
            {isViewMode ? 'View Sub-Category' : SubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
          </h2>
          <button type="button" onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a4d4d] focus:border-[#5a4d4d] disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="e.g. Artisan Originals"
              disabled={isViewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category *</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a4d4d] focus:border-[#5a4d4d] disabled:bg-gray-50 disabled:text-gray-500"
              disabled={isViewMode}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a4d4d] focus:border-[#5a4d4d] disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Brief description about this sub-category..."
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input 
              type="url" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a4d4d] focus:border-[#5a4d4d] disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="https://example.com"
              disabled={isViewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div 
                  className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setViewingImage(formData.image)}
                >
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              {!isViewMode && (
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#5a4d4d] transition-colors">
                    <div className="flex items-center space-x-2 text-gray-500">
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input 
              type="checkbox" 
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-4 h-4 text-[#5a4d4d] border-gray-300 rounded focus:ring-[#5a4d4d] disabled:opacity-50"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active Sub-Category</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-[#eae0d5] text-[#5a4d4d] font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 px-4 py-2.5 bg-[#5a4d4d] text-white font-medium rounded-xl hover:bg-[#3b2f2f] transition-colors flex justify-center items-center cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Sub-Category'}
              </button>
            )}
            </div>
          </form>
        </div>

      </div>
      <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
    </div>
  );
}

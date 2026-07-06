import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, XCircle, Info, Image as ImageIcon, DollarSign, Truck, UploadCloud, Trash2 } from 'lucide-react';
import Alert from '../utils/Alert';
import api from '../utils/api';
import ImageViewer from './ImageViewer';

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'inventory', label: 'Pricing & Inventory', icon: DollarSign },
  { id: 'shipping', label: 'Shipping', icon: Truck },
];

export default function ProductModal({ isOpen, onClose, product, onSuccess, isViewMode = false }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    sku: '',
    category: '',
    subCategory: '',
    image: '',
    gallery: [],
    dimensions: '',
    creationYear: '',
    weight: '',
    shippingClass: 'standard',
    packaging: '',
    isActive: true,
  });
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategorys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
      fetchCategoriesAndSubCategorys();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        stock: product.stock || '',
        sku: product.sku || '',
        category: product.category?._id || product.category || '',
        subCategory: product.subCategory?._id || product.subCategory || '',
        image: product.image || '',
        gallery: product.gallery || [],
        dimensions: product.dimensions || '',
        creationYear: product.creationYear || '',
        weight: product.weight || '',
        shippingClass: product.shippingClass || 'standard',
        packaging: product.packaging || '',
        isActive: product.isActive !== false,
      });
    } else {
      setFormData({
        name: '', description: '', price: '', salePrice: '', stock: '', sku: '',
        category: '', subCategory: '', image: '', gallery: [], dimensions: '', creationYear: '',
        weight: '', shippingClass: 'standard', packaging: '', isActive: true
      });
    }
  }, [product, isOpen]);

  const fetchCategoriesAndSubCategorys = async () => {
    try {
      const [catRes, SubCategoryRes] = await Promise.all([
        api.get('/categories?limit=100'),
        api.get('/subcategories?limit=100')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (SubCategoryRes.data.success) setSubCategorys(SubCategoryRes.data.data);
    } catch (error) {
      Alert.error('Error', 'Failed to fetch categories or subCategories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSingle(true);
    const formDataFile = new FormData();
    formDataFile.append('file', file);

    try {
      const response = await api.post('/upload/single', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.data.url }));
        Alert.success('Image Uploaded', 'Main display image successfully uploaded');
      }
    } catch (error) {
      Alert.error('Upload Failed', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingSingle(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingGallery(true);
    const formDataFiles = new FormData();
    files.forEach(file => formDataFiles.append('files', file));

    try {
      const response = await api.post('/upload/multiple', formDataFiles, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        const urls = response.data.data.map(img => img.url);
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
        Alert.success('Images Uploaded', 'Gallery images successfully uploaded');
      }
    } catch (error) {
      Alert.error('Upload Failed', error.response?.data?.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const removeDisplayImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.subCategory) {
      return Alert.error('Validation Error', 'Name, Price, Category and subCategory are required');
    }
    
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: formData.stock ? Number(formData.stock) : 0,
        weight: formData.weight ? Number(formData.weight) : undefined,
      };

      if (product) {
        await api.put(`/products/${product._id}`, payload);
        Alert.success('Updated', 'Product updated successfully');
      } else {
        await api.post('/products', payload);
        Alert.success('Created', 'Product created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.error('Error', error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[95vh] animate-enter">
        <div className="p-6 border-b border-[#eae0d5] flex flex-col sm:flex-row sm:items-center justify-between bg-[#fdfbf7] gap-4 shrink-0">
          <h2 className="text-xl font-bold text-[#3b2f2f]">
            {isViewMode ? 'View Artwork' : product ? 'Edit Artwork' : 'Add New Artwork'}
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex bg-white rounded-lg p-1 border border-[#eae0d5] shadow-sm overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#3b2f2f] text-white' 
                    : 'text-[#5a4d4d] hover:bg-[#fdfbf7]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer sm:static sm:top-auto sm:right-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-white min-h-[400px]">
          <form className="space-y-6" id="productForm" onSubmit={handleSubmit}>
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-medium text-[#5a4d4d]">Artwork Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required id="name" placeholder="e.g., Midnight Harmony" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="block text-sm font-medium text-[#5a4d4d]">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required id="category" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500">
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subCategory" className="block text-sm font-medium text-[#5a4d4d]">subCategory *</label>
                    <select name="subCategory" value={formData.subCategory} onChange={handleChange} required id="subCategory" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500">
                      <option value="">Select a subCategory</option>
                      {subCategories.map(subCategory => (
                        <option key={subCategory._id} value={subCategory._id}>{subCategory.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dimensions" className="block text-sm font-medium text-[#5a4d4d]">Dimensions (W x H x D)</label>
                    <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} id="dimensions" placeholder="e.g., 24 x 36 x 1.5 inches" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="creationYear" className="block text-sm font-medium text-[#5a4d4d]">Creation Year</label>
                    <input type="text" name="creationYear" value={formData.creationYear} onChange={handleChange} id="creationYear" placeholder="e.g., 2024" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>

                  <div className="space-y-1.5 flex items-center pt-8">
                    <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} disabled={isViewMode} className="w-4 h-4 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] disabled:opacity-50" />
                    <label htmlFor="isActive" className="ml-2 text-sm text-[#5a4d4d]">Active Product</label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-medium text-[#5a4d4d]">Detailed Description & Inspiration</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} id="description" rows={5} placeholder="Describe the artwork, the inspiration behind it, and any special care instructions..." disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Display Image (Main Cover)</label>
                  {!formData.image ? (
                    <label className={`border-2 border-dashed border-[#eae0d5] bg-[#fdfbf7] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c39a5c] hover:bg-[#c39a5c]/5 transition-colors group h-56 w-full block ${uploadingSingle || isViewMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={handleSingleImageUpload} disabled={uploadingSingle || isViewMode} />
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-[#c39a5c] group-hover:scale-110 transition-transform mx-auto">
                        {uploadingSingle ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                      <p className="text-sm font-medium text-[#3b2f2f]">{uploadingSingle ? 'Uploading...' : 'Upload Main Display Image'}</p>
                      <p className="text-xs text-[#5a4d4d] mt-1">This will be the first image customers see.</p>
                    </label>
                  ) : (
                    <div className="relative h-56 w-full rounded-2xl border border-[#eae0d5] overflow-hidden group">
                      <div 
                        className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setViewingImage(formData.image)}
                      >
                        <img src={formData.image} alt="Display" className="w-full h-full object-contain bg-gray-50" />
                      </div>
                      {!isViewMode && (
                        <button type="button" onClick={removeDisplayImage} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 mt-6">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Gallery Images</label>
                  {(!isViewMode || formData.gallery.length === 0) && (
                    <label className={`border-2 border-dashed border-[#eae0d5] bg-[#fdfbf7] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c39a5c] hover:bg-[#c39a5c]/5 transition-colors group ${formData.gallery.length === 0 ? 'h-56' : 'py-8'} w-full block ${uploadingGallery || isViewMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingGallery || isViewMode} />
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-[#c39a5c] group-hover:scale-110 transition-transform mx-auto">
                        {uploadingGallery ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                      </div>
                      <p className="text-sm font-medium text-[#3b2f2f]">{uploadingGallery ? 'Uploading...' : 'Upload Gallery Images'}</p>
                      <p className="text-xs text-[#5a4d4d] mt-1">Select multiple files. Showcase details, framed view, or room mockups.</p>
                    </label>
                  )}
                  
                  {formData.gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {formData.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-xl border border-[#eae0d5] overflow-hidden group">
                          <div 
                            className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setViewingImage(imgUrl)}
                          >
                            <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          </div>
                          {!isViewMode && (
                            <button 
                              type="button" 
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing & Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="price" className="block text-sm font-medium text-[#5a4d4d]">Regular Price (₹) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required id="price" placeholder="0.00" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="salePrice" className="block text-sm font-medium text-[#5a4d4d]">Sale Price (₹) (Optional)</label>
                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} id="salePrice" placeholder="0.00" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="sku" className="block text-sm font-medium text-[#5a4d4d]">SKU (Stock Keeping Unit)</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} id="sku" placeholder="e.g., ART-001" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="stock" className="block text-sm font-medium text-[#5a4d4d]">Stock Quantity</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} id="stock" placeholder="1" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                    <p className="text-xs text-[#5a4d4d] mt-1">For original paintings, stock is usually 1.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="weight" className="block text-sm font-medium text-[#5a4d4d]">Weight (kg)</label>
                    <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} id="weight" placeholder="e.g., 2.5" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="shippingClass" className="block text-sm font-medium text-[#5a4d4d]">Shipping Class</label>
                    <select name="shippingClass" value={formData.shippingClass} onChange={handleChange} id="shippingClass" disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500">
                      <option value="standard">Standard Shipping</option>
                      <option value="fragile">Fragile / Special Handling</option>
                      <option value="large">Oversized Cargo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="packaging" className="block text-sm font-medium text-[#5a4d4d]">Packaging Details</label>
                    <textarea name="packaging" value={formData.packaging} onChange={handleChange} id="packaging" rows={3} placeholder="Describe how this artwork will be packaged (e.g., Shipped rolled in a tube, or in a wooden crate)..." disabled={isViewMode} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Hidden submit button to trigger form submission */}
            <button type="submit" id="submitForm" className="hidden">Submit</button>
          </form>
        </div>
        
        <div className="p-4 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-between items-center shrink-0">
          <div className="text-sm text-[#5a4d4d]">
            Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button 
                type="button"
                onClick={() => document.getElementById('submitForm').click()}
                disabled={loading || uploadingSingle || uploadingGallery}
                className="px-5 py-2.5 rounded-xl bg-[#3b2f2f] text-[#fcf9f2] text-sm font-semibold hover:bg-[#2d2626] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Product'}
              </button>
            )}
          </div>
        </div>
      </div>
      <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
    </div>
  );
}

import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon, Search, Edit2, Trash2, X, UploadCloud, Info, DollarSign, Truck, Package } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Golden Hour Serenity', category: 'Abstract Oil Paintings', price: '₹45,000', stock: 1, status: 'In Stock' },
  { id: 2, name: 'Whispering Woods', category: 'Watercolor Landscapes', price: '₹12,500', stock: 3, status: 'In Stock' },
  { id: 3, name: 'The Silent Observer', category: 'Charcoal Portraits', price: '₹18,000', stock: 0, status: 'Out of Stock' },
];

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'inventory', label: 'Pricing & Inventory', icon: DollarSign },
  { id: 'shipping', label: 'Shipping', icon: Truck },
];

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleOpenModal = () => {
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Products</h1>
          <p className="text-[#5a4d4d] mt-1">Manage your artworks, prices, and inventory.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* List View */}
      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eae0d5] text-sm text-[#5a4d4d]">
                <th className="px-6 py-4 font-medium">Artwork Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#fdfbf7]/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-[#3b2f2f]">{product.name}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{product.category}</td>
                  <td className="px-6 py-4 text-[#3b2f2f] font-semibold">{product.price}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-[#5a4d4d] hover:text-[#c39a5c] transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-[#eae0d5] cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[#5a4d4d] hover:text-red-500 transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-[#eae0d5] cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay for Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
            <div className="p-6 border-b border-[#eae0d5] flex flex-col sm:flex-row sm:items-center justify-between bg-[#fdfbf7] gap-4">
              <h2 className="text-xl font-bold text-[#3b2f2f]">Add New Artwork</h2>
              
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
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer sm:static sm:top-auto sm:right-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-white min-h-[400px]">
              <form className="space-y-6">
                
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-sm font-medium text-[#5a4d4d]">Artwork Name</label>
                        <input type="text" id="name" placeholder="e.g., Midnight Harmony" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="category" className="block text-sm font-medium text-[#5a4d4d]">Category</label>
                        <select id="category" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer">
                          <option value="">Select a category</option>
                          <option value="1">Abstract Oil Paintings</option>
                          <option value="2">Watercolor Landscapes</option>
                          <option value="3">Charcoal Portraits</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="brand" className="block text-sm font-medium text-[#5a4d4d]">Brand</label>
                        <select id="brand" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer">
                          <option value="">Select a brand</option>
                          <option value="1">Artisan Originals</option>
                          <option value="2">Studio Palette</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="dimensions" className="block text-sm font-medium text-[#5a4d4d]">Dimensions (W x H x D)</label>
                        <input type="text" id="dimensions" placeholder="e.g., 24 x 36 x 1.5 inches" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="creationYear" className="block text-sm font-medium text-[#5a4d4d]">Creation Year</label>
                        <input type="text" id="creationYear" placeholder="e.g., 2024" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="description" className="block text-sm font-medium text-[#5a4d4d]">Detailed Description & Inspiration</label>
                      <textarea id="description" rows={5} placeholder="Describe the artwork, the inspiration behind it, and any special care instructions..." className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none" />
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-[#5a4d4d]">Display Image (Main Cover)</label>
                      <label className="border-2 border-dashed border-[#eae0d5] bg-[#fdfbf7] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c39a5c] hover:bg-[#c39a5c]/5 transition-colors group h-56 w-full block">
                        <input type="file" className="hidden" accept="image/*" />
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-[#c39a5c] group-hover:scale-110 transition-transform mx-auto">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-[#3b2f2f]">Upload Main Display Image</p>
                        <p className="text-xs text-[#5a4d4d] mt-1">This will be the first image customers see.</p>
                      </label>
                    </div>

                    <div className="space-y-1.5 mt-6">
                      <label className="block text-sm font-medium text-[#5a4d4d]">Gallery Images</label>
                      <label className="border-2 border-dashed border-[#eae0d5] bg-[#fdfbf7] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c39a5c] hover:bg-[#c39a5c]/5 transition-colors group h-56 w-full block">
                        <input type="file" className="hidden" accept="image/*" multiple />
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-[#c39a5c] group-hover:scale-110 transition-transform mx-auto">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-[#3b2f2f]">Upload Gallery Images</p>
                        <p className="text-xs text-[#5a4d4d] mt-1">Select multiple files. Showcase details, framed view, or room mockups.</p>
                      </label>
                    </div>
                  </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="price" className="block text-sm font-medium text-[#5a4d4d]">Regular Price (₹)</label>
                        <input type="number" id="price" placeholder="0.00" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="salePrice" className="block text-sm font-medium text-[#5a4d4d]">Sale Price (₹) (Optional)</label>
                        <input type="number" id="salePrice" placeholder="0.00" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="sku" className="block text-sm font-medium text-[#5a4d4d]">SKU (Stock Keeping Unit)</label>
                        <input type="text" id="sku" placeholder="e.g., ART-001" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="stock" className="block text-sm font-medium text-[#5a4d4d]">Stock Quantity</label>
                        <input type="number" id="stock" placeholder="1" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
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
                        <input type="text" id="weight" placeholder="e.g., 2.5" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="shippingClass" className="block text-sm font-medium text-[#5a4d4d]">Shipping Class</label>
                        <select id="shippingClass" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer">
                          <option value="standard">Standard Shipping</option>
                          <option value="fragile">Fragile / Special Handling</option>
                          <option value="large">Oversized Cargo</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="packaging" className="block text-sm font-medium text-[#5a4d4d]">Packaging Details</label>
                        <textarea id="packaging" rows={3} placeholder="Describe how this artwork will be packaged (e.g., Shipped rolled in a tube, or in a wooden crate)..." className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none" />
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>
            
            <div className="p-4 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-between items-center shrink-0">
              <div className="text-sm text-[#5a4d4d]">
                Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-[#3b2f2f] text-[#fcf9f2] text-sm font-semibold hover:bg-[#2d2626] transition-colors shadow-sm cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

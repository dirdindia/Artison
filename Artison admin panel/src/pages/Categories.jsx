import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon, Search, Edit2, Trash2, X } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Abstract Oil Paintings', slug: 'abstract-oil-paintings', items: 24, status: 'Active' },
  { id: 2, name: 'Watercolor Landscapes', slug: 'watercolor-landscapes', items: 12, status: 'Active' },
  { id: 3, name: 'Charcoal Portraits', slug: 'charcoal-portraits', items: 8, status: 'Inactive' },
];

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Categories</h1>
          <p className="text-[#5a4d4d] mt-1">Organize your artworks into collections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* List View */}
      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full bg-white border border-[#eae0d5] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eae0d5] text-sm text-[#5a4d4d]">
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {mockCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fdfbf7]/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-[#3b2f2f]">{cat.name}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{cat.slug}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{cat.items}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cat.status}
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]">
              <h2 className="text-xl font-bold text-[#3b2f2f]">Add New Category</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-medium text-[#5a4d4d]">Category Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="e.g., Abstract Oil Paintings" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="slug" className="block text-sm font-medium text-[#5a4d4d]">Slug / URL</label>
                    <input 
                      type="text" 
                      id="slug" 
                      placeholder="e.g., abstract-oil-paintings" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-medium text-[#5a4d4d]">Description</label>
                  <textarea 
                    id="description" 
                    rows={3}
                    placeholder="Describe what kind of artworks belong in this category..."
                    className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Cover Image</label>
                  <label className="border-2 border-dashed border-[#eae0d5] bg-[#fdfbf7] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c39a5c] hover:bg-[#c39a5c]/5 transition-colors group block w-full">
                    <input type="file" className="hidden" accept="image/*" />
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 text-[#c39a5c] group-hover:scale-110 transition-transform mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[#3b2f2f]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[#5a4d4d] mt-1">SVG, PNG, JPG or GIF</p>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl bg-[#3b2f2f] text-[#fcf9f2] text-sm font-semibold hover:bg-[#2d2626] transition-colors shadow-sm cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

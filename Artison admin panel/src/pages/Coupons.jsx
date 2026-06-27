import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2, X, Tag, Check, ChevronDown } from 'lucide-react';

const mockCoupons = [
  { id: 1, code: 'WELCOME10', type: 'Percentage', value: '10%', applicability: 'All Orders', minSpend: '₹5,000', expiry: '2027-12-31', status: 'Active' },
  { id: 2, code: 'FESTIVE5000', type: 'Fixed Amount', value: '₹5,000', applicability: 'Specific Categories', minSpend: '₹25,000', expiry: '2026-11-15', status: 'Active' },
  { id: 3, code: 'PAINTING20', type: 'Percentage', value: '20%', applicability: 'Specific Products', minSpend: 'None', expiry: '2026-08-01', status: 'Expired' },
];

const mockProducts = [
  { id: 'p1', label: 'Golden Hour Serenity' },
  { id: 'p2', label: 'Whispering Woods' },
  { id: 'p3', label: 'The Silent Observer' },
  { id: 'p4', label: 'Midnight Ocean' },
];

const mockCategories = [
  { id: 'c1', label: 'Abstract Oil Paintings' },
  { id: 'c2', label: 'Watercolor Landscapes' },
  { id: 'c3', label: 'Charcoal Portraits' },
  { id: 'c4', label: 'Digital Art' },
];

// Custom Searchable Multi-Select Component
const MultiSelect = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleOption = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeOption = (e, id) => {
    e.stopPropagation();
    onChange(selected.filter(x => x !== id));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-[#c39a5c]/20 focus-within:border-[#c39a5c] transition-colors cursor-text min-h-[44px] flex flex-wrap items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        {selected.length > 0 ? (
          selected.map(id => {
            const option = options.find(o => o.id === id);
            return option ? (
              <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#eae0d5] text-[#3b2f2f] rounded-md text-xs font-medium">
                {option.label}
                <button type="button" onClick={(e) => removeOption(e, id)} className="text-[#5a4d4d] hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })
        ) : (
          <span className="text-gray-400 select-none">{placeholder}</span>
        )}
        
        <input 
          type="text"
          className="flex-1 min-w-[50px] bg-transparent outline-none text-sm placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={selected.length === 0 ? "" : "Search..."}
          onFocus={() => setIsOpen(true)}
        />
        
        <div className="ml-auto text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-[#eae0d5] rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#5a4d4d]">No results found.</div>
          ) : (
            <ul className="py-2">
              {filteredOptions.map(option => {
                const isSelected = selected.includes(option.id);
                return (
                  <li 
                    key={option.id}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-[#fdfbf7] transition-colors ${isSelected ? 'bg-[#fdfbf7] font-medium text-[#c39a5c]' : 'text-[#3b2f2f]'}`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                    {isSelected && <Check className="w-4 h-4 text-[#c39a5c]" />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default function Coupons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Coupon Form State
  const [applicability, setApplicability] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleOpenModal = () => {
    setApplicability('all');
    setSelectedProducts([]);
    setSelectedCategories([]);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Coupons</h1>
          <p className="text-[#5a4d4d] mt-1">Create and manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Coupon
        </button>
      </div>

      {/* List View */}
      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search coupons..." 
              className="w-full bg-white border border-[#eae0d5] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eae0d5] text-sm text-[#5a4d4d]">
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Applies To</th>
                <th className="px-6 py-4 font-medium">Min. Spend</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {mockCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#fdfbf7]/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#c39a5c]" />
                      <span className="font-bold text-[#3b2f2f]">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#5a4d4d]">
                    <span className="font-semibold text-[#3b2f2f]">{coupon.value}</span>
                    <span className="text-xs ml-1 text-gray-500">({coupon.type})</span>
                  </td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{coupon.applicability}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{coupon.minSpend}</td>
                  <td className="px-6 py-4 text-[#5a4d4d]">{coupon.expiry}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      coupon.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            <div className="p-6 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]">
              <h2 className="text-xl font-bold text-[#3b2f2f]">Create New Coupon</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6">
                
                {/* Coupon Rules */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#3b2f2f] uppercase tracking-wider">Applicability</h3>
                  
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#5a4d4d]">Where can this coupon be applied?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${applicability === 'all' ? 'border-[#c39a5c] bg-[#c39a5c]/5 text-[#3b2f2f]' : 'border-[#eae0d5] bg-white text-[#5a4d4d] hover:bg-[#fdfbf7]'}`}>
                        <input type="radio" name="applicability" className="hidden" checked={applicability === 'all'} onChange={() => setApplicability('all')} />
                        <span className="font-semibold text-sm mb-1">Total Price (All)</span>
                        <span className="text-xs opacity-75">Applies to the entire cart</span>
                      </label>
                      <label className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${applicability === 'products' ? 'border-[#c39a5c] bg-[#c39a5c]/5 text-[#3b2f2f]' : 'border-[#eae0d5] bg-white text-[#5a4d4d] hover:bg-[#fdfbf7]'}`}>
                        <input type="radio" name="applicability" className="hidden" checked={applicability === 'products'} onChange={() => setApplicability('products')} />
                        <span className="font-semibold text-sm mb-1">Specific Products</span>
                        <span className="text-xs opacity-75">Applies to selected items</span>
                      </label>
                      <label className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${applicability === 'categories' ? 'border-[#c39a5c] bg-[#c39a5c]/5 text-[#3b2f2f]' : 'border-[#eae0d5] bg-white text-[#5a4d4d] hover:bg-[#fdfbf7]'}`}>
                        <input type="radio" name="applicability" className="hidden" checked={applicability === 'categories'} onChange={() => setApplicability('categories')} />
                        <span className="font-semibold text-sm mb-1">Specific Categories</span>
                        <span className="text-xs opacity-75">Applies to selected categories</span>
                      </label>
                    </div>
                  </div>

                  {/* Multi-Select Dropdowns based on Applicability */}
                  {applicability === 'products' && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-medium text-[#5a4d4d]">Select Products</label>
                      <MultiSelect 
                        options={mockProducts}
                        selected={selectedProducts}
                        onChange={setSelectedProducts}
                        placeholder="Search and select products..."
                      />
                    </div>
                  )}

                  {applicability === 'categories' && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-medium text-[#5a4d4d]">Select Categories</label>
                      <MultiSelect 
                        options={mockCategories}
                        selected={selectedCategories}
                        onChange={setSelectedCategories}
                        placeholder="Search and select categories..."
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-[#eae0d5] my-6"></div>

                {/* Standard Coupon Fields */}
                <h3 className="text-sm font-bold text-[#3b2f2f] uppercase tracking-wider">Discount Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="code" className="block text-sm font-medium text-[#5a4d4d]">Coupon Code</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        id="code" 
                        placeholder="e.g., SUMMER20" 
                        className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="type" className="block text-sm font-medium text-[#5a4d4d]">Discount Type</label>
                    <select 
                      id="type" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="freeship">Free Shipping</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="value" className="block text-sm font-medium text-[#5a4d4d]">Discount Value</label>
                    <input 
                      type="number" 
                      id="value" 
                      placeholder="e.g., 20" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="minSpend" className="block text-sm font-medium text-[#5a4d4d]">Minimum Spend (₹)</label>
                    <input 
                      type="number" 
                      id="minSpend" 
                      placeholder="e.g., 5000" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="expiry" className="block text-sm font-medium text-[#5a4d4d]">Expiry Date</label>
                    <input 
                      type="date" 
                      id="expiry" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="usageLimit" className="block text-sm font-medium text-[#5a4d4d]">Usage Limit</label>
                    <select 
                      id="usageLimit" 
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="unlimited">Unlimited uses</option>
                      <option value="once_per_user">Once per customer</option>
                      <option value="total_limit">Limited total uses</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <input type="checkbox" id="active" defaultChecked className="w-4 h-4 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                  <label htmlFor="active" className="text-sm font-medium text-[#3b2f2f] cursor-pointer">Activate coupon immediately</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl bg-[#3b2f2f] text-[#fcf9f2] text-sm font-semibold hover:bg-[#2d2626] transition-colors shadow-sm cursor-pointer"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

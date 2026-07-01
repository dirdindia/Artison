import React, { useState, useEffect, useRef } from 'react';
import { X, Tag, Check, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';

// Custom Searchable Multi-Select Component with Async Search
const AsyncMultiSelect = ({ selected, onChange, placeholder, fetchUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch options from backend when search term changes
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`${fetchUrl}?search=${searchTerm}&limit=10`);
        if (response.data.success) {
          // Both products and categories return data with _id and name
          const mappedOptions = response.data.data.map(item => ({
            id: item._id,
            label: item.name
          }));
          setOptions(mappedOptions);
        }
      } catch (error) {
        console.error("Failed to fetch options", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchOptions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUrl]);

  const toggleOption = (option) => {
    const isSelected = selected.some(x => x.id === option.id);
    if (isSelected) {
      onChange(selected.filter(x => x.id !== option.id));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (e, id) => {
    e.stopPropagation();
    onChange(selected.filter(x => x.id !== id));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-[#c39a5c]/20 focus-within:border-[#c39a5c] transition-colors cursor-text min-h-[44px] flex flex-wrap items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        {selected.length > 0 ? (
          selected.map(option => (
            <span key={option.id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#eae0d5] text-[#3b2f2f] rounded-md text-xs font-medium">
              {option.label}
              <button type="button" onClick={(e) => removeOption(e, option.id)} className="text-[#5a4d4d] hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
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
          {loading ? (
            <div className="p-4 text-center text-sm text-[#5a4d4d]">Loading...</div>
          ) : options.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#5a4d4d]">No results found.</div>
          ) : (
            <ul className="py-2">
              {options.map(option => {
                const isSelected = selected.some(x => x.id === option.id);
                return (
                  <li 
                    key={option.id}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-[#fdfbf7] transition-colors ${isSelected ? 'bg-[#fdfbf7] font-medium text-[#c39a5c]' : 'text-[#3b2f2f]'}`}
                    onClick={() => toggleOption(option)}
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

const CouponModal = ({ isOpen, onClose, coupon, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Coupon Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minSpend: '',
    expiryDate: '',
    usageLimit: 'unlimited',
    isActive: true
  });
  
  const [applicability, setApplicability] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue || '',
        minSpend: coupon.minSpend || '',
        expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
        usageLimit: coupon.usageLimit || 'unlimited',
        isActive: coupon.isActive
      });
      setApplicability(coupon.applicability);
      
      if (coupon.applicability === 'products' && coupon.selectedProducts) {
        setSelectedProducts(coupon.selectedProducts.map(p => ({ id: p._id, label: p.name })));
      } else {
        setSelectedProducts([]);
      }
      
      if (coupon.applicability === 'categories' && coupon.selectedCategories) {
        setSelectedCategories(coupon.selectedCategories.map(c => ({ id: c._id, label: c.name })));
      } else {
        setSelectedCategories([]);
      }
    } else {
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minSpend: '',
        expiryDate: '',
        usageLimit: 'unlimited',
        isActive: true
      });
      setApplicability('all');
      setSelectedProducts([]);
      setSelectedCategories([]);
    }
  }, [coupon, isOpen]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        applicability,
        selectedProducts: applicability === 'products' ? selectedProducts.map(p => p.id) : [],
        selectedCategories: applicability === 'categories' ? selectedCategories.map(c => c.id) : []
      };

      if (coupon) {
        await api.put(`/coupons/${coupon._id}`, payload);
        Alert.success('Success', 'Coupon updated successfully');
      } else {
        await api.post('/coupons', payload);
        Alert.success('Success', 'Coupon created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.error('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        <div className="p-6 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]">
          <h2 className="text-xl font-bold text-[#3b2f2f]">
            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="coupon-form" onSubmit={handleSubmit} className="space-y-6">
            
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
                  <AsyncMultiSelect 
                    fetchUrl="/products"
                    selected={selectedProducts}
                    onChange={setSelectedProducts}
                    placeholder="Search and select products..."
                  />
                </div>
              )}

              {applicability === 'categories' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Select Categories</label>
                  <AsyncMultiSelect 
                    fetchUrl="/categories"
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
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="e.g., SUMMER20" 
                    className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="discountType" className="block text-sm font-medium text-[#5a4d4d]">Discount Type</label>
                <select 
                  id="discountType" 
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="freeship">Free Shipping</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="discountValue" className="block text-sm font-medium text-[#5a4d4d]">Discount Value</label>
                <input 
                  type="number" 
                  id="discountValue" 
                  value={formData.discountValue}
                  onChange={handleChange}
                  required={formData.discountType !== 'freeship'}
                  disabled={formData.discountType === 'freeship'}
                  placeholder="e.g., 20" 
                  className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="minSpend" className="block text-sm font-medium text-[#5a4d4d]">Minimum Spend (₹)</label>
                <input 
                  type="number" 
                  id="minSpend" 
                  value={formData.minSpend}
                  onChange={handleChange}
                  placeholder="e.g., 5000" 
                  className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-[#5a4d4d]">Expiry Date</label>
                <input 
                  type="date" 
                  id="expiryDate" 
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="usageLimit" className="block text-sm font-medium text-[#5a4d4d]">Usage Limit</label>
                <select 
                  id="usageLimit" 
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer"
                >
                  <option value="unlimited">Unlimited uses</option>
                  <option value="once_per_user">Once per customer</option>
                  <option value="total_limit">Limited total uses</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isActive" 
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" 
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#3b2f2f] cursor-pointer">Activate coupon immediately</label>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="coupon-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#3b2f2f] text-[#fcf9f2] text-sm font-semibold hover:bg-[#2d2626] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;

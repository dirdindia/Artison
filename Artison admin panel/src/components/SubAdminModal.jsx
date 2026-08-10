import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import Alert from '../utils/Alert';
import api from '../utils/api';

export default function SubAdminModal({ isOpen, onClose, subAdmin, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (subAdmin) {
      setFormData({
        name: subAdmin.name || '',
        email: subAdmin.email || '',
        phone: subAdmin.phone || '',
        password: '' // Keep empty for editing, unless they want to change it
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
    }
  }, [subAdmin, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subAdmin) {
        // Only send password if it's filled in
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/subadmins/${subAdmin._id}`, updateData);
        Alert.success('Success', 'Subadmin updated successfully');
      } else {
        if (!formData.password) {
          Alert.error('Error', 'Password is required for new subadmins');
          setLoading(false);
          return;
        }
        await api.post('/subadmins', formData);
        Alert.success('Success', 'Subadmin created successfully');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#fdfbf7] rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-[#eae0d5] flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-[#3b2f2f]">
            {subAdmin ? 'Edit Subadmin' : 'Add New Subadmin'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-[#5a4d4d] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="subadminForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#5a4d4d]">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-white border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#5a4d4d]">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-white border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#5a4d4d]">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
                className="w-full bg-white border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#5a4d4d]">
                Password {subAdmin ? '(Leave blank to keep unchanged)' : '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!subAdmin}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7] flex justify-end gap-3 shrink-0 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#5a4d4d] hover:bg-[#eae0d5]/50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="subadminForm"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#3b2f2f] text-[#fcf9f2] hover:bg-[#2a2121] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {subAdmin ? 'Update Subadmin' : 'Create Subadmin'}
          </button>
        </div>
      </div>
    </div>
  );
}

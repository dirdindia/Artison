import React, { useState, useEffect } from 'react';
import { Store, CreditCard, Shield, Bell, Save, Mail, MapPin, Phone } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'general', label: 'General', icon: Store, description: 'Store details and contact info' },
  { id: 'payment', label: 'Payments & Tax', icon: CreditCard, description: 'Currency and tax rates' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and account protection' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push alerts' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [formData, setFormData] = useState({
    storeName: 'kalakosh',
    supportEmail: 'support@kalakosh.com',
    contactPhone: '+91 98765 43210',
    businessAddress: '123 Creative Street, Arts District\nMumbai, Maharashtra 400001',
    defaultCurrency: 'INR',
    taxRate: 18,
    newOrdersAlert: true,
    lowStockAlert: true,
    newReviewAlert: false,
  });

  // Password State (Security)
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings');
      if (data) {
        setFormData({
          storeName: data.storeName || 'kalakosh',
          supportEmail: data.supportEmail || '',
          contactPhone: data.contactPhone || '',
          businessAddress: data.businessAddress || '',
          defaultCurrency: data.defaultCurrency || 'INR',
          taxRate: data.taxRate || 18,
          newOrdersAlert: data.newOrdersAlert ?? true,
          lowStockAlert: data.lowStockAlert ?? true,
          newReviewAlert: data.newReviewAlert ?? false,
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Basic validation for password change if attempted
      if (passwords.newPassword || passwords.currentPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setIsSaving(false);
          return toast.error('New passwords do not match');
        }
        if (!passwords.currentPassword) {
          setIsSaving(false);
          return toast.error('Current password is required to change password');
        }
        // Assuming there is an endpoint to update password or we just ignore for now
        await api.put('/auth/update-password', passwords);
        toast.success('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }

      const { data } = await api.put('/settings', formData);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    fetchSettings();
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast('Changes discarded', { icon: '↺' });
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5a4d4d]">Loading settings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Settings</h1>
        <p className="text-[#5a4d4d] mt-1">Manage your store preferences and account configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 shrink-0 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-colors cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-white border-[#c39a5c] shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-white hover:border-[#eae0d5]'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-[#c39a5c]/10 text-[#c39a5c]' : 'bg-[#eae0d5]/50 text-[#5a4d4d]'}`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-semibold ${activeTab === tab.id ? 'text-[#3b2f2f]' : 'text-[#5a4d4d]'}`}>{tab.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-[#eae0d5] shadow-sm min-h-[500px]">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#3b2f2f]">General Settings</h2>
                <p className="text-sm text-[#5a4d4d] mt-1">Update your store's basic information.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Store Name</label>
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Business Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea name="businessAddress" rows={3} value={formData.businessAddress} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Tax Tab */}
          {activeTab === 'payment' && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#3b2f2f]">Payments & Taxes</h2>
                <p className="text-sm text-[#5a4d4d] mt-1">Configure how you charge customers.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Default Currency</label>
                  <select name="defaultCurrency" value={formData.defaultCurrency} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Tax Rate (%)</label>
                  <input type="number" name="taxRate" value={formData.taxRate} onChange={handleInputChange} className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#3b2f2f]">Security</h2>
                <p className="text-sm text-[#5a4d4d] mt-1">Update your password and secure your account.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Current Password</label>
                  <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">New Password</label>
                  <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="Must be at least 8 characters" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Match new password" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#3b2f2f]">Notifications</h2>
                <p className="text-sm text-[#5a4d4d] mt-1">Choose what alerts you want to receive.</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="flex items-start justify-between gap-4 p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[#3b2f2f]">New Orders</h4>
                    <p className="text-sm text-[#5a4d4d] mt-0.5">Receive an email when a customer places an order.</p>
                  </div>
                  <input type="checkbox" name="newOrdersAlert" checked={formData.newOrdersAlert} onChange={handleInputChange} className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>

                <div className="flex items-start justify-between gap-4 p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[#3b2f2f]">Low Stock Alerts</h4>
                    <p className="text-sm text-[#5a4d4d] mt-0.5">Get notified when a product is running low or out of stock.</p>
                  </div>
                  <input type="checkbox" name="lowStockAlert" checked={formData.lowStockAlert} onChange={handleInputChange} className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>
                
                <div className="flex items-start justify-between gap-4 p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[#3b2f2f]">New Feedback/Reviews</h4>
                    <p className="text-sm text-[#5a4d4d] mt-0.5">Receive alerts for new customer reviews on products.</p>
                  </div>
                  <input type="checkbox" name="newReviewAlert" checked={formData.newReviewAlert} onChange={handleInputChange} className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7]/50 rounded-b-2xl flex justify-end gap-3">
            <button onClick={handleDiscard} className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              Discard Changes
            </button>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer ${isSaving ? 'bg-[#c39a5c]/70 cursor-not-allowed' : 'bg-[#c39a5c] hover:bg-[#b0894f]'}`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

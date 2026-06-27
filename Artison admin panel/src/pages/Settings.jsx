import React, { useState } from 'react';
import { Store, CreditCard, Shield, Bell, Save, Mail, MapPin, Phone } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Store, description: 'Store details and contact info' },
  { id: 'payment', label: 'Payments & Tax', icon: CreditCard, description: 'Currency and tax rates' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and account protection' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push alerts' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

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
                  <input type="text" defaultValue="Artisan Palette" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" defaultValue="support@artisan.com" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Business Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                    <textarea rows={3} defaultValue="123 Creative Street, Arts District\nMumbai, Maharashtra 400001" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none" />
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
                  <select className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors appearance-none cursor-pointer">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Tax Rate (%)</label>
                  <input type="number" defaultValue="18" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>

                <div className="border-t border-[#eae0d5] pt-6">
                  <h3 className="font-semibold text-[#3b2f2f] mb-4">Payment Gateways</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                      <div>
                        <h4 className="font-medium text-[#3b2f2f]">Razorpay</h4>
                        <p className="text-xs text-[#5a4d4d] mt-0.5">Accept cards, UPI, and net banking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md">Connected</span>
                        <button className="px-3 py-1.5 border border-[#eae0d5] rounded-lg text-sm text-[#5a4d4d] hover:bg-white transition-colors cursor-pointer">Edit</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                      <div>
                        <h4 className="font-medium text-[#3b2f2f]">Stripe</h4>
                        <p className="text-xs text-[#5a4d4d] mt-0.5">For international payments</p>
                      </div>
                      <button className="px-4 py-1.5 bg-[#3b2f2f] text-white rounded-lg text-sm font-medium hover:bg-[#2d2626] transition-colors cursor-pointer">Connect</button>
                    </div>
                  </div>
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
                  <input type="password" placeholder="••••••••" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">New Password</label>
                  <input type="password" placeholder="Must be at least 8 characters" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#5a4d4d]">Confirm New Password</label>
                  <input type="password" placeholder="Match new password" className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors" />
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
                  <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>

                <div className="flex items-start justify-between gap-4 p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[#3b2f2f]">Low Stock Alerts</h4>
                    <p className="text-sm text-[#5a4d4d] mt-0.5">Get notified when a product is running low or out of stock.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>
                
                <div className="flex items-start justify-between gap-4 p-4 bg-[#fdfbf7] border border-[#eae0d5] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[#3b2f2f]">New Feedback/Reviews</h4>
                    <p className="text-sm text-[#5a4d4d] mt-0.5">Receive alerts for new customer reviews on products.</p>
                  </div>
                  <input type="checkbox" className="mt-1 w-5 h-5 text-[#c39a5c] border-[#eae0d5] rounded focus:ring-[#c39a5c] cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="p-6 border-t border-[#eae0d5] bg-[#fdfbf7]/50 rounded-b-2xl flex justify-end gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-white border border-[#eae0d5] text-[#5a4d4d] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              Discard Changes
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c39a5c] text-white text-sm font-semibold hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

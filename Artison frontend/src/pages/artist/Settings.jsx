import React, { useState, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, Link as LinkIcon, Save, Landmark, CreditCard, ReceiptIndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';

export default function Settings() {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    portfolioUrl: user?.portfolioUrl || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    bankDetails: {
      bankName: user?.bankDetails?.bankName || '',
      accountHolderName: user?.bankDetails?.accountHolderName || '',
      accountNumber: user?.bankDetails?.accountNumber || '',
      ifscCode: user?.bankDetails?.ifscCode || '',
      upiId: user?.bankDetails?.upiId || '',
    }
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      const { data } = await api.post('/upload/single', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        setFormData(prev => ({ ...prev, avatar: data.data.url }));
        toast.success("Avatar uploaded! Don't forget to save changes.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bank_')) {
      const field = name.split('bank_')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChangeSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setPasswordLoading(true);
      const { data } = await api.put('/users/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', formData);
      if (data.success) {
        setUser(data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your artist profile and preferences</p>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Update your public details and contact info.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden border-4 border-background shadow-sm">
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                formData.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className={`px-4 py-2 bg-secondary text-foreground border border-border rounded-xl text-sm font-semibold transition-colors cursor-pointer ${uploadingAvatar ? 'opacity-50 pointer-events-none' : 'hover:bg-secondary/80'}`}>
              {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
                disabled={uploadingAvatar}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={user?.email || ''} disabled className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Portfolio URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="url" name="portfolioUrl" placeholder="https://..." value={formData.portfolioUrl} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Artist Bio</label>
            <textarea rows="4" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell customers about yourself and your art..." className="w-full p-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Account & Withdrawal Details</h2>
          <p className="text-sm text-muted-foreground mt-1">Provide your bank and UPI details to receive payments.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bank Name</label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="bank_bankName" value={formData.bankDetails.bankName} onChange={handleChange} placeholder="e.g. State Bank of India" className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Account Holder Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="bank_accountHolderName" value={formData.bankDetails.accountHolderName} onChange={handleChange} placeholder="John Doe" className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Account Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="bank_accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange} placeholder="1234567890" className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">IFSC Code</label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="bank_ifscCode" value={formData.bankDetails.ifscCode} onChange={handleChange} placeholder="ABCD0123456" className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all uppercase" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">UPI ID</label>
              <div className="relative">
                <ReceiptIndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="bank_upiId" value={formData.bankDetails.upiId} onChange={handleChange} placeholder="username@bank" className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-canvas flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Change Password</h2>
          <p className="text-sm text-muted-foreground mt-1">Update your account password to stay secure.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.hasSetPassword && (
              <div className="space-y-2 md:col-span-2 max-w-md">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <input 
                  type="password" 
                  name="oldPassword" 
                  value={passwordData.oldPassword} 
                  onChange={handlePasswordChangeInput} 
                  placeholder="Enter current password" 
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                value={passwordData.newPassword} 
                onChange={handlePasswordChangeInput} 
                placeholder="Enter new password" 
                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={passwordData.confirmPassword} 
                onChange={handlePasswordChangeInput} 
                placeholder="Confirm new password" 
                className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-canvas flex justify-end">
          <button 
            onClick={handlePasswordChangeSubmit} 
            disabled={passwordLoading}
            className="flex items-center gap-2 px-6 py-2 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

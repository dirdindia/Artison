import { useState, useEffect } from "react";
import { Settings, User, Package, LogOut, ChevronRight, MapPin, Camera, Lock, Loader2, FileText, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { toast } from "sonner";
import { formatPrice } from "@/data/products"; 
import { Country, State, City as CityData } from "country-state-city";
import { generateInvoice, downloadInvoice } from "@/utils/invoice";

const getStatusBadge = (status) => {
  const styles = {
    'Processing': 'bg-amber-100 text-amber-700',
    'Shipped': 'bg-blue-100 text-blue-700',
    'Out for Delivery': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Refunded': 'bg-gray-100 text-gray-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
};

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile, security, orders

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [street, setStreet] = useState(user?.address?.street || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [stateCode, setStateCode] = useState(user?.address?.state || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, page]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get(`/orders/myorders?page=${page}&limit=5`);
      if (data.success) {
        setOrders(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setAvatar(data.data.url);
        toast.success('Avatar uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const { data } = await api.put('/users/profile', {
        name,
        phone,
        avatar,
        address: { street, city, state: stateCode, country, postalCode }
      });
      if (data.success) {
        setUser(data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    try {
      const { data } = await api.put('/users/password', {
        oldPassword,
        newPassword
      });
      if (data.success) {
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <AppShell title="Profile">
      <div className="px-5 pb-24">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-5 text-primary-foreground shadow-card mb-6">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gold/30 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70"} 
                alt={user?.name} 
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-background/30" 
              />
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-2xl font-bold">{user?.name}</div>
              <div className="truncate text-sm text-primary-foreground/85 capitalize">{user?.role}</div>
              <div className="truncate text-sm text-primary-foreground/85">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === "profile" ? "bg-foreground text-background" : "bg-card text-muted-foreground shadow-sm hover:bg-secondary"}`}
          >
            Profile Info
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === "orders" ? "bg-foreground text-background" : "bg-card text-muted-foreground shadow-sm hover:bg-secondary"}`}
          >
            My Orders
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === "security" ? "bg-foreground text-background" : "bg-card text-muted-foreground shadow-sm hover:bg-secondary"}`}
          >
            Security
          </button>
        </div>

        {/* Tab Content: Profile Info */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Personal Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Avatar Image</label>
                  <div className="relative mt-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange} 
                      disabled={uploadingAvatar}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 transition-colors"
                    />
                    {uploadingAvatar && <Loader2 className="absolute right-4 top-2 h-5 w-5 animate-spin text-primary" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Shipping Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Street Address</label>
                  <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">Country</label>
                    <select 
                      value={country} 
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setStateCode("");
                        setCity("");
                      }} 
                      className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select Country</option>
                      {Country.getAllCountries().map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">State / Province</label>
                    <select 
                      value={stateCode} 
                      onChange={(e) => {
                        setStateCode(e.target.value);
                        setCity("");
                      }} 
                      disabled={!country}
                      className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value="">Select State</option>
                      {country && State.getStatesOfCountry(country).map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">City</label>
                    <select 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      disabled={!stateCode}
                      className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value="">Select City</option>
                      {country && stateCode && CityData.getCitiesOfState(country, stateCode).map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">Postal Code</label>
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={updatingProfile} className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background shadow-soft transition-transform active:scale-[0.98] flex items-center justify-center">
              {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
            </button>
          </form>
        )}

        {/* Tab Content: Security */}
        {activeTab === "security" && (
          <form onSubmit={handleChangePassword} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Change Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Current Password</label>
                  <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">New Password</label>
                  <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={updatingPassword} className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background shadow-soft transition-transform active:scale-[0.98] flex items-center justify-center">
              {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Password"}
            </button>
          </form>
        )}

        {/* Tab Content: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {loadingOrders ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
                <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="font-medium text-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-1">When you buy artwork, it will appear here.</p>
              </div>
            ) : (
              <>
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
                    <div className="flex items-start justify-between border-b border-border pb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Order #{order._id.substring(18)}</div>
                        <div className="text-sm font-medium mt-0.5">{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusBadge(order.orderStatus || 'Processing')}`}>
                          {order.orderStatus || 'Processing'}
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {order.isPaid ? 'Paid' : 'Payment Pending'}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              generateInvoice(order);
                            }}
                            className="text-xs font-semibold text-[#3b2f2f] hover:text-[#5a4d4d] flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            Print
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadInvoice(order);
                            }}
                            className="text-xs font-semibold text-white flex items-center gap-1 bg-[#3b2f2f] hover:bg-[#5a4d4d] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground bg-secondary/20 p-3 rounded-lg border border-border/50">
                      <div>
                        <div className="font-semibold text-foreground mb-1">Shipping Address:</div>
                        <div>{order.shippingAddress?.street}</div>
                        <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</div>
                        <div>{order.shippingAddress?.country}</div>
                      </div>
                      <div className="space-y-1">
                        <div><span className="font-semibold text-foreground">Payment Method:</span> {order.paymentMethod}</div>
                        {order.razorpayOrderId && <div className="truncate"><span className="font-semibold text-foreground">Razorpay Order ID:</span> {order.razorpayOrderId}</div>}
                        {order.paymentId && <div className="truncate"><span className="font-semibold text-foreground">Payment ID:</span> {order.paymentId}</div>}
                        {order.isPaid && order.paidAt && <div><span className="font-semibold text-foreground">Paid At:</span> {new Date(order.paidAt).toLocaleString()}</div>}
                        {order.isDelivered && order.deliveredAt && <div><span className="font-semibold text-foreground">Delivered At:</span> {new Date(order.deliveredAt).toLocaleString()}</div>}
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-secondary" alt={item.name} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {(() => {
                      const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
                      const additionalCharges = order.totalPrice - subtotal;
                      return (
                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                          </div>
                          {additionalCharges > 0 && (
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span>Shipping & Tax</span>
                              <span>{formatPrice(additionalCharges)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-border/50">
                            <span className="font-semibold text-foreground">Total Amount</span>
                            <span className="font-display font-bold text-lg text-primary">{formatPrice(order.totalPrice)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

      </div>
    </AppShell>
  );
}
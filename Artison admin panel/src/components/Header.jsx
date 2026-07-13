import React, { useState, useEffect } from 'react';
import { Bell, Search, UserCircle, Menu } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (e) {}
  };

  const handleNotificationClick = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setShowDropdown(false);
      navigate('/tickets');
    } catch (e) {}
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  return (
    <header className="h-16 border-b border-[#eae0d5] bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="p-2 md:hidden hover:bg-[#fdfbf7] rounded-lg text-[#5a4d4d] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center text-[#c39a5c] font-bold text-xl tracking-tight cursor-pointer">
          <span className="text-[#3b2f2f]">Art</span>ison
        </div>
      </div>
      
      <div className="flex items-center flex-1 max-w-md mx-8 hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-[#3b2f2f] relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 hover:bg-[#fdfbf7] rounded-full transition-colors relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c39a5c] rounded-full"></span>}
        </button>

        {showDropdown && (
          <div className="absolute top-12 right-10 w-72 bg-white rounded-xl shadow-lg border border-[#eae0d5] overflow-hidden z-50">
            <div className="p-3 border-b border-[#eae0d5] bg-[#fdfbf7] font-bold text-sm">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
              ) : (
                unreadNotifications.map(n => (
                  <div 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n._id)}
                    className={`p-3 border-b border-[#eae0d5] cursor-pointer hover:bg-[#fdfbf7] transition-colors ${n.read ? 'opacity-60' : 'bg-[#c39a5c]/5'}`}
                  >
                    <div className="text-sm font-medium">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <div className="h-8 w-8 rounded-full bg-[#fdfbf7] border border-[#eae0d5] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#c39a5c] transition-colors">
          <UserCircle className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </header>
  );
}

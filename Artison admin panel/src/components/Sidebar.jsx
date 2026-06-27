import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  Megaphone,
  MessageSquare,
  BarChart,
  Settings, 
  LogOut,
  Award,
  LifeBuoy
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Category', path: '/categories', icon: Layers },
  { name: 'Brands', path: '/brands', icon: Award },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Coupons', path: '/coupons', icon: Tag },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Tickets', path: '/tickets', icon: LifeBuoy },
  { name: 'Marketing', path: '/marketing', icon: Megaphone },
  { name: 'Feedback', path: '/feedback', icon: MessageSquare },
  { name: 'Analysis', path: '/analysis', icon: BarChart },
];

export default function Sidebar() {
  return (
    <div className="h-full bg-[#fdfbf7] flex flex-col py-6">
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#3b2f2f] text-[#fcf9f2] shadow-sm'
                  : 'text-[#5a4d4d] hover:bg-[#eae0d5]/50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 pt-4 mt-auto border-t border-[#eae0d5] space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#3b2f2f] text-[#fcf9f2] shadow-sm'
                : 'text-[#5a4d4d] hover:bg-[#eae0d5]/50'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="truncate">Settings</span>
        </NavLink>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
}

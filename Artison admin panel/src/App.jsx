import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ConfirmProvider } from './context/ConfirmContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Products from './pages/Products';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';
import Tickets from './pages/Tickets';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Marketing from './pages/Marketing';
import Reviews from './pages/Reviews';
import Feedbacks from './pages/Feedbacks';

// Placeholder component for other routes
const Placeholder = ({ title }) => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight mb-4">{title}</h1>
    <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] p-8 text-center text-[#5a4d4d]">
      <p>This is the {title} page. UI to be implemented.</p>
    </div>
  </div>
);

function App() {
  return (
    <ConfirmProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="SubCategories" element={<SubCategories />} />
            <Route path="products" element={<Products />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="review" element={<Reviews />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route path="analysis" element={<Placeholder title="Analysis" />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfirmProvider>
  );
}

export default App;

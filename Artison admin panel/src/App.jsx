import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Products from './pages/Products';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';
import Tickets from './pages/Tickets';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="products" element={<Products />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="orders" element={<Placeholder title="Orders" />} />
          <Route path="customers" element={<Placeholder title="Customers" />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="marketing" element={<Placeholder title="Marketing" />} />
          <Route path="feedback" element={<Placeholder title="Feedback" />} />
          <Route path="analysis" element={<Placeholder title="Analysis" />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

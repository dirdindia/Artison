import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Profile from "./pages/user/Profile";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import Checkout from "./pages/Checkout";
import ArtistSignup from "./pages/artist/ArtistSignup";
import ForgotPassword from "./pages/user/ForgotPassword";
import Featured from "./pages/Featured";
import Trending from "./pages/Trending";
import About from "./pages/About";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Simple route guard for protected routes
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/subcategories" element={<SubCategories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/artist/signup" element={<ArtistSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

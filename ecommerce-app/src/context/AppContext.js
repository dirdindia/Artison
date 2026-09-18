import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// This file holds ALL the app's shared data (user, cart, orders)
// using simple React State. No Redux, no external library.
// Any screen can read/update this using the useApp() hook below.

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = logged out
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setCart([]); // clear cart on logout for a clean demo
  };

  // ----- CART -----
  // cart is an array of items: { product, qty }
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty = 1) => {
    const newArtistId = typeof product.artist === 'object' ? product.artist?._id : product.artist;
    
    if (cart.length > 0) {
      const firstItemArtist = typeof cart[0].product.artist === 'object' 
        ? cart[0].product.artist?._id 
        : cart[0].product.artist;
        
      const firstArtistStr = firstItemArtist ? String(firstItemArtist) : 'independent';
      const newArtistStr = newArtistId ? String(newArtistId) : 'independent';
        
      if (firstArtistStr !== newArtistStr) {
        Toast.show({ 
          type: 'error', 
          text1: 'Different Artist', 
          text2: 'You cannot mix products from different artists or independent products. Please clear your cart first.' 
        });
        return;
      }
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prevCart, { product, qty }];
    });
    Toast.show({ type: 'success', text1: "Added to Cart", text2: `${product.name || product.title} added to your cart.` });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.product._id === productId ? { ...item, qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ----- ORDERS -----
  const [orders, setOrders] = useState([]);

  const placeOrder = (address, paymentMethod) => {
    const newOrder = {
      id: Date.now().toString(),
      items: cart,
      total: cartTotal,
      address,
      paymentMethod,
      date: new Date().toLocaleDateString(),
      status: "Processing",
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  // Everything below is available to any screen via useApp()
  const value = {
    user,
    setUser,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartTotal,
    cartCount,
    orders,
    placeOrder,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook - import this in any screen: const { cart, addToCart } = useApp();
export const useApp = () => useContext(AppContext);

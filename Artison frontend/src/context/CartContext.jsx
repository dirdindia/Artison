import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("kalakosh-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("kalakosh-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const newArtistId = typeof product.artist === 'object' ? product.artist?._id : product.artist;
    
    if (cart.length > 0) {
      const firstItemArtist = typeof cart[0].product.artist === 'object' 
        ? cart[0].product.artist?._id 
        : cart[0].product.artist;
        
      const firstArtistStr = firstItemArtist ? String(firstItemArtist) : 'independent';
      const newArtistStr = newArtistId ? String(newArtistId) : 'independent';
        
      if (firstArtistStr !== newArtistStr) {
        toast.error('You cannot mix products from different artists or independent products. Please clear your cart first.');
        return;
      }
    }

    setCart((prev) => {
      const productId = product.id || product._id;
      const existing = prev.find((c) => (c.product.id || c.product._id) === productId);
      if (existing) {
        return prev.map((c) =>
          (c.product.id || c.product._id) === productId ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name || product.title || 'Item'} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => (c.product.id || c.product._id) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((c) => {
        if ((c.product.id || c.product._id) === id) {
          const newQty = Math.max(1, c.qty + delta);
          return { ...c, qty: newQty };
        }
        return c;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

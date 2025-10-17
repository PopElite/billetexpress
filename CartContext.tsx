import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../lib/supabase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.ticketId === item.ticketId);

      if (existingItem) {
        return prevCart.map((i) =>
          i.ticketId === item.ticketId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.availableQuantity) }
            : i
        );
      }

      return [...prevCart, item];
    });
  };

  const removeFromCart = (ticketId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.ticketId !== ticketId));
  };

  const updateQuantity = (ticketId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ticketId === ticketId
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.availableQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

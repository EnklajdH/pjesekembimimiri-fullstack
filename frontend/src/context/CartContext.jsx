import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'pkm_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'));

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) { setCart(prev => prev.filter(item => item.id !== id)); }
  function clearCart() { setCart([]); }
  function updateQty(id, qty) {
    const safeQty = Math.max(1, Number(qty) || 1);
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: safeQty } : item));
  }

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0), [cart]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + Number(item.qty), 0), [cart]);
  const currency = cart[0]?.currency || 'EUR';

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count, currency }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

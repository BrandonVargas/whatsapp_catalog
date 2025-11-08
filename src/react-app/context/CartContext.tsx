import { createContext, useContext, useState, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, isPack: boolean, quantity?: number) => void;
  removeFromCart: (productId: string, isPack: boolean) => void;
  updateQuantity: (productId: string, isPack: boolean, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  const calculatePrice = (product: Product, isPack: boolean): number => {
    if (isPack && product.isPack && product.packDiscount) {
      return product.price * (1 - product.packDiscount / 100);
    }
    return product.price;
  };

  const addToCart = (product: Product, isPack: boolean, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id && item.isPack === isPack
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...prevCart.items, { product, quantity, isPack }];
      }

      return { items: newItems, total: calculateTotal(newItems) };
    });
  };

  const removeFromCart = (productId: string, isPack: boolean) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => !(item.product.id === productId && item.isPack === isPack)
      );
      return { items: newItems, total: calculateTotal(newItems) };
    });
  };

  const updateQuantity = (productId: string, isPack: boolean, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, isPack);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId && item.isPack === isPack
          ? { ...item, quantity }
          : item
      );
      return { items: newItems, total: calculateTotal(newItems) };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const price = calculatePrice(item.product, item.isPack);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartTotal = () => calculateTotal(cart.items);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

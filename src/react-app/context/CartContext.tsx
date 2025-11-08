import { createContext, useContext, useState, ReactNode } from 'react';
import { Cart, CartItem, Product } from '../types';
import { theme } from '../theme';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean, quantity?: number) => void;
  removeFromCart: (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean) => void;
  updateQuantity: (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemQuantity: (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  const calculatePrice = (product: Product, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean): number => {
    let basePrice = product.price;

    // Calculate pack price
    if (isPack && product.isPack && product.packSize) {
      // Price = (unit price * pack size) - discount
      basePrice = product.price * product.packSize;
      if (product.packDiscount) {
        basePrice = basePrice * (1 - product.packDiscount / 100);
      }
    }

    // Add dietary option charges
    if (isGlutenFree && product.glutenFreeAvailable) {
      basePrice += theme.pricing.glutenFreeUpcharge;
    }
    if (isSugarFree && product.sugarFreeAvailable) {
      basePrice += theme.pricing.sugarFreeUpcharge;
    }

    return basePrice;
  };

  const findCartItemIndex = (items: CartItem[], productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean): number => {
    return items.findIndex(
      item => item.product.id === productId &&
              item.isPack === isPack &&
              item.isGlutenFree === isGlutenFree &&
              item.isSugarFree === isSugarFree
    );
  };

  const addToCart = (product: Product, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = findCartItemIndex(prevCart.items, product.id, isPack, isGlutenFree, isSugarFree);

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...prevCart.items, { product, quantity, isPack, isGlutenFree, isSugarFree }];
      }

      return { items: newItems, total: calculateTotal(newItems) };
    });
  };

  const removeFromCart = (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => !(item.product.id === productId &&
                  item.isPack === isPack &&
                  item.isGlutenFree === isGlutenFree &&
                  item.isSugarFree === isSugarFree)
      );
      return { items: newItems, total: calculateTotal(newItems) };
    });
  };

  const updateQuantity = (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, isPack, isGlutenFree, isSugarFree);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId &&
        item.isPack === isPack &&
        item.isGlutenFree === isGlutenFree &&
        item.isSugarFree === isSugarFree
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
      const price = calculatePrice(item.product, item.isPack, item.isGlutenFree, item.isSugarFree);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartTotal = () => calculateTotal(cart.items);

  const getItemQuantity = (productId: string, isPack: boolean, isGlutenFree: boolean, isSugarFree: boolean): number => {
    const itemIndex = findCartItemIndex(cart.items, productId, isPack, isGlutenFree, isSugarFree);
    return itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemQuantity,
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

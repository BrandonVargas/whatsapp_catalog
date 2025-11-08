import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { sendWhatsAppOrder } from '../utils/whatsapp';
import '../styles/Cart.css';
import { useState } from 'react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckout = () => {
    if (!phoneNumber) {
      alert('Por favor ingrese el número de WhatsApp del negocio');
      return;
    }

    if (cart.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    sendWhatsAppOrder(cart.items, cart.total, phoneNumber);
    clearCart();
    setIsOpen(false);
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.button
        className="cart-toggle"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="cart-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="cart-header">
                <h2>
                  <ShoppingCart size={24} />
                  Carrito
                </h2>
                <button onClick={() => setIsOpen(false)} className="close-button">
                  <X size={24} />
                </button>
              </div>

              <div className="cart-items">
                {cart.items.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  cart.items.map((item, index) => {
                    const price = item.isPack && item.product.isPack && item.product.packDiscount
                      ? item.product.price * (1 - item.product.packDiscount / 100)
                      : item.product.price;

                    return (
                      <motion.div
                        key={`${item.product.id}-${item.isPack}`}
                        className="cart-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {item.product.images && item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="cart-item-image"
                          />
                        )}

                        <div className="cart-item-info">
                          <h4>
                            {item.product.name}
                            {item.isPack && ' (Pack)'}
                          </h4>
                          <p className="cart-item-price">${price.toFixed(2)}</p>

                          <div className="quantity-controls">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.isPack, item.quantity - 1)
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.isPack, item.quantity + 1)
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-actions">
                          <p className="cart-item-subtotal">
                            ${(price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.isPack)}
                            className="remove-button"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {cart.items.length > 0 && (
                <div className="cart-footer">
                  <div className="phone-input-group">
                    <label htmlFor="phone">WhatsApp del negocio:</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 5491123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="phone-input"
                    />
                  </div>

                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${cart.total.toFixed(2)}</span>
                  </div>

                  <motion.button
                    className="checkout-button"
                    onClick={handleCheckout}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enviar pedido por WhatsApp
                  </motion.button>

                  <button onClick={clearCart} className="clear-cart-button">
                    Vaciar carrito
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

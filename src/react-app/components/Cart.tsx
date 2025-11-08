import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { sendWhatsAppOrder } from '../utils/whatsapp';
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
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[var(--color-primary)] text-white rounded-full shadow-2xl hover:shadow-[var(--color-primary)]/50 transition-shadow"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={itemCount > 0 ? { y: [0, -5, 0] } : {}}
        transition={itemCount > 0 ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        <ShoppingCart size={24} className="md:w-7 md:h-7" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-[var(--color-error)] text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-bold border-2 border-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-full md:w-96 lg:w-[28rem] bg-[var(--color-background)] shadow-2xl z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <motion.h2
                  className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-[var(--color-text)] m-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ShoppingCart size={24} />
                  Carrito
                </motion.h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} className="text-[var(--color-text-secondary)]" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="popLayout">
                  {cart.items.length === 0 ? (
                    <motion.div
                      key="empty"
                      className="flex flex-col items-center justify-center h-full text-center gap-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ShoppingCart size={64} className="text-[var(--color-text-secondary)] opacity-40" />
                      </motion.div>
                      <p className="text-lg text-[var(--color-text-secondary)]">Tu carrito está vacío</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cart.items.map((item, index) => {
                        const price = item.isPack && item.product.isPack && item.product.packDiscount
                          ? item.product.price * (1 - item.product.packDiscount / 100)
                          : item.product.price;

                        return (
                          <motion.div
                            key={`${item.product.id}-${item.isPack}-${item.isGlutenFree}-${item.isSugarFree}`}
                            className="bg-[var(--color-surface)] rounded-xl p-3 md:p-4 border border-[var(--color-border)] flex gap-3 md:gap-4"
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                          >
                            {item.product.images && item.product.images[0] && (
                              <motion.img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                              />
                            )}

                            <div className="flex-1 flex flex-col gap-2">
                              <div>
                                <h4 className="text-base md:text-lg font-semibold text-[var(--color-text)] m-0">
                                  {item.product.name}
                                  {item.isPack && ' (Pack)'}
                                </h4>
                                <p className="text-sm text-[var(--color-text-secondary)] m-0">
                                  ${price.toFixed(2)} c/u
                                </p>
                                {(item.isGlutenFree || item.isSugarFree) && (
                                  <div className="flex gap-2 mt-1">
                                    {item.isGlutenFree && (
                                      <span className="text-xs px-2 py-0.5 bg-[var(--color-warning)]/20 text-[var(--color-warning)] rounded">
                                        Sin Gluten
                                      </span>
                                    )}
                                    {item.isSugarFree && (
                                      <span className="text-xs px-2 py-0.5 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded">
                                        Sin Azúcar
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-[var(--color-background)] rounded-lg p-1">
                                  <motion.button
                                    onClick={() =>
                                      updateQuantity(item.product.id, item.isPack, item.isGlutenFree, item.isSugarFree, item.quantity - 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Minus size={14} />
                                  </motion.button>
                                  <span className="w-8 text-center font-semibold text-[var(--color-text)]">
                                    {item.quantity}
                                  </span>
                                  <motion.button
                                    onClick={() =>
                                      updateQuantity(item.product.id, item.isPack, item.isGlutenFree, item.isSugarFree, item.quantity + 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Plus size={14} />
                                  </motion.button>
                                </div>

                                <div className="text-right">
                                  <p className="text-base md:text-lg font-bold text-[var(--color-primary)] m-0">
                                    ${(price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <motion.button
                              onClick={() => removeFromCart(item.product.id, item.isPack, item.isGlutenFree, item.isSugarFree)}
                              className="self-start p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {cart.items.length > 0 && (
                <motion.div
                  className="border-t border-[var(--color-border)] p-4 md:p-6 bg-[var(--color-surface)] flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-[var(--color-text)]">
                      WhatsApp del negocio:
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 5491123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[var(--color-border)]">
                    <span className="text-lg md:text-xl font-semibold text-[var(--color-text)]">Total:</span>
                    <motion.span
                      className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]"
                      key={cart.total}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      ${cart.total.toFixed(2)}
                    </motion.span>
                  </div>

                  <motion.button
                    className="w-full py-3 md:py-4 bg-[var(--color-whatsapp)] text-white rounded-lg font-semibold text-base md:text-lg flex items-center justify-center gap-2 hover:bg-[#1da851] transition-colors shadow-lg"
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(37, 211, 102, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enviar pedido por WhatsApp
                  </motion.button>

                  <motion.button
                    onClick={clearCart}
                    className="w-full py-2 md:py-3 bg-transparent text-[var(--color-error)] border border-[var(--color-error)] rounded-lg font-medium hover:bg-[var(--color-error)]/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Vaciar carrito
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

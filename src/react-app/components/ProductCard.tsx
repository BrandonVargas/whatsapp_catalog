import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Leaf, Wheat, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, getTotalItemQuantity } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState<'unit' | 'pack'>('unit');
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isSugarFree, setIsSugarFree] = useState(false);

  // Touch support for carousel
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Debounce for add to cart button
  const isAddingRef = useRef(false);

  const isPack = selectedType === 'pack';
  const itemQuantity = getTotalItemQuantity(product.id, isPack);

  // Calculate display price
  const calculateDisplayPrice = (): number => {
    let basePrice = product.price;

    if (isPack && product.isPack && product.packSize) {
      basePrice = product.price * product.packSize;
      if (product.packDiscount) {
        basePrice = basePrice * (1 - product.packDiscount / 100);
      }
    }

    if (isGlutenFree && product.glutenFreeAvailable) {
      basePrice += theme.pricing.glutenFreeUpcharge;
    }
    if (isSugarFree && product.sugarFreeAvailable) {
      basePrice += theme.pricing.sugarFreeUpcharge;
    }

    return basePrice;
  };

  const displayPrice = calculateDisplayPrice();
  const originalPackPrice =
    isPack && product.isPack && product.packSize ? product.price * product.packSize : null;

  const handleAddToCart = () => {
    // Prevent rapid successive clicks
    if (isAddingRef.current) return;

    isAddingRef.current = true;
    addToCart(product, isPack, isGlutenFree, isSugarFree);

    // Reset debounce after 300ms
    setTimeout(() => {
      isAddingRef.current = false;
    }, 300);
  };

  const nextImage = () => {
  if (!product.images?.length) return;
  setSelectedImage((p) => (p + 1) % product.images.length);
};
const prevImage = () => {
  if (!product.images?.length) return;
  setSelectedImage((p) => (p - 1 + product.images.length) % product.images.length);
};

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  return (
    <motion.div
      className="bg-[var(--color-surface)] rounded-xl overflow-hidden shadow-lg border border-[var(--color-border)] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative w-full h-64 md:h-60 overflow-hidden bg-black/30"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {product.images && product.images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={`hero-${product.id || 'noid'}-${selectedImage}`}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              />
            </AnimatePresence>

            {product.images.length > 1 && (
              <>
                <motion.button
                  className="absolute top-1/2 -translate-y-1/2 left-2 md:left-2.5 bg-black/60 text-white w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center z-10"
                  onClick={prevImage}
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="md:w-5 md:h-5" />
                </motion.button>
                <motion.button
                  className="absolute top-1/2 -translate-y-1/2 right-2 md:right-2.5 bg-black/60 text-white w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center z-10"
                  onClick={nextImage}
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="md:w-5 md:h-5" />
                </motion.button>

                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {product.images.map((_, index) => (
                    <motion.button
                      key={`dot-${product.id || 'noid'}-${index}`}
                      className={`h-2 rounded-full border-none cursor-pointer p-0 transition-all ${index === selectedImage
                          ? 'w-6 bg-[var(--color-primary)]'
                          : 'w-2 bg-white/50'
                        }`}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{
                        backgroundColor:
                          index === selectedImage ? undefined : 'rgba(255, 255, 255, 0.8)',
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] opacity-50">
            <Package size={48} />
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <AnimatePresence>
            {product.glutenFreeAvailable && (
              <motion.span
                key={`badge-gluten-${product.id || 'noid'}`}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/95 shadow-md text-[var(--color-warning)]"
                title="Gluten Free Available"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Wheat size={16} />
              </motion.span>
            )}
            {product.sugarFreeAvailable && (
              <motion.span
                key={`badge-sugar-${product.id || 'noid'}`}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/95 shadow-md text-(--color-success)"
                title="Sugar Free Available"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.15, rotate: -10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Leaf size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-6 md:p-4 flex-1 flex flex-col gap-4">
        <motion.h3
          className="text-2xl md:text-xl font-semibold text-(--color-text) m-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          className="text-sm text-(--color-text-secondary) m-0 flex-1 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {product.description}
        </motion.p>

        {product.isPack && (
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={`flex-1 py-2 px-3 rounded-lg border transition-all text-sm ${selectedType === 'unit'
                  ? 'bg-[var(--color-primary)] text-white border-(--color-primary)'
                  : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}
              onClick={() => setSelectedType('unit')}
              whileHover={
                selectedType !== 'unit'
                  ? {
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    borderColor: 'var(--color-primary)',
                  }
                  : {}
              }
              whileTap={{ scale: 0.97 }}
            >
              Unidad
            </motion.button>
            <motion.button
              className={`flex-1 py-2 px-3 rounded-lg border transition-all text-sm ${selectedType === 'pack'
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}
              onClick={() => setSelectedType('pack')}
              whileHover={
                selectedType !== 'pack'
                  ? {
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    borderColor: 'var(--color-primary)',
                  }
                  : {}
              }
              whileTap={{ scale: 0.97 }}
            >
              Pack x{product.packSize} {product.packDiscount && `(-${product.packDiscount}%)`}
            </motion.button>
          </motion.div>
        )}

        {/* Dietary Options */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {product.glutenFreeAvailable && (
            <motion.label
              className="flex items-center gap-2 cursor-pointer text-[var(--color-text-secondary)] text-sm"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
                className="w-[18px] h-[18px] cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="select-none">
                Sin Gluten (+${theme.pricing.glutenFreeUpcharge.toFixed(2)})
              </span>
            </motion.label>
          )}
          {product.sugarFreeAvailable && (
            <motion.label
              className="flex items-center gap-2 cursor-pointer text-[var(--color-text-secondary)] text-sm"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={isSugarFree}
                onChange={(e) => setIsSugarFree(e.target.checked)}
                className="w-[18px] h-[18px] cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="select-none">
                Sin Azúcar (+${theme.pricing.sugarFreeUpcharge.toFixed(2)})
              </span>
            </motion.label>
          )}
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-auto">
          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          >
            <span className="text-xs text-[var(--color-text-secondary)]">Precio:</span>
            <motion.span className="text-2xl font-bold text-[var(--color-primary)]" whileHover={{ scale: 1.05 }}>
              ${displayPrice.toFixed(2)}
            </motion.span>
            {isPack && product.packDiscount && originalPackPrice && (
              <motion.span
                className="text-sm text-[var(--color-text-secondary)] line-through opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              >
                ${originalPackPrice.toFixed(2)}
              </motion.span>
            )}
          </motion.div>

          <motion.button
            className={`flex items-center justify-center gap-2 text-white border-none py-3 px-6 rounded-lg font-semibold transition-all ${itemQuantity > 0 ? 'bg-[var(--color-primary)] relative' : 'bg-[var(--color-primary)]'
              } w-full md:w-auto`}
            onClick={handleAddToCart}
            whileHover={{
              backgroundColor: 'var(--color-primary-hover)',
              y: -2,
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          >
            <ShoppingCart size={20} />
            Agregar
            <AnimatePresence>
              {itemQuantity > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-[var(--color-error)] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-[var(--color-surface)]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {itemQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

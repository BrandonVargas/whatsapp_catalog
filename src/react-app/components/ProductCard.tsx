import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Leaf, Wheat, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';
import '../styles/ProductCard.css';

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
  const originalPackPrice = isPack && product.isPack && product.packSize
    ? product.price * product.packSize
    : null;

  const handleAddToCart = () => {
    addToCart(product, isPack, isGlutenFree, isSugarFree);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
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

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="product-image-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {product.images && product.images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {product.images.length > 1 && (
              <>
                <button className="carousel-button prev" onClick={prevImage} aria-label="Previous image">
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-button next" onClick={nextImage} aria-label="Next image">
                  <ChevronRight size={24} />
                </button>

                <div className="image-indicators">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === selectedImage ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <Package size={48} />
          </div>
        )}

        <div className="product-badges">
          {product.glutenFreeAvailable && (
            <span className="badge gluten-free" title="Gluten Free Available">
              <Wheat size={16} />
            </span>
          )}
          {product.sugarFreeAvailable && (
            <span className="badge sugar-free" title="Sugar Free Available">
              <Leaf size={16} />
            </span>
          )}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {product.isPack && (
          <div className="product-type-selector">
            <button
              className={`type-button ${selectedType === 'unit' ? 'active' : ''}`}
              onClick={() => setSelectedType('unit')}
            >
              Unidad
            </button>
            <button
              className={`type-button ${selectedType === 'pack' ? 'active' : ''}`}
              onClick={() => setSelectedType('pack')}
            >
              Pack x{product.packSize} {product.packDiscount && `(-${product.packDiscount}%)`}
            </button>
          </div>
        )}

        {/* Dietary Options */}
        <div className="dietary-options">
          {product.glutenFreeAvailable && (
            <label className="dietary-option">
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
              />
              <span>Sin Gluten (+${theme.pricing.glutenFreeUpcharge.toFixed(2)})</span>
            </label>
          )}
          {product.sugarFreeAvailable && (
            <label className="dietary-option">
              <input
                type="checkbox"
                checked={isSugarFree}
                onChange={(e) => setIsSugarFree(e.target.checked)}
              />
              <span>Sin Azúcar (+${theme.pricing.sugarFreeUpcharge.toFixed(2)})</span>
            </label>
          )}
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Precio:</span>
            <span className="price-value">${displayPrice.toFixed(2)}</span>
            {isPack && product.packDiscount && originalPackPrice && (
              <span className="price-original">${originalPackPrice.toFixed(2)}</span>
            )}
          </div>

          {itemQuantity > 0 ? (
            <motion.button
              className="add-to-cart-button in-cart"
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={20} />
              Agregar
              <span className="cart-quantity-badge">{itemQuantity}</span>
            </motion.button>
          ) : (
            <motion.button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={20} />
              Agregar
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

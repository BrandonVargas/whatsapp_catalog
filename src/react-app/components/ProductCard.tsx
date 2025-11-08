import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Leaf, Wheat } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState<'unit' | 'pack'>('unit');

  const displayPrice = selectedType === 'pack' && product.isPack && product.packDiscount
    ? product.price * (1 - product.packDiscount / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedType === 'pack');
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-container">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="product-image"
            />
            {product.images.length > 1 && (
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
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <Package size={48} />
          </div>
        )}

        <div className="product-badges">
          {product.isGlutenFree && (
            <span className="badge gluten-free" title="Gluten Free">
              <Wheat size={16} />
            </span>
          )}
          {product.isSugarFree && (
            <span className="badge sugar-free" title="Sugar Free">
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
              Pack {product.packDiscount && `(-${product.packDiscount}%)`}
            </button>
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Precio:</span>
            <span className="price-value">${displayPrice.toFixed(2)}</span>
            {selectedType === 'pack' && product.packDiscount && (
              <span className="price-original">${product.price.toFixed(2)}</span>
            )}
          </div>

          <motion.button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
            Agregar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

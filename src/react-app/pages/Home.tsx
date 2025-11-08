import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto mb-8 md:mb-12 text-center py-8 md:py-12">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          Bienvenido a nuestro catálogo
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explora nuestros productos y realiza tu pedido por WhatsApp
        </motion.p>
      </div>

      <motion.div
        className="flex flex-wrap gap-2 md:gap-3 justify-center mb-8 md:mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
          }`}
          onClick={() => setSelectedCategory('all')}
          whileHover={{ scale: selectedCategory === 'all' ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Todos
        </motion.button>
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
            onClick={() => setSelectedCategory(category.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-[var(--color-text-secondary)]">Cargando productos...</p>
            </motion.div>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            className="flex items-center justify-center min-h-[400px] text-center px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-2xl border border-[var(--color-border)] max-w-md">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-4"
              >
                🍞
              </motion.div>
              <p className="text-lg text-[var(--color-text-secondary)]">
                No hay productos disponibles en esta categoría
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="products"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

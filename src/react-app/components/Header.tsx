import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)] backdrop-blur-lg bg-opacity-95"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Store size={32} className="text-[var(--color-primary)]" />
            </motion.div>
            <motion.span
              className="text-xl md:text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Food Catalog
            </motion.span>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="no-underline">
              <motion.span
                className="text-base md:text-lg font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Catálogo
              </motion.span>
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

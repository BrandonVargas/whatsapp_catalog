import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag } from 'lucide-react';
import { CategoryManager } from '../components/admin/CategoryManager';
import { ProductManager } from '../components/admin/ProductManager';
import '../styles/Admin.css';

type AdminView = 'products' | 'categories';

export const Admin = () => {
  const [activeView, setActiveView] = useState<AdminView>('products');

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona tus productos y categorías</p>
      </div>

      <div className="admin-tabs">
        <motion.button
          className={`tab-button ${activeView === 'products' ? 'active' : ''}`}
          onClick={() => setActiveView('products')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Package size={20} />
          Productos
        </motion.button>

        <motion.button
          className={`tab-button ${activeView === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveView('categories')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Tag size={20} />
          Categorías
        </motion.button>
      </div>

      <div className="admin-content">
        {activeView === 'products' ? <ProductManager /> : <CategoryManager />}
      </div>
    </div>
  );
};

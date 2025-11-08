import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag, Lock } from 'lucide-react';
import { CategoryManager } from '../components/admin/CategoryManager';
import { ProductManager } from '../components/admin/ProductManager';
import '../styles/Admin.css';

type AdminView = 'products' | 'categories';

const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('products');

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="login-header">
            <Lock size={48} />
            <h1>Panel de Administración</h1>
            <p>Ingrese la contraseña para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="password-input"
                autoFocus
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button">
              Ingresar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-header-actions">
          <p>Gestiona tus productos y categorías</p>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
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

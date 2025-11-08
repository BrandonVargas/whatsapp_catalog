import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import '../styles/Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Store size={32} />
          <span>Food Catalog</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
};

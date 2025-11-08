import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Product, Category } from '../../types';
import '../../styles/ProductManager.css';

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isPack: false,
    packDiscount: '',
    packSize: '',
    glutenFreeAvailable: false,
    sugarFreeAvailable: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('categoryId', formData.categoryId);
    productData.append('isPack', String(formData.isPack));
    productData.append('packDiscount', formData.packDiscount);
    productData.append('glutenFreeAvailable', String(formData.glutenFreeAvailable));
    productData.append('sugarFreeAvailable', String(formData.glutenFreeAvailable));

    // Add existing images if editing
    if (editingProduct && editingProduct.images) {
      productData.append('existingImages', JSON.stringify(editingProduct.images));
    }

    // Add new image files
    imageFiles.forEach((file) => {
      productData.append('images', file);
    });

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : '/api/products';

    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: productData,
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
      } else {
        const error = await response.text();
        alert('Error al guardar el producto: ' + error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto? Se eliminarán también sus imágenes.')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId,
      isPack: product.isPack || false,
      packDiscount: String(product.packDiscount || ''),
      packSize: String(product.packSize || ''),
      glutenFreeAvailable: product.glutenFreeAvailable,
      sugarFreeAvailable: product.sugarFreeAvailable,
    });
    setImagePreviews(product.images || []);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      isPack: false,
      packDiscount: '',
    packSize: '',
      glutenFreeAvailable: false,
      sugarFreeAvailable: false,
    });
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    setIsFormOpen(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Productos</h2>
        <motion.button
          className="add-button"
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Nuevo Producto
        </motion.button>
      </div>

      <div className="products-table">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="product-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="product-image-thumb">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="no-image">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-category">{getCategoryName(product.categoryId)}</p>
              <p className="product-desc">{product.description}</p>
              <div className="product-badges-list">
                {product.glutenFreeAvailable && <span className="mini-badge">Sin Gluten</span>}
                {product.sugarFreeAvailable && <span className="mini-badge">Sin Azúcar</span>}
                {product.isPack && <span className="mini-badge pack">Pack</span>}
              </div>
            </div>

            <div className="product-price-col">
              <span className="price">${product.price.toFixed(2)}</span>
              {product.isPack && product.packDiscount && (
                <span className="discount">-{product.packDiscount}% pack</span>
              )}
            </div>

            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="edit-button">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="delete-button">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
            />
            <motion.div
              className="modal product-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onClick={resetForm} className="close-modal">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre *</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Ej: Croissant de chocolate"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoryId">Categoría *</label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del producto"
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Precio *</label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="packDiscount">Descuento Pack (%)</label>
                    <input
                      id="packDiscount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.packDiscount}
                      onChange={(e) => setFormData({ ...formData, packDiscount: e.target.value })}
                      placeholder="0"
                      disabled={!formData.isPack}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Opciones</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isPack}
                        onChange={(e) => setFormData({ ...formData, isPack: e.target.checked })}
                      />
                      <span>Disponible en pack</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.glutenFreeAvailable}
                        onChange={(e) => setFormData({ ...formData, glutenFreeAvailable: e.target.checked })}
                      />
                      <span>Sin gluten</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.sugarFreeAvailable}
                        onChange={(e) => setFormData({ ...formData, sugarFreeAvailable: e.target.checked })}
                      />
                      <span>Sin azúcar</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="images">Imágenes</label>
                  <div className="image-upload">
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="images" className="file-label">
                      <Upload size={20} />
                      Seleccionar imágenes
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-button">
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

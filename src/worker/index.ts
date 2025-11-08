import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  CATALOG_DB: KVNamespace;
  CATALOG_IMAGES: R2Bucket;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
  isPack?: boolean;
  packDiscount?: number;
  packSize?: number;
  glutenFreeAvailable: boolean;
  sugarFreeAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use('/*', cors());

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// ==================== CATEGORIES API ====================

// Get all categories
app.get('/api/categories', async (c) => {
  try {
    const list = await c.env.CATALOG_DB.list({ prefix: 'category:' });
    const categories: Category[] = [];

    for (const key of list.keys) {
      const data = await c.env.CATALOG_DB.get(key.name);
      if (data) {
        categories.push(JSON.parse(data));
      }
    }

    return c.json(categories.sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Get single category
app.get('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.env.CATALOG_DB.get(`category:${id}`);

  if (!data) {
    return c.json({ error: 'Category not found' }, 404);
  }

  return c.json(JSON.parse(data));
});

// Create category
app.post('/api/categories', async (c) => {
  try {
    const body = await c.req.json();
    const category: Category = {
      id: generateId(),
      name: body.name,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await c.env.CATALOG_DB.put(`category:${category.id}`, JSON.stringify(category));
    return c.json(category, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Update category
app.put('/api/categories/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.env.CATALOG_DB.get(`category:${id}`);

    if (!data) {
      return c.json({ error: 'Category not found' }, 404);
    }

    const category: Category = JSON.parse(data);
    const body = await c.req.json();

    category.name = body.name;
    category.description = body.description || '';
    category.updatedAt = new Date().toISOString();

    await c.env.CATALOG_DB.put(`category:${id}`, JSON.stringify(category));
    return c.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

// Delete category
app.delete('/api/categories/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.CATALOG_DB.delete(`category:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// ==================== PRODUCTS API ====================

// Get all products
app.get('/api/products', async (c) => {
  try {
    const list = await c.env.CATALOG_DB.list({ prefix: 'product:' });
    const products: Product[] = [];

    for (const key of list.keys) {
      const data = await c.env.CATALOG_DB.get(key.name);
      if (data) {
        products.push(JSON.parse(data));
      }
    }

    return c.json(products.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.env.CATALOG_DB.get(`product:${id}`);

  if (!data) {
    return c.json({ error: 'Product not found' }, 404);
  }

  return c.json(JSON.parse(data));
});

// Create product
app.post('/api/products', async (c) => {
  try {
    const formData = await c.req.formData();
    const imageUrls: string[] = [];

    // Upload images to R2
    const imageFiles = formData.getAll('images');
    for (const file of imageFiles) {
      if (file && typeof file === 'object' && 'stream' in file) {
        const imageId = generateId();
        const fileObj = file as any;
        const extension = fileObj.name?.split('.').pop() || 'jpg';
        const key = `products/${imageId}.${extension}`;

        await c.env.CATALOG_IMAGES.put(key, fileObj.stream(), {
          httpMetadata: {
            contentType: fileObj.type || 'image/jpeg',
          },
        });

        // Generate public URL (you'll need to configure R2 public access or use a custom domain)
        imageUrls.push(`/api/images/${key}`);
      }
    }

    const product: Product = {
      id: generateId(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      images: imageUrls,
      price: parseFloat(formData.get('price') as string),
      categoryId: formData.get('categoryId') as string,
      isPack: formData.get('isPack') === 'true',
      packDiscount: formData.get('packDiscount') ? parseFloat(formData.get('packDiscount') as string) : undefined,
      packSize: formData.get('packSize') ? parseInt(formData.get('packSize') as string) : undefined,
      glutenFreeAvailable: formData.get('glutenFreeAvailable') === 'true',
      sugarFreeAvailable: formData.get('sugarFreeAvailable') === 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await c.env.CATALOG_DB.put(`product:${product.id}`, JSON.stringify(product));
    return c.json(product, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product
app.put('/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.env.CATALOG_DB.get(`product:${id}`);

    if (!data) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const product: Product = JSON.parse(data);
    const formData = await c.req.formData();

    // Handle existing images
    const existingImages = formData.get('existingImages');
    let imageUrls: string[] = existingImages ? JSON.parse(existingImages as string) : [];

    // Upload new images to R2
    const imageFiles = formData.getAll('images');
    for (const file of imageFiles) {
      if (file && typeof file === 'object' && 'stream' in file) {
        const imageId = generateId();
        const fileObj = file as any;
        const extension = fileObj.name?.split('.').pop() || 'jpg';
        const key = `products/${imageId}.${extension}`;

        await c.env.CATALOG_IMAGES.put(key, fileObj.stream(), {
          httpMetadata: {
            contentType: fileObj.type || 'image/jpeg',
          },
        });

        imageUrls.push(`/api/images/${key}`);
      }
    }

    product.name = formData.get('name') as string;
    product.description = formData.get('description') as string;
    product.images = imageUrls;
    product.price = parseFloat(formData.get('price') as string);
    product.categoryId = formData.get('categoryId') as string;
    product.isPack = formData.get('isPack') === 'true';
    product.packDiscount = formData.get('packDiscount') ? parseFloat(formData.get('packDiscount') as string) : undefined;
    product.glutenFreeAvailable = formData.get('isGlutenFree') === 'true';
    product.sugarFreeAvailable = formData.get('isSugarFree') === 'true';
    product.updatedAt = new Date().toISOString();

    await c.env.CATALOG_DB.put(`product:${id}`, JSON.stringify(product));
    return c.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product
app.delete('/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.env.CATALOG_DB.get(`product:${id}`);

    if (!data) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const product: Product = JSON.parse(data);

    // Delete images from R2
    for (const imageUrl of product.images) {
      const key = imageUrl.replace('/api/images/', '');
      await c.env.CATALOG_IMAGES.delete(key);
    }

    await c.env.CATALOG_DB.delete(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ==================== IMAGES API ====================

// Serve image from R2
app.get('/api/images/*', async (c) => {
  try {
    const key = c.req.path.replace('/api/images/', '');
    const object = await c.env.CATALOG_IMAGES.get(key);

    if (!object) {
      return c.json({ error: 'Image not found' }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return c.json({ error: 'Failed to serve image' }, 500);
  }
});

export default app;

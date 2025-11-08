# WhatsApp Food Catalog

A modern, full-stack React application for food businesses (bakeries, restaurants, etc.) that allows customers to browse products and place orders via WhatsApp. Built with React, Vite, Hono, and Cloudflare Workers.

## Features

### Customer Features
- 📱 **Responsive Product Catalog** - Browse products with beautiful images and detailed information
- 🛒 **Shopping Cart** - Add products with unit or pack options
- 💬 **WhatsApp Integration** - Send orders directly to business via WhatsApp
- 🏷️ **Category Filtering** - Filter products by category
- 🌾 **Dietary Information** - See gluten-free and sugar-free options
- 📦 **Pack Discounts** - Special pricing for bulk purchases
- 🎨 **Smooth Animations** - Beautiful UI with Framer Motion animations
- 🌗 **Light/Dark Mode** - Automatic theme based on system preferences

### Admin Features
- 📝 **Category Management** - Create, edit, and delete product categories
- 🍰 **Product Management** - Full CRUD operations for products
- 🖼️ **Image Upload** - Support for multiple product images
- 💰 **Pricing Options** - Set regular and pack pricing
- 🎯 **Product Options** - Mark products as gluten-free, sugar-free, or available in packs

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router DOM
- **Styling**: CSS3 with CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Cloudflare Workers with Hono
- **Database**: Cloudflare Workers KV
- **Storage**: Cloudflare R2 (for product images)
- **Deployment**: Cloudflare Pages

## Project Structure

```
whatsapp-food-catalog/
├── src/
│   ├── react-app/              # React frontend
│   │   ├── components/         # React components
│   │   │   ├── admin/          # Admin panel components
│   │   │   ├── Cart.tsx        # Shopping cart
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   └── ProductCard.tsx # Product display
│   │   ├── context/            # React context
│   │   │   └── CartContext.tsx # Cart state management
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Main catalog page
│   │   │   └── Admin.tsx       # Admin dashboard
│   │   ├── styles/             # CSS files
│   │   ├── utils/              # Utility functions
│   │   │   └── whatsapp.ts     # WhatsApp integration
│   │   ├── types.ts            # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # App entry point
│   │   └── index.css           # Global styles
│   └── worker/                 # Cloudflare Worker
│       └── index.ts            # API routes
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── wrangler.json               # Cloudflare configuration
└── tsconfig.json               # TypeScript configuration
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)
- Wrangler CLI

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-food-catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Cloudflare resources** (for deployment)

   Create a KV namespace:
   ```bash
   wrangler kv:namespace create "CATALOG_DB"
   ```

   Create an R2 bucket:
   ```bash
   wrangler r2 bucket create catalog-images
   ```

4. **Update wrangler.json** with your KV and R2 IDs
   ```json
   {
     "kv_namespaces": [
       {
         "binding": "CATALOG_DB",
         "id": "your-kv-namespace-id"
       }
     ],
     "r2_buckets": [
       {
         "binding": "CATALOG_IMAGES",
         "bucket_name": "catalog-images"
       }
     ]
   }
   ```

## Development

Start the development server:

```bash
npm run dev
```

This will start:
- Frontend dev server on `http://localhost:5173`
- Cloudflare Worker with live reload

## Building

Build for production:

```bash
npm run build
```

This compiles TypeScript and bundles the application.

## Deployment

Deploy to Cloudflare:

```bash
npm run deploy
```

Or with Wrangler directly:

```bash
wrangler deploy
```

## Usage

### For Customers

1. Visit the catalog website
2. Browse products by category
3. Click on products to see details
4. Add products to cart (choose unit or pack)
5. Open the cart from the floating button
6. Enter the business WhatsApp number
7. Click "Send order via WhatsApp"
8. Complete the order in WhatsApp

### For Admins

1. Navigate to `/admin`
2. **Categories Tab**:
   - Click "New Category" to add categories
   - Edit or delete existing categories
3. **Products Tab**:
   - Click "New Product" to add products
   - Upload multiple images
   - Set pricing and options
   - Mark dietary information
   - Enable pack pricing with discounts
   - Edit or delete existing products

## Data Models

### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
  isPack?: boolean;
  packDiscount?: number;
  isGlutenFree: boolean;
  isSugarFree: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (multipart/form-data)
- `PUT /api/products/:id` - Update product (multipart/form-data)
- `DELETE /api/products/:id` - Delete product (also deletes images)

### Images
- `GET /api/images/:path` - Serve product image

## Customization

### Colors
Edit CSS variables in `src/react-app/index.css`:
```css
:root {
  --primary-color: #646cff;
  --secondary-color: #bd34fe;
  /* Add your custom colors */
}
```

### WhatsApp Message Format
Customize the message in `src/react-app/utils/whatsapp.ts`.

### Adding Features
- **Authentication**: Add authentication to `/admin` route
- **Payment Integration**: Replace WhatsApp with payment gateway
- **Reviews**: Add product reviews
- **Search**: Implement product search
- **Analytics**: Add Cloudflare Analytics

## Environment Variables

For local development, create `.dev.vars`:
```
# Add any environment variables here
```

## Performance

- **Images**: Automatically optimized via R2
- **Caching**: Images cached for 1 year
- **Bundle Size**: Optimized with Vite tree-shaking
- **Edge Deployment**: Deployed on Cloudflare's global network

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check Cloudflare Workers documentation
- Review React documentation

## Roadmap

- [ ] Admin authentication
- [ ] Product inventory tracking
- [ ] Order history
- [ ] Customer accounts
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Advanced analytics

---

Built with ❤️ using React, Vite, and Cloudflare Workers

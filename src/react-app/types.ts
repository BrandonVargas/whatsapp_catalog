export interface Product {
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isPack: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number; // Base price per unit
  categoryId: string;
  isPack?: boolean;
  packSize?: number; // Number of units in a pack
  packDiscount?: number; // Percentage discount for pack
  glutenFreeAvailable: boolean; // If product can be made gluten-free
  sugarFreeAvailable: boolean; // If product can be made sugar-free
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
  isGlutenFree: boolean; // Customer selected gluten-free option
  isSugarFree: boolean; // Customer selected sugar-free option
}

export interface Cart {
  items: CartItem[];
  total: number;
}

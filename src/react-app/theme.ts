// Theme configuration
export const theme = {
  // Autumn color palette
  colors: {
    primary: '#D97706', // Amber-600
    primaryHover: '#B45309', // Amber-700
    secondary: '#DC2626', // Red-600
    accent: '#92400E', // Amber-800
    background: '#78350F', // Amber-900
    surface: '#451A03', // Amber-950
    text: '#FEF3C7', // Amber-100
    textSecondary: '#FDE68A', // Amber-200
    border: '#92400E', // Amber-800
    success: '#16A34A', // Green-600
    warning: '#EA580C', // Orange-600
    error: '#DC2626', // Red-600
    whatsapp: '#25D366',
  },
  // Pricing configuration
  pricing: {
    glutenFreeUpcharge: 1.50, // Additional charge for gluten-free
    sugarFreeUpcharge: 1.00, // Additional charge for sugar-free
  },
};

export type Theme = typeof theme;

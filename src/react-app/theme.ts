// Theme configuration
export const theme = {
  // Light Autumn color palette
  colors: {
    primary: '#EA580C', // Bright warm orange (pumpkin)
    primaryHover: '#C2410C', // Deeper orange
    secondary: '#DC2626', // Autumn red
    accent: '#D97706', // Golden amber
    background: '#FFF8F0', // Warm cream
    surface: '#FFEDD5', // Light peach
    text: '#451A03', // Dark brown
    textSecondary: '#78350F', // Medium brown
    border: '#FED7AA', // Light orange border
    success: '#16A34A', // Green
    warning: '#F59E0B', // Amber warning
    error: '#DC2626', // Red
    whatsapp: '#25D366',
  },
  // Pricing configuration
  pricing: {
    glutenFreeUpcharge: 1.50, // Additional charge for gluten-free
    sugarFreeUpcharge: 1.00, // Additional charge for sugar-free
  },
};

export type Theme = typeof theme;

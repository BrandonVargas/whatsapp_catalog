import { CartItem } from '../types';
import { theme } from '../theme';

export const generateWhatsAppMessage = (items: CartItem[], total: number): string => {
  let message = '🛒 *Nuevo Pedido*\n\n';

  items.forEach((item, index) => {
    let basePrice = item.product.price;

    // Calculate pack price
    if (item.isPack && item.product.isPack && item.product.packSize) {
      basePrice = item.product.price * item.product.packSize;
      if (item.product.packDiscount) {
        basePrice = basePrice * (1 - item.product.packDiscount / 100);
      }
    }

    // Add dietary option charges
    if (item.isGlutenFree && item.product.glutenFreeAvailable) {
      basePrice += theme.pricing.glutenFreeUpcharge;
    }
    if (item.isSugarFree && item.product.sugarFreeAvailable) {
      basePrice += theme.pricing.sugarFreeUpcharge;
    }

    const packLabel = item.isPack ? ` (Pack x${item.product.packSize})` : '';
    const dietaryOptions: string[] = [];
    if (item.isGlutenFree) dietaryOptions.push('Sin Gluten');
    if (item.isSugarFree) dietaryOptions.push('Sin Azúcar');
    const dietaryLabel = dietaryOptions.length > 0 ? ` - ${dietaryOptions.join(', ')}` : '';

    const subtotal = basePrice * item.quantity;

    message += `${index + 1}. *${item.product.name}${packLabel}${dietaryLabel}*\n`;
    message += `   Cantidad: ${item.quantity}\n`;
    message += `   Precio unitario: $${basePrice.toFixed(2)}\n`;
    message += `   Subtotal: $${subtotal.toFixed(2)}\n\n`;
  });

  message += `💰 *Total: $${total.toFixed(2)}*`;

  return message;
};

export const sendWhatsAppOrder = (items: CartItem[], total: number, phoneNumber: string): void => {
  const message = generateWhatsAppMessage(items, total);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};

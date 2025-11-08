import { CartItem } from '../types';

export const generateWhatsAppMessage = (items: CartItem[], total: number): string => {
  let message = '🛒 *Nuevo Pedido*\n\n';

  items.forEach((item, index) => {
    const pricePerUnit = item.isPack && item.product.isPack && item.product.packDiscount
      ? item.product.price * (1 - item.product.packDiscount / 100)
      : item.product.price;

    const packLabel = item.isPack ? ' (Pack)' : '';
    const subtotal = pricePerUnit * item.quantity;

    message += `${index + 1}. *${item.product.name}${packLabel}*\n`;
    message += `   Cantidad: ${item.quantity}\n`;
    message += `   Precio unitario: $${pricePerUnit.toFixed(2)}\n`;
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

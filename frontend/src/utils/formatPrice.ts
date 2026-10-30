export function formatPrice(price: string | number): string {
  if (typeof price === 'string') {
    price = parseFloat(price.replace('R$', '').replace(',', '.'));
  }
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export function formatMyceliumPrice(price: number): string {
  if (price === 0) return 'R$ 0,0';
  return `R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)}`;
}

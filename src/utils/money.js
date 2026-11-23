// Форматує ціну з бекенду (BigDecimal приходить числом) у рядок "123.00 грн".
// Без змін з JS-лабораторної: чисті функції не залежать від фреймворку.
export function formatPrice(price) {
  return `${Number(price).toFixed(2)} грн`;
}

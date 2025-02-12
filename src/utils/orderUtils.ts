// Generiert eine eindeutige Bestellnummer im Format: VILO-YYYYMMDD-XXXX
// Beispiel: VILO-20250210-1234
export const generateOrderNumber = () => {
  const prefix = 'VILO';
  const date = new Date();
  const dateStr = date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}-${dateStr}-${random}`;
};

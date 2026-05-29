export function generateOrderId() {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OYA-${Date.now().toString(36).toUpperCase()}-${segment()}`;
}

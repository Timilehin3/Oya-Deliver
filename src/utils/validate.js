export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isZip(value) {
  return /^\d{5}(-\d{4})?$/.test(String(value).trim());
}

export function required(value) {
  return String(value ?? '').trim().length > 0;
}

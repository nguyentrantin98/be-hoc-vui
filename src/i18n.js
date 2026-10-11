import { state } from './state.js';
import { TEXT, fill } from './text.js';

export function t(key, x = '') {
  return fill(TEXT[state.lang]?.[key] ?? key, x);
}

// Lấy trường theo ngôn ngữ hiện tại: L({vi, en})
export const L = (obj) => obj[state.lang];

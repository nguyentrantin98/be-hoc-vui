// Danh sách MỌI câu game sẽ đọc, dùng để tạo sẵn mp3 bằng Piper (scripts/gen_voice.py).
// File này không phụ thuộc trình duyệt để Node đọc được. Nếu thêm câu audio.say() mới, nhớ thêm vào đây.

import { ANIMALS, COLORS, NUMBER_WORDS, LETTERS, MODES } from './data.js';
import { TEXT, fill } from './text.js';

export function allPhrases(lang) {
  const T = TEXT[lang];
  const out = new Set([T.title, T.countSay]);
  MODES.forEach((m) => out.add(T[m.key]));
  ANIMALS.forEach((a) => out.add(`${a[lang][0]}. ${a[lang][1]}!`));
  COLORS.forEach((c) => ['findColorSay', 'correct', 'thisIs'].forEach((k) => out.add(fill(T[k], c[lang]))));
  NUMBER_WORDS[lang].slice(1).forEach((w) => {
    out.add(w);
    out.add(fill(T.allAre, w));
  });
  LETTERS[lang].forEach(([ch, word]) => out.add(`${ch}. ${word}`));
  return [...out];
}

// Tên file ổn định từ nội dung câu (FNV-1a 32-bit)
export function phraseId(text) {
  let h = 0x811c9dc5;
  for (const ch of text.trim()) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

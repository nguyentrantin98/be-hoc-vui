import { platform } from './platform.js';

// Tiến trình + cài đặt của bé. Lưu qua platform (YouTube / CrazyGames / localStorage).
export const state = {
  stars: 0,
  lang: navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en',
  voices: {}, // tên giọng đã chọn cho từng ngôn ngữ: { vi: 'Linh', en: 'Samantha' }

  async load() {
    const data = await platform.load();
    this.stars = data.stars || 0;
    if (data.lang) this.lang = data.lang;
    this.voices = data.voices || {};
  },

  save() {
    platform.save({ stars: this.stars, lang: this.lang, voices: this.voices });
  },

  addStar() {
    this.stars++;
    this.save();
  },
};

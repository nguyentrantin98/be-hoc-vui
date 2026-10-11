// Giọng đọc Piper chạy ngay trong trình duyệt (miễn phí, offline sau lần tải đầu).
// Thư viện: @diffusionstudio/vits-web. Model tải từ HuggingFace một lần rồi lưu vào OPFS của trình duyệt.
// Chỉ bật ở bản web: YouTube Playables / CrazyGames không cho tải file lớn từ ngoài lúc chạy.

import { platform } from './platform.js';

export const PIPER_VOICES = {
  vi: [
    { id: 'vi_VN-vais1000-medium', label: 'Piper Nữ (chuẩn)' },
    { id: 'vi_VN-25hours_single-low', label: 'Piper Nữ 2' },
    { id: 'vi_VN-vivos-x_low', label: 'Piper (nhẹ)' },
  ],
  en: [
    { id: 'en_US-hfc_female-medium', label: 'Piper Female' },
    { id: 'en_US-amy-medium', label: 'Piper Amy' },
    { id: 'en_US-kristin-medium', label: 'Piper Kristin' },
    { id: 'en_US-hfc_male-medium', label: 'Piper Male' },
  ],
};

export const piperEnabled = platform.name === 'web' && typeof WebAssembly === 'object';

let lib = null;
const ready = new Set(); // voice đã tải xong
const failed = new Set(); // tải lỗi → không thử lại trong phiên này
const loading = new Map(); // voiceId -> Promise
const progress = new Map(); // voiceId -> 0..1
const cache = new Map(); // `${voiceId}|${text}` -> objectURL
const listeners = new Set();

const emit = () => listeners.forEach((f) => f());
const getLib = async () => (lib ??= await import('@diffusionstudio/vits-web'));

export const piper = {
  onChange(f) { listeners.add(f); return () => listeners.delete(f); },
  isReady: (id) => ready.has(id),
  progress: (id) => progress.get(id) ?? 0,

  // Tải model (nếu chưa có). Gọi nhiều lần cũng chỉ tải một lần.
  load(id) {
    if (!piperEnabled) return Promise.resolve(false);
    if (ready.has(id)) return Promise.resolve(true);
    if (failed.has(id)) return Promise.resolve(false);
    if (loading.has(id)) return loading.get(id);
    const p = (async () => {
      try {
        const tts = await getLib();
        if (!(await tts.stored()).includes(id)) {
          await tts.download(id, (e) => {
            if (e.total) progress.set(id, e.loaded / e.total);
            emit();
          });
        }
        ready.add(id);
        // Khởi động engine sẵn để câu đầu tiên không bị chậm
        await this.synth(id, '.');
        return true;
      } catch (e) {
        failed.add(id);
        console.warn('Piper: không tải được giọng', id, e);
        return false;
      } finally {
        loading.delete(id);
        emit();
      }
    })();
    loading.set(id, p);
    emit();
    return p;
  },

  isLoading: (id) => loading.has(id),
  isFailed: (id) => failed.has(id),

  // Trả về URL file wav (có cache, câu lặp lại phát ngay)
  async synth(id, text) {
    const key = `${id}|${text}`;
    if (cache.has(key)) return cache.get(key);
    const tts = await getLib();
    const wav = await tts.predict({ text, voiceId: id });
    const url = URL.createObjectURL(wav);
    cache.set(key, url);
    return url;
  },
};

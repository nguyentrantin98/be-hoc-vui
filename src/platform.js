// Lớp trung gian cho các nền tảng: YouTube Playables, CrazyGames, hoặc web thường.
// Chọn nền tảng lúc build: VITE_PLATFORM=youtube | crazygames | web (mặc định).
// Game chỉ gọi các hàm trong file này, không gọi trực tiếp SDK.

const PLATFORM = import.meta.env.VITE_PLATFORM || 'web';
const SAVE_KEY = 'be-hoc-vui-save';

const SDK_URLS = {
  youtube: 'https://www.youtube.com/game_api/v1',
  crazygames: 'https://sdk.crazygames.com/crazygames-sdk-v3.js',
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const yt = () => window.ytgame;
const cg = () => window.CrazyGames?.SDK;

export const platform = {
  name: PLATFORM,

  async init() {
    if (!SDK_URLS[PLATFORM]) return;
    try {
      await loadScript(SDK_URLS[PLATFORM]);
      if (PLATFORM === 'crazygames') await cg().init();
    } catch (e) {
      console.warn('Không tải được SDK, chạy chế độ web', e);
    }
  },

  // Đã vẽ được khung hình đầu tiên
  firstFrameReady() {
    if (PLATFORM === 'youtube') yt()?.game.firstFrameReady();
    if (PLATFORM === 'crazygames') cg()?.game.loadingStart();
  },

  // Người chơi đã tương tác được
  gameReady() {
    if (PLATFORM === 'youtube') yt()?.game.gameReady();
    if (PLATFORM === 'crazygames') cg()?.game.loadingStop();
  },

  gameplayStart() {
    if (PLATFORM === 'crazygames') cg()?.game.gameplayStart();
  },

  gameplayStop() {
    if (PLATFORM === 'crazygames') cg()?.game.gameplayStop();
  },

  // Game cho trẻ nhỏ: KHÔNG gọi quảng cáo.

  isAudioEnabled() {
    if (PLATFORM === 'youtube' && yt()) return yt().system.isAudioEnabled();
    return true;
  },

  onAudioChange(cb) {
    if (PLATFORM === 'youtube') yt()?.system.onAudioEnabledChange(cb);
  },

  onPause(cb) {
    if (PLATFORM === 'youtube') yt()?.system.onPause(cb);
    document.addEventListener('visibilitychange', () => document.hidden && cb());
  },

  onResume(cb) {
    if (PLATFORM === 'youtube') yt()?.system.onResume(cb);
    document.addEventListener('visibilitychange', () => !document.hidden && cb());
  },

  async load() {
    try {
      let raw = null;
      if (PLATFORM === 'youtube' && yt()) raw = await yt().game.loadData();
      else if (PLATFORM === 'crazygames' && cg()) raw = cg().data.getItem(SAVE_KEY);
      else raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  async save(data) {
    const raw = JSON.stringify(data);
    try {
      if (PLATFORM === 'youtube' && yt()) await yt().game.saveData(raw);
      else if (PLATFORM === 'crazygames' && cg()) cg().data.setItem(SAVE_KEY, raw);
      else localStorage.setItem(SAVE_KEY, raw);
    } catch (e) {
      console.warn('Lưu thất bại', e);
    }
  },
};

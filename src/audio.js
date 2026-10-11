// Âm thanh tạo bằng Web Audio + giọng đọc tiếng Việt bằng Web Speech API.
// Không cần file âm thanh → build rất nhẹ.

import { platform } from './platform.js';
import { state } from './state.js';
import { piper, piperEnabled, PIPER_VOICES } from './piper.js';
import { phraseId } from './phrases.js';

let ctx = null;
let enabled = true;
let allVoices = [];
let player = null; // <audio> phát giọng Piper
let sayToken = 0; // câu mới hủy câu cũ
let recorded = {}; // { vi: Set(id), en: Set(id) } – mp3 tạo sẵn trong public/voice

function refreshVoices() {
  allVoices = window.speechSynthesis?.getVoices() || [];
}
if (window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

const LANG_TAG = { vi: 'vi-VN', en: 'en-US' };

export const audio = {
  async init() {
    try {
      const res = await fetch('./voice/manifest.json');
      if (res.ok) {
        const m = await res.json();
        for (const lang of ['vi', 'en']) recorded[lang] = new Set(m[lang] || []);
      }
    } catch {
      // chưa tạo mp3 → dùng Piper trực tiếp / giọng máy
    }
    enabled = platform.isAudioEnabled();
    platform.onAudioChange((on) => {
      enabled = on;
      if (!on) this.stopSpeech();
    });
  },

  // Gọi trong sự kiện chạm đầu tiên (trình duyệt chặn âm thanh trước khi tương tác)
  unlock() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  },

  suspend() { ctx?.suspend(); this.stopSpeech(); },
  resume() { ctx?.resume(); },

  // Một nốt nhạc nhẹ nhàng
  tone(freq, dur = 0.25, type = 'sine', vol = 0.15) {
    if (!enabled || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },

  // Nốt ngẫu nhiên trong thang ngũ cung (luôn nghe êm tai)
  randomNote() {
    const scale = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];
    this.tone(scale[Math.floor(Math.random() * scale.length)], 0.4, 'triangle');
  },

  happy() {
    [523.3, 659.3, 784.0, 1046.5].forEach((f, i) => setTimeout(() => this.tone(f, 0.18, 'triangle'), i * 90));
  },

  oops() {
    this.tone(330, 0.15, 'sine', 0.1);
    setTimeout(() => this.tone(262, 0.25, 'sine', 0.1), 120);
  },

  // Danh sách giọng cho ngôn ngữ đang chọn: Piper trước, rồi giọng có sẵn của máy.
  // Mỗi giọng: { key, label, piperId? , voice? }
  voiceOptions(lang = state.lang) {
    const out = [];
    if (recorded[lang]?.size) out.push({ key: 'mp3', label: lang === 'vi' ? 'Piper (có sẵn)' : 'Piper (built-in)', mp3: true });
    if (piperEnabled) PIPER_VOICES[lang].forEach((v) => out.push({ key: `piper:${v.id}`, label: v.label, piperId: v.id }));
    allVoices
      .filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(lang))
      .forEach((v) => out.push({ key: `web:${v.name}`, label: v.name, voice: v }));
    return out;
  },

  currentVoice() {
    const list = this.voiceOptions();
    return list.find((v) => v.key === state.voices[state.lang]) || list[0] || null;
  },

  // Chuyển sang giọng kế tiếp, trả về giọng mới
  nextVoice() {
    const list = this.voiceOptions();
    if (!list.length) return null;
    const v = list[(list.indexOf(this.currentVoice()) + 1) % list.length];
    state.voices[state.lang] = v.key;
    state.save();
    this.prepare();
    return v;
  },

  // Bắt đầu tải giọng Piper đang chọn (chạy nền)
  prepare() {
    const v = this.currentVoice();
    if (v?.piperId) piper.load(v.piperId);
  },

  stopSpeech() {
    sayToken++;
    window.speechSynthesis?.cancel();
    player?.pause();
  },

  async say(text) {
    if (!enabled) return;
    this.stopSpeech();
    const token = sayToken;
    const v = this.currentVoice();

    const id = phraseId(text);
    if (v?.mp3 && recorded[state.lang].has(id)) {
      try {
        await this.play(`./voice/${state.lang}/${id}.mp3`, token);
        return;
      } catch (e) {
        console.warn('Không phát được mp3', e);
      }
    }

    if (v?.piperId && piper.isReady(v.piperId)) {
      try {
        await this.play(await piper.synth(v.piperId, text), token);
        return;
      } catch (e) {
        console.warn('Piper lỗi, dùng giọng trình duyệt', e);
      }
    }
    if (v?.piperId) piper.load(v.piperId); // chưa có → tải nền, tạm dùng giọng máy
    this.webSay(text, v?.voice);
  },

  async play(url, token) {
    if (token !== sayToken) return; // bé đã chạm cái khác
    player ??= new Audio();
    player.src = url;
    await player.play();
  },

  webSay(text, voice) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_TAG[state.lang];
    voice ??= allVoices.find((x) => x.lang?.toLowerCase().replace('_', '-').startsWith(state.lang));
    if (voice) u.voice = voice;
    u.rate = 0.8;
    u.pitch = 1.2;
    window.speechSynthesis.speak(u);
  },
};

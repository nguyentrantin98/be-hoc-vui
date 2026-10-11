import { BaseScene } from './BaseScene.js';
import { MODES } from '../data.js';
import { audio } from '../audio.js';
import { state } from '../state.js';
import { platform } from '../platform.js';
import { piper } from '../piper.js';
import { t, L } from '../i18n.js';

export class MenuScene extends BaseScene {
  constructor() { super('Menu'); }

  create() {
    this.setup(0xfff7e6);
    platform.gameplayStop();
    const { W, H, S } = this;

    this.text(W / 2, H * 0.13, t('title'), S * 0.09, '#e53935', { fontStyle: 'bold', stroke: '#fff', strokeThickness: 8 });
    this.settings();
    this.text(W / 2, H * 0.21, `⭐ ${state.stars}`, S * 0.05, '#f9a825', { fontStyle: 'bold' });

    // Lưới thẻ chế độ chơi: ngang 3 cột, dọc 2 cột
    const cols = W > H ? 3 : 2;
    const rows = Math.ceil(MODES.length / cols);
    const areaTop = H * 0.27;
    const cellW = (W * 0.92) / cols;
    const cellH = Math.min((H * 0.66) / rows, cellW * 0.9);
    const left = (W - cellW * cols) / 2;

    MODES.forEach((m, i) => {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, MODES.length - row * cols);
      const rowLeft = left + ((cols - inRow) * cellW) / 2; // căn giữa hàng cuối
      const x = rowLeft + cellW * (i % cols) + cellW / 2;
      const y = areaTop + cellH * row + cellH / 2;
      const w = cellW * 0.9;
      const h = cellH * 0.88;

      const card = this.add.container(x, y);
      const bg = this.add.rectangle(0, 0, w, h, m.color).setStrokeStyle(6, 0xffffff);
      const icon = this.emoji(0, -h * 0.14, m.emoji, h * 0.38);
      const title = this.text(0, h * 0.2, t(m.key), h * 0.13, '#fff', { fontStyle: 'bold' });
      const age = this.text(0, h * 0.36, L(m.age), h * 0.08, '#ffffffcc');
      card.add([bg, icon, title, age]);

      bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        audio.unlock();
        audio.say(t(m.key));
        this.pop(card, 1.08);
        this.time.delayedCall(250, () => {
          platform.gameplayStart();
          this.scene.start(m.key);
        });
      });

      card.setScale(0);
      this.tweens.add({ targets: card, scale: 1, duration: 400, delay: i * 80, ease: 'Back.easeOut' });
    });

    this.text(W / 2, H - 16, t('parentHint'), S * 0.025, '#999').setOrigin(0.5, 1);
  }

  // Góc phải: đổi ngôn ngữ (VI/EN) và đổi giọng đọc
  settings() {
    const { W, S } = this;
    const size = S * 0.026;
    const pad = 12;
    const btn = (y, label, onTap) => {
      const b = this.text(W - pad, y, label, size, '#333', {
        backgroundColor: '#ffffffdd', padding: { x: 12, y: 6 }, fixedWidth: 0,
      }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
      b.on('pointerdown', () => { audio.unlock(); onTap(b); });
      return b;
    };

    btn(pad, state.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English', () => {
      state.lang = state.lang === 'vi' ? 'en' : 'vi';
      state.save();
      this.scene.restart();
      audio.say(t('title'));
    });

    const voiceLabel = () => {
      const v = audio.currentVoice();
      if (!v) return t('noVoice');
      let tag = '';
      if (v.piperId) {
        if (piper.isReady(v.piperId)) tag = ' ✅';
        else if (piper.isFailed(v.piperId)) tag = ' ⚠️';
        else if (piper.isLoading(v.piperId)) tag = ` ⏬ ${Math.round(piper.progress(v.piperId) * 100)}%`;
      }
      return `🔊 ${t('voice')}: ${v.label.slice(0, 22)}${tag}`;
    };
    const vb = btn(pad + size * 2.4, voiceLabel(), (b) => {
      audio.nextVoice();
      b.setText(voiceLabel());
      audio.say(t('title'));
    });
    // Cập nhật % tải giọng Piper; danh sách giọng của máy cũng có thể tải muộn
    const off = piper.onChange(() => vb.active && vb.setText(voiceLabel()));
    this.events.once('shutdown', off);
    this.time.delayedCall(800, () => vb.setText(voiceLabel()));
    audio.prepare();
  }
}

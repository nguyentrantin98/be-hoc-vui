import { BaseScene } from './BaseScene.js';
import { MODES } from '../data.js';
import { audio } from '../audio.js';
import { state } from '../state.js';
import { platform } from '../platform.js';
import { t, L } from '../i18n.js';

const UI_ICONS = ['sparkles', 'cat_face', 'artist_palette', 'input_numbers', 'input_latin_uppercase', 'star', 'house'];
const TITLE_COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa'];

export class MenuScene extends BaseScene {
  constructor() { super('Menu'); }

  preload() {
    // Biểu tượng 3D: Microsoft Fluent Emoji (MIT)
    UI_ICONS.forEach((k) => this.load.image(`ui-${k}`, `./img/ui/${k}.png`));
  }

  create() {
    this.setup(0xfff7e6);
    platform.gameplayStop();
    const { W, H, S } = this;

    this.background();
    this.title(W / 2, H * 0.12, S * 0.1);
    this.starPill(W / 2, H * 0.215, S * 0.045);
    this.langToggle();

    // Lưới thẻ: ngang 3 cột, dọc 2 cột, hàng cuối căn giữa
    const cols = W > H ? 3 : 2;
    const rows = Math.ceil(MODES.length / cols);
    const top = H * 0.29;
    const cellW = (W * 0.94) / cols;
    const cellH = Math.min((H * 0.69) / rows, cellW * 0.85);
    const left = (W - cellW * cols) / 2;

    MODES.forEach((m, i) => {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, MODES.length - row * cols);
      const rowLeft = left + ((cols - inRow) * cellW) / 2;
      const x = rowLeft + cellW * (i % cols) + cellW / 2;
      const y = top + cellH * row + cellH / 2;
      this.card(m, x, y, cellW * 0.9, cellH * 0.88, i);
    });
  }

  // Nền chuyển màu nhẹ + vài đám mây trôi
  background() {
    const { W, H, S } = this;
    this.add.graphics().fillGradientStyle(0xfff3e0, 0xfff3e0, 0xe3f2fd, 0xe3f2fd, 1).fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) {
      const c = this.add.container(Math.random() * W, H * (0.05 + Math.random() * 0.9)).setAlpha(0.6);
      const r = S * (0.04 + Math.random() * 0.03);
      [[0, 0, 1], [r * 0.9, r * 0.2, 0.8], [-r * 0.9, r * 0.25, 0.75]].forEach(([dx, dy, k]) =>
        c.add(this.add.circle(dx, dy, r * k, 0xffffff)));
      this.tweens.add({ targets: c, x: c.x + W * 0.15, duration: 14000 + i * 3000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  // Tiêu đề nhiều màu, từng chữ nhún nhảy
  title(cx, cy, size) {
    const str = t('title');
    const letters = [...str].map((ch, i) =>
      this.text(0, cy, ch, size, TITLE_COLORS[i % TITLE_COLORS.length], { fontStyle: 'bold', stroke: '#ffffff', strokeThickness: size * 0.16 }));
    const total = letters.reduce((w, l) => w + l.width * 0.8, 0);
    let x = cx - total / 2;
    letters.forEach((l, i) => {
      x += (l.width * 0.8) / 2;
      l.x = x;
      x += (l.width * 0.8) / 2;
      this.tweens.add({ targets: l, y: cy - size * 0.08, duration: 600, yoyo: true, repeat: -1, delay: i * 90, ease: 'Sine.easeInOut' });
    });
  }

  pill(x, y, w, h, color, alpha = 1) {
    return this.add.graphics().fillStyle(color, alpha).fillRoundedRect(x - w / 2, y - h / 2, w, h, h / 2);
  }

  starPill(x, y, size) {
    const h = size * 1.6;
    const label = this.text(0, y, String(state.stars), size, '#f57f17', { fontStyle: 'bold' });
    const w = label.width + h * 1.6;
    this.pill(x, y + 3, w, h, 0x000000, 0.08);
    this.pill(x, y, w, h, 0xffffff);
    const icon = this.add.image(x - w / 2 + h * 0.6, y, 'ui-star');
    icon.setScale((h * 0.8) / icon.width);
    label.setX(icon.x + h * 0.45 + label.width / 2).setDepth(1);
  }

  // Nút chuyển ngôn ngữ dạng 2 nửa: [ Tiếng Việt | English ]
  langToggle() {
    const { W, S } = this;
    const h = S * 0.065;
    const size = h * 0.42;
    const opts = [['vi', 'Tiếng Việt'], ['en', 'English']];
    const labels = opts.map(([, s]) => this.text(0, 0, s, size, '#555', { fontStyle: 'bold' }));
    const segW = Math.max(...labels.map((l) => l.width)) + h * 0.8;
    const w = segW * 2 + 8;
    const x0 = W - w / 2 - 12;
    const y = 12 + h / 2;
    this.pill(x0, y, w, h, 0xffffff).setDepth(5);
    opts.forEach(([lang], i) => {
      const cx = x0 - w / 2 + 4 + segW * i + segW / 2;
      const active = state.lang === lang;
      if (active) this.pill(cx, y, segW, h - 8, 0x1e88e5).setDepth(6);
      labels[i].setPosition(cx, y).setColor(active ? '#ffffff' : '#777').setDepth(7);
      const hit = this.add.rectangle(cx, y, segW, h, 0, 0).setDepth(8).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', () => {
        audio.unlock();
        if (active) return;
        state.lang = lang;
        state.save();
        this.scene.restart();
        audio.say(t('title'));
      });
    });
  }

  card(m, x, y, w, h, i) {
    const r = Math.min(w, h) * 0.12;
    const c = this.add.container(x, y);
    const shadow = this.add.graphics().fillStyle(0x000000, 0.15).fillRoundedRect(-w / 2, -h / 2 + h * 0.04, w, h, r);
    const body = this.add.graphics()
      .fillStyle(0xffffff).fillRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, r + 4)
      .fillStyle(m.color).fillRoundedRect(-w / 2, -h / 2, w, h, r)
      .fillStyle(0xffffff, 0.18).fillRoundedRect(-w / 2, -h / 2, w, h * 0.45, { tl: r, tr: r, bl: 0, br: 0 });
    const icon = this.add.image(0, -h * 0.13, `ui-${m.icon}`);
    icon.setScale((h * 0.42) / icon.width);
    const title = this.text(0, h * 0.2, t(m.key), h * 0.13, '#fff', {
      fontStyle: 'bold', stroke: '#00000033', strokeThickness: 4,
    });
    const ageText = this.text(0, h * 0.36, L(m.age), h * 0.075, '#ffffff', { fontStyle: 'bold' });
    const badge = this.add.graphics().fillStyle(0x000000, 0.18)
      .fillRoundedRect(-ageText.width / 2 - h * 0.06, h * 0.36 - h * 0.06, ageText.width + h * 0.12, h * 0.12, h * 0.06);
    c.add([shadow, body, icon, title, badge, ageText]);

    // Biểu tượng nhún nhẹ để thu hút bé
    this.tweens.add({ targets: icon, y: icon.y - h * 0.035, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const hit = this.add.rectangle(x, y, w, h, 0, 0).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      audio.unlock();
      audio.say(t(m.key));
      this.tweens.add({ targets: c, scale: 0.92, duration: 90, yoyo: true });
      this.time.delayedCall(250, () => {
        platform.gameplayStart();
        this.scene.start(m.key);
      });
    });

    c.setScale(0);
    this.tweens.add({ targets: c, scale: 1, duration: 450, delay: i * 90, ease: 'Back.easeOut' });
  }
}

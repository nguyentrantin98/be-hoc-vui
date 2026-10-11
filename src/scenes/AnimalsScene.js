import { BaseScene } from './BaseScene.js';
import { ANIMALS } from '../data.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 6+ tháng: chạm con vật → phóng to, đọc tên + tiếng kêu.
export class AnimalsScene extends BaseScene {
  constructor() { super('Animals'); }

  create() {
    this.setup(0xe8f5e9);
    const { W, H } = this;
    const cols = W > H ? 4 : 3;
    const rows = Math.ceil(ANIMALS.length / cols);
    const top = H * 0.14;
    const cw = W / cols;
    const ch = (H - top) / rows;
    const size = Math.min(cw, ch) * 0.6;
    this.taps = 0;

    this.label = this.text(W / 2, H * 0.07, t('animalsHint'), this.S * 0.05, '#2e7d32', { fontStyle: 'bold' });

    ANIMALS.forEach((a, i) => {
      const x = cw * (i % cols) + cw / 2;
      const y = top + ch * Math.floor(i / cols) + ch / 2;
      const e = this.emoji(x, y, a.emoji, size).setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: e, y: y - 6, duration: 900 + i * 50, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      e.on('pointerdown', () => this.tapAnimal(a, x, y));
    });

    this.backButton();
  }

  tapAnimal(a, x, y) {
    const [name, sound] = L(a);
    audio.say(`${name}. ${sound}!`);
    this.label.setText(`${name} – ${sound}!`);

    // Hiện to ở giữa màn
    this.big?.destroy();
    this.big = this.emoji(x, y, a.emoji, this.S * 0.15).setDepth(50);
    this.tweens.add({
      targets: this.big,
      x: this.W / 2,
      y: this.H / 2,
      scale: 3,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        const big = this.big;
        this.tweens.add({ targets: big, angle: { from: -8, to: 8 }, duration: 150, yoyo: true, repeat: 3 });
        this.tweens.add({ targets: big, alpha: 0, delay: 1600, duration: 300, onComplete: () => big.destroy() });
      },
    });

    if (++this.taps % 5 === 0) this.reward();
  }
}

import { BaseScene } from './BaseScene.js';
import { ANIMALS } from '../data.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 6+ tháng: chạm con vật → phóng to, đọc tên + tiếng kêu.
export class AnimalsScene extends BaseScene {
  constructor() { super('Animals'); }

  preload() {
    ANIMALS.forEach((a) => this.load.image(`animal-${a.img}`, `./img/animals/${a.img}.png`));
  }

  // Ảnh 3D có kích thước hiển thị = size (px)
  animal(x, y, a, size) {
    const img = this.add.image(x, y, `animal-${a.img}`);
    img.setScale(size / img.width);
    return img;
  }

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
      const e = this.animal(x, y, a, size).setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: e, y: y - 6, duration: 900 + i * 50, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      e.on('pointerdown', () => this.tapAnimal(a, x, y));
    });

    this.backButton();
  }

  tapAnimal(a, x, y) {
    const [name, sound, sentence] = L(a);
    audio.say(sentence);
    this.label.setText(`${name} – ${sound}!`);

    // Hiện to ở giữa màn
    this.big?.destroy();
    // Hiện to ở giữa (ảnh gốc 256px, phóng tối đa 1.5 lần để không vỡ hình)
    const bigSize = Math.min(this.S * 0.55, 384);
    this.big = this.animal(x, y, a, bigSize * 0.3).setDepth(50);
    this.tweens.add({
      targets: this.big,
      x: this.W / 2,
      y: this.H / 2,
      scale: bigSize / this.big.width,
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

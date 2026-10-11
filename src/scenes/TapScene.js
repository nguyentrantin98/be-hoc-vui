import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 0+ tháng: chạm đâu cũng ra hình tương phản cao + nhạc. Dạy "nguyên nhân → kết quả".
// Trẻ sơ sinh nhìn rõ nhất màu đen / trắng / đỏ nên nền đen, hình trắng-đỏ-vàng.
const SHAPE_COLORS = [0xffffff, 0xe53935, 0xfdd835, 0x1e88e5];
const EMOJIS = ['⭐', '❤️', '🌙', '☀️', '🎈', '🐤', '🌸', '🦋'];

export class TapScene extends BaseScene {
  constructor() { super('Tap'); }

  create() {
    this.setup(0x111111);
    const hint = this.text(this.W / 2, this.H / 2, t('tapHint'), this.S * 0.06, '#fff');
    this.tweens.add({ targets: hint, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });

    this.input.on('pointerdown', (p) => {
      hint.destroy();
      this.spawn(p.x, p.y);
    });
    this.backButton();
  }

  spawn(x, y) {
    audio.randomNote();
    const size = this.S * Phaser.Math.FloatBetween(0.12, 0.22);
    let obj;
    if (Math.random() < 0.6) {
      const color = Phaser.Utils.Array.GetRandom(SHAPE_COLORS);
      const kind = Phaser.Math.Between(0, 2);
      if (kind === 0) obj = this.add.circle(x, y, size / 2, color);
      else if (kind === 1) obj = this.add.rectangle(x, y, size, size, color);
      else obj = this.add.star(x, y, 5, size * 0.25, size * 0.55, color);
    } else {
      obj = this.emoji(x, y, Phaser.Utils.Array.GetRandom(EMOJIS), size);
    }

    obj.setScale(0);
    this.tweens.add({ targets: obj, scale: 1, angle: Phaser.Math.Between(-30, 30), duration: 350, ease: 'Back.easeOut' });
    // Từ từ trôi lên và mờ dần → màn hình không bao giờ bị đầy
    this.tweens.add({
      targets: obj,
      y: y - this.S * 0.3,
      alpha: 0,
      delay: 1200,
      duration: 1800,
      onComplete: () => obj.destroy(),
    });
  }
}

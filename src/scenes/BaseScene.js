import Phaser from 'phaser';
import { audio } from '../audio.js';
import { state } from '../state.js';

const FONT = '"Baloo 2", "Comic Sans MS", system-ui, sans-serif';

// Lớp cha cho mọi màn: nền, nút thoát có khóa trẻ em, phần thưởng sao, xử lý xoay màn hình.
export class BaseScene extends Phaser.Scene {
  get W() { return this.scale.width; }
  get H() { return this.scale.height; }
  get S() { return Math.min(this.W, this.H); } // cạnh ngắn, dùng để co giãn kích thước

  setup(bgColor = 0xfff7e6) {
    this.cameras.main.setBackgroundColor(bgColor);
    this.input.on('pointerdown', () => audio.unlock());
    // Xoay màn / đổi kích thước → dựng lại màn cho đơn giản
    const onResize = () => this.scene.restart();
    this.scale.on('resize', onResize);
    this.events.once('shutdown', () => this.scale.off('resize', onResize));
  }

  text(x, y, str, size, color = '#333', style = {}) {
    return this.add
      .text(x, y, str, { fontFamily: FONT, fontSize: `${Math.round(size)}px`, color, align: 'center', ...style })
      .setOrigin(0.5);
  }

  emoji(x, y, ch, size) {
    // padding tránh bị cắt mép emoji trên một số trình duyệt
    return this.add.text(x, y, ch, { fontSize: `${Math.round(size)}px`, padding: { x: 8, y: 8 } }).setOrigin(0.5);
  }

  // Nút về menu: chạm là về
  backButton() {
    const r = this.S * 0.06;
    const x = r + 12;
    const y = r + 12;
    const bg = this.add.circle(x, y, r, 0xffffff, 0.85).setStrokeStyle(3, 0x999999).setDepth(100);
    const house = this.add.image(x, y, 'ui-house').setDepth(101);
    house.setScale((r * 1.3) / house.width);
    bg.setInteractive({ useHandCursor: true }).on('pointerdown', (p, lx, ly, ev) => {
      ev?.stopPropagation();
      this.scene.start('Menu');
    });
    return bg;
  }

  // Thưởng 1 sao: pháo giấy + âm thanh vui + lưu tiến trình
  reward(x = this.W / 2, y = this.H / 2) {
    audio.happy();
    state.addStar();
    for (let i = 0; i < 18; i++) {
      const star = this.emoji(x, y, Phaser.Utils.Array.GetRandom(['⭐', '✨', '🌟', '💖']), this.S * 0.06);
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(this.S * 0.15, this.S * 0.4);
      this.tweens.add({
        targets: star,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 1.6,
        duration: 900,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy(),
      });
    }
  }

  // Hiệu ứng nảy khi chạm
  pop(obj, scale = 1.25) {
    this.tweens.killTweensOf(obj);
    const base = obj.getData('baseScale') ?? obj.scale;
    obj.setData('baseScale', base);
    obj.setScale(base);
    this.tweens.add({ targets: obj, scale: base * scale, duration: 120, yoyo: true, ease: 'Sine.easeOut' });
  }

  shake(obj) {
    const x0 = obj.x;
    this.tweens.add({ targets: obj, x: x0 + 12, duration: 50, yoyo: true, repeat: 3, onComplete: () => (obj.x = x0) });
  }
}

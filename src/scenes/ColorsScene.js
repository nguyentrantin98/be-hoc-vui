import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { COLORS } from '../data.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 18+ tháng: "Bé tìm màu đỏ" – chọn đúng quả bóng. Bắt đầu 2 lựa chọn, đúng nhiều thì tăng lên 4.
export class ColorsScene extends BaseScene {
  constructor() { super('Colors'); }

  create() {
    this.setup(0xfffde7);
    this.streak = 0;
    this.prompt = this.text(this.W / 2, this.H * 0.12, '', this.S * 0.07, '#333', { fontStyle: 'bold' });
    this.prompt.setInteractive().on('pointerdown', () => audio.say(this.prompt.text));
    this.balls = [];
    this.backButton();
    this.round();
  }

  round() {
    this.balls.forEach((b) => b.destroy());
    this.balls = [];
    const n = this.streak >= 6 ? 4 : this.streak >= 3 ? 3 : 2;
    const choices = Phaser.Utils.Array.Shuffle([...COLORS]).slice(0, n);
    const target = Phaser.Utils.Array.GetRandom(choices);
    this.prompt.setText(t('findColor', L(target)));
    audio.say(t('findColorSay', L(target)));

    const { W, H, S } = this;
    const r = Math.min(S * 0.16, (W * 0.9) / n / 2.4);
    this.locked = false;

    choices.forEach((c, i) => {
      const x = (W / (n + 1)) * (i + 1);
      const y = H * 0.55;
      const ball = this.add.circle(x, y, r, c.hex).setStrokeStyle(6, 0xffffff);
      ball.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pick(ball, c, target));
      ball.setScale(0);
      this.tweens.add({ targets: ball, scale: 1, duration: 400, delay: i * 100, ease: 'Back.easeOut' });
      this.balls.push(ball);
    });
  }

  pick(ball, c, target) {
    if (this.locked) return;
    if (c === target) {
      this.locked = true;
      this.streak++;
      audio.say(t('correct', L(c)));
      this.pop(ball, 1.4);
      this.reward(ball.x, ball.y);
      this.time.delayedCall(1600, () => this.round());
    } else {
      // Không phạt: chỉ lắc nhẹ và nhắc lại tên màu bé vừa chạm
      this.streak = Math.max(0, this.streak - 1);
      audio.oops();
      audio.say(t('thisIs', L(c)));
      this.shake(ball);
    }
  }
}

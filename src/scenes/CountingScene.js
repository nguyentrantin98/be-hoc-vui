import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { COUNT_ITEMS, NUMBER_WORDS } from '../data.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 2+ tuổi: chạm từng đồ vật để đếm "một, hai, ba…". Đếm hết thì hiện số to.
export class CountingScene extends BaseScene {
  constructor() { super('Counting'); }

  create() {
    this.setup(0xe3f2fd);
    this.level = 1;
    this.title = this.text(this.W / 2, this.H * 0.1, '', this.S * 0.06, '#1565c0', { fontStyle: 'bold' });
    this.objs = [];
    this.backButton();
    this.round();
  }

  round() {
    this.objs.forEach((o) => o.destroy());
    this.objs = [];
    // Số lượng tăng dần 1 → 10 rồi lặp lại ngẫu nhiên
    const n = this.level <= 10 ? this.level : Phaser.Math.Between(1, 10);
    const item = Phaser.Utils.Array.GetRandom(COUNT_ITEMS);
    this.count = 0;
    this.n = n;
    this.title.setText(t('countHint'));
    audio.say(t('countSay'));

    const { W, H, S } = this;
    const cols = Math.min(n, W > H ? 5 : 4);
    const rows = Math.ceil(n / cols);
    const size = Math.min((W * 0.85) / cols, (H * 0.6) / rows) * 0.7;
    const top = H * 0.25;

    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, n - row * cols);
      const x = W / 2 + (i % cols - (inRow - 1) / 2) * size * 1.35;
      const y = top + (row + 0.5) * size * 1.35;
      const o = this.emoji(x, y, item, size).setInteractive({ useHandCursor: true });
      o.once('pointerdown', () => this.tapItem(o));
      o.setScale(0);
      this.tweens.add({ targets: o, scale: 1, delay: i * 80, duration: 300, ease: 'Back.easeOut' });
      this.objs.push(o);
    }
  }

  tapItem(o) {
    this.count++;
    audio.tone(300 + this.count * 50, 0.2, 'triangle');
    audio.say(L(NUMBER_WORDS)[this.count]);
    o.setAlpha(0.45);
    this.pop(o, 1.3);
    const num = this.text(o.x, o.y, String(this.count), this.S * 0.07, '#e53935', { fontStyle: 'bold', stroke: '#fff', strokeThickness: 6 });
    this.objs.push(num);

    if (this.count === this.n) {
      this.time.delayedCall(700, () => {
        const word = L(NUMBER_WORDS)[this.n];
        this.title.setText(`${this.n} – ${word[0].toUpperCase() + word.slice(1)}!`);
        audio.say(t('allAre', word));
        const big = this.text(this.W / 2, this.H * 0.55, String(this.n), this.S * 0.4, '#e53935', { fontStyle: 'bold', stroke: '#fff', strokeThickness: 12 }).setDepth(50);
        big.setScale(0);
        this.tweens.add({ targets: big, scale: 1, duration: 400, ease: 'Back.easeOut' });
        this.objs.push(big);
        this.reward();
        this.level++;
        this.time.delayedCall(2200, () => this.round());
      });
    }
  }
}

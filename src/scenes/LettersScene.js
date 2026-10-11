import { BaseScene } from './BaseScene.js';
import { LETTERS } from '../data.js';
import { audio } from '../audio.js';
import { t, L } from '../i18n.js';

// 3+ tuổi: lật từng chữ cái (bảng chữ theo ngôn ngữ đang chọn), kèm từ ví dụ và hình. Vuốt hoặc bấm mũi tên để chuyển.
export class LettersScene extends BaseScene {
  constructor() { super('Letters'); }

  create() {
    this.setup(0xfce4ec);
    this.idx = 0;
    this.letters = L(LETTERS);
    this.seen = new Set();
    const { W, H, S } = this;

    this.card = this.add.container(W / 2, H * 0.5);
    this.cardBg = this.add.rectangle(0, 0, Math.min(W * 0.7, S * 0.9), H * 0.7, 0xffffff).setStrokeStyle(8, 0xec407a);
    this.letter = this.text(0, -H * 0.17, '', S * 0.28, '#ec407a', { fontStyle: 'bold' });
    this.pic = this.emoji(0, H * 0.08, '', S * 0.16);
    this.word = this.text(0, H * 0.25, '', S * 0.07, '#333', { fontStyle: 'bold' });
    this.card.add([this.cardBg, this.letter, this.pic, this.word]);
    this.cardBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.speak());

    const arrow = (x, ch, d) =>
      this.emoji(x, H * 0.5, ch, S * 0.1).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.go(d));
    arrow(W * 0.08 + S * 0.05, '⬅️', -1);
    arrow(W * 0.92 - S * 0.05, '➡️', 1);

    // Vuốt trái/phải
    this.input.on('pointerup', (p) => {
      const dx = p.upX - p.downX;
      if (Math.abs(dx) > S * 0.15) this.go(dx < 0 ? 1 : -1);
    });

    this.backButton();
    this.show();
  }

  go(d) {
    this.idx = (this.idx + d + this.letters.length) % this.letters.length;
    this.show();
  }

  show() {
    const [ch, word, emoji] = this.letters[this.idx];
    this.letter.setText(`${ch} ${ch.toLowerCase()}`);
    this.pic.setText(emoji);
    this.word.setText(word);
    this.card.setScale(0.8);
    this.tweens.add({ targets: this.card, scale: 1, duration: 250, ease: 'Back.easeOut' });
    this.speak();
  }

  speak() {
    const [ch, word] = this.letters[this.idx];
    audio.say(`${ch}. ${word}`);
    this.pop(this.pic, 1.3);
    if (!this.seen.has(ch)) {
      this.seen.add(ch);
      if (this.seen.size % 5 === 0) this.reward();
    }
  }
}

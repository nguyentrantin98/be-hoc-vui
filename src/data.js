// Nội dung học song ngữ. Thêm/bớt mục ở đây là game tự cập nhật.

export const ANIMALS = [
  { emoji: '🐱', vi: ['Con mèo', 'Meo meo'], en: ['Cat', 'Meow meow'] },
  { emoji: '🐶', vi: ['Con chó', 'Gâu gâu'], en: ['Dog', 'Woof woof'] },
  { emoji: '🐮', vi: ['Con bò', 'Ò ò'], en: ['Cow', 'Moo'] },
  { emoji: '🐷', vi: ['Con lợn', 'Ụt ịt'], en: ['Pig', 'Oink oink'] },
  { emoji: '🐔', vi: ['Con gà', 'Ò ó o'], en: ['Chicken', 'Cluck cluck'] },
  { emoji: '🦆', vi: ['Con vịt', 'Cạp cạp'], en: ['Duck', 'Quack quack'] },
  { emoji: '🐸', vi: ['Con ếch', 'Ộp ộp'], en: ['Frog', 'Ribbit'] },
  { emoji: '🐑', vi: ['Con cừu', 'Be be'], en: ['Sheep', 'Baa baa'] },
  { emoji: '🐘', vi: ['Con voi', 'Voi kêu to lắm'], en: ['Elephant', 'Toot toot'] },
  { emoji: '🦁', vi: ['Con sư tử', 'Gừ gừ'], en: ['Lion', 'Roar'] },
  { emoji: '🐒', vi: ['Con khỉ', 'Chí chí'], en: ['Monkey', 'Ooh ooh aah aah'] },
  { emoji: '🐟', vi: ['Con cá', 'Cá bơi tung tăng'], en: ['Fish', 'Blub blub'] },
];

export const COLORS = [
  { vi: 'màu đỏ', en: 'red', hex: 0xe53935 },
  { vi: 'màu vàng', en: 'yellow', hex: 0xfdd835 },
  { vi: 'màu xanh lá', en: 'green', hex: 0x43a047 },
  { vi: 'màu xanh dương', en: 'blue', hex: 0x1e88e5 },
  { vi: 'màu cam', en: 'orange', hex: 0xfb8c00 },
  { vi: 'màu tím', en: 'purple', hex: 0x8e24aa },
  { vi: 'màu hồng', en: 'pink', hex: 0xec407a },
  { vi: 'màu đen', en: 'black', hex: 0x212121 },
];

export const NUMBER_WORDS = {
  vi: ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
};
export const COUNT_ITEMS = ['🍎', '🍌', '⭐', '🎈', '🐤', '🍓', '🚗', '🌸'];

export const LETTERS = {
  vi: [
    ['A', 'Áo', '👕'], ['B', 'Bóng', '⚽'], ['C', 'Cá', '🐟'], ['D', 'Dưa hấu', '🍉'],
    ['Đ', 'Đèn', '💡'], ['E', 'Em bé', '👶'], ['G', 'Gà', '🐔'], ['H', 'Hoa', '🌸'],
    ['K', 'Kem', '🍦'], ['L', 'Lá', '🍃'], ['M', 'Mèo', '🐱'], ['N', 'Nho', '🍇'],
    ['O', 'Ong', '🐝'], ['S', 'Sao', '⭐'], ['T', 'Táo', '🍎'], ['V', 'Voi', '🐘'], ['X', 'Xe', '🚗'],
  ],
  en: [
    ['A', 'Apple', '🍎'], ['B', 'Ball', '⚽'], ['C', 'Cat', '🐱'], ['D', 'Dog', '🐶'],
    ['E', 'Egg', '🥚'], ['F', 'Fish', '🐟'], ['G', 'Grapes', '🍇'], ['H', 'Hat', '🎩'],
    ['I', 'Ice cream', '🍦'], ['J', 'Juice', '🧃'], ['K', 'Kite', '🪁'], ['L', 'Lion', '🦁'],
    ['M', 'Moon', '🌙'], ['N', 'Nose', '👃'], ['O', 'Orange', '🍊'], ['P', 'Pig', '🐷'],
    ['Q', 'Queen', '👸'], ['R', 'Rainbow', '🌈'], ['S', 'Sun', '☀️'], ['T', 'Tree', '🌳'],
    ['U', 'Umbrella', '☂️'], ['V', 'Van', '🚐'], ['W', 'Whale', '🐳'], ['X', 'Xylophone', '🎹'],
    ['Y', 'Yo-yo', '🪀'], ['Z', 'Zebra', '🦓'],
  ],
};

// Mỗi chế độ học, xếp theo độ tuổi
export const MODES = [
  { key: 'Tap', emoji: '✨', color: 0x212121, age: { vi: '0+ tháng', en: '0+ months' } },
  { key: 'Animals', emoji: '🐱', color: 0xfb8c00, age: { vi: '6+ tháng', en: '6+ months' } },
  { key: 'Colors', emoji: '🎨', color: 0xe53935, age: { vi: '18+ tháng', en: '18+ months' } },
  { key: 'Counting', emoji: '🔢', color: 0x43a047, age: { vi: '2+ tuổi', en: '2+ years' } },
  { key: 'Letters', emoji: '🔤', color: 0x1e88e5, age: { vi: '3+ tuổi', en: '3+ years' } },
];

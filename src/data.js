// Nội dung học song ngữ. Thêm/bớt mục ở đây là game tự cập nhật.

// [tên, tiếng kêu (hiện chữ), câu đọc]. img = public/img/animals/<img>.png (Microsoft Fluent Emoji 3D, MIT)
export const ANIMALS = [
  { emoji: '🐱', img: 'cat', vi: ['Con mèo', 'Meo meo', 'Con mèo. Con mèo kêu meo meo'], en: ['Cat', 'Meow', 'Cat. The cat says meow, meow'] },
  { emoji: '🐶', img: 'dog', vi: ['Con chó', 'Gâu gâu', 'Con chó. Con chó kêu gâu gâu'], en: ['Dog', 'Woof', 'Dog. The dog says woof, woof'] },
  { emoji: '🐮', img: 'cow', vi: ['Con bò', 'Ò ò', 'Con bò. Con bò kêu ò ò'], en: ['Cow', 'Moo', 'Cow. The cow says moo'] },
  { emoji: '🐷', img: 'pig', vi: ['Con lợn', 'Ụt ịt', 'Con lợn. Con lợn kêu ụt ịt'], en: ['Pig', 'Oink', 'Pig. The pig says oink, oink'] },
  { emoji: '🐔', img: 'chicken', vi: ['Con gà', 'Ò ó o', 'Con gà. Con gà gáy ò ó o'], en: ['Chicken', 'Cluck', 'Chicken. The chicken says cluck, cluck'] },
  { emoji: '🦆', img: 'duck', vi: ['Con vịt', 'Cạp cạp', 'Con vịt. Con vịt kêu cạp cạp'], en: ['Duck', 'Quack', 'Duck. The duck says quack, quack'] },
  { emoji: '🐸', img: 'frog', vi: ['Con ếch', 'Ộp ộp', 'Con ếch. Con ếch kêu ộp ộp'], en: ['Frog', 'Ribbit', 'Frog. The frog says ribbit'] },
  { emoji: '🐑', img: 'ewe', vi: ['Con cừu', 'Be be', 'Con cừu. Con cừu kêu be be'], en: ['Sheep', 'Baa', 'Sheep. The sheep says baa'] },
  { emoji: '🐘', img: 'elephant', vi: ['Con voi', 'Vòi dài', 'Con voi. Con voi có cái vòi thật dài'], en: ['Elephant', 'Long trunk', 'Elephant. The elephant has a long trunk'] },
  { emoji: '🦁', img: 'lion', vi: ['Con sư tử', 'Gầm gừ', 'Con sư tử. Con sư tử gầm gừ'], en: ['Lion', 'Roar', 'Lion. The lion says roar'] },
  { emoji: '🐒', img: 'monkey', vi: ['Con khỉ', 'Chí chí', 'Con khỉ. Con khỉ kêu chí chí'], en: ['Monkey', 'Ooh aah', 'Monkey. The monkey says ooh ooh, aah aah'] },
  { emoji: '🐟', img: 'fish', vi: ['Con cá', 'Bơi bơi', 'Con cá. Con cá bơi tung tăng'], en: ['Fish', 'Swim', 'Fish. The fish can swim'] },
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

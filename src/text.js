// Câu chữ giao diện. {x} là chỗ điền biến.
export const TEXT = {
  vi: {
    title: 'Bé Học Vui',
    letterSay: 'Chữ {x}',
    Tap: 'Chạm Vui', Animals: 'Con Vật', Colors: 'Màu Sắc', Counting: 'Đếm Số', Letters: 'Chữ Cái',
    parentHint: 'Ba mẹ nên chơi cùng bé nhé ❤️',
    tapHint: '👆 Chạm vào màn hình',
    animalsHint: 'Chạm vào con vật nhé!',
    findColor: 'Bé tìm {x}',
    findColorSay: 'Bé tìm {x} nào',
    correct: 'Đúng rồi! {x}',
    thisIs: 'Đây là {x}',
    countHint: 'Bé đếm cùng mẹ nhé!',
    countSay: 'Bé đếm nào',
    allAre: 'Tất cả là {x}!',
  },
  en: {
    title: 'Baby Learn',
    letterSay: 'Letter {x}',
    Tap: 'Tap Fun', Animals: 'Animals', Colors: 'Colors', Counting: 'Counting', Letters: 'ABC',
    parentHint: 'Play together with your little one ❤️',
    tapHint: '👆 Tap the screen',
    animalsHint: 'Tap an animal!',
    findColor: 'Find {x}',
    findColorSay: 'Can you find {x}?',
    correct: 'Great job! {x}',
    thisIs: 'This is {x}',
    countHint: "Let's count together!",
    countSay: "Let's count",
    allAre: 'That makes {x}!',
  },
};

export const fill = (str, x = '') => str.replace('{x}', x);

// Câu đọc chữ cái: "Chữ C. Ví dụ: Cá" / "Letter C. C is for Cat"
export const letterSentence = (lang, ch, word) =>
  lang === 'vi' ? `Chữ ${ch}. Ví dụ: ${word}` : `Letter ${ch}. ${ch} is for ${word}`;

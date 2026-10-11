// Câu chữ giao diện. {x} là chỗ điền biến.
export const TEXT = {
  vi: {
    title: 'Bé Học Vui',
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
    voice: 'Giọng',
    voiceDefault: 'mặc định',
    noVoice: '⚠️ Máy chưa có giọng tiếng Việt',
  },
  en: {
    title: 'Baby Learn',
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
    voice: 'Voice',
    voiceDefault: 'default',
    noVoice: '⚠️ No English voice on this device',
  },
};

export const fill = (str, x = '') => str.replace('{x}', x);

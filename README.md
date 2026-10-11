# Bé Học Vui 👶

Game dạy bé (từ sơ sinh đến 4 tuổi) chạy trên trình duyệt, làm bằng **Phaser 3 + Vite**.
Có sẵn lớp tích hợp cho **YouTube Playables** và **CrazyGames**.

## Chế độ chơi
| Chế độ | Tuổi | Cách chơi |
|---|---|---|
| ✨ Chạm Vui | 0+ tháng | Chạm đâu cũng ra hình tương phản cao (đen/trắng/đỏ) + nhạc → dạy "nguyên nhân – kết quả" |
| 🐱 Con Vật | 6+ tháng | Chạm con vật → phóng to, đọc tên và tiếng kêu |
| 🎨 Màu Sắc | 18+ tháng | "Bé tìm màu đỏ" – 2 lựa chọn, tăng dần lên 4. Chọn sai không bị phạt |
| 🔢 Đếm Số | 2+ tuổi | Chạm từng đồ vật để đếm 1 → 10 |
| 🔤 Chữ Cái | 3+ tuổi | Thẻ chữ cái tiếng Việt kèm từ và hình, vuốt để chuyển |

- Hình con vật: [Microsoft Fluent Emoji 3D](https://github.com/microsoft/fluentui-emoji) (MIT) trong `public/img/animals/`.
- **Không quảng cáo, không mua hàng** (bắt buộc với game cho trẻ nhỏ).
- Hình là emoji, âm thanh tạo bằng Web Audio, giọng đọc dùng Web Speech API (`vi-VN`) → không có file asset, build ~350KB gzip.

## Chạy
```bash
npm install
npm run dev               # chạy thử ở http://localhost:5173
npm run build             # bản web thường
npm run build:youtube     # bản YouTube Playables
npm run build:crazygames  # bản CrazyGames
```
Nén thư mục `dist/` thành zip rồi upload lên nền tảng.

## Cấu trúc
- `src/data.js` – nội dung học (con vật, màu, chữ cái…). Thêm mục ở đây là xong.
- `src/platform.js` – lớp gọi SDK YouTube / CrazyGames / localStorage. Game chỉ gọi file này.
- `src/audio.js` – nhạc và giọng đọc.
- `src/scenes/` – mỗi chế độ chơi là một scene.

## Lưu ý
- Giọng đọc phụ thuộc thiết bị: nếu máy không có giọng tiếng Việt thì đọc sai/không đọc. Muốn chắc chắn, thu âm file `.mp3` thay cho `audio.say()`.
- WHO khuyến cáo trẻ dưới 2 tuổi hạn chế màn hình. Nên để ba mẹ chơi cùng bé, mỗi lần vài phút.
- CrazyGames chủ yếu hướng tới người chơi lớn hơn; nên hỏi đội ngũ của họ trước khi nộp game dành cho trẻ nhỏ.

## Tạo sẵn mp3 (Edge TTS – giọng Việt chuẩn, miễn phí)
Dùng Edge TTS, giọng bé gái cho cả 2 thứ tiếng: `vi-VN-HoaiMyNeural` nâng cao giọng (+30Hz) và `en-US-AnaNeural`, tốc độ -40% cho bé dễ nghe. Muốn dùng Piper offline: chạy với `ENGINE=piper`.

Mọi câu game đọc được liệt kê trong `src/phrases.js`. Script tạo mp3 cho từng câu vào `public/voice/<lang>/<id>.mp3` (+ `manifest.json`).
Game phát mp3 có sẵn; thiếu câu nào mới dùng giọng nữ của máy.

- **Tự động:** workflow `.github/workflows/voice.yml` chạy khi sửa `data.js` / `text.js` / `phrases.js`, rồi tự commit mp3 vào repo. Có thể bấm chạy tay ở tab Actions.
- **Chạy trên máy:**
  ```bash
  pip install edge-tts piper-tts   # cần thêm ffmpeg
  node scripts/export-phrases.mjs > /tmp/phrases.json
  python scripts/gen_voice.py /tmp/phrases.json
  ```
- Đổi giọng: sửa `VOICES` trong `scripts/gen_voice.py`. Thêm câu `audio.say()` mới thì nhớ thêm vào `src/phrases.js`.

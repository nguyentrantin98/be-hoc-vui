"""Tạo sẵn file mp3 cho mọi câu trong game bằng Piper (miễn phí, chạy offline).

Cách dùng (cần: pip install piper-tts, ffmpeg, node):
    node scripts/export-phrases.mjs > /tmp/phrases.json
    python scripts/gen_voice.py /tmp/phrases.json

Kết quả: public/voice/<lang>/<id>.mp3 + public/voice/manifest.json
"""

import json
import subprocess
import sys
import tempfile
import urllib.request
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

# Giọng dùng cho từng ngôn ngữ (đổi ở đây nếu muốn giọng khác)
VOICES = {
    "vi": "vi_VN-vais1000-medium",
    "en": "en_US-hfc_female-medium",
}
# Đọc chậm hơn một chút cho bé dễ nghe
SYN = SynthesisConfig(length_scale=1.15)

HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "voice"
MODELS = ROOT / ".piper-models"


def model_path(voice_id: str) -> Path:
    lang_region, name, quality = voice_id.split("-")
    lang = lang_region.split("_")[0]
    MODELS.mkdir(exist_ok=True)
    onnx = MODELS / f"{voice_id}.onnx"
    for suffix in (".onnx", ".onnx.json"):
        dst = MODELS / f"{voice_id}{suffix}"
        if not dst.exists():
            url = f"{HF}/{lang}/{lang_region}/{name}/{quality}/{voice_id}{suffix}"
            print("Tải", url)
            urllib.request.urlretrieve(url, dst)
    return onnx


def main() -> None:
    phrases = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    manifest = {"voices": VOICES}

    for lang, items in phrases.items():
        voice = PiperVoice.load(model_path(VOICES[lang]))
        out_dir = OUT / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        # Xóa file của câu không còn dùng
        for old in out_dir.glob("*.mp3"):
            if old.stem not in items:
                old.unlink()

        for pid, text in items.items():
            mp3 = out_dir / f"{pid}.mp3"
            with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
                with wave.open(tmp.name, "wb") as wav:
                    voice.synthesize_wav(text, wav, syn_config=SYN)
                subprocess.run(
                    ["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name,
                     "-ac", "1", "-ar", "22050", "-b:a", "48k", str(mp3)],
                    check=True,
                )
            print(f"[{lang}] {pid}  {text}")
        manifest[lang] = sorted(items)

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Xong:", OUT)


if __name__ == "__main__":
    main()

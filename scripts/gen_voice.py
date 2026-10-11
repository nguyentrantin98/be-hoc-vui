"""Tạo sẵn file mp3 cho mọi câu trong game.

Mặc định dùng Edge TTS (giọng neural Microsoft, miễn phí, không cần key):
  - Tiếng Việt: vi-VN-HoaiMyNeural, nâng cao giọng → nghe như bé gái
  - Tiếng Anh:  en-US-AnaNeural (giọng bé gái)
Dự phòng: Piper (offline) nếu chạy với ENGINE=piper.

Cách dùng (cần: pip install edge-tts [piper-tts], ffmpeg, node):
    node scripts/export-phrases.mjs > /tmp/phrases.json
    python scripts/gen_voice.py /tmp/phrases.json

Kết quả: public/voice/<lang>/<id>.mp3 + public/voice/manifest.json
"""

import asyncio
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import wave
from pathlib import Path

ENGINE = os.environ.get("ENGINE", "edge")

# Edge TTS: giọng + tốc độ (âm = chậm hơn). Đổi ở đây nếu muốn.
EDGE_VOICES = {"vi": "vi-VN-HoaiMyNeural", "en": "en-US-AnaNeural"}
EDGE_RATE = "-40%"
EDGE_PITCH = {"vi": "+30Hz", "en": "+10Hz"}  # cao hơn = giọng trẻ con hơn

# Piper (dự phòng)
PIPER_VOICES = {"vi": "vi_VN-vais1000-medium", "en": "en_US-hfc_female-medium"}
PIPER_LENGTH_SCALE = 1.7  # >1 = chậm hơn

HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "voice"
MODELS = ROOT / ".piper-models"


async def edge_one(text: str, voice: str, pitch: str, mp3: Path) -> None:
    import edge_tts

    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, voice, rate=EDGE_RATE, pitch=pitch).save(str(mp3))
            return
        except Exception as e:  # mạng chập chờn → thử lại
            if attempt == 3:
                raise
            print("  thử lại:", e)
            await asyncio.sleep(2 * (attempt + 1))


def piper_model(voice_id: str) -> Path:
    lang_region, name, quality = voice_id.split("-")
    lang = lang_region.split("_")[0]
    MODELS.mkdir(exist_ok=True)
    for suffix in (".onnx", ".onnx.json"):
        dst = MODELS / f"{voice_id}{suffix}"
        if not dst.exists():
            urllib.request.urlretrieve(f"{HF}/{lang}/{lang_region}/{name}/{quality}/{voice_id}{suffix}", dst)
    return MODELS / f"{voice_id}.onnx"


def piper_all(lang: str, items: dict, out_dir: Path) -> None:
    from piper import PiperVoice, SynthesisConfig

    voice = PiperVoice.load(piper_model(PIPER_VOICES[lang]))
    syn = SynthesisConfig(length_scale=PIPER_LENGTH_SCALE)
    for pid, text in items.items():
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            with wave.open(tmp.name, "wb") as wav:
                voice.synthesize_wav(text, wav, syn_config=syn)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name,
                            "-ac", "1", "-ar", "22050", "-b:a", "48k", str(out_dir / f"{pid}.mp3")], check=True)
        print(f"[{lang}] {pid}  {text}")


async def main() -> None:
    phrases = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    voices = EDGE_VOICES if ENGINE == "edge" else PIPER_VOICES
    manifest = {"engine": ENGINE, "voices": voices}

    for lang, items in phrases.items():
        out_dir = OUT / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        for old in out_dir.glob("*.mp3"):  # xóa câu không còn dùng / bản cũ
            old.unlink()
        if ENGINE == "edge":
            for pid, text in items.items():
                await edge_one(text, voices[lang], EDGE_PITCH[lang], out_dir / f"{pid}.mp3")
                print(f"[{lang}] {pid}  {text}")
        else:
            piper_all(lang, items, out_dir)
        manifest[lang] = sorted(items)

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Xong:", OUT)


if __name__ == "__main__":
    asyncio.run(main())

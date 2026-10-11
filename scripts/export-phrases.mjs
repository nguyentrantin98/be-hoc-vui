// In ra JSON { vi: { id: text }, en: { id: text } } cho gen_voice.py
import { allPhrases, phraseId } from '../src/phrases.js';

const out = {};
for (const lang of ['vi', 'en']) {
  out[lang] = Object.fromEntries(allPhrases(lang).map((t) => [phraseId(t), t]));
}
console.log(JSON.stringify(out, null, 2));

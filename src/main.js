import Phaser from 'phaser';
import { platform } from './platform.js';
import { audio } from './audio.js';
import { state } from './state.js';
import { MenuScene } from './scenes/MenuScene.js';
import { TapScene } from './scenes/TapScene.js';
import { AnimalsScene } from './scenes/AnimalsScene.js';
import { ColorsScene } from './scenes/ColorsScene.js';
import { CountingScene } from './scenes/CountingScene.js';
import { LettersScene } from './scenes/LettersScene.js';

const DPR = Math.min(window.devicePixelRatio || 1, 2);

async function start() {
  await platform.init();
  await state.load();
  await audio.init();

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#fff7e6',
    // Vẽ theo điểm ảnh thật của màn hình (Retina) để hình sắc nét, rồi thu nhỏ bằng zoom
    scale: { mode: Phaser.Scale.NONE, width: innerWidth * DPR, height: innerHeight * DPR, zoom: 1 / DPR },
    scene: [MenuScene, TapScene, AnimalsScene, ColorsScene, CountingScene, LettersScene],
    callbacks: {
      postBoot: () => {
        platform.firstFrameReady();
        platform.gameReady();
      },
    },
  });

  window.addEventListener('resize', () => {
    game.scale.resize(innerWidth * DPR, innerHeight * DPR);
    game.scale.setZoom(1 / DPR);
  });

  platform.onPause(() => {
    game.loop.sleep();
    audio.suspend();
  });
  platform.onResume(() => {
    game.loop.wake();
    audio.resume();
  });
}

start();

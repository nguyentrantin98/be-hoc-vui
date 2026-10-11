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

async function start() {
  await platform.init();
  await state.load();
  await audio.init();

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#fff7e6',
    scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
    resolution: window.devicePixelRatio || 1,
    scene: [MenuScene, TapScene, AnimalsScene, ColorsScene, CountingScene, LettersScene],
    callbacks: {
      postBoot: () => {
        platform.firstFrameReady();
        platform.gameReady();
      },
    },
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

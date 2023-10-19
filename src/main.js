/*
Keaton Shawhan
Rocket Patrol Mods
Time Taken: ~8-10 hours
Mods Chosen (20/20 Total Points):
  Allow the player to control the Rocket after it's fired (1)
  Display the time remaining (in seconds) on the screen (3)
  Implement the speed increase that happens after 30 seconds in the original game (1)
  Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
  Implement a new timing/scoring mechanism that adds time to the clock for successful hits (5)
  Create 4 new explosion sound effects and randomize which one plays on impact (3)
  Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)
  Create a new scrolling tile sprite for the background (1)

Citations:
https://thenounproject.com/icon/spaceship-1652612/
https://pixabay.com/sound-effects/transition-explosion-121425/
https://pixabay.com/sound-effects/explosion-6055/
https://pixabay.com/sound-effects/pop2-84862/
https://pixabay.com/sound-effects/medium-explosion-40472/
https://pixabay.com/sound-effects/8bit-music-for-game-68698/
https://thenounproject.com/icon/planet-1124430/
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}  

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
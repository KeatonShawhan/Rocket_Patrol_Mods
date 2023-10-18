/*
Keaton Shawhan
Rocket Patrol Mods
Time Taken:
Mods Chosen (10/20 Total Points):
  Allow the player to control the Rocket after it's fired (1)
  Display the time remaining (in seconds) on the screen (3)
  Implement the speed increase that happens after 30 seconds in the original game (1)
  Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)



Citations:
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
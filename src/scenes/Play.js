class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('ufo', './assets/ufo.png');
        this.load.image('planet', './assets/planet.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        this.randomHeights = [];
        for (var i = 150; i < 400; i ++){
          this.randomHeights.push(i);
        }
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.planet = this.add.tileSprite(game.config.width, 200, 0, 0, 'planet').setOrigin(0,0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
          // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*9, borderUISize*6+borderPadding*9, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20).setOrigin(0,0);
        this.ufo = new UFO(this, game.config.width + borderUISize*6, borderUISize*4, 'ufo', 0, 60).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.explosionSounds = [
          'sfx_explosion1',
          'sfx_explosion2',
          'sfx_explosion3',
          'sfx_explosion4',
          'sfx_explosion5'
        ];
        // initialize score
        this.p1Score = 0;
        // display score
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);
        // GAME OVER flag
        this.gameOver = false;
        this.updated = false;
        // 60-second play clock
        this.scoreConfig.fixedWidth = 0;
        if (this.music && this.music.isPlaying) {
          this.music.stop();
      }
        this.music = this.sound.add('looping_music', {loop: true});
        this.music.play();      
        this.startingTime = game.settings.gameTimer;
        this.timerDisplay = this.add.text(10, 10, this.formatTime(game.settings.gameTimer), {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#FFFFFF',
          color: '#000000'
        });
        this.shotdelay = 10000;
    }
    update() {
         // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            this.game.settings.gameTimer = this.startingTime;
            this.gameOver = false;
            this.gameOverDisplayed = false;
        }
        if (this.updated){
          this.starfield.tilePositionX -= 4; // double the background speed when we hit 30 seconds of playtime
          this.planet.x -= 8;
        }
        this.starfield.tilePositionX -= 4;
        this.planet.x -= 8;
        this.shotdelay -= 16.67;
        if (this.shotdelay <= 0 && this.planet.x <= 0) {
          this.planet.x = this.game.config.width;
          this.shotdelay = 10000;
          this.planet.y = Phaser.Utils.Array.GetRandom(this.randomHeights);
        }
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ufo.update();
        } 
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ufo)) {
          this.p1Rocket.reset();
          this.ufoExplode(this.ufo);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        if (!this.gameOver) {
          game.settings.gameTimer -= 16.67;
          this.timerDisplay.setText(this.formatTime(game.settings.gameTimer));
          if (!this.updated && Math.floor(game.settings.gameTimer) <= this.startingTime-30000){
            this.ship01.setSpeed(this.ship01.getSpeed()+1);
            this.ship02.setSpeed(this.ship02.getSpeed()+1);
            this.ship03.setSpeed(this.ship03.getSpeed()+1);
            this.ufo.setSpeed(this.ufo.getSpeed()*1.5);
            this.updated = true;
          }
          if (game.settings.gameTimer <= 0) {
            if (!this.gameOverDisplayed) {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5);
                this.gameOverDisplayed = true;
            }
            this.game.settings.gameTimer = 0;
            this.timerDisplay.setText(this.formatTime(game.settings.gameTimer));
            this.gameOver = true;
            this.events.on('shutdown', () => {
                this.music.stop();
            });            
          }
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          ship.reset();                       // reset ship position
          ship.alpha = 1;                     // make ship visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.game.settings.gameTimer += Math.floor(ship.points/10)*1000;
        this.scoreLeft.text = this.p1Score;
        let randomSoundKey = Phaser.Utils.Array.GetRandom(this.explosionSounds);
        this.sound.play(randomSoundKey);
    }
    ufoExplode(ship) {
      // temporarily hide ship
      ship.alpha = 0;                         
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after ani completes
        ship.reset();                       // reset ship position
        ship.alpha = 1;                     // make ship visible again
        boom.destroy();                     // remove explosion sprite
      });
      // score add and repaint
      this.p1Score += ship.points;
      this.game.settings.gameTimer += Math.floor(ship.points/10)*1000;
      this.scoreLeft.text = this.p1Score;
      let randomSoundKey = Phaser.Utils.Array.GetRandom(this.explosionSounds);
      this.sound.play(randomSoundKey);
  }
    formatTime(ms) {
      let seconds = Math.floor(ms / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds = seconds - (minutes * 60);
      return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  }
}
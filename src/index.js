//help from:
//https://phaser.io/tutorials/making-your-first-phaser-3-game/part1
//https://phaser.io/examples/v3/view/physics/arcade/basic-platform

import Phaser from "phaser";

var player;
var platforms;
var stars;
var cursors;
var score = 0;
var scoreText;
var redstars;
var enemys;
var enemysleft;
var GameoverText;
var GameoverTextRed;

var pixelWidth = 2;
var pixelHeight = 2;

//https://phaser.io/examples/v3/view/textures/generate-more-textures
var redstar = [
  ".....843.....",
  "....84443....",
  "....84443....",
  "...8444443...",
  "4444444444444",
  "8444444444443",
  ".84444444443.",
  "..844444443..",
  "..844444443..",
  ".84444444443.",
  ".84443.74443.",
  ".843.....7443."
];
var rocketright = [
  "334.............",
  "3333............",
  "333332222222D...",
  ".FF22222222EED..",
  ".F222222222FEED.",
  ".2222222222FFEED",
  "4443322222222222",
  "44433FFFFFFFFFFF",
  ".111FFFFFFFFFFF.",
  ".11FFFFFFFFFFF..",
  ".1FFFFFFFFFF1...",
  "3333............",
  "333............."
];

var rocketleft = [
  ".............433",
  "............3333",
  "...D222222233333",
  "..DEE22222222FF.",
  ".DEEF222222222F.",
  "DEFF22222222222.",
  "2222222222233444",
  "FFFFFFFFFFF33444",
  ".FFFFFFFFFFF111.",
  "..FFFFFFFFFFF11.",
  "...1FFFFFFFFFF1.",
  "............3333",
  ".............333"
];

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  this.textures.generate("redstar", { data: redstar, pixelWidth: pixelWidth });
  this.textures.generate("rocket", {
    data: rocketright,
    pixelWidth: pixelWidth
  });
  this.textures.generate("rocketleft", {
    data: rocketleft,
    pixelWidth: pixelWidth
  });
}

function create() {
  this.add.image(400, 300, "sky");

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  platforms.create(700, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = this.physics.add.sprite(100, 450, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  this.physics.add.collider(player, platforms);

  enemys = this.physics.add.image(400, 340, "rocket");
  enemys.setImmovable(true);
  enemys.body.allowGravity = false;
  enemys.setVelocityX(50);

  this.physics.add.overlap(player, enemys, gotDamage, null, this);

  enemysleft = this.physics.add.image(600, 150, "rocketleft");
  enemysleft.setImmovable(true);
  enemysleft.body.allowGravity = false;
  enemysleft.setVelocityX(50);

  this.physics.add.overlap(player, enemysleft, gotDamage, null, this);

  //Yellowstars
  stars = this.physics.add.group({
    key: "star",
    repeat: 6,
    setXY: { x: 45, y: 20, stepX: 120 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  //redstars
  redstars = this.physics.add.group({
    key: "redstar",
    repeat: 2,
    setXY: { x: 130, y: 0, stepX: 250 }
  });
  this.physics.add.collider(redstars, platforms);
  this.physics.add.overlap(player, redstars, collectRedStar, null, this);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#000"
  });

  GameoverTextRed = this.add.text(299, 300, "Game Over!", {
    fontSize: "64px",
    fill: "	#FF0000"
  });
  GameoverTextRed.setOrigin(0.2);
  GameoverTextRed.visible = false;

  GameoverText = this.add.text(300, 299, "Game Over!", {
    fontSize: "64px",
    fill: "#000"
  });
  GameoverText.setOrigin(0.2);
  GameoverText.visible = false;
}

function gotDamage(player) {
  this.physics.pause();
  player.setTint(0xff0000);
  let gameOver = true;
  GameoverText.visible = true;
  GameoverTextRed.visible = true;
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 5;
  scoreText.setText("Score: " + score);
}

function collectRedStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  if (enemys.x >= 750) {
    enemys.body.velocity.x = -256;
  } else if (enemys.x <= 20) {
    enemys.setVelocityX(50);
  }

  if (enemysleft.x >= 750) {
    enemysleft.body.velocity.x = -256;
  } else if (enemysleft.x <= 20) {
    enemysleft.setVelocityX(50);
  }
}

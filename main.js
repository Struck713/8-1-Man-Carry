
const gameManager = new GameManager();
const tileManager = new TileManager();
const levelManager = new LevelManager(tileManager);
const hudManager = new HUDManager();
const spriteManager = new SpriteManager();

function preload() {
  spriteManager.preload([ "nona.png", "shark.png", "urchin.png", "clam.png", "pufferfish.png", "oil_att.png", "crab.png"]);
  hudManager.preload();
  tileManager.preload();

  //loadSound('assets/sound/background.mp3', e => e.play());

}

let character;
function setup() {
  spriteManager.load(); // load sprites
  tileManager.load();

  levelManager.load(); //load levels

  // test some enemies
  gameManager.queue(new Shark(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  gameManager.queue(new Urchin(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  gameManager.queue(new Clam(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  gameManager.queue(new Pufferfish(random(0, GameManager.CANVAS_X), random(0, GameManager.CANVAS_Y)));
  
  character = new Character(400, 400);
  gameManager.queue(character); // add our character to the render queue

  let canvas = createCanvas(GameManager.CANVAS_X, GameManager.CANVAS_Y);
  canvas.style('cursor', 'url(\'assets/hud/crosshair.png\'), none');
  canvas.background(100, 140, 160);
  canvas.position((screen.width - GameManager.CANVAS_X) / 2, 15); //centering the game canvas

  canvas.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); } // disable right click
}

function draw(){
  levelManager.render();
  gameManager.render();
  hudManager.render();
}

/**
 * Key Events
 */
function keyPressed() {
  character.keyPressed(key, true);
}

function keyReleased() {
  character.keyPressed(key, false);
}

/**
 * Mouse Events
 */
function mouseMoved() {
  character.mouseMovement(mouseX, mouseY);
}

function mousePressed(event) {
  character.mouseClicked(event.button);
}



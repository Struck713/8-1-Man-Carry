
const gameManager = new GameManager();
const gameController = new GameController();
const spriteManager = new SpriteManager();

let character;
let gameCanvasSizex = 960;
let gameCanvasSizey = 720;

function preload() {
  spriteManager.load("nona.png"); // will look in assets folder for nona.png and nona.png.json
  spriteManager.load([ "shark.png", "urchant.png", "clam.png" ]);
  spriteManager.load("crosshair.png"); // load crosshair

  spriteManager.preloadAll();
}

function setup() {
  spriteManager.loadAll(); // load sprites

  gameManager.queue(new Enemy(400, 400, spriteManager.get("Shark")));
  gameManager.queue(new Enemy(100, 100, spriteManager.get("Urchant")));
  gameManager.queue(new Enemy(300, 300, spriteManager.get("Clam")));

  let character = new Character(250, 200, spriteManager.get("Nona"));
  let cross = new Character(250, 225, spriteManager.get("Crosshair"));
  gameManager.queue(character); // add our character to the render queue
  gameManager.queue(cross);
  gameController.subscribe(character); // subscribe to gameController event bus
  gameController.subscribe(cross);

  // let gameCanvas = createCanvas(640, 480);
  // gameCanvas.background(100,140,160);
  //gameCanvas.center();

  let gameCanvas = createCanvas(gameCanvasSizex, gameCanvasSizey);
  gameCanvas.background(100,140,160);
  gameCanvas.position((screen.width - gameCanvasSizex)/2, 15); //centering the game canvas
}

function draw(){
  background(100, 140, 160); // clear canvas and then render

  gameManager.render();
}

function keyPressed() {
  gameController.keyPressed(key, true);
}

function keyReleased() {
  gameController.keyPressed(key, false);
}

function checkBoundaries(position) {
  console.log(position);
}

// currently does not work
function trackMouse(){
  gameController.trackMouse(true)
}


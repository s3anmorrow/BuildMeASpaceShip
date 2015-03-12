// Build me a Space Ship!
// Sean Morrow
// Jan 2015

// TODO expert mode where you can color the ship outside the lines
// TODO get rid of address bar in browser on mobile devices
// TODO build system so that stage.update() only happens when it needs to be
// TODO pause all tweens when game paused

// the base width and height of game that graphics are designed for (pre-resizing for android screens)
var BASE_WIDTH = 640;
var BASE_HEIGHT = 960;
var scaleRatio = 1;
// am I running on a mobile device?
var mobile = false;

// flag to mark a stage update is needed
var stageUpdateReq = true;


/*
var RATIO = 0;
var currentWidth = 0;
var currentHeight = 0;
var android = false;
var ios = false;
*/

// game variables
var stage = null;
var canvas = null;
// the main container for the game - is resized to device android screen resolutions
var root = null;

// frame rate of game
var frameRate = 30;
// current game stage
var gameStage = "";

// game objects
var background = null;
var startStage = null;
var startScreen = null;
var colorStage = null;
var assemblyStage = null;
var blastOffStage = null;
var asteroidStage = null;
var cometStage = null;
var assetManager = null;
var spaceShip = null;

// ----------------------------------------------------------- private methods
function randomMe(low, high) {
    // returns a random number
	return Math.floor(Math.random() * (1 + high - low)) + low;
}

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");

    // we need to sniff out Android and iOS
    // so that we can hide the address bar in
    // our resize function
    /*
    var ua = navigator.userAgent.toLowerCase();
    android = ua.indexOf("android") > -1 ? true : false;
    ios = ( ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1  ) ? true : false;
    */

	// get reference to canvas
	canvas = document.getElementById("stage");
	// create stage object
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

    // is a touch screen supported?
    if (createjs.Touch.isSupported()) {
        console.log(">> mobile device detected");
        createjs.Touch.enable(stage);
        mobile = true;
    }

    // construct root container - this one is scaled to fit mobile device screen
    root = new createjs.Container();
    stage.addChild(root);



    // construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener("onAllAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);

    // initial resize of app to adjust for device screen size
    onResize();
}

function onResize(e) {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var bestFit = false;
    if (bestFit) {
        // !!!!!!!!!!!!! probably drop this bestfit approach since it stretches things bad
        // scale to exact fit
        stage.scaleX = w / BASE_WIDTH;
        stage.scaleY = h / BASE_HEIGHT;

        // adjust canvas size
        stage.canvas.width = BASE_WIDTH * stage.scaleX;
        stage.canvas.height = BASE_HEIGHT * stage.scaleY;
    } else {
        // keep aspect ratio
        scaleRatio = Math.min(w / BASE_WIDTH, h / BASE_HEIGHT);
        stage.scaleX = scaleRatio;
        stage.scaleY = scaleRatio;

        // adjust canvas size
        canvas.width = BASE_WIDTH * scaleRatio;
        canvas.height = BASE_HEIGHT * scaleRatio;
    }

    /*
    // we use a timeout here because some mobile
    // browsers don't fire if there is not
    // a short delay
    window.setTimeout(function() {
            window.scrollTo(0,1);
    }, 1);
    */

}

function onPause(e) {
    // ??????????????????????????????????????????????
    background.pauseMe();
    asteroidStage.pauseMe();
    createjs.Ticker.pause = true;
    createjs.Ticker.removeEventListener("tick", onTick);
}

function onResume(e) {
    // ??????????????????????????????????????????????
    background.unPauseMe();
    asteroidStage.unPauseMe();
    createjs.Ticker.pause = false;
    createjs.Ticker.addEventListener("tick", onTick);
}

function onSetup(e) {
    console.log(">> adding sprites to game");
	stage.removeEventListener("onAllAssetsLoaded", onSetup);

    // construct background (shared amongst all stages)
    background = new Background();
    background.showMe();

    // construct game objects
    spaceShip = new SpaceShip();
    startStage = new StartStage();
    assemblyStage = new AssemblyStage();
    colorStage = new ColorStage();
    blastOffStage = new BlastOffStage();
    asteroidStage = new AsteroidStage();
    cometStage = new CometStage();

    // setup event listeners for screen flow
    stage.addEventListener("onStageComplete", onStageComplete, true);

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener("tick", onTick);
    // listener for browser resize (on desktop) to resize game
    window.addEventListener("resize", onResize);
    // setup event listener for when browser loses focus
    window.addEventListener("blur", onPause);
    window.addEventListener("focus", onResume);

    startStage.showMe();
    gameStage = "start";

    console.log(">> game ready");
}

function onStartGame(e) {
    root.removeChild(startScreen);
    assemblyStage.showMe();
}

function onStageComplete(e) {

    console.log("stage complete: " + e.id);

    // event routing
    switch(e.id) {
        case "start":
            startStage.hideMe();
            assemblyStage.showMe();
            gameStage = "assembly";
            break;
        case "assembly":
            assemblyStage.hideMe();
            colorStage.showMe();
            gameStage = "color";
            break;
        case "color":
            colorStage.hideMe();
            blastOffStage.showMe();
            gameStage = "blastOff";
            break;
        case "blastOff":
            blastOffStage.hideMe();
            asteroidStage.showMe();
            gameStage = "asteroids";
            break;
        case "asteroids":
            asteroidStage.hideMe();
            cometStage.showMe();
            gameStage = "comet";
            break;
        case "comet":

            // ???????????

            break;

    }
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // game loop code here
	// ..

    if (gameStage === "asteroids") {
        background.updateMe();
        asteroidStage.updateMe();
    } else if (gameStage === "comet") {
        background.updateMe();
        cometStage.updateMe();
    }



    if (stageUpdateReq) {
        // update the stage!
        stage.update();
        // reset flag till next update required
        //stageUpdateReq = false;
    }
}

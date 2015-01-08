// Space Kids Game
// Sean Morrow
// Jan 2015

// TODO expert mode where you can color the ship outside the lines
// TODO get rid of address bar in browser on mobile devices

// the base width and height of game that graphics are designed for (pre-resizing for android screens)
var BASE_WIDTH = 960;
var BASE_HEIGHT = 640;
var scaleRatio = 1;
// am I running on a mobile device?
var mobile = false;


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
var gameContainer = null;

// frame rate of game
var frameRate = 60;

// game objects
var coloringStage = null;
var assetManager = null;

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");


    // is a touch screen supported?
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage);
        mobile = true;
    }


    /*
    RATIO = WIDTH / HEIGHT;
    currentWidth = WIDTH;
    currentHeight = HEIGHT;
    */
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

    // set canvas to as wide/high as the browser window
	canvas.width = BASE_WIDTH;
	canvas.height = BASE_HEIGHT;

	// create stage object
    stage = new createjs.Stage(canvas);


    gameContainer = new createjs.Container();
    stage.addChild(gameContainer);



    // construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener("onAllAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);

    // initial resize of app to adjust for device screen size
    onResize();
}

function onResize(e) {
    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;

    /*
    // resize the width in proportion
    // to the new height
    currentWidth = currentHeight * RATIO;
    */

    /*
    // this will create some extra space on the
    // page, allowing us to scroll past
    // the address bar, thus hiding it.
    if (android || ios) {
        document.body.style.height = (window.innerHeight + 50) + "px";
    }
    */

    // set the new canvas style width and height
    // our canvas is still 320 x 480, but
    // we're essentially scaling it with CSS
    canvas.width = currentWidth;
    canvas.height = currentHeight;


    // Determine scale ratio
    var widthRatio = canvas.width / BASE_WIDTH;
    var heightRatio = canvas.height / BASE_HEIGHT;
    // Use Math.min to constrain to the stage
    scaleRatio = Math.max(widthRatio, heightRatio);

    gameContainer.scaleX = gameContainer.scaleY = scaleRatio;


    /*
    // we use a timeout here because some mobile
    // browsers don't fire if there is not
    // a short delay
    window.setTimeout(function() {
            window.scrollTo(0,1);
    }, 1);
    */

}

function onSetup(e) {
    console.log(">> adding sprites to game");
	stage.removeEventListener("onAllAssetsLoaded", onSetup);


    coloringStage = new ColoringStage(assetManager, gameContainer);




    /*
    // setup event listeners for custom events for screen flow
    stage.addEventListener("onBetComplete", onBetComplete, true);
    stage.addEventListener("onChooseComplete", onChooseComplete, true);
    stage.addEventListener("onRaceComplete", onRaceComplete, true);
    stage.addEventListener("onSummaryComplete", onStartMe, true);
    */

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener("tick", onTick);


    window.addEventListener("resize", onResize);


    console.log(">> game ready");
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // game loop code here
	// ..





    // update the stage!
	stage.update();
}

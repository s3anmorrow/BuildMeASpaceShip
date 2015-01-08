// Space Kids Game
// Sean Morrow
// Jan 2015

// mobile canvas resizing variables
var WIDTH = 960;
var HEIGHT = 640;
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
var frameRate = 24;

// game objects
var colorScreen = null;
var assetManager = null;

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");


    // is a touch screen supported?
    if (createjs.Touch.isSupported()) {

        console.log("getting in here!");

        createjs.Touch.enable(stage);
        //mobile = true;
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
    window.addEventListener("resize", onResize);


	// get reference to canvas
	canvas = document.getElementById("stage");

    // set canvas to as wide/high as the browser window
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// create stage object
    stage = new createjs.Stage(canvas);


    gameContainer = new createjs.Container();
    stage.addChild(gameContainer);



    // construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener("onAllAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);


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
    // note: our canvas is still 320 x 480, but
    // we're essentially scaling it with CSS
    canvas.width = currentWidth;
    canvas.height = currentHeight;


    // Determine scale ratio
    var widthRatio = canvas.width / WIDTH;
    var heightRatio = canvas.height / HEIGHT;
    // Use Math.min to constrain to the stage
    var scaleRatio = Math.max(widthRatio,heightRatio);

    console.log("scaleRatio: " + scaleRatio);

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


    colorScreen = new ColorScreen(assetManager, gameContainer);




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

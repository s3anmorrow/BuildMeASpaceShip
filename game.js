// Build me a Space Ship!
// Sean Morrow
// Jan 2015

// TODO expert mode where you can color the ship outside the lines
// TODO build system so that stage.update() only happens when it needs to be
// TODO problem with astronaut entering cockpit
// TODO add quit button
// TODO Sound effect list
// TODO remove annonymous functions
// TODO get rid of extra asteroid

// TODO test release version of APK

// TODO fix issue with cordova media not working on android 5+

// the base width and height of game that graphics are designed for (pre-resizing for android screens)
var BASE_HEIGHT = 960;
var BASE_WIDTH = 640;
var scaleRatio = 1;
// am I running on a mobile device?
var mobile = false;
var mobileOS = null;

// flag to mark a stage update is needed
var stageUpdateReq = true;

// game variables
var stage = null;
var canvas = null;
// the main container for the game - is resized to device android screen resolutions
var root = null;

// frame rate of game
var frameRate = 30;
// include instructions?
var instructions = true;

// game objects
var background = null;
var spaceShip = null;
var startStage = null;
var instructStage = null;
var assemblyStage = null;
var colorStage = null;
var blastOffStage = null;
var asteroidStage = null;
var cometStage = null;
var astronautStage = null;

// screen flow control - populated when game loaded
var gameStages = [];
var gameStagesNoInstruct = [];
var gameStageIndex = 0;

// ----------------------------------------------------------- private methods
function randomMe(low, high) {
    // returns a random number
    return Math.floor(Math.random() * (1 + high - low)) + low;
}

// ------------------------------------------------------------ event handlers
function onInit(e) {
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

    // is a touch screen supported?
    if (createjs.Touch.isSupported()) {
        console.log(">> touch device detected");
        createjs.Touch.enable(stage,true,false);
    }
    // is this a mobile device and what type?
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/(android)/)) {
    //if (ua.match(/(iphone|ipod|ipad|android)/)) {
        mobile = true;
        console.log(">> device info: " + ua);
        // collect data about device OS
        if (ua.match(/android 5/)) mobileOS = "android 5";
        else if (ua.match(/android 4/)) mobileOS = "android 4";
        else mobileOS = "iOS";
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
    background.pauseMe();
    asteroidStage.pauseMe();
    createjs.Touch.disable(stage);

    // pauses all tweens
    createjs.Ticker.setPaused(true);
    createjs.Ticker.removeEventListener("tick", onTick);
}

function onResume(e) {
    background.unPauseMe();
    asteroidStage.unPauseMe();
    createjs.Touch.enable(stage,true,false);

    createjs.Ticker.setPaused(false);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onSetup(e) {
    console.log(">> adding sprites to game");
    stage.removeEventListener("onAllAssetsLoaded", onSetup);

    // construct background (shared amongst all gameStages)
    background = new Background();
    background.showMe();

    // construct spaceship
    spaceShip = new SpaceShip();

    // construct gameStage objects
    startStage = new StartStage();
    instructStage = new InstructStage();
    assemblyStage = new AssemblyStage();
    colorStage = new ColorStage();
    blastOffStage = new BlastOffStage();
    asteroidStage = new AsteroidStage();
    cometStage = new CometStage();
    astronautStage = new AstronautStage();
    // populate gameStages array
    gameStages = [startStage,instructStage,assemblyStage,colorStage,blastOffStage,instructStage,asteroidStage,instructStage,cometStage,astronautStage,instructStage];
    gameStagesNoInstruct = [assemblyStage,colorStage,blastOffStage,asteroidStage,cometStage,astronautStage,instructStage]
    //gameStages = [startStage,assemblyStage,astronautStage];

    // setup event listeners for screen flow
    stage.addEventListener("onStageComplete", onStageComplete, true);

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener("tick", onTick);
    // listener for browser resize (on desktop) to resize game
    window.addEventListener("resize", onResize);
    // setup event listener for when browser loses focus
    if (mobile) {
        document.addEventListener("pause", onPause);
        document.addEventListener("resume", onResume);
    } else {
        window.addEventListener("blur", onPause);
        window.addEventListener("focus", onResume);
    }

    // show the startStage
    gameStages[gameStageIndex].showMe();

    console.log(">> game ready");
    console.log(">> stage start - index: " + gameStageIndex);
}

function onStageComplete(e) {

    console.log(">> stage complete");

    if (gameStageIndex === (gameStages.length - 1)) {
        console.log("END OF GAME");

        // cleanup and resets
        gameStages[gameStageIndex].hideMe();
        gameStageIndex = 0;
        spaceShip.resetMe();
        // modify screen flow for remainder games
        gameStages = gameStagesNoInstruct;
        // play game again!
        gameStages[gameStageIndex].showMe();

    } else {

        // hide last stage screen
        gameStages[gameStageIndex].hideMe();
        // show next stage screen
        gameStageIndex++;
        gameStages[gameStageIndex].showMe();
    }

    console.log(">> stage start - index: " + gameStageIndex);
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = Math.floor(createjs.Ticker.getMeasuredFPS());

    // update any objects that need to know when a tick has occurred
    background.updateMe();
    asteroidStage.updateMe();
    cometStage.updateMe();
    astronautStage.updateMe();

    if (stageUpdateReq) {
        // update the stage!
        stage.update();
        // reset flag till next update required
        //stageUpdateReq = false;
    }
}

// ------------------------------------------------------ game entry point
if (mobile) {
    document.addEventListener("deviceready", onInit, false);
} else {
    window.addEventListener("load", onInit, false);
}

var CometStage = function() {

    // game stage constants
    var COMET_SPEED = 4;
    var COMET_COUNT = 5;

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var backgroundSprite = window.background.getSprite();

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);
    completeEvent.id = "comet";

    // comets ready to appear
    var ready = false;
    // number of comets dropped
    var cometCount = 0;
    // spaceship movement direction
    var moveDir = 0;


    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    // construct comet sprite
    var comet = assetManager.getSprite("assets","comet1");
    comet.active = false;

    // ------------------------------------------------- private methods
    function moveRight() {


    }


    // ------------------------------------------------- public methods
    this.showMe = function(){
        // show spaceship
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);
        spaceShip.activateTurret();

        // set background to move
        background.setMoving(true);

        // wire up event listeners
        backgroundSprite.addEventListener("mousedown", onStartSwipe);
        backgroundSprite.addEventListener("pressmove", onSwiping);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        cometCount = 0;
        moveDir = 0;
        backgroundSprite.removeEventListener("mousedown", onStartSwipe);
        backgroundSprite.removeEventListener("pressmove", onSwiping);
        comet.active = false;
        screen.removeChild(comet);
        root.removeChild(screen);
    };

    this.pauseMe = function() {
        //window.clearInterval(cometTimer);
    };

    this.unPauseMe = function() {
        //if (ready) cometTimer = window.setInterval(dropComet, cometFreq);
    };

    this.updateMe = function() {
        if (ready) {
            // update comet on the screen if active
            if (comet.active) {
                comet.y += comet.speed;
                // has the comet off the bottom of th screen?
                if (comet.y > BASE_HEIGHT + 110) {
                    comet.active = false;
                    screen.removeChild(comet);

                    if (cometCount >= COMET_COUNT) spaceShip.flyOffStage(onComplete);
                    else dropComet();
                }
            }

            // moving spaceship if required
            if (moveDir === 1) {
                // moving right
                if (!spaceShip.moveRight()) moveDir = 0;
            } else if (moveDir === -1) {
                // moving left
                if (!spaceShip.moveLeft()) moveDir = 0;
            }

        }
    };

    // ------------------------------------------------- event handler
    function onStartSwipe(e) {
        downX = stage.mouseX;
    }

    function onSwiping(e) {
        if (!downX) return;

        // calculating change in touch location
        var upY = stage.mouseY;

        var upX = stage.mouseX;
        var diffX = downX - upX;

        // is difference negative or positive?
        if (diffX > 0) {
            console.log("LEFT");
            moveDir = -1;
        } else {
            console.log("RIGHT");
            moveDir = 1;
        }
        // reset values
        downX = null;
    }

    function dropComet(e) {

        // setup comet
        comet.gotoAndPlay("comet" + randomMe(1,3));
        comet.y = -60;

        // ??????????????????????? adjust this to avoid overlap
        if (randomMe(1,2) === 1) comet.x = 100;
        else comet.x = 500;
        // ???????????????????????????????????

        comet.speed = COMET_SPEED;
        comet.active = true;
        comet.moving = true;
        screen.addChild(comet);

        cometCount++;

        /*
        // random rotation direction
        var dir = 1;
        if (randomMe(0,1) === 1) dir = -1;
        createjs.Tween.get(asteroid,{loop:true}).to({rotation: (360 * dir)}, randomMe(15,25) * 1000);
        */

    }


    function onReady(e) {
        ready = true;
        // drop comet right away
        dropComet();
    }

    function onComplete(e) {
        // kill all tweens
        //createjs.Tween.removeAllTweens();
        // stage is complete
        //screen.dispatchEvent(completeEvent);


        console.log("comet stage done!");

    }

};

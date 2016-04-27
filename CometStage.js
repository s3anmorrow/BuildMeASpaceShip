var CometStage = function() {

    // game stage constants
    var COMET_SPEED = 8;
    //var COMET_COUNT = 5;
    var COMET_COUNT = 1;

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var baseWidth = window.BASE_WIDTH;
    var baseHeight = window.BASE_HEIGHT;
    var backgroundSprite = window.background.getSprite();
    // width of stage on device
    var stageWidth = stage.canvas.width;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // comets ready to appear
    var ready = false;
    // number of comets dropped
    var cometCount = 0;
    // current X position of touch
    var touchX = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering comets
    var cometLayer = new createjs.Container();

    // construct comet sprite
    var comet = assetManager.getSprite("assets","comet1");
    comet.active = false;

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // show spaceship
        spaceShip.showMeOn(screen, 100, 970);
        spaceShip.flyOnStage(onReady);
        spaceShip.toggleTurret(false);

        // initialize touchX
        touchX = (192 * stageWidth) / baseWidth;

        // set background to move
        background.setMoving(true);

        // wire up event listeners
        backgroundSprite.addEventListener("mousedown", onMoving);
        backgroundSprite.addEventListener("pressmove", onMoving);

        // add comet layer on top of spaceship
        screen.addChild(cometLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        cometCount = 0;
        moveDir = 0;
        touchX = 0;
        comet.active = false;
        screen.removeChild(comet);
        root.removeChild(screen);
    };

    this.updateMe = function() {
        if (ready) {
            // update comet on the screen if active
            if (comet.active) {
                comet.y += comet.speed;

                // draw scorch marks on every fourth tick
                if ((createjs.Ticker.getTicks() % 4) == 0) spaceShip.scorchMe(comet, cometLayer);

                // has the comet gone off the bottom of the screen?
                if (comet.y > baseHeight + 220) {
                    comet.active = false;
                    screen.removeChild(comet);

                    if (cometCount >= COMET_COUNT) {
                        backgroundSprite.removeEventListener("mousedown", onMoving);
                        backgroundSprite.removeEventListener("pressmove", onMoving);
                        spaceShip.flyOffStage(onComplete);
                    } else {
                        dropComet();
                    }
                }
            }
            // moving spaceship if required
            spaceShip.moveMe(touchX);
        }
    };

    // ------------------------------------------------- event handler
    function onMoving(e) {
        touchX = e.stageX;
    }

    function dropComet(e) {

        // setup comet
        comet.gotoAndPlay("comet" + randomMe(1,3));
        comet.y = -150;

        // random horizontal positioning
        comet.x = randomMe(130,470);

        // setting comet properties
        comet.speed = COMET_SPEED;
        comet.active = true;
        comet.soundPlayed = false;
        screen.addChild(comet);
        assetManager.getSound("comet").play();

        cometCount++;
    }

    function onReady(e) {
        ready = true;
        // drop comet right away
        dropComet();
    }

    function onComplete(e) {
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

var CometStage = function() {

    // game stage constants
    var COMET_SPEED = 8;
    var COMET_COUNT = 5;

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var backgroundSprite = window.background.getSprite();

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
        touchX = spaceShip.getShipContainer().x + 92;

        // set background to move
        background.setMoving(true);

        // wire up event listeners
        backgroundSprite.addEventListener("mousedown", onMoving);
        backgroundSprite.addEventListener("pressmove", onMoving);

        // add laser and comet layer on top of spaceship
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
                if (comet.y > BASE_HEIGHT + 110) {
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
        var which = randomMe(1,3);
        if (which === 1) comet.x = 150 + randomMe(-20,20);
        else if (which === 2) comet.x = 300 + randomMe(-20,20);
        else comet.x = 450 + randomMe(-20,20);
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

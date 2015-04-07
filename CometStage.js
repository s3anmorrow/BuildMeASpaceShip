var CometStage = function() {

    // game stage constants
    var COMET_SPEED = 8;
    var COMET_COUNT = 1;

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
    // spaceship movement direction
    var moveDir = 0;

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

        // set background to move
        background.setMoving(true);

        // wire up event listeners
        backgroundSprite.addEventListener("mousedown", onStartSwipe);
        backgroundSprite.addEventListener("pressmove", onSwiping);

        // add laser and comet layer on top of spaceship
        screen.addChild(cometLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        cometCount = 0;
        moveDir = 0;
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
                        backgroundSprite.removeEventListener("mousedown", onStartSwipe);
                        backgroundSprite.removeEventListener("pressmove", onSwiping);
                        spaceShip.flyOffStage(onComplete);
                    } else {
                        dropComet();
                    }
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
        comet.y = -150;

        // random horizontal positioning
        if (randomMe(1,2) === 1) comet.x = 150 + randomMe(-20,20);
        else comet.x = 450 + randomMe(-20,20);
        // setting comet properties
        comet.speed = COMET_SPEED;
        comet.active = true;
        screen.addChild(comet);

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

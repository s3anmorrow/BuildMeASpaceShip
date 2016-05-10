var EnergyStage = function() {

    // game stage constants
    var ENERGY_SPEED = 8;
    var ENERGY_COUNT = 3;

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

    // energy balls ready to appear
    var ready = false;
    // number of energy balls dropped
    var energyCount = 0;
    // current X position of touch
    var touchX = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering energy balls
    var energyLayer = new createjs.Container();

    // construct energy sprite
    var energy = assetManager.getSprite("spacestuff2","energyYellow");
    energy.active = false;

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

        // add energy layer on top of spaceship
        screen.addChild(energyLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        energyCount = 0;
        moveDir = 0;
        touchX = 0;
        energy.active = false;
        screen.removeChild(energy);
        root.removeChild(screen);
    };

    this.updateMe = function() {
        if (ready) {
            // update energy on the screen if active
            if (energy.active) {
                energy.y += energy.speed;
                energy.rotation++;

                // check for pickup on every fourth tick
                if ((createjs.Ticker.getTicks() % 4) == 0) spaceShip.pickupMe(energy, energyLayer);

                // has the energy gone off the bottom of the screen?
                if (energy.y > baseHeight + 220) {
                    energy.active = false;
                    screen.removeChild(energy);

                    if (energyCount >= ENERGY_COUNT) {
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

        // setup energy
        energy.gotoAndPlay("energy" + randomMe(1,3));
        energy.y = -150;

        // random horizontal positioning
        energy.x = randomMe(130,470);

        // setting energy properties
        energy.speed = ENERGY_SPEED;
        energy.active = true;
        energy.soundPlayed = false;
        screen.addChild(energy);
        assetManager.getSound("energy").play();

        energyCount++;
    }

    function onReady(e) {
        ready = true;
        // drop energy right away
        dropComet();
    }

    function onComplete(e) {
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

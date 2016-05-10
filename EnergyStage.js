var EnergyStage = function() {

    // game stage constants
    var PICKUP_SPEED = 8;
    var PICKUP_MAX = 5;

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

    // pickup ready to appear
    var ready = false;
    // number of energy balls picked up
    var pickupCount = 0;
    // current X position of touch
    var touchX = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering pickup
    var pickupLayer = new createjs.Container();

    // construct pickup sprite
    var pickup = assetManager.getSprite("spacestuff2","energy1");
    pickup.bitmapText = new createjs.BitmapText("",assetManager.getSpriteSheet("interface"));
    pickup.bitmapText.letterSpacing = 2;
    pickup.active = false;
    // construct label sprite
    var label = assetManager.getSprite("interface","energy1Label");

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

        // add pickup layer on top of spaceship
        screen.addChild(pickupLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        pickupCount = 0;
        moveDir = 0;
        touchX = 0;
        pickup.active = false;
        screen.removeChild(pickup);
        root.removeChild(screen);
    };

    this.updateMe = function() {
        if (ready) {
            // update pickup on the screen if active
            if (pickup.active) {
                pickup.y += pickup.speed;
                pickup.rotation++;

                // collision detection for pickup on every fourth tick
                if ((createjs.Ticker.getTicks() % 4) == 0) {
                    // convert pickup x,y relative to shipContainer
                    var pickupPoint = pickupLayer.localToLocal(pickup.x, pickup.y, spaceShip.getShipContainer());

                    // only if pickup actually on fuselage
                    if ((pickupPoint.y > 0) && (pickupPoint.y < 400) && (pickupPoint.x > -36) && (pickupPoint.x < 212)) {
                        // display label
                        label.gotoAndStop(pickup.currentAnimation + "Label");
                        label.alpha = 1;
                        label.x = pickup.x - (label.getBounds().width / 2) - 4;
                        label.y = pickup.y - 44;
                        pickupLayer.addChild(label);
                        // tween bitmapText fading away
                        createjs.Tween.get(label).wait(500).to({alpha:0}, 500).call(onTextFaded);
                        
                        // play killed animation
                        pickup.gotoAndPlay(pickup.currentAnimation + "Killed");
                        pickup.addEventListener("animationend", onPickupKilled);
                        pickup.active = false;

                        assetManager.getSound("pickup").play();
                    }                    
                }

                // has the pickup gone off the bottom of the screen?
                if (pickup.y > baseHeight + 220) {
                    pickup.active = false;
                    screen.removeChild(pickup);
                    // time to drop another pickup?
                    if (pickupCount < PICKUP_MAX) dropPickup();
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

    function dropPickup(e) {
        // setup pickup
        pickup.gotoAndPlay("energy" + randomMe(1,3));
        pickup.y = -150;

        // random horizontal positioning
        pickup.x = randomMe(130,470);

        // setting pickup properties
        pickup.speed = PICKUP_SPEED;
        pickup.active = true;
        pickup.soundPlayed = false;
        screen.addChild(pickup);
        assetManager.getSound("pickupDrop").play();
    }
    
    function onTextFaded(e) {
        // remove label from screen
        pickupLayer.removeChild(e.target);
    }    
    
    function onPickupKilled(e) {
        pickupCount++;
        e.target.stop();
        e.target.removeAllEventListeners();
        createjs.Tween.removeTweens(e.target);
        pickupLayer.removeChild(e.target);
        //e.target.active = false;
        // end of stage?
        if (pickupCount >= PICKUP_MAX) {
            backgroundSprite.removeEventListener("mousedown", onMoving);
            backgroundSprite.removeEventListener("pressmove", onMoving);
            spaceShip.flyOffStage(onComplete);
        } else {
            dropPickup();
        }
    }    

    function onReady(e) {
        ready = true;
        // drop pickup right away
        dropPickup();
    }

    function onComplete(e) {
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

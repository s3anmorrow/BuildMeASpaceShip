var AstronautStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var background = window.background;
    var backgroundSprite = window.background.getSprite();
    var baseHeight = window.BASE_HEIGHT;
    var stageHeight = stage.canvas.height;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // screen ready
    var ready = false;
    // current Y position of touch
    var touchY = 0;
    var cockpitY = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    // screen sprites
    var astronaut = assetManager.getSprite("assets","astronautWaving");
    var instructions = assetManager.getSprite("assets","instructBubble10",50,150,false);

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // position and show spaceShip on screen
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);

        // add astronaut to screen (off top)
        astronaut.x = 337;
        astronaut.y = 150;
        astronaut.gotoAndPlay("astronautWaving");
        screen.addChild(astronaut);

        // hard code touch on screen so astronaut is moved in automatically
        touchY = (astronaut.y * stageHeight) / baseHeight;

        // animate astronaut hovering in space
        createjs.Tween.get(astronaut,{loop:true}).to({x:astronaut.x - 20}, 4000).to({x:astronaut.x}, 4000);

        // set background to stop moving
        background.setMoving(false);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        astronaut.stop();
        touchY = 0;
        cockpitY = 0;
        createjs.Tween.removeAllTweens();

        root.removeChild(screen);
    };

    this.updateMe = function() {
        if (ready) {
            var destY = (touchY/stageHeight) * baseHeight;
            // check if any movement required
            var dif = astronaut.y - destY;
            if ((dif > -6) && (dif < 6)) return;
            // move astronaut
            if (astronaut.y < destY) {
                astronaut.y += 6;
            } else {
                astronaut.y -= 6;
            }

            // have I reached the cockpit?
            if (astronaut.y > cockpitY) {
                // close cockpit
                spaceShip.toggleCockpit(false);
                // remove astronaut
                screen.removeChild(astronaut);
                spaceShip.toggleThrust(true);
                spaceShip.flyOffStage(onComplete);
                backgroundSprite.removeEventListener("mousedown", onStartMoveAstronaut);
                backgroundSprite.removeEventListener("pressmove", onMoveAstronaut);
                ready = false;
            }
        }
    };

    // ------------------------------------------------- event handler
    function onStartMoveAstronaut(e) {
        assetManager.getSound("saveAstronaut").play();
    }

    function onMoveAstronaut(e) {
        touchY = e.stageY;
        screen.removeChild(instructions);
    }

    function onReady(e) {
        ready = true;
        // open the cockpit on spaceship
        spaceShip.toggleCockpit(true);
        // turn off spaceship thrust
        spaceShip.toggleThrust(false);

        screen.addChild(instructions);

        // determine cockpit location scaled to device screen size
        cockpitY = ((spaceShip.getCockpitLocation() - 10)/stageHeight) * baseHeight;

        // wire up event listener
        backgroundSprite.addEventListener("mousedown", onStartMoveAstronaut);
        backgroundSprite.addEventListener("pressmove", onMoveAstronaut);
    }

    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

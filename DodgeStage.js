var DodgeStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var backgroundSprite = window.background.getSprite();

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);
    completeEvent.id = "dodge";

    // comets ready to appear
    var ready = false;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // show spaceship
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);

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
        backgroundSprite.removeEventListener("mousedown", onStartSwipe);
        backgroundSprite.removeEventListener("pressmove", onSwiping);

        root.removeChild(screen);
    };

    this.pauseMe = function() {
        //window.clearInterval(asteroidTimer);
    };

    this.unPauseMe = function() {
        //if (ready) asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);
    };

    this.updateMe = function() {
        if (ready) {


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

        } else {
            console.log("RIGHT");

        }
        // reset values
        downX = null;
    }


    function onReady(e) {
        ready = true;
    }

    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

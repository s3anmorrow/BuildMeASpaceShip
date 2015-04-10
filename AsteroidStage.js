var AsteroidStage = function() {

    // game stage constants
    var ASTEROID_SPEED = 4;
    //var ASTEROID_COUNT = 10;
    var ASTEROID_COUNT = 4;
    var ASTEROID_MAX = 2

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var background = window.background;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // asteroids ready to appear
    var ready = false;
    // timer for asteroids to drop
    var asteroidTimer = null;
    var asteroidFreq = 1500;
    // kill counter
    var killCount = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering asteroids
    var asteroidLayer = new createjs.Container();

    // create pool of asteroids
    var asteroids = [];
    for (var n=0; n<ASTEROID_MAX; n++) {
        var asteroid = assetManager.getSprite("assets","asteroid1");
        asteroid.bitmapText = new createjs.BitmapText("",assetManager.getSpriteSheet("assets"));
        asteroid.active = false;
        asteroid.moving = false;
        asteroids.push(asteroid);
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // show spaceship
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);
        spaceShip.toggleTurret(true);

        // set background to move
        background.setMoving(true);

        // game stage initialization
        killCount = 0;

        // add laser and asteroid layer on top of spaceship
        screen.addChild(asteroidLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        window.clearInterval(asteroidTimer);
        spaceShip.toggleTurret(false);
        for (var n=0; n<ASTEROID_MAX; n++) {
            var asteroid = asteroids[n];
            asteroid.active = false;
            asteroid.removeAllEventListeners();
            asteroidLayer.removeChild(asteroid);
        }
        root.removeChild(screen);
    };

    this.pauseMe = function() {
        window.clearInterval(asteroidTimer);
    };

    this.unPauseMe = function() {
        if (ready) asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);
    };

    this.updateMe = function() {
        if (ready) {
            // loop through all asteroids in pool
            for (var n=0; n<ASTEROID_MAX; n++) {
                if (asteroids[n].moving) {
                    var asteroid = asteroids[n];
                    asteroid.y += ASTEROID_SPEED;
                    // is the asteroid off the bottom of the screen?
                    if (asteroid.y > BASE_HEIGHT + 110) {
                        asteroid.active = false;
                        asteroid.moving = false;
                        asteroid.removeAllEventListeners();
                        asteroidLayer.removeChild(asteroid);
                    }
                }
            }
        }
    };

    // ------------------------------------------------- event handler
    function onDropAsteroid(e) {

        // find free asteroid that isn't currently active
        for (var n=0; n<ASTEROID_MAX; n++) {
            if (!asteroids[n].active) {
                var asteroid = asteroids[n];
                asteroid.gotoAndPlay("asteroid" + randomMe(1,3));
                asteroid.y = -85;

                // ??????????????????????? adjust this to avoid overlap
                if ((n % 2) === 0) asteroid.x = randomMe(100,200);
                else asteroid.x = randomMe(400,500);
                // ???????????????????????????????????

                asteroid.active = true;
                asteroid.moving = true;
                asteroid.addEventListener("mousedown", onFireLaser);
                asteroidLayer.addChild(asteroid);

                // random rotation direction
                var dir = 1;
                if (randomMe(0,1) === 1) dir = -1;
                createjs.Tween.get(asteroid,{loop:true}).to({rotation: (360 * dir)}, randomMe(15,25) * 1000);

                break;
            }
        }

    }

    function onFireLaser(e) {
        var asteroid = e.target;
        asteroid.removeEventListener("mousedown", onFireLaser);
        spaceShip.fireMe(asteroid, asteroidLayer);

        // play killed animation
        asteroid.gotoAndPlay(asteroid.currentAnimation + "Killed");
        asteroid.addEventListener("animationend", onAsteroidKilled);
        asteroid.moving = false;

        // setup bitmapText
        killCount++;
        var bitmapText = asteroid.bitmapText;
        bitmapText.text = String(killCount);
        bitmapText.alpha = 1;
        bitmapText.x = asteroid.x - (bitmapText.getBounds().width / 2) - 4;
        bitmapText.y = asteroid.y - 44;
        asteroidLayer.addChild(bitmapText);
        // tween bitmapText fading away
        createjs.Tween.get(bitmapText).wait(500).to({alpha:0}, 500).call(onTextFaded);

        assetManager.getSound("laser").play();
        assetManager.getSound("asteroidExplode").play();
    }

    function onAsteroidKilled(e) {
        e.target.stop();
        e.target.removeAllEventListeners();
        createjs.Tween.removeTweens(e.target);
        asteroidLayer.removeChild(e.target);
        e.target.active = false;
        // end of stage?
        if (killCount >= ASTEROID_COUNT) {
            window.clearInterval(asteroidTimer);
            // kill all listeners so user can't shoot an asteroid while flying off stage
            for (var n=0; n<ASTEROID_MAX; n++) asteroids[n].removeAllEventListeners();
            spaceShip.flyOffStage(onComplete);
        }
    }

    function onTextFaded(e) {
        // remove BitmapText from screen
        asteroidLayer.removeChild(e.target);
    }

    function onReady(e) {
        ready = true;
        // start timer to drop asteroids now that spaceship has flown onto screen
        asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);
        // drop asteroid right away
        onDropAsteroid();
    }

    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

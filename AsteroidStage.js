var AsteroidStage = function() {

    // TODO adjust code so no two asteroids EVER overlap

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);
    completeEvent.id = "asteroids";

    // asteroids ready to appear
    var ready = false;
    // number of asteroids
    var asteroidNumber = 20;
    // timer for asteroids to drop
    var asteroidTimer = null;
    var asteroidFreq = 1500;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering asteroids
    var asteroidLayer = new createjs.Container();
    // shape to draw laser beam on
    var laserLayer = new createjs.Shape();

    var asteroidIndex = 0;
    var asteroids = [];
    for (var n=0; n<asteroidNumber; n++) {
        var asteroid = assetManager.getSprite("assets","asteroid1");
        asteroid.addEventListener("mousedown", onFireLaser);
        asteroids.push(asteroid);
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){

        // show spaceship
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);

        // set background to move
        background.setMoving(true);

        // game stage initialization
        ready = false;
        // reset asteroids
        for (var n=0; n<asteroidNumber; n++) {
            var asteroid = asteroids[n];
            asteroid.gotoAndPlay("asteroid" + randomMe(1,3));
            asteroid.y = -100;
            if ((n % 2) === 0) asteroid.x = randomMe(10,184);
            else asteroid.x = randomMe(340,504);
            asteroid.speed = randomMe(5,10);
            asteroid.active = false;
        }

        // add laser and asteroid layer on top of spaceship
        screen.addChild(asteroidLayer);
        screen.addChild(laserLayer);

        root.addChild(screen);

        // drop asteroid right away
        onDropAsteroid();
    };

    this.hideMe = function(){
        // cleanup
        for (var n=0; n<asteroidNumber; n++) screen.removeChild(asteroids[n]);


        root.removeChild(screen);
    };

    this.pauseMe = function() {
        window.clearInterval(asteroidTimer);
    };

    this.unPauseMe = function() {
        asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);
    };

    this.updateMe = function() {
        if (ready) {
            console.log("updating asteroidStage");


            for (var n=0; n<asteroidNumber; n++) {

                if (asteroids[n].active) {

                    asteroids[n].y += asteroids[n].speed;

                }


            }


        }
    };

    // ------------------------------------------------- event handler
    function onDropAsteroid(e) {
        if (asteroidIndex >= asteroidNumber) return;
        asteroidLayer.addChild(asteroids[asteroidIndex]);
        asteroids[asteroidIndex].active = true;

        // random rotation direction
        var dir = 1;
        if (randomMe(0,1) === 1) dir = -1;
        createjs.Tween.get(asteroids[asteroidIndex],{loop:true}).to({rotation: (360 * dir)}, randomMe(15,25) * 1000);

        asteroidIndex++;
    }

    function onFireLaser(e) {
        var asteroid = e.target;
        spaceShip.fireMe(asteroid, asteroidLayer);
        // play killed animation
        asteroid.gotoAndPlay(asteroid.currentAnimation + "Killed");
        asteroid.addEventListener("animationend",onAsteroidKilled);
        asteroid.active = false;

    }

    function onAsteroidKilled(e) {
        e.target.stop();
        asteroidLayer.removeChild(e.target);
        // end of stage?
        if (asteroidIndex >= asteroidNumber) {

            console.log("END OF ASTEROID STAGE!");

            spaceShip.flyOffStage();

        }
    }

    function onReady(e) {
        ready = true;
        // start timer to drop asteroids
        asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);
    }

};

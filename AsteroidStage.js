var AsteroidStage = function() {

    // TODO scroll background stars to simulate flying through space

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);
    completeEvent.id = "asteroids";

    // asteroids ready to appear
    var ready = false;
    // timer for asteroids to drop
    var asteroidTimer = null;
    var asteroidFreq = 5000;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var asteroidIndex = 0;
    var asteroids = [];
    for (var n=0; n<10; n++) {
        var asteroid = assetManager.getSprite("assets","asteroid1");
        asteroid.addEventListener("mousedown", onPopAsteroid);
        asteroids.push(asteroid);
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // show spaceship
        //spaceShip.shrinkMe();
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);

        // set background to move
        background.setMoving(true);

        // game stage initialization
        ready = false;
        // reset asteroids
        for (var n=0; n<10; n++) {
            asteroids[n].gotoAndStop("asteroid" + randomMe(1,4));
            asteroids[n].y = -100;
            asteroids[n].x = 10;
            asteroids[n].speed = randomMe(1,4);
            asteroids[n].active = false;
        }

        root.addChild(screen);
    };

    this.hideMe = function(){

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


            for (var n=0; n<10; n++) {

                if (asteroids[n].active) {

                    asteroids[n].y += asteroids[n].speed;

                }


            }


        }
    };

    // ------------------------------------------------- event handler
    function onDropAsteroid(e) {
        if (asteroidIndex >= 10) return;
        screen.addChild(asteroids[asteroidIndex]);
        asteroids[asteroidIndex].active = true;
        asteroidIndex++;
    };

    function onPopAsteroid(e) {

        console.log("pop " + e.target);

        var asteroid = e.target;
        // !!!!!!!!!!!!!!!!!
        // play popping animation
        screen.removeChild(asteroid);
        asteroid.active = false;

    };

    function onReady(e) {

        console.log("ready!");
        ready = true;

        // start timer to drop asteroids
        asteroidTimer = window.setInterval(onDropAsteroid, asteroidFreq);

    }

};

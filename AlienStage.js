var AlienStage = function() {

    // game stage constants
    var ALIEN_SPEED = 4;
    var ALIEN_MAX = 10;
    //var ALIEN_MAX = 3;
    var ALIEN_POOL_MAX = 3;

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var background = window.background;
    var baseHeight = window.BASE_HEIGHT;
    var stageHeight = stage.canvas.height;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // aliens ready to appear
    var ready = false;
    // timer for aliens to drop
    var alienTimer = null;
    var alienFreq = 1500;
    var alienCount = 0;
    // kill counter
    var killCount = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering aliens
    var alienLayer = new createjs.Container();

    // create pool of aliens
    var aliens = [];
    for (var n=0; n<ALIEN_POOL_MAX; n++) {
        var alien = assetManager.getSprite("assets","alienUp");
        alien.bitmapText = new createjs.BitmapText("",assetManager.getSpriteSheet("assets"));
        alien.bitmapText.letterSpacing = 2;
        alien.active = false;
        alien.moving = false;
        alien.direction = 1;
        aliens.push(alien);
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
        alienCount = 0;

        // add laser and alien layer on top of spaceship
        screen.addChild(alienLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        window.clearInterval(alienTimer);
        spaceShip.toggleTurret(false);
        for (var n=0; n<ALIEN_POOL_MAX; n++) {
            var alien = aliens[n];
            alien.active = false;
            alien.removeAllEventListeners();
            alienLayer.removeChild(alien);
        }
        root.removeChild(screen);
    };

    this.pauseMe = function() {
        window.clearInterval(alienTimer);
    };

    this.unPauseMe = function() {
        if (ready) alienTimer = window.setInterval(onDropAlien, alienFreq);
    };

    this.updateMe = function() {
        if (ready) {
            // loop through all aliens in pool
            for (var n=0; n<ALIEN_POOL_MAX; n++) {
                if (aliens[n].moving) {
                    var alien = aliens[n];
                    if (alien.direction === 1) {
                        alien.y += ALIEN_SPEED;
                        // is the alien off the bottom/top of the screen?
                        if (alien.y > baseHeight + 110) removeAlien(alien);
                    } else {
                        alien.y -= ALIEN_SPEED;
                        // is the alien off the bottom/top of the screen?
                        if (alien.y < -110) removeAlien(alien);
                    }
                }
            }
        }
    };
    
    // ------------------------------------------------- private methods
    function removeAlien(alien){
        alien.active = false;
        alien.moving = false;
        alien.direction = 1;
        alien.removeAllEventListeners();
        alienLayer.removeChild(alien);
        alienCount--;
    }

    // ------------------------------------------------- event handler
    function onDropAlien(e) {

        // if at the max then don't drop anymore
        if (alienCount >= ALIEN_MAX) return;

        // find free alien that isn't currently active
        for (var n=0; n<ALIEN_POOL_MAX; n++) {
            if (!aliens[n].active) {
                var alien = aliens[n];
                
                // random direction - moving down by default
                alien.direction = 1;
                alien.y = -50;
                alien.gotoAndPlay("alienDown");
                if (randomMe(0,1) === 1) {
                    // moving up
                    alien.gotoAndPlay("alienUp");
                    alien.direction = -1;
                    alien.y = baseHeight + 110;
                }

                // ??????????????????????? adjust this to avoid overlap
                if ((n % 2) === 0) alien.x = randomMe(100,200);
                else alien.x = randomMe(400,500);
                // ???????????????????????????????????

                alien.active = true;
                alien.moving = true;
                alien.addEventListener("mousedown", onFireLaser);
                alienLayer.addChild(alien);
                alienCount++;

                break;
            }
        }
    }

    function onFireLaser(e) {
        var alien = e.target;
        alien.removeEventListener("mousedown", onFireLaser);
        spaceShip.fireMe(alien, alienLayer);

        // play killed animation
        alien.gotoAndPlay("alienKilled");
        alien.addEventListener("animationend", onAlienKilled);
        alien.moving = false;

        // setup bitmapText and display up or down message according to where alien is in relation to cockpit
        var bitmapText = alien.bitmapText;
        //var alienY = (alien.y * stageHeight) / baseHeight;
        if (alien.y < (baseHeight/2)) bitmapText.text = "u";
        else bitmapText.text = "d";
        
        bitmapText.alpha = 1;
        bitmapText.x = alien.x - (bitmapText.getBounds().width / 2) - 4;
        bitmapText.y = alien.y - 44;
        alienLayer.addChild(bitmapText);
        // tween bitmapText fading away
        createjs.Tween.get(bitmapText).wait(500).to({alpha:0}, 500).call(onTextFaded);

        assetManager.getSound("laser").play();
        assetManager.getSound("asteroidExplode").play();
    }

    function onAlienKilled(e) {
        killCount++;
        assetManager.getSound("alienDie").play();
        e.target.stop();
        e.target.removeAllEventListeners();
        createjs.Tween.removeTweens(e.target);
        alienLayer.removeChild(e.target);
        e.target.active = false;
        // end of stage?
        if (killCount >= ALIEN_MAX) {
            window.clearInterval(alienTimer);
            // kill all listeners so user can't shoot an alien while flying off stage
            for (var n=0; n<ALIEN_POOL_MAX; n++) aliens[n].removeAllEventListeners();
            spaceShip.flyOffStage(onComplete);
        }
    }

    function onTextFaded(e) {
        // remove BitmapText from screen
        alienLayer.removeChild(e.target);
    }

    function onReady(e) {
        ready = true;
        // start timer to drop aliens now that spaceship has flown onto screen
        alienTimer = window.setInterval(onDropAlien, alienFreq);
        // drop alien right away
        onDropAlien();
    }

    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

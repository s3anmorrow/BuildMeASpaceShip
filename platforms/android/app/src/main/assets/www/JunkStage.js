var JunkStage = function() {

    // game stage constants
    var JUNK_SPEED = 4;
    var JUNK_MAX = 20;
    var JUNK_POOL_MAX = 4;

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var randomMe = window.randomMe;
    var background = window.background;
    var baseHeight = window.BASE_HEIGHT;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // spaceJunk ready to appear
    var ready = false;
    // timer for spacejunk to drop
    var junkCount = 0;
    // kill counter
    var killCount = 0;
    var typeCounter = 1;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    // container for layering spaceJunk
    var junkLayer = new createjs.Container();

    // create pool of space junk
    var spaceJunk = [];
    for (var n=0; n<JUNK_POOL_MAX; n++) {
        var junk = assetManager.getSprite("spacestuff2","spaceJunk1");
        junk.bitmapText = new createjs.BitmapText("",assetManager.getSpriteSheet("interface"));
        junk.bitmapText.letterSpacing = 2;
        junk.active = false;
        junk.moving = false;
        spaceJunk.push(junk);
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){

        console.log("showing junk stage");

        // show spaceship
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);
        spaceShip.toggleTurret(true);

        // set background to move
        background.setMoving(true);

        // game stage initialization
        killCount = 0;
        junkCount = 0;

        // add laser and junk layer on top of spaceship
        screen.addChild(junkLayer);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        spaceShip.toggleTurret(false);
        for (var n=0; n<JUNK_POOL_MAX; n++) {
            var junk = spaceJunk[n];
            junk.active = false;
            junk.removeAllEventListeners();
            junkLayer.removeChild(junk);
        }
        root.removeChild(screen);
    };

    this.pauseMe = function() {
    };

    this.unPauseMe = function() {
    };

    this.updateMe = function() {
        if (ready) {
            // loop through all spaceJunk in pool
            for (var n=0; n<JUNK_POOL_MAX; n++) {
                if (spaceJunk[n].moving) {
                    var junk = spaceJunk[n];
                    junk.y += JUNK_SPEED;
                    // is the junk off the bottom of the screen - loop it around
                    if (junk.y > baseHeight + 110) {
                        junk.y = -85;
                    }
                }
            }
        }
    };

    function dropSpaceJunk() {

        // if at the max then don't drop anymore
        if (junkCount >= JUNK_MAX) return;

        // find two free spacejunks that aren't currently active
        for (var i=0; i<2; i++) {
            for (var n=0; n<JUNK_POOL_MAX; n++) {
                if (!spaceJunk[n].active) {
                    var junk = spaceJunk[n];
                    junk.gotoAndPlay("spaceJunk" + typeCounter);
                    typeCounter++;
                    if (typeCounter > 7) typeCounter = 1;
                    junk.y = -85;

                    // adjust this to avoid overlap
                    if (i == 0) junk.x = randomMe(100,250);
                    else junk.x = randomMe(350,500);

                    junk.active = true;
                    junk.moving = true;
                    junk.addEventListener("mousedown", onFireLaser);
                    junkLayer.addChild(junk);
                    junkCount++;

                    // random rotation direction
                    var dir = 1;
                    if (randomMe(0,1) === 1) dir = -1;
                    createjs.Tween.get(junk,{loop:true}).to({rotation: (360 * dir)}, randomMe(15,25) * 1000);

                    break;
                }
            }
        }
    }

    // ------------------------------------------------- event handler
    function onFireLaser(e) {
        var junk = e.target;
        junk.removeEventListener("mousedown", onFireLaser);
        spaceShip.fireMe(junk, junkLayer);

        // play killed animation
        junk.gotoAndPlay(junk.currentAnimation + "Killed");
        junk.addEventListener("animationend", onSpaceJunkKilled);
        junk.moving = false;

        // setup bitmapText
        if ((killCount + 1) % 2 == 0) {
            var bitmapText = junk.bitmapText;
            bitmapText.text = String(killCount + 1);
            bitmapText.alpha = 1;
            bitmapText.x = junk.x - (bitmapText.getBounds().width / 2) - 4;
            bitmapText.y = junk.y - 44;
            junkLayer.addChild(bitmapText);
            // tween bitmapText fading away
            createjs.Tween.get(bitmapText).wait(500).to({alpha:0}, 500).call(onTextFaded);
        }

        assetManager.getSound("laser").play();
        assetManager.getSound("asteroidExplode").play();
    }

    function onSpaceJunkKilled(e) {
        killCount++;
        e.target.stop();
        e.target.removeAllEventListeners();
        createjs.Tween.removeTweens(e.target);
        junkLayer.removeChild(e.target);
        e.target.active = false;

        // end of stage?
        if (killCount >= JUNK_MAX) {
            // kill all listeners so user can't shoot an junk while flying off stage
            for (var n=0; n<JUNK_POOL_MAX; n++) spaceJunk[n].removeAllEventListeners();
            spaceShip.flyOffStage(onComplete);
        } else if ((killCount % 2) == 0) {
            dropSpaceJunk();
        }
    }

    function onTextFaded(e) {
        // remove BitmapText from screen
        junkLayer.removeChild(e.target);
    }

    function onReady(e) {
        ready = true;
        // drop junk right away
        dropSpaceJunk();
    }

    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};

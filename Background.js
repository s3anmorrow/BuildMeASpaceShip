var Background = function(){
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;

    // timer for twinkling stars
    var twinkleTimer = null;
    var twinkleFreq = 0;
    // whether stars are moving
    var moving = false;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var background = assetManager.getSprite("assets","background",0,0,false);
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var starField1 = assetManager.getSprite("assets","starField",0,0,false);
    var starField2 = assetManager.getSprite("assets","starField",0,0,false);
    starField2.y = -960;
    screen.addChild(starField2);
    screen.addChild(starField1);

    // twinkle stars only when background not moving
    var twinkleStars = [];
    for (var n=0; n<10; n++) {
        var star = assetManager.getSprite("assets","star");
        star.x = randomMe(10,630);
        star.y = randomMe(10,950);
        screen.addChild(star);
        twinkleStars[n] = star;
    }

    // get a bunch of stars twinkling right off the start
    onTwinkle();
    onTwinkle();
    onTwinkle();
    onTwinkle();

    // ------------------------------------------------- get/set methods
    this.getSprite = function(){
        return background;
    };

    this.setMoving = function(value) {
        moving = value;
        if (moving) {
            for (var n=0; n<10; n++) screen.removeChild(twinkleStars[n]);
        } else {
            for (var n=0; n<10; n++) screen.addChild(twinkleStars[n]);
        }
    };

    // ------------------------------------------------- public methods
    this.showMe = function(){
        twinkleTimer = window.setInterval(onTwinkle, 200);
        root.addChild(screen);
    };

    this.hideMe = function(){
        window.clearInterval(twinkleTimer);
        root.removeChild(screen);
    };

    this.pauseMe = function() {
        window.clearInterval(twinkleTimer);
    };

    this.unPauseMe = function() {
        twinkleTimer = window.setInterval(onTwinkle, 200);
    };

    this.updateMe = function() {
        if (moving) {
            // moving starfield down stage
            starField1.y+=4;
            starField2.y+=4;
            if (starField1.y > 960) {
                starField1.y = -960;
            } else if (starField2.y > 960) {
                starField2.y = -960;
            }
        }
    };

    // ------------------------------------------------- event handlers
    function onTwinkle(e) {
        var index = randomMe(0,9);
        twinkleStars[index].addEventListener("animationend", onStarAnimationEnd);
        twinkleStars[index].play();
    }

    function onStarAnimationEnd(e) {
        e.target.gotoAndStop("star");
        e.remove();
    };

};

var Background = function(){
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var baseWidth = window.BASE_WIDTH;
    var baseHeight = window.BASE_HEIGHT;

    // timer for twinkling stars
    var twinkleTimer = null;
    var twinkleFreq = 0;
    // whether stars are moving
    var moving = false;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var backgroundLayer = new createjs.Container();
    var starFieldLayer = new createjs.Container();
    var twinkleLayer = new createjs.Container();

    var background = assetManager.getSprite("assets","background",0,0,false);
    backgroundLayer.addChild(background);
    backgroundLayer.cache(0, 0, BASE_WIDTH, BASE_HEIGHT);

    var starField1 = assetManager.getSprite("assets","starField",0,0,false);
    var starField2 = assetManager.getSprite("assets","starField",0,0,false);
    starField1.y = -960;
    starFieldLayer.addChild(starField1);
    starFieldLayer.addChild(starField2);
    starFieldLayer.cache(0, -960, BASE_WIDTH, BASE_HEIGHT * 2);

    // twinkle stars only when background not moving
    var twinkleStars = [];
    for (var n=0; n<10; n++) {
        var star = assetManager.getSprite("assets","star");
        star.x = randomMe(10,630);
        star.y = randomMe(10,950);
        twinkleLayer.addChild(star);
        twinkleStars[n] = star;
    }

    screen.addChild(backgroundLayer);
    screen.addChild(starFieldLayer);
    screen.addChild(twinkleLayer);

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
        if (moving) screen.removeChild(twinkleLayer);
        else screen.addChild(twinkleLayer);
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
            starFieldLayer.y+=2;
            if (starFieldLayer.y >= 960) {
                starFieldLayer.y = 0;
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

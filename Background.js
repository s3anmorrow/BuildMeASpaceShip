var Background = function(){
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;

    // timer for twinkling stars
    var twinkleTimer = null;
    var twinkleFreq = 0;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var background = assetManager.getSprite("assets");
    background.gotoAndStop("starBackground");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var stars = [];
    for (var n=0; n<100; n++) {
        var star = assetManager.getSprite("assets","star");
        star.x = randomMe(10,630);
        star.y = randomMe(10,950);
        screen.addChild(star);
        stars[n] = star;
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
    }

    this.unPauseMe = function() {
        twinkleTimer = window.setInterval(onTwinkle, 200);
    }

    // ------------------------------------------------- event handlers
    function onTwinkle(e) {
        var index = randomMe(0,99);
        stars[index].addEventListener("animationend", onStarAnimationEnd);
        stars[index].play();
    }

    function onStarAnimationEnd(e) {
        e.target.gotoAndStop("star");
        e.remove();
    };

};

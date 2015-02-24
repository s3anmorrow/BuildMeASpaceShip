var BlastOffStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onBlastOffComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var background = assetManager.getSprite("assets");
    background.gotoAndStop("screenAssembly");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    // the spaceship sprite
    var spaceShipSprite = spaceShip.getSprite();

    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 444;
    btnOk.y = 530;
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);


    // ------------------------------------------------- public methods
    this.showMe = function(){

        // position spaceShip on screen
        spaceShipSprite.x = 100;
        spaceShipSprite.y = 100;
        screen.addChild(spaceShipSprite);


        root.addChild(screen);
    };

    this.hideMe = function(){

        root.removeChild(screen);
    };

    // ------------------------------------------------- event handler
    function onOk(e) {
        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");
        } else {
            btnOk.gotoAndStop("btnOkUp");
            // stage is complete
            //screen.dispatchEvent(completeEvent);
        }
    }

};

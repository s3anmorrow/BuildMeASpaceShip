var FlightStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onFlightComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var background = assetManager.getSprite("assets");
    background.gotoAndStop("screenBlastOff");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 444;
    btnOk.y = 530;
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);


    // ------------------------------------------------- public methods
    this.showMe = function(){

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

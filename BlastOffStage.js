var BlastOffStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onBlastOffComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var ground = assetManager.getSprite("assets","ground");
    ground.y = 853;
    screen.addChild(ground);

    // the spaceship sprite
    var spaceShipSprite = spaceShip.getSprite();

    var btnGo = assetManager.getSprite("assets","btnGoUp");
    btnGo.x = 100;
    btnGo.y = 100;
    btnGo.addEventListener("mousedown", onOk);
    btnGo.addEventListener("pressup", onOk);
    screen.addChild(btnGo);


    // ------------------------------------------------- public methods
    this.showMe = function(){
        // position spaceShip on screen
        spaceShipSprite.x = 235;
        spaceShipSprite.y = BASE_HEIGHT - spaceShipSprite.getBounds().height - 67;
        screen.addChild(spaceShipSprite);

        root.addChild(screen);
    };

    this.hideMe = function(){

        root.removeChild(screen);
    };

    // ------------------------------------------------- event handler
    function onOk(e) {
        if (e.type === "mousedown") {
            btnGo.gotoAndStop("btnGoDown");
        } else {
            btnGo.gotoAndStop("btnGoUp");
            // stage is complete
            //screen.dispatchEvent(completeEvent);
        }
    }

};

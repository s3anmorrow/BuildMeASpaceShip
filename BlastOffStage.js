var BlastOffStage = function() {

    // TODO add shadow from spaceship
    // TODO make trees vibrate when spaceship blasts off

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);
    completeEvent.id = "blastOff";

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var ground = assetManager.getSprite("assets","ground");
    ground.y = 853;
    screen.addChild(ground);

    var countDownIndex = 5;
    var countDown = [];
    countDown[5] = assetManager.getSprite("assets","countdown5", 271, -160);
    countDown[4] = assetManager.getSprite("assets","countdown4", 271, -160);
    countDown[3] = assetManager.getSprite("assets","countdown3", 271, -160);
    countDown[2] = assetManager.getSprite("assets","countdown2", 271, -160);
    countDown[1] = assetManager.getSprite("assets","countdown1", 271, -160);
    countDown[0] = assetManager.getSprite("assets","countdownBlastOff", 150, -240);

    // the spaceship sprite
    var spaceShipSprite = spaceShip.getSprite();

    var btnGo = assetManager.getSprite("assets","btnGoUp");
    btnGo.x = 270;
    btnGo.y = 100;
    btnGo.addEventListener("mousedown", onOk);
    btnGo.addEventListener("pressup", onOk);

    // ------------------------------------------------- private methods
    function dropCountDownNumber() {
        // tween count down number onto stage
        createjs.Tween.get(countDown[countDownIndex]).to({y:150}, 240, createjs.Ease.cubicOut).call(onCountDownNumberComplete);
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // position and show spaceShip on screen
        spaceShip.showMeOn(screen, 235, BASE_HEIGHT - spaceShipSprite.getBounds().height - 67);
        spaceShip.activateTurret();

        // add other screen sprites
        screen.addChild(btnGo);
        for (var n=0; n<6; n++) {
            countDown[n].alpha = 1;
            screen.addChild(countDown[n]);
        }

        // other initialization
        countDownIndex = 5;

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

            // remove go button
            screen.removeChild(btnGo);
            // start countdown
            dropCountDownNumber();
            // add smoke from engines / vibration
            spaceShip.activateSmoke(true);
        }
    }

    function onCountDownNumberComplete(e) {
        // tween it to alpha 0
        createjs.Tween.get(countDown[countDownIndex]).to({alpha:0}, 500);
        countDownIndex--;
        if (countDownIndex < 0) {
            // kill smoke and start thrust
            spaceShip.activateSmoke(false);
            spaceShip.activateThrust(true);
            // time to blast off!
            spaceShip.flyOffStage(onComplete);
        } else {
            dropCountDownNumber();
        }
    }

    function onComplete(e) {
        // stage is complete
        screen.dispatchEvent(completeEvent);
    }

};


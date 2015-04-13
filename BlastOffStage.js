var BlastOffStage = function() {

    // TODO add shadow from spaceship
    // TODO make trees vibrate when spaceship blasts off

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var baseHeight = window.BASE_HEIGHT;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var ground = assetManager.getSprite("assets","ground",0,0,false);
    ground.y = 853;
    screen.addChild(ground);

    var countDownIndex = 5;
    var countDown = [];
    countDown[5] = assetManager.getSprite("assets","countdown5", 271, -160, false);
    countDown[4] = assetManager.getSprite("assets","countdown4", 271, -160, false);
    countDown[3] = assetManager.getSprite("assets","countdown3", 271, -160, false);
    countDown[2] = assetManager.getSprite("assets","countdown2", 271, -160, false);
    countDown[1] = assetManager.getSprite("assets","countdown1", 271, -160, false);
    countDown[0] = assetManager.getSprite("assets","countdownBlastOff", 150, -240, false);

    // the spaceship sprite
    var spaceShipContainer = spaceShip.getShipContainer();

    var btnGo = assetManager.getSprite("assets","btnGoUp", 255, 100, false);
    btnGo.addEventListener("mousedown", onOk);
    btnGo.addEventListener("pressup", onOk);

    // ------------------------------------------------- private methods
    function dropCountDownNumber() {
        // tween count down number onto stage
        createjs.Tween.get(countDown[countDownIndex]).to({y:150}, 750, createjs.Ease.cubicOut).call(onCountDownNumberComplete);
        assetManager.getSound("countdown").play();
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // position and show spaceShip on screen
        spaceShip.showMeOn(screen, 235, baseHeight - spaceShipContainer.getBounds().height - 67);
        spaceShip.toggleTurret(true);

        // add other screen sprites
        screen.addChild(btnGo);
        for (var n=0; n<6; n++) {
            countDown[n].alpha = 1;
            countDown[n].y = -160;
            if (n === 0) countDown[n].y = -240;
            screen.addChild(countDown[n]);
        }

        // other initialization
        countDownIndex = 5;

        root.addChild(screen);
    };

    this.hideMe = function(){
        screen.removeChild(btnGo);
        for (var n=0; n<6; n++) screen.removeChild(countDown[n]);
        spaceShip.toggleTurret(false);
        root.removeChild(screen);
    };

    // ------------------------------------------------- event handler
    function onOk(e) {
        if (e.type === "mousedown") {
            btnGo.gotoAndStop("btnGoDown");
            assetManager.getSound("beep").play();
        } else {
            btnGo.gotoAndStop("btnGoUp");

            // remove go button
            screen.removeChild(btnGo);
            // start countdown
            dropCountDownNumber();
            // add smoke from engines / vibration
            spaceShip.toggleSmoke(true);
        }
    }

    function onCountDownNumberComplete(e) {
        // tween it to alpha 0
        createjs.Tween.get(countDown[countDownIndex]).to({alpha:0}, 500);
        countDownIndex--;
        if (countDownIndex < 0) {
            // kill smoke and start thrust
            spaceShip.toggleSmoke(false);
            spaceShip.toggleThrust(true);
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


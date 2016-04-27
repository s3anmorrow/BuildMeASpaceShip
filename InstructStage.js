var InstructStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var background = window.background;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // instruction set counter
    var instructSetCount = 1;
    var expertMode = false;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var btnOk = assetManager.getSprite("assets", "btnOkUp", 0, 0, false);
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);

    var astronautHead = assetManager.getSprite("assets","astronautHead",0,0,false);
    var astronautWaving = assetManager.getSprite("assets","astronautWaving");
    var instructBubble = assetManager.getSprite("assets","instructBubble1",0,0,false);

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // set background to stop moving
        background.setMoving(false);

        // setup according to which instruction set
        switch (instructSetCount) {
            case 1:
                // add display objects to screen
                astronautWaving.play();
                astronautWaving.x = 327;
                astronautWaving.y = 500;
                screen.addChild(astronautWaving);
                instructBubble.x = 65;
                instructBubble.y = 130;
                instructBubble.gotoAndStop("instructBubble1");
                btnOk.x = 255;
                btnOk.y = 795;
                screen.addChild(instructBubble);
                // tween astronaut hovering up and down
                createjs.Tween.get(astronautWaving,{loop:true}).to({y:astronautWaving.y + 20}, 4000).to({y:astronautWaving.y}, 4000);

                break;
            case 2:
                astronautHead.x = 200;
                astronautHead.y = 500;
                astronautHead.rotation = 45;
                screen.addChild(astronautHead);
                instructBubble.x = 50;
                instructBubble.y = 50;
                instructBubble.gotoAndStop("instructBubble2");
                btnOk.x = 255;
                btnOk.y = 795;
                screen.addChild(instructBubble);
                createjs.Tween.get(astronautHead,{loop:true}).to({y:astronautHead.y + 40}, 3000).to({y:astronautHead.y}, 3000);

                break;
            case 3:
                astronautHead.x = 500;
                astronautHead.y = 150;
                astronautHead.rotation = 220;
                screen.addChild(astronautHead);
                instructBubble.x = 25;
                instructBubble.y = 450;
                instructBubble.gotoAndStop("instructBubble3");
                btnOk.x = 255;
                btnOk.y = 795;
                screen.addChild(instructBubble);
                createjs.Tween.get(astronautHead,{loop:true}).to({y:astronautHead.y + 20}, 3000).to({y:astronautHead.y}, 3000);

                break;
            case 4:
                astronautHead.x = 200;
                astronautHead.y = 500;
                astronautHead.rotation = 45;
                screen.addChild(astronautHead);
                instructBubble.x = 50;
                instructBubble.y = 50;
                instructBubble.gotoAndStop("instructBubble11");
                btnOk.x = 255;
                btnOk.y = 795;
                screen.addChild(instructBubble);
                createjs.Tween.get(astronautHead,{loop:true}).to({y:astronautHead.y + 40}, 3000).to({y:astronautHead.y}, 3000);

                break;
            case 5:
                background.setMoving(true);
                spaceShip.toggleTurret(true);
                spaceShip.toggleThrust(true);
                spaceShip.showMeOn(screen,235,970);
                spaceShip.flyOnStage();
                instructBubble.x = 70;
                instructBubble.y = 35;
                instructBubble.gotoAndStop("instructBubble4");
                btnOk.x = 255;
                btnOk.y = 235;
                screen.addChild(instructBubble);

                break;
            default:
                instructSetCount = 1;
                if (expertMode) instructSetCount = 4;
                this.showMe();
                return;
        }

        screen.addChild(btnOk);
        root.addChild(screen);
        instructSetCount++;

        assetManager.getSound("instructions").play();
    };

    this.hideMe = function(){
        // cleanup
        astronautWaving.stop();
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // remove all children
        screen.removeAllChildren();

        root.removeChild(screen);
    };

    this.setExpertMode = function(value){
        // only show the final instructions in expertmode
        instructSetCount = 4;
        expertMode = value;
    };

    // ------------------------------------------------- event handler
    function onOk(e) {
        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");

            assetManager.getSound("beep").play();
        } else {
            btnOk.gotoAndStop("btnOkUp");

            if (instructSetCount === 5) {
                // fly spaceship off stage
                screen.removeChild(btnOk);
                spaceShip.flyOffStage(onShipOffStage);
            } else {
                // stage is complete - am forced to construct new event object instead of reusing
                screen.dispatchEvent(completeEvent);
            }
        }
    }

    function onShipOffStage(e) {
        background.setMoving(false);
        screen.dispatchEvent(completeEvent);
    }
};

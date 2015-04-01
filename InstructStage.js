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

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var btnOk = assetManager.getSprite("assets", "btnOkUp");
    btnOk.x = 270;
    btnOk.y = 780;
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);

    var astronautHead = assetManager.getSprite("assets","astronautHead");
    var astronautWaving = assetManager.getSprite("assets","astronautWaving");
    var instructBubble = assetManager.getSprite("assets");

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // setup according to which instruction set
        switch (instructSetCount) {
            case 1:
                // add astronaut to screen
                astronautWaving.play();
                astronautWaving.x = 327;
                astronautWaving.y = 500;
                screen.addChild(astronautWaving);
                instructBubble.x = 65;
                instructBubble.y = 130;
                instructBubble.gotoAndStop("instructBubble1");
                screen.addChild(instructBubble);
                // tween astronaut hovering up and down
                createjs.Tween.get(astronautWaving,{loop:true}).to({y:astronautWaving.y + 20}, 4000).to({y:astronautWaving.y}, 4000);

                break;
            case 2:
                astronautHead.x = 200;
                astronautHead.y = 500;
                astronautHead.rotation = 45;
                screen.addChild(astronautHead);
                instructBubble.x = 45;
                instructBubble.y = 50;
                instructBubble.gotoAndStop("instructBubble2");
                screen.addChild(instructBubble);
                // tween astronaut coming onto screen and bobbing
                //createjs.Tween.get(astronautHead).to({x:astronautHead.x + 400}, 2000);

                createjs.Tween.get(astronautHead,{loop:true}).to({y:astronautHead.y + 40}, 3000).to({y:astronautHead.y}, 3000);



                break;
            case 3:
                astronautHead.x = 500;
                astronautHead.y = 150;
                astronautHead.rotation = 220;
                screen.addChild(astronautHead);
                instructBubble.x = 45;
                instructBubble.y = 450;
                instructBubble.gotoAndStop("instructBubble3");
                screen.addChild(instructBubble);

                // tween astronaut coming onto screen and bobbing
                //createjs.Tween.get(astronautHead).to({x:500}, 1000)
                //createjs.Tween.get(astronautHead).to({y:150}, 1000).call(function(){
                    createjs.Tween.get(astronautHead,{loop:true}).to({y:astronautHead.y + 20}, 3000).to({y:astronautHead.y}, 3000);
                //});

                break;
            default:
                instructSetCount = 1;
                this.showMe();
                return;
        }

        screen.addChild(btnOk);
        // set background to stop moving
        background.setMoving(false);

        root.addChild(screen);
        instructSetCount++;
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

    // ------------------------------------------------- event handler
    function onOk(e) {
        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnGoDown");
        } else {
            btnOk.gotoAndStop("btnGoUp");
            // stage is complete - am forced to construct new event object instead of reusing
            screen.dispatchEvent(completeEvent);
        }
    }
};

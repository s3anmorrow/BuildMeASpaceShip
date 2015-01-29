var AssemblyStage = function() {

    // TODO fix swipe functionality so going basically up/down does not fire a left or right swipe

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onAssemblyComplete", true);

    // private variables
    // the X location of touch to determine direction of swipe
    var downX = null;
    // an array for the current parts user is selecting from
    var partsOnTheLine = null;
    // the array index of current part
    var partIndex = 0;
    // the index of the current assemblyLine (fuselages, wings, tail)
    var assemblyLineIndex = 0;

    // !!!!!!!!!!!!!!!!!!!!!!!! this will be need to be moved to a more global location (custom class?)
    // position your spaceship
    spaceShip.x = 400;
    spaceShip.y = 50;
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var fadeBandRight = assetManager.getSprite("assets");
    fadeBandRight.x = 930;
    fadeBandRight.gotoAndStop("fadeBandRight");
    var fadeBandLeft = assetManager.getSprite("assets");
    fadeBandLeft.gotoAndStop("fadeBandLeft");

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("assembly");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 435;
    btnOk.y = 530;
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);

    // construct sprites of spaceship parts to add to assembly line later
    var assemblyLine = new createjs.Container();

    var spacer = 60;
    var dropX = 0;
    var fuselages = [];
    for (var n=0; n<5; n++) {
        fuselages[n] = assetManager.getSprite("assets");
        fuselages[n].gotoAndStop("fuselage" + (n + 1));
        fuselages[n].x = dropX;
        fuselages[n].y = 50;
        dropX += fuselages[n].getBounds().width + spacer;
    }

    dropX = 0;
    var wings = [];
    for (n=0; n<5; n++) {
        wings[n] = assetManager.getSprite("assets");
        wings[n].gotoAndStop("wings" + (n + 1));
        wings[n].x = dropX;
        wings[n].y = 50;
        dropX += wings[n].getBounds().width + spacer;
    }

    dropX = 0;
    var tails = [];
    for (n=0; n<5; n++) {
        tails[n] = assetManager.getSprite("assets");
        tails[n].gotoAndStop("tail" + (n + 1));
        tails[n].x = dropX;
        tails[n].y = 75;
        dropX += tails[n].getBounds().width + spacer;
    }

    // setup assemblyLine with current parts
    assemblyLineSetup();

    screen.addChild(assemblyLine);
    screen.addChild(spaceShip);
    screen.addChild(fadeBandRight);
    screen.addChild(fadeBandLeft);

    // ------------------------------------------------- private methods
    function swipeLeft() {
        if (partIndex === 4) return;

        partIndex++;
        var destX = 400 - partsOnTheLine[partIndex].x;
        // tween to new X destination over 250ms
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
    }

    function swipeRight() {
        if (partIndex === 0) return;

        partIndex--;
        var destX = 400 - partsOnTheLine[partIndex].x;
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
    }

    function assemblyLineSetup() {
        // assembly line resets
        assemblyLine.removeAllChildren();
        partIndex = 0;
        assemblyLine.x = 400;

        // current part to assemblyline for selection
        if (assemblyLineIndex === 0) partsOnTheLine = fuselages;
        else if (assemblyLineIndex === 1) partsOnTheLine = wings;
        else if (assemblyLineIndex === 2) partsOnTheLine = tails;
        else {
            // stage is complete
            screen.dispatchEvent(completeEvent);
        }

        // add new parts to assemblyLine
        for (var n=0; n<5; n++) {
            assemblyLine.addChild(partsOnTheLine[n]);
        }
    }



    // ------------------------------------------------- public methods
    this.showMe = function(){
        background.addEventListener("mousedown", onStartSwipe);
        background.addEventListener("pressmove", onSwiping);




        root.addChild(screen);
    };

    this.hideMe = function(){
        background.removeEventListener("mousedown", onStartSwipe);
        background.removeEventListener("pressmove", onSwiping);




        root.removeChild(screen);
    };


    // ------------------------------------------------- event handlers


    function onStartSwipe(e) {
        downX = stage.mouseX;
    }

    function onSwiping(e) {
        if (!downX) return;

        // calculating change in touch location
        var upY = stage.mouseY;

        var upX = stage.mouseX;
        var diffX = downX - upX;

        // is difference negative or positive?
        if (diffX > 0) {
            console.log("LEFT");
            swipeLeft();
        } else {
            console.log("RIGHT");
            swipeRight();
        }
        // reset values
        downX = null;
    }

    function onOk(e) {
        console.log("e type: " + e.type);

        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");

            if (assemblyLineIndex < 2) {
                // add part to spaceShip container
                var newPart = partsOnTheLine[partIndex];
                newPart.x = 0;
                newPart.y = 0;
                spaceShip.addChildAt(newPart, 0);
            }
            assemblyLineIndex++;
            assemblyLineSetup();

        } else {
            btnOk.gotoAndStop("btnOkUp");
        }
    }



};

var AssemblyStage = function() {
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
    // the spaceship sprite
    var spaceShipSprite = spaceShip.getSprite();

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var background = assetManager.getSprite("assets");
    background.gotoAndStop("screenAssembly");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 275;
    btnOk.y = 720;
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
        fuselages[n].type = "fuselage";
        dropX += fuselages[n].getBounds().width + spacer;
    }

    dropX = 0;
    var wings = [];
    for (n=0; n<5; n++) {
        wings[n] = assetManager.getSprite("assets");
        wings[n].gotoAndStop("wings" + (n + 1));
        wings[n].x = dropX;
        wings[n].y = 50;
        wings[n].type = "wing";
        dropX += wings[n].getBounds().width + spacer;
    }

    dropX = 0;
    var tails = [];
    for (n=0; n<5; n++) {
        tails[n] = assetManager.getSprite("assets");
        tails[n].gotoAndStop("tail" + (n + 1));
        tails[n].x = dropX;
        tails[n].y = 50;
        tails[n].type = "tail";
        dropX += tails[n].getBounds().width + spacer;
    }

    // setup assemblyLine with current parts
    assemblyLineSetup();

    // ------------------------------------------------- private methods
    function swipeLeft() {
        if (partIndex === 4) return;
        partIndex++;
        var destX = 235 - partsOnTheLine[partIndex].x;
        // tween to new X destination over 250ms
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
    }

    function swipeRight() {
        if (partIndex === 0) return;
        partIndex--;
        var destX = 235 - partsOnTheLine[partIndex].x;
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
    }

    function assemblyLineSetup() {
        // assembly line resets
        assemblyLine.removeAllChildren();
        partIndex = 0;
        assemblyLine.x = 235;
        assemblyLine.y = 160;

        // current part to assemblyline for selection
        if (assemblyLineIndex === 0) partsOnTheLine = fuselages;
        else if (assemblyLineIndex === 1) partsOnTheLine = wings;
        else if (assemblyLineIndex === 2) {
            partsOnTheLine = tails;
            // swap displaylist index so tails are on top of spaceship
            screen.swapChildren(spaceShipSprite, assemblyLine);
        } else {
            // stage is complete
            screen.dispatchEvent(completeEvent);
            return;
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



        // add assembly line container overtop
        screen.addChild(assemblyLine);
        // positioning and showing spaceship on this screen
        spaceShipSprite.x = 235;
        spaceShipSprite.y = 210;
        screen.addChild(spaceShipSprite);

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

            // add part to spaceShip assembly
            spaceShip.assembleMe(partsOnTheLine[partIndex]);

            assemblyLineIndex++;
            assemblyLineSetup();

        } else {
            btnOk.gotoAndStop("btnOkUp");
        }
    }



};

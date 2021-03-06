var AssemblyStage = function() {

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var background = window.background.getSprite();

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // private variables
    // the X location of touch to determine direction of swipe
    var downX = null;
    // an array for the current parts user is selecting from
    var partsOnTheLine = null;
    // the array index of current part
    var partIndex = 0;
    var partCount = 0;
    // the index of the current assemblyLine (fuselages, wings, tail)
    var assemblyLineIndex = 0;
    // the spaceship container for dimensions
    var spaceShipContainer = spaceShip.getShipContainer();

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var constructionBar2 = assetManager.getSprite("interface","constructionBar",0,150,false);
    screen.addChild(constructionBar2);
    var constructionBar1 = assetManager.getSprite("interface","constructionBar",0,720,false);
    screen.addChild(constructionBar1);
    var astronaut = assetManager.getSprite("interface","astronautWaving",50,70);
    astronaut.rotation = 45;
    screen.addChild(astronaut);
    var instructions = assetManager.getSprite("interface","instructBubble5",130,30,false);
    screen.addChild(instructions);

    var btnOk = assetManager.getSprite("interface","btnOkUp",255,795,false);
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("pressup", onOk);
    screen.addChild(btnOk);

    // construct sprites of spaceship parts to add to assembly line later
    var assemblyLine = new createjs.Container();

    var fuselages = [];
    for (var n=0; n<5; n++) {
        fuselages[n] = assetManager.getSprite("spaceship","fuselage" + (n + 1),0,0,false);
        fuselages[n].type = "fuselage";
    }

    var wings = [];
    for (n=0; n<5; n++) {
        wings[n] = assetManager.getSprite("spaceship","wings" + (n + 1),0,0,false);
        wings[n].type = "wings";
    }

    var tails = [];
    for (n=0; n<5; n++) {
        tails[n] = assetManager.getSprite("spaceship","tail" + (n + 1),0,0,false);
        tails[n].type = "tail";
    }

    var cockpits = [];
    for (n=0; n<4; n++) {
        cockpits[n] = assetManager.getSprite("spaceship","cockpit" + (n + 1));
        cockpits[n].type = "cockpit";
    }

    var lasers = [];
    for (n=0; n<3; n++) {
        lasers[n] = assetManager.getSprite("spaceship","laser" + (n + 1),0,0,false);
        lasers[n].type = "laser";
    }

    // setup assemblyLine with current parts
    assemblyLineSetup();

    // ------------------------------------------------- private methods
    function swipeLeft() {
        if (partIndex === (partCount - 1)) return;
        partIndex++;
        var destX = 235 - partsOnTheLine[partIndex].x;
        // tween to new X destination over 250ms
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
        assetManager.getSound("slideLeft").play();
    }

    function swipeRight() {
        if (partIndex === 0) return;
        partIndex--;
        var destX = 235 - partsOnTheLine[partIndex].x;
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
        assetManager.getSound("slideRight").play();
    }

    function assemblyLineSetup() {
        // assembly line resets
        assemblyLine.removeAllChildren();
        partIndex = 0;
        assemblyLine.x = 235;
        assemblyLine.y = 180;

        // current part to assemblyline for selection
        if (assemblyLineIndex === 0) {
            partsOnTheLine = fuselages;
            instructions.gotoAndStop("instructBubble5");
        } else if (assemblyLineIndex === 1) {
            partsOnTheLine = wings;
            instructions.gotoAndStop("instructBubble6");
        } else if (assemblyLineIndex === 2) {
            partsOnTheLine = tails;
            // swap displaylist index so tails are on top of spaceship
            screen.swapChildren(spaceShipContainer, assemblyLine);
            instructions.gotoAndStop("instructBubble7");
        } else if (assemblyLineIndex === 3) {
            partsOnTheLine = cockpits;
            instructions.gotoAndStop("instructBubble8");
        } else if (assemblyLineIndex === 4) {
            partsOnTheLine = lasers;
            instructions.gotoAndStop("instructBubble9");
        } else {
            // stage is complete
            createjs.Tween.removeAllTweens();
            screen.dispatchEvent(completeEvent);
            return;
        }

        // save number of parts on the line
        partCount = partsOnTheLine.length;

        // add new parts to assemblyLine
        var spacer = 60;
        var dropX = 0;
        var partsCount = partsOnTheLine.length;
        for (var n=0; n<partsCount; n++) {
            // positioning each part
            partsOnTheLine[n].x = dropX;
            partsOnTheLine[n].y = 50;
            dropX += partsOnTheLine[n].getBounds().width + spacer;
            // add to assemblyline container
            assemblyLine.addChild(partsOnTheLine[n]);
        }
    }

    // ------------------------------------------------- public methods
    this.showMe = function(){
        background.addEventListener("mousedown", onStartSwipe);
        background.addEventListener("pressmove", onSwiping);

        downX = null;
        assemblyLineIndex = 0;
        assemblyLineSetup();

        // moving effect for astronaut
        astronaut.y = 70;
        createjs.Tween.get(astronaut,{loop:true}).to({y:astronaut.y - 10}, 4000).to({y:astronaut.y}, 4000);

        // add assembly line container overtop
        screen.addChild(assemblyLine);
        // positioning and showing spaceship on this screen
        spaceShip.showMeOn(screen, 235, 230);

        root.addChild(screen);
    };

    this.hideMe = function(){
        background.removeEventListener("mousedown", onStartSwipe);
        background.removeEventListener("pressmove", onSwiping);
        createjs.Tween.removeAllTweens();

        root.removeChild(screen);
    };


    // ------------------------------------------------- event handlers
    function onStartSwipe(e) {
        downX = e.stageX;
    }

    function onSwiping(e) {
        if (!downX) return;

        // calculating change in touch location
        var upX = e.stageX;
        var diffX = downX - upX;

        // is difference negative or positive?
        if (diffX < 0) swipeRight();
        else swipeLeft();

        // reset values
        downX = null;
    }

    function onOk(e) {
        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");
            assetManager.getSound("beep").play();

            // add part to spaceShip assembly
            spaceShip.assembleMe(partsOnTheLine[partIndex]);

            assemblyLineIndex++;
            assemblyLineSetup();

        } else {
            btnOk.gotoAndStop("btnOkUp");
        }
    }



};

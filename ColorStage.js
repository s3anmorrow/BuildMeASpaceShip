var ColorStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onColorComplete", true);

    // size of brush for coloring spaceship
    var brushSize = 20;
    var brushColor = "#990000";

    // the x,y position of the current touch on the screen
    var curPoint = new createjs.Point();
    // the x,y position of the last touch on the screen
    var lastPoint = new createjs.Point();
    // array to keep track of which part we are coloring
    var partsQueue = ["fuselage","wings","tail"];
    var partsIndex = 0;
    var colorCanvas = null;

    // the spaceship sprite
    var spaceShipSprite = spaceShip.getSprite();

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    // setup paint selection buttons
    var btnRed = assetManager.getSprite("assets");
    btnRed.gotoAndStop("btnRedDown");
    btnRed.x = 25;
    btnRed.y = 65;
    btnRed.color = "#990000";
    btnRed.label = "btnRed";
    btnRed.addEventListener("click", onChangeColor);
    screen.addChild(btnRed);

    var btnGreen = assetManager.getSprite("assets");
    btnGreen.gotoAndStop("btnGreenUp");
    btnGreen.x = 125;
    btnGreen.y = 65;
    btnGreen.color = "#006600";
    btnGreen.label = "btnGreen";
    btnGreen.addEventListener("click", onChangeColor);
    screen.addChild(btnGreen);

    var btnYellow = assetManager.getSprite("assets");
    btnYellow.gotoAndStop("btnYellowUp");
    btnYellow.x = 225;
    btnYellow.y = 65;
    btnYellow.color = "#FFCC00";
    btnYellow.label = "btnYellow";
    btnYellow.addEventListener("click", onChangeColor);
    screen.addChild(btnYellow);

    var btnBlue = assetManager.getSprite("assets");
    btnBlue.gotoAndStop("btnBlueUp");
    btnBlue.x = 325;
    btnBlue.y = 65;
    btnBlue.color = "#0033CC";
    btnBlue.label = "btnBlue";
    btnBlue.addEventListener("click", onChangeColor);
    screen.addChild(btnBlue);

    var btnPurple = assetManager.getSprite("assets");
    btnPurple.gotoAndStop("btnPurpleUp");
    btnPurple.x = 425;
    btnPurple.y = 65;
    btnPurple.color = "#663399";
    btnPurple.label = "btnPurple";
    btnPurple.addEventListener("click", onChangeColor);
    screen.addChild(btnPurple);

    var btnOrange = assetManager.getSprite("assets");
    btnOrange.gotoAndStop("btnOrangeUp");
    btnOrange.x = 525;
    btnOrange.y = 65;
    btnOrange.color = "#CC6600";
    btnOrange.label = "btnOrange";
    btnOrange.addEventListener("click", onChangeColor);
    screen.addChild(btnOrange);

    // add ok button
    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 270;
    btnOk.y = 740;
    btnOk.addEventListener("mousedown", onFinished);
    btnOk.addEventListener("pressup", onFinished);
    screen.addChild(btnOk);

    // ------------------------------------------------- public methods
    this.showMe = function(){
        // setup event listeners
        screen.addEventListener("mousedown", onStartColoring);
        screen.addEventListener("pressmove", onColoring);

        // setup canvas to fuselage (default) and alpha all other parts to focus
        partsIndex = 0;
        colorCanvas = spaceShip.getColorCanvas(partsQueue[partsIndex]);
        spaceShip.focusOnPart(partsQueue[partsIndex]);




        // positioning and showing spaceship
        spaceShipSprite.x = 235;
        spaceShipSprite.y = 230;
        screen.addChild(spaceShipSprite);

        root.addChild(screen);
    };

    this.hideMe = function(){
        screen.removeEventListener("mousedown", onStartColoring);
        screen.removeEventListener("pressmove", onColoring);


        root.removeChild(screen);
    };

    // ------------------------------------------------- private methods
    function paintMe(e) {
        // where are we now in terms of colorCanvas shape coord system?
        var touchPoint = colorCanvas.globalToLocal(stage.mouseX, stage.mouseY);
        // scale it to our resizing of game
        //curPoint.x = touchPoint.x / scaleRatio;
        curPoint.x = touchPoint.x;
        //curPoint.y = touchPoint.y / scaleRatio;
        curPoint.y = touchPoint.y;

        // draw line onto colorLayer
        colorCanvas.graphics.setStrokeStyle(brushSize, "round", "round");
        colorCanvas.graphics.beginStroke(brushColor);
        colorCanvas.graphics.moveTo(lastPoint.x, lastPoint.y);
        colorCanvas.graphics.lineTo(curPoint.x, curPoint.y);
        // store current X,Y
        lastPoint.x = curPoint.x;
        lastPoint.y = curPoint.y;

        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		colorCanvas.updateCache("source-overlay");
        // because the vector paint drop has been drawn to the cache clear it out
		colorCanvas.graphics.clear();
    }

    // ------------------------------------------------- event handlers
    function onChangeColor(e) {
        console.log("color change to " + e.target.color);

        // set brush color and adjust button
        brushColor = e.target.color;
        // reset all buttons and set target
        btnRed.gotoAndStop(btnRed.label + "Up");
        btnGreen.gotoAndStop(btnGreen.label + "Up");
        btnYellow.gotoAndStop(btnYellow.label + "Up");
        btnBlue.gotoAndStop(btnBlue.label + "Up");
        btnPurple.gotoAndStop(btnPurple.label + "Up");
        btnOrange.gotoAndStop(btnOrange.label + "Up");
        e.target.gotoAndStop(e.target.label + "Down");
    }

    function onStartColoring(e) {
        console.log("start coloring");

        // set last point to current touch point with scaling
        var touchPoint = colorCanvas.globalToLocal(stage.mouseX, stage.mouseY);
        //lastPoint.x = touchPoint.x / scaleRatio;
        //lastPoint.y = touchPoint.y / scaleRatio;
        lastPoint.x = touchPoint.x;
        lastPoint.y = touchPoint.y;

        paintMe(e);
    }

    function onStopColoring(e) {
        console.log("stop coloring");
    }

    function onColoring(e) {
        paintMe(e);
    }

    function onFinished(e) {
        console.log("e type: " + e.type);

        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");
        } else {
            btnOk.gotoAndStop("btnOkUp");

            if (partsIndex === 2) {
                // stage is complete
                spaceShip.focusOnPart(undefined);
                screen.dispatchEvent(completeEvent);
                return;
            }

            // change to the next canvas for coloring
            partsIndex++;
            colorCanvas = spaceShip.getColorCanvas(partsQueue[partsIndex]);
            spaceShip.focusOnPart(partsQueue[partsIndex]);
        }
    }


};


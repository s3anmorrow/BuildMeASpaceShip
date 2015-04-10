var ColorStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;
    var spaceShip = window.spaceShip;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

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

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var constructionBar2 = assetManager.getSprite("assets","constructionBar");
    constructionBar2.y = 150;
    screen.addChild(constructionBar2);
    var constructionBar1 = assetManager.getSprite("assets","constructionBar");
    constructionBar1.y = 720;
    screen.addChild(constructionBar1);

    // setup paint selection buttons
    var btnRed = assetManager.getSprite("assets","btnRedDown",25,30,false);
    btnRed.color = "#990000";
    btnRed.label = "btnRed";
    btnRed.addEventListener("click", onChangeColor);
    screen.addChild(btnRed);

    var btnGreen = assetManager.getSprite("assets","btnGreenUp",125,30,false);
    btnGreen.color = "#006600";
    btnGreen.label = "btnGreen";
    btnGreen.addEventListener("click", onChangeColor);
    screen.addChild(btnGreen);

    var btnYellow = assetManager.getSprite("assets","btnYellowUp",225,30,false);
    btnYellow.color = "#FFCC00";
    btnYellow.label = "btnYellow";
    btnYellow.addEventListener("click", onChangeColor);
    screen.addChild(btnYellow);

    var btnBlue = assetManager.getSprite("assets","btnBlueUp",325,30,false);
    btnBlue.color = "#0033CC";
    btnBlue.label = "btnBlue";
    btnBlue.addEventListener("click", onChangeColor);
    screen.addChild(btnBlue);

    var btnPurple = assetManager.getSprite("assets","btnPurpleUp",425,30,false);
    btnPurple.color = "#663399";
    btnPurple.label = "btnPurple";
    btnPurple.addEventListener("click", onChangeColor);
    screen.addChild(btnPurple);

    var btnOrange = assetManager.getSprite("assets","btnOrangeUp",525,30,false);
    btnOrange.color = "#CC6600";
    btnOrange.label = "btnOrange";
    btnOrange.addEventListener("click", onChangeColor);
    screen.addChild(btnOrange);

    // add ok button
    var btnOk = assetManager.getSprite("assets","btnOkUp",255,780,false);
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

        // setup current color
        brushColor = "#990000";
        btnRed.dispatchEvent(new createjs.Event("click"));

        // positioning and showing spaceship
        spaceShip.showMeOn(screen, 235, 230);

        root.addChild(screen);
    };

    this.hideMe = function(){
        screen.removeEventListener("mousedown", onStartColoring);
        screen.removeEventListener("pressmove", onColoring);

        root.removeChild(screen);
    };

    // ------------------------------------------------- private methods
    function paintMe() {
        // where are we now in terms of colorCanvas shape coord system?
        var touchPoint = colorCanvas.globalToLocal(stage.mouseX, stage.mouseY);
        // scale it to our resizing of game
        curPoint.x = touchPoint.x;
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
        btnRed.gotoAndStop("btnRedUp");
        btnGreen.gotoAndStop("btnGreenUp");
        btnYellow.gotoAndStop("btnYellowUp");
        btnBlue.gotoAndStop("btnBlueUp");
        btnPurple.gotoAndStop("btnPurpleUp");
        btnOrange.gotoAndStop("btnOrangeUp");
        e.target.gotoAndStop(e.target.label + "Down");
    }

    function onStartColoring(e) {
        // set last point to current touch point with scaling
        var touchPoint = colorCanvas.globalToLocal(stage.mouseX, stage.mouseY);
        lastPoint.x = touchPoint.x;
        lastPoint.y = touchPoint.y;

        paintMe();
    }

    function onColoring(e) {
        paintMe();
    }

    function onFinished(e) {
        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");
            assetManager.getSound("beep").play();
        } else {
            btnOk.gotoAndStop("btnOkUp");

            if (partsIndex === 2) {
                // stage is complete
                spaceShip.unFocusOnParts();
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


var AssemblyStage = function(assetManager, root) {

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    // size of brush for coloring spaceship
    var brushSize = 30;
    var brushColor = "#990000";

    // the x,y position of the current touch on the screen
    var curPoint = new createjs.Point();
    // the x,y position of the last touch on the screen
    var lastPoint = new createjs.Point();

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("assembly");
    screen.addChild(background);

    // container to contain whole spaceship (coloring and all)
    var spaceShip = new createjs.Container();

    // setup spaceship part with shape for coloring and sprite for coloring on
    var part1 = {};
    part1.colorCanvas = new createjs.Shape();
    part1.sprite = assetManager.getSprite("assets");
    part1.sprite.gotoAndStop("body");
    part1.sprite.x = 50;
    part1.sprite.y = 30;
    // setting composite so we can ONLY color current spaceship part
    part1.sprite.compositeOperation = "destination-atop";

    var part2 = {};
    part2.colorCanvas = new createjs.Shape();
    part2.sprite = assetManager.getSprite("assets");
    part2.sprite.gotoAndStop("wings");
    part2.sprite.x = 10;
    part2.sprite.y = 200;
    //part2.sprite.compositeOperation = "destination-atop";

    var part3 = {};
    part3.colorCanvas = new createjs.Shape();
    part3.sprite = assetManager.getSprite("assets");
    part3.sprite.gotoAndStop("tail");
    part3.sprite.x = 10;
    part3.sprite.y = 300;
    //part3.sprite.compositeOperation = "destination-atop";

    spaceShip.addChild(part1.colorCanvas);
    spaceShip.addChild(part1.sprite);
    spaceShip.addChild(part2.colorCanvas);
    spaceShip.addChild(part2.sprite);
    spaceShip.addChild(part3.colorCanvas);
    spaceShip.addChild(part3.sprite);

    // !!!!!!!!!!!!!!!!!!! change caching to only be the size of the spaceship
    // cache coloring container and master container
    part1.colorCanvas.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    part2.colorCanvas.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    part3.colorCanvas.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    spaceShip.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    // add to screen
    screen.addChild(spaceShip);

    /*
    screen.addChild(coloringCanvas);
    screen.addChild(spriteContainer);
    */

    // parts queue
    var partsQueue = [part1, part2, part3];
    // the current part being colored
    var currentPart = part1;




    // setup paint selection buttons
    var btnRed = assetManager.getSprite("assets");
    btnRed.gotoAndStop("btnRedDown");
    btnRed.x = 400;
    btnRed.y = 50;
    btnRed.color = "#990000";
    btnRed.label = "btnRed";
    btnRed.addEventListener("click", onChangeColor);
    screen.addChild(btnRed);

    var btnGreen = assetManager.getSprite("assets");
    btnGreen.gotoAndStop("btnGreenUp");
    btnGreen.x = 400;
    btnGreen.y = 110;
    btnGreen.color = "#006600";
    btnGreen.label = "btnGreen";
    btnGreen.addEventListener("click", onChangeColor);
    screen.addChild(btnGreen);

    var btnYellow = assetManager.getSprite("assets");
    btnYellow.gotoAndStop("btnYellowUp");
    btnYellow.x = 400;
    btnYellow.y = 170;
    btnYellow.color = "#FFCC00";
    btnYellow.label = "btnYellow";
    btnYellow.addEventListener("click", onChangeColor);
    screen.addChild(btnYellow);

    var btnBlue = assetManager.getSprite("assets");
    btnBlue.gotoAndStop("btnBlueUp");
    btnBlue.x = 400;
    btnBlue.y = 230;
    btnBlue.color = "#003366";
    btnBlue.label = "btnBlue";
    btnBlue.addEventListener("click", onChangeColor);
    screen.addChild(btnBlue);

    var btnPurple = assetManager.getSprite("assets");
    btnPurple.gotoAndStop("btnPurpleUp");
    btnPurple.x = 400;
    btnPurple.y = 290;
    btnPurple.color = "#663399";
    btnPurple.label = "btnPurple";
    btnPurple.addEventListener("click", onChangeColor);
    screen.addChild(btnPurple);

    var btnOrange = assetManager.getSprite("assets");
    btnOrange.gotoAndStop("btnOrangeUp");
    btnOrange.x = 400;
    btnOrange.y = 350;
    btnOrange.color = "#CC6600";
    btnOrange.label = "btnOrange";
    btnOrange.addEventListener("click", onChangeColor);
    screen.addChild(btnOrange);

    // add ok button
    var btnFinished = assetManager.getSprite("assets");
    btnFinished.gotoAndStop("btnOkUp");
    btnFinished.x = 400;
    btnFinished.y = 420;
    btnFinished.addEventListener("mousedown", onFinished);
    btnFinished.addEventListener("click", onFinished);
    screen.addChild(btnFinished);




    // add screen to root for display
    root.addChild(screen);

    // setup event listeners
    screen.addEventListener("mousedown", onStartColoring);
    screen.addEventListener("pressmove", onColoring);

    // ------------------------------------------------- public methods
    this.showMe = function(){

    };

    this.hideMe = function(){

    };

    // ------------------------------------------------- private methods
    function paintMe(e) {
        // prevents game scrolling or anything dumb
        //e.preventDefault();

        // where are we now?
        curPoint.x = stage.mouseX / scaleRatio;
        curPoint.y = stage.mouseY / scaleRatio;

        /*
        // place paint drop - scale to correct ratio for canvas resize since it is a vector being added to the container
        coloringCanvas.graphics.beginFill(brushColor);
        coloringCanvas.graphics.drawCircle((touchX / scaleRatio), (touchY / scaleRatio), brushSize);
        coloringCanvas.graphics.endFill();
        */

        // draw line onto colorLayer
        currentPart.colorCanvas.graphics.setStrokeStyle(brushSize, "round", "round");
        currentPart.colorCanvas.graphics.beginStroke(brushColor);
        currentPart.colorCanvas.graphics.moveTo(lastPoint.x, lastPoint.y);
        currentPart.colorCanvas.graphics.lineTo(curPoint.x, curPoint.y);
        // store current X,Y
        lastPoint.x = curPoint.x;
        lastPoint.y = curPoint.y;

        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		currentPart.colorCanvas.updateCache("source-overlay");
        // because the vector paint drop has been drawn to the cache clear it out
		currentPart.colorCanvas.graphics.clear();
        // update cache whole spaceShip container so that composite (can only color on spaceship part) works
        spaceShip.updateCache("source-overlay");
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
        lastPoint.x = stage.mouseX / scaleRatio;
        lastPoint.y = stage.mouseY / scaleRatio;

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
            btnFinished.gotoAndStop("btnOkDown");
        } else {
            btnFinished.gotoAndStop("btnOkUp");

            //currentPart.sprite.compositeOperation = "source-over";
            currentPart = part2;
            currentPart.sprite.compositeOperation = "destination-atop";




        }
    }


};

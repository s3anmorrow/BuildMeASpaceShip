var AssemblyStage = function(assetManager, root) {

    // the current part being colored
    var currentPart = null;

    // size of brush for coloring spaceship
    var brushSize = 30;
    var brushColor = "#990000";

    // the x,y position of the current touch on the screen
    var curPoint = new createjs.Point();
    // the x,y position of the last touch on the screen
    var lastPoint = new createjs.Point();

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("assembly");
    screen.addChild(background);

    // container to contain whole spaceship (coloring and all)
    var spaceShip = new createjs.Container();

    // setup body spaceship part
    // shape for coloring on - cache for fast rendering
    var coloringCanvas = new createjs.Shape();
    // sprite of spaceship part we color
    var part1 = assetManager.getSprite("assets");
    part1.gotoAndStop("body");
    part1.x = 50;
    part1.y = 30;

    var part2 = assetManager.getSprite("assets");
    part2.gotoAndStop("wings");
    part2.x = 10;
    part2.y = 200;

    var part3 = assetManager.getSprite("assets");
    part3.gotoAndStop("tail");
    part3.x = 10;
    part3.y = 300;


    spaceShip.addChild(coloringCanvas);
    spaceShip.addChild(part1);
    //spaceShip.addChild(part2);
    //spaceShip.addChild(part3);

    // setting composite so we can ONLY color current spaceship part
    // http://community.createjs.com/discussions/easeljs/494-composite-operation-on-one-layer-knopckout-mask-as-example
    part1.compositeOperation = "destination-atop";

    // !!!!!!!!!!!!!!!!!!! change caching to only be the size of the spaceship
    // cache coloring container and master container
    coloringCanvas.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    spaceShip.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    // add to screen
    screen.addChild(spaceShip);

    /*
    screen.addChild(coloringCanvas);
    screen.addChild(spriteContainer);
    */




    // setup paint selection buttons
    var btnRed = assetManager.getSprite("assets");
    btnRed.gotoAndStop("redPaint");
    btnRed.x = 300;
    btnRed.y = 50;
    btnRed.color = "#990000";
    btnRed.upframe = btnRed.currentFrame;
    btnRed.overframe = btnRed.currentFrame + 1;
    btnRed.gotoAndStop(btnRed.overframe);
    btnRed.addEventListener("click", onChangeColor);
    screen.addChild(btnRed);

    var btnGreen = assetManager.getSprite("assets");
    btnGreen.gotoAndStop("greenPaint");
    btnGreen.x = 300;
    btnGreen.y = 110;
    btnGreen.color = "#006600";
    btnGreen.upframe = btnGreen.currentFrame;
    btnGreen.overframe = btnGreen.currentFrame + 1;
    btnGreen.addEventListener("click", onChangeColor);
    screen.addChild(btnGreen);

    var btnYellow = assetManager.getSprite("assets");
    btnYellow.gotoAndStop("yellowPaint");
    btnYellow.x = 300;
    btnYellow.y = 170;
    btnYellow.color = "#FFCC00";
    btnYellow.upframe = btnYellow.currentFrame;
    btnYellow.overframe = btnYellow.currentFrame + 1;
    btnYellow.addEventListener("click", onChangeColor);
    screen.addChild(btnYellow);

    var btnBlue = assetManager.getSprite("assets");
    btnBlue.gotoAndStop("bluePaint");
    btnBlue.x = 300;
    btnBlue.y = 230;
    btnBlue.color = "#003366";
    btnBlue.upframe = btnBlue.currentFrame;
    btnBlue.overframe = btnBlue.currentFrame + 1;
    btnBlue.addEventListener("click", onChangeColor);
    screen.addChild(btnBlue);

    var btnPurple = assetManager.getSprite("assets");
    btnPurple.gotoAndStop("purplePaint");
    btnPurple.x = 300;
    btnPurple.y = 290;
    btnPurple.color = "#663399";
    btnPurple.upframe = btnPurple.currentFrame;
    btnPurple.overframe = btnPurple.currentFrame + 1;
    btnPurple.addEventListener("click", onChangeColor);
    screen.addChild(btnPurple);

    var btnOrange = assetManager.getSprite("assets");
    btnOrange.gotoAndStop("orangePaint");
    btnOrange.x = 300;
    btnOrange.y = 350;
    btnOrange.color = "#CC6600";
    btnOrange.upframe = btnOrange.currentFrame;
    btnOrange.overframe = btnOrange.currentFrame + 1;
    btnOrange.addEventListener("click", onChangeColor);
    screen.addChild(btnOrange);




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
        coloringCanvas.graphics.setStrokeStyle(brushSize, "round", "round");
        coloringCanvas.graphics.beginStroke(brushColor);
        coloringCanvas.graphics.moveTo(lastPoint.x, lastPoint.y);
        coloringCanvas.graphics.lineTo(curPoint.x, curPoint.y);
        // store current X,Y
        lastPoint.x = curPoint.x;
        lastPoint.y = curPoint.y;

        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		coloringCanvas.updateCache("source-overlay");
        // because the vector paint drop has been drawn to the cache clear it out
		coloringCanvas.graphics.clear();
        // update cache whole spaceShip container so that composite (can only color on spaceship part) works
        spaceShip.updateCache("source-overlay");
    }



    // ------------------------------------------------- event handlers
    function onChangeColor(e) {
        console.log("color change to " + e.target.color);

        // set brush color and adjust button
        brushColor = e.target.color;
        // reset all buttons and set target
        btnRed.gotoAndStop(btnRed.upframe);
        btnGreen.gotoAndStop(btnGreen.upframe);
        btnYellow.gotoAndStop(btnYellow.upframe);
        btnBlue.gotoAndStop(btnBlue.upframe);
        btnPurple.gotoAndStop(btnPurple.upframe);
        btnOrange.gotoAndStop(btnOrange.upframe);
        e.target.gotoAndStop(e.target.overframe);
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

};

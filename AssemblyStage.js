var AssemblyStage = function(assetManager, gameContainer) {

    // the current part being colored
    var currentPart = null;

    // size of brush for coloring spaceship
    var brushSize = 20;
    var brushColor = "#990000";

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("assembly");
    screen.addChild(background);


    // containers for all three spaceship parts
    var body = new createjs.Container();
    var wings = new createjs.Container();
    var tail = new createjs.Container();



    var spaceShipPart = new createjs.Container();


    // setup body spaceship part
    // shape for coloring on - cache for fast rendering
    var coloring = new createjs.Shape();
    // sprite of spaceship part we color
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop("spaceship");

    spaceShipPart.addChild(coloring);
    spaceShipPart.addChild(sprite);

    // setting composite so we can ONLY color current spaceship part
    // http://community.createjs.com/discussions/easeljs/494-composite-operation-on-one-layer-knopckout-mask-as-example
    sprite.compositeOperation = "destination-atop";

    coloring.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);
    spaceShipPart.cache(0, 0, canvas.width / scaleRatio, canvas.height / scaleRatio);

    screen.addChild(spaceShipPart);

    /*
    screen.addChild(coloring);
    screen.addChild(spriteContainer);
    */















    // setup paint selection buttons
    var btnRed = assetManager.getSprite("assets");
    btnRed.gotoAndStop("redPaint");
    btnRed.x = 300;
    btnRed.y = 50;
    btnRed.color = "#990000";
    btnRed.addEventListener("click", onChangeColor);
    screen.addChild(btnRed);

    var btnGreen = assetManager.getSprite("assets");
    btnGreen.gotoAndStop("greenPaint");
    btnGreen.x = 300;
    btnGreen.y = 110;
    btnGreen.color = "#006600";
    btnGreen.addEventListener("click", onChangeColor);
    screen.addChild(btnGreen);

    var btnYellow = assetManager.getSprite("assets");
    btnYellow.gotoAndStop("yellowPaint");
    btnYellow.x = 300;
    btnYellow.y = 170;
    btnYellow.color = "#FFCC00";
    btnYellow.addEventListener("click", onChangeColor);
    screen.addChild(btnYellow);

    var btnBlue = assetManager.getSprite("assets");
    btnBlue.gotoAndStop("bluePaint");
    btnBlue.x = 300;
    btnBlue.y = 230;
    btnBlue.color = "#003366";
    btnBlue.addEventListener("click", onChangeColor);
    screen.addChild(btnBlue);

    var btnPurple = assetManager.getSprite("assets");
    btnPurple.gotoAndStop("purplePaint");
    btnPurple.x = 300;
    btnPurple.y = 290;
    btnPurple.color = "#663399";
    btnPurple.addEventListener("click", onChangeColor);
    screen.addChild(btnPurple);

    var btnOrange = assetManager.getSprite("assets");
    btnOrange.gotoAndStop("orangePaint");
    btnOrange.x = 300;
    btnOrange.y = 350;
    btnOrange.color = "#CC6600";
    btnOrange.addEventListener("click", onChangeColor);
    screen.addChild(btnOrange);




    // add screen to gameContainer for display
    gameContainer.addChild(screen);

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

        var touchX = stage.mouseX;
        var touchY = stage.mouseY;

        /*
        // only draw if pointer is overtop of spaceShip - even though composite of spaceship section is done it slows down framerate
        var point = sprite.globalToLocal(touchX, touchY);
        if (!sprite.hitTest(point.x, point.y)) return;
        */

        // place paint drop - scale to correct ratio for canvas resize since it is a vector being added to the container
        coloring.graphics.beginFill(brushColor);
        coloring.graphics.drawCircle((touchX / scaleRatio), (touchY / scaleRatio), brushSize);
        coloring.graphics.endFill();





        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		coloring.updateCache("source-overlay");
        // because the vector paint drop has been drawn to the cache clear it out
		coloring.graphics.clear();


        spaceShipPart.updateCache("source-overlay");
    }

    // ------------------------------------------------- event handlers
    function onChangeColor(e) {
        console.log("color change to " + e.target.color);

        // set brush color and adjust button
        brushColor = e.target.color;
        // reset all buttons and set target
        btnRed.gotoAndStop("redPaint");
        btnGreen.gotoAndStop("greenPaint");
        btnYellow.gotoAndStop("yellowPaint");
        btnBlue.gotoAndStop("bluePaint");
        btnPurple.gotoAndStop("purplePaint");
        btnOrange.gotoAndStop("orangePaint");
        e.target.gotoAndStop(e.target.currentFrame + 1);


    }

    function onStartColoring(e) {
        console.log("start coloring");
        paintMe(e);
    }

    function onStopColoring(e) {
        console.log("stop coloring");
    }

    function onColoring(e) {
        //console.log("coloring! " + e.touches[0].pageX + "," + e.touches[0].pageY);
        console.log("coloring! " + stage.mouseX + "," + stage.mouseY);
        paintMe(e);
    }

};

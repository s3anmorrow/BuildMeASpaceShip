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

    // containers for all three spaceship parts
    var body = new createjs.Container();
    var wings = new createjs.Container();
    var tail = new createjs.Container();

    // setup body spaceship part
    // shape for coloring on - cache for fast rendering
    var coloring = new createjs.Shape();
    coloring.cache(0, 0, canvas.width, canvas.height);
    // sprite of spaceship part we color
    var sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop("spaceship");
    // setting composite so we can ONLY color current spaceship part
    // http://community.createjs.com/discussions/easeljs/494-composite-operation-on-one-layer-knopckout-mask-as-example
    //sprite.compositeOperation = "destination-atop";
    screen.addChild(coloring);
    screen.addChild(sprite);

    /*
    // setup wings spaceship part
    wings.coloring = new createjs.Shape();
    wings.coloring.cache(0, 0, canvas.width, canvas.height);
    wings.sprite = assetManager.getSprite("assets");
    wings.sprite.gotoAndStop("spaceship");
    wings.sprite.compositeOperation = "destination-atop";
    wings.addChild(wings.coloring);
    wings.addChild(wings.sprite);

    // setup wings spaceship part
    tail.coloring = new createjs.Shape();
    tail.coloring.cache(0, 0, canvas.width, canvas.height);
    tail.sprite = assetManager.getSprite("assets");
    tail.sprite.gotoAndStop("spaceship");
    tail.sprite.compositeOperation = "destination-atop";
    tail.addChild(tail.coloring);
    tail.addChild(tail.sprite);
    */














    /*
    // setup paint selection buttons
    var redPaint = assetManager.getSprite("assets");
    redPaint.gotoAndStop(4);
    redPaint.x = 300;
    redPaint.y = 50;
    redPaint.color = "#990000";
    redPaint.addEventListener("mousedown", onChangeColor);
    screen.addChild(redPaint);

    var greenPaint = assetManager.getSprite("assets");
    greenPaint.gotoAndStop("greenPaint");
    greenPaint.x = 300;
    greenPaint.y = 110;
    greenPaint.color = "#006600";
    greenPaint.addEventListener("mousedown", onChangeColor);
    screen.addChild(greenPaint);

    var yellowPaint = assetManager.getSprite("assets");
    yellowPaint.gotoAndStop("yellowPaint");
    yellowPaint.x = 300;
    yellowPaint.y = 170;
    yellowPaint.color = "#FFCC00"
    yellowPaint.addEventListener("mousedown", onChangeColor);
    screen.addChild(yellowPaint);

    var bluePaint = assetManager.getSprite("assets");
    bluePaint.gotoAndStop("bluePaint");
    bluePaint.x = 300;
    bluePaint.y = 230;
    bluePaint.color = "#003366"
    bluePaint.addEventListener("mousedown", onChangeColor);
    screen.addChild(bluePaint);

    var purplePaint = assetManager.getSprite("assets");
    purplePaint.gotoAndStop("purplePaint");
    purplePaint.x = 300;
    purplePaint.y = 290;
    purplePaint.color = "#663399"
    purplePaint.addEventListener("mousedown", onChangeColor);
    screen.addChild(purplePaint);
    */

    var orangePaint = assetManager.getSprite("assets");
    orangePaint.gotoAndStop("orangePaint");
    orangePaint.x = 300;
    orangePaint.y = 350;
    orangePaint.color = "#CC6600"
    orangePaint.addEventListener("click", onChangeColor);
    orangePaint.addEventListener("touchend", onChangeColor);
    screen.addChild(orangePaint);




    // add screen to gameContainer for display
    gameContainer.addChild(screen);

    // setup event listeners
    /*
    screen.addEventListener("touchstart", onStartColoring);
    screen.addEventListener("touchmove", onColoring);
    screen.addEventListener("touchend", onStopColoring);
    */

    stage.addEventListener("mousedown", onStartColoring);
    sprite.addEventListener("pressmove", onColoring);

    // ------------------------------------------------- public methods
    this.showMe = function(){

    };

    this.hideMe = function(){

    };

    // ------------------------------------------------- private methods
    function paintMe(e) {
        // prevents game scrolling or anything dumb

        /*
        var touchX = e.touches[0].pageX;
        var touchY = e.touches[0].pageY;
        */
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
    }

    // ------------------------------------------------- event handlers
    function onChangeColor(e) {
        console.log("color change to " + e.target.color);


        brushColor = e.target.color;

        e.preventDefault();
    }

    function onStartColoring(e) {
        console.log("start");
        paintMe(e);
        e.preventDefault();
    }

    function onStopColoring(e) {
        console.log("stop");
        e.preventDefault();
    }

    function onColoring(e) {
        //console.log("coloring! " + e.touches[0].pageX + "," + e.touches[0].pageY);
        console.log("coloring! " + stage.mouseX + "," + stage.mouseY);
        paintMe(e);
        e.preventDefault();
    }

};

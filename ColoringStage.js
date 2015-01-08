var ColoringStage = function(assetManager, gameContainer) {

    // size of brush for coloring spaceship
    var brushSize = 20;
    var brushColor = "#FF0000";

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();

    // building coloring book
    var coloring = new createjs.Shape();
    // cache it (stores it as a seperate canvas)
    coloring.cache(0, 0, canvas.width, canvas.height);
    var spaceShip = assetManager.getSprite("assets");
    spaceShip.gotoAndStop("outline");
    screen.addChild(coloring);
    screen.addChild(spaceShip);

    // add screen to gameContainer for display
    gameContainer.addChild(screen);

    // setup event listeners
    window.addEventListener("touchstart", onStartColoring);
    window.addEventListener("touchmove", onColoring);
    window.addEventListener("touchend", onStopColoring);
    //gameContainer.addEventListener("mouseleave", onStopColoring);

    // ------------------------------------------------- public methods
    this.showMe = function(){

    };

    this.hideMe = function(){

    };

    // ------------------------------------------------- private methods
    function paintMe(e) {
        // prevents game scrolling or anything dumb
        e.preventDefault();

        // place paint drop
        coloring.graphics.beginFill(brushColor);
        coloring.graphics.drawCircle(e.touches[0].pageX / scaleRatio, e.touches[0].pageY / scaleRatio, brushSize);
        coloring.graphics.endFill();

        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		coloring.updateCache("source-overlay");

        // because the vector paint drop has been drawn to the cache clear it out
		coloring.graphics.clear();
    }

    // ------------------------------------------------- event handlers
    function onStartColoring(e) {
        console.log("start");

        paintMe(e);
    }

    function onStopColoring(e) {
        console.log("stop");

    }

    function onColoring(e) {
        console.log("coloring! " + e.touches[0].pageX + "," + e.touches[0].pageY);

        paintMe(e);

    }


};

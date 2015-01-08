var ColoringStage = function(assetManager, gameContainer) {

    // size of brush for coloring spaceship
    var brushSize = 20;
    var brushColor = "#FF0000";

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    var stage = new createjs.Container();
    var colorShape = new createjs.Shape();
    var outline = assetManager.getSprite("assets");
    outline.gotoAndStop("test");

    stage.addChild(colorShape);
    stage.addChild(outline);
    gameContainer.addChild(stage);

    // setup event listeners
    window.addEventListener("touchstart", onStartColoring);
    window.addEventListener("touchmove", onColoring);
    //window.addEventListener("touchend", onStopColoring);
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

        // place paint circle
        colorShape.graphics.beginFill(brushColor);
        colorShape.graphics.drawCircle(e.touches[0].pageX / scaleRatio, e.touches[0].pageY / scaleRatio, brushSize);
        colorShape.graphics.endFill();
    }

    // ------------------------------------------------- event handlers
    function onStartColoring(e) {
        console.log("start");

        paintMe(e);
    }

    function onColoring(e) {
        console.log("coloring! " + e.touches[0].pageX + "," + e.touches[0].pageY);

        paintMe(e);

    }


};

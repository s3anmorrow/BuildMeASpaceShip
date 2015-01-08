var ColorScreen = function(assetManager, gameContainer) {

    // event to be dispatched when this screen is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    var screen = new createjs.Container();
    var colorShape = new createjs.Shape();
    var outline = assetManager.getSprite("assets");
    outline.gotoAndStop("test");

    screen.addChild(colorShape);
    screen.addChild(outline);
    stage.addChild(screen);

    // setup event listeners
    window.addEventListener("touchstart", onStartColoring);
    window.addEventListener("touchmove", onColoring);
    window.addEventListener("touchend", onStopColoring);
    //gameContainer.addEventListener("mouseleave", onStopColoring);

    // ------------------------------------------------- public methods


    // ------------------------------------------------- event handlers
    function onStartColoring(e) {
        console.log("start");

        e.preventDefault();

        //document.addEventListener("pressmove", onColoring);
    }

    function onStopColoring(e) {
        console.log("stop");

        e.preventDefault();

        //document.removeEventListener("pressmove", onColoring);
    }

    function onColoring(e) {
        console.log("coloring! " + e.touches[0].pageX + "," + e.touches[0].pageY);

        e.preventDefault();

        colorShape.graphics.beginFill("#FF0000");
        //colorShape.graphics.drawCircle(e.pageX - 5, e.pageY - 5, 10);
        colorShape.graphics.drawCircle(e.touches[0].pageX, e.touches[0].pageY, 10);
        colorShape.graphics.endFill();

    }


};

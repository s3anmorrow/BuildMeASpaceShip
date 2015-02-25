var SpaceShip = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;

    // container to hold spaceship parts
    var shipContainer = new createjs.Container();
    // shape for user to draw on
    var colorCanvas = new createjs.Shape();
    // fuselage mask (sprite)
    var colorMask = assetManager.getSprite("assets");
    colorMask.x = 0;
    colorMask.y = 0;




    // ------------------------------------------------- public methods
    this.getSprite = function() {
        return shipContainer;
    };

    this.getColorCanvas = function() {
        return colorCanvas;
    };

    this.assembleMe = function(newPart) {

        console.log("part type: " + newPart.type);

        // add part to spaceShip shipContainer
        newPart.x = 0;
        newPart.y = 0;

        // setup coloring canvas and mask for fuselage
        if (newPart.type === "fuselage") {

            console.log("animation: " + newPart.currentAnimation);

            shipContainer.addChild(newPart);
            shipContainer.addChild(colorCanvas);
            colorCanvas.cache(0, 0, newPart.getBounds().width, newPart.getBounds().height);
            //colorCanvas.cache(0, 0, 960, 640);
            colorMask.gotoAndStop(newPart.currentAnimation + "Mask");
            shipContainer.addChild(colorMask);
        } else if (newPart.type === "wing") {
            shipContainer.addChildAt(newPart, 0);
        } else {
            shipContainer.addChild(newPart);
        }
    };

    this.resetMe = function() {

    };






    // ------------------------------------------------- event handlers




};

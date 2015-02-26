var SpaceShip = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;

    // container to hold spaceship parts
    var shipContainer = new createjs.Container();

    // collection of shapes to color on for each ship part
    var colorCanvases = {};
    colorCanvases.fuselage = new createjs.Shape();
    colorCanvases.wings = new createjs.Shape();
    colorCanvases.tail = new createjs.Shape();

    // collection of sprites to act as masks for coloring on shapes
    var colorMasks = {};
    colorMasks.fuselage = assetManager.getSprite("assets");
    colorMasks.wings = assetManager.getSprite("assets");
    colorMasks.tail = assetManager.getSprite("assets");

    // collection of the rectangle coordinates of what area to be cached for each part
    var cacheCoord = {};
    cacheCoord.fuselage1 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.fuselage2 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.fuselage3 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.fuselage4 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.fuselage5 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.wings1 = new createjs.Rectangle(-74,209,320,95);
    cacheCoord.wings2 = new createjs.Rectangle(-84,215,340,80);
    cacheCoord.wings3 = new createjs.Rectangle(-84,205,340,100);
    cacheCoord.wings4 = new createjs.Rectangle(-68,205,317,100);
    cacheCoord.wings5 = new createjs.Rectangle(-84,215,340,85);
    cacheCoord.tail1 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.tail2 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.tail3 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.tail4 = new createjs.Rectangle(0,0,176,400);
    cacheCoord.tail5 = new createjs.Rectangle(0,0,176,400);

    // ------------------------------------------------- public methods
    this.getSprite = function() {
        return shipContainer;
    };

    this.getColorCanvas = function(which) {
        return colorCanvases[which];
    };

    this.assembleMe = function(newPart) {

        console.log("part type: " + newPart.type);

        // add part to spaceShip shipContainer
        newPart.x = 0;
        newPart.y = 0;

        // get name of frame of part (part name)
        var partName = newPart.currentAnimation;
        var cacheRect = cacheCoord[partName];


        // setup coloring canvas and mask for fuselage
        if (newPart.type === "fuselage") {

            // adding new part to ship
            shipContainer.addChild(newPart);

            // adding color canvas to ship
            shipContainer.addChild(colorCanvases.fuselage);
            colorCanvases.fuselage.cache(cacheRect.x, cacheRect.y, cacheRect.width, cacheRect.height);

            // adding color mask to ship
            colorMasks.fuselage.gotoAndStop(partName + "Mask");
            shipContainer.addChild(colorMasks.fuselage);
        } else if (newPart.type === "wing") {

            // adding color mask to ship
            colorMasks.wings.gotoAndStop(partName + "Mask");
            shipContainer.addChildAt(colorMasks.wings, 0);

            // adding color canvas to ship
            shipContainer.addChildAt(colorCanvases.wings, 0);
            colorCanvases.wings.cache(cacheRect.x, cacheRect.y, cacheRect.width, cacheRect.height);

            // adding new part to ship at back
            shipContainer.addChildAt(newPart, 0);
        } else {
            shipContainer.addChild(newPart);
        }
    };

    this.resetMe = function() {

    };






    // ------------------------------------------------- event handlers




};

var SpaceShip = function() {

    // TODO fix some fuselages so the masks don't knock out sections of them

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;

    // parts list
    var partsQueue = ["fuselage","wings","tail"];

    // container to hold all spaceship parts
    var shipContainer = new createjs.Container();

    // collection of containers to hold individual spaceship parts
    var containers = {};
    containers.fuselage = new createjs.Container();
    containers.wings = new createjs.Container();
    containers.tail = new createjs.Container();

    // collection of sprites for each part added to the ship
    var parts = {};
    parts.fuselage = null;
    parts.wings = null;
    parts.tail = null;

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
    cacheCoord.tail1 = new createjs.Rectangle(-2,348,180,64);
    cacheCoord.tail2 = new createjs.Rectangle(1,359,174,90);
    cacheCoord.tail3 = new createjs.Rectangle(-6,352,186,94);
    cacheCoord.tail4 = new createjs.Rectangle(-12,342,199,107);
    cacheCoord.tail5 = new createjs.Rectangle(-22,370,220,60);

    // add containers to shipContainer
    shipContainer.addChild(containers.wings);
    shipContainer.addChild(containers.fuselage);
    shipContainer.addChild(containers.tail);

    // ???????????????????????????
    // misc spaceship parts
    var laserTurret = assetManager.getSprite("assets","btnRedUp");
    // ???????????????????????????


    // other spaceship effects
    var thrust = assetManager.getSprite("assets", "thrust");
    var smoke = assetManager.getSprite("assets","smoke");

    // ------------------------------------------------- public methods
    this.getSprite = function() {
        return shipContainer;
    };

    this.getColorCanvas = function(which) {
        return colorCanvases[which];
    };

    this.showMeOn = function(screen, locX, locY) {
        shipContainer.x = locX;
        shipContainer.y = locY;
        screen.addChild(shipContainer);
    };

    this.focusOnPart = function(which) {


        //shipContainer.addChild(containers[which]);


        var alphaSetting = 0.2;
        if (which === undefined) alphaSetting = 1;

        // set all parts, canvases, and masks to be alphed
        for (var n=0; n<3; n++) containers[partsQueue[n]].alpha = alphaSetting;

        if (which === undefined) return;

        containers[which].alpha = 1;

    };

    this.activateThrust = function(which) {
        if (!which) {
            thrust.stop();
            shipContainer.removeChild(thrust);
            return;
        }
        // position thrust sprite
        thrust.x = 18;
        thrust.y = shipContainer.getBounds().height - 60;
        thrust.play();
        shipContainer.addChild(thrust);
    };

    this.activateSmoke = function(which) {
        if (!which) {
            // stopping smoke animation after animation is complete (avoid abrupt ending)
            smoke.on("animationend",
                function(){
                    smoke.stop();
                    shipContainer.removeChild(smoke);
                },
            null, true);
            return;
        }
        // position thrust sprite
        smoke.x = -8;
        smoke.y = shipContainer.getBounds().height - 60;
        smoke.play();
        shipContainer.addChild(smoke);
    };

    /*
    this.shrinkMe = function(which) {
        if (which) {
            shipContainer.scaleX = 0.75;
            shipContainer.scaleY = 0.75;
        } else {
            shipContainer.scaleX = 1;
            shipContainer.scaleY = 1;
        }
    };
    */

    this.flyOffStage = function(callback) {
        // tween spaceship blasting off top of stage
        //createjs.Tween.get(shipContainer).to({y:-(shipContainer.getBounds().height + 10)}, 5000, createjs.Ease.cubicIn).call(callback);
        createjs.Tween.get(shipContainer).to({y:-(shipContainer.getBounds().height + 10)}, 500, createjs.Ease.cubicIn).call(callback);
    };

    this.flyOnStage = function(callback) {
        //createjs.Tween.get(shipContainer).to({y:400}, 5000, createjs.Ease.cubicOut).call(callback);
        createjs.Tween.get(shipContainer).to({y:400}, 500, createjs.Ease.cubicOut).call(callback);
    };

    this.assembleMe = function(newPart) {
        // get name of frame of part (part name)
        var partType = newPart.type;
        var partName = newPart.currentAnimation;
        var container = containers[partType];
        var colorCanvas = colorCanvases[partType];
        var cacheRect = cacheCoord[partName];
        var colorMask = colorMasks[partType];

        // add laser turret if part is a fuselage
        // ????????????????



        // adjust location since it was in the assemblyLine before
        newPart.x = 0;
        newPart.y = 0;
        // storing ref to new part
        parts[partType] = newPart;
        // adding new part to shipContainer
        container.addChild(newPart);

        // adding color canvas shape to shipContainer
        container.addChild(colorCanvas);
        colorCanvas.cache(cacheRect.x, cacheRect.y, cacheRect.width, cacheRect.height);

        // adding color mask to shipContainer
        colorMask.gotoAndStop(partName + "Mask");
        container.addChild(colorMask);
    };

    this.resetMe = function() {
        // resets
        parts.fuselage = null;
        parts.wings = null;
        parts.tail = null;
        // no focusing on any part
        this.focusOnPart(undefined);
        // clearing out all caches for next round
        colorCanvases.fuselage.uncache();
        colorCanvases.wings.uncache();
        colorCanvases.tail.uncache();



    };






    // ------------------------------------------------- event handlers




};

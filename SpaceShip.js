var SpaceShip = function() {

    // TODO fix some fuselages so the masks don't knock out sections of them

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var randomMe = window.randomMe;

    // parts list
    var partsQueue = ["fuselage","wings","tail","cockpit","laser"];

    // container to hold all spaceship parts
    var shipContainer = new createjs.Container();

    // collection of containers to hold individual spaceship parts
    var containers = {};
    containers.fuselage = new createjs.Container();
    containers.wings = new createjs.Container();
    containers.tail = new createjs.Container();
    containers.cockpit = new createjs.Container();
    containers.laserBeams = new createjs.Container();
    containers.laser = new createjs.Container();

    // shapes to draw laser beams on
    var laserBeams = [];
    for (var n=0; n<5; n++) {
        laserBeams[n] = new createjs.Shape();
        laserBeams[n].active = false;
    }

    // collection of sprites for each part added to the ship
    var parts = {};
    parts.fuselage = null;
    parts.wings = null;
    parts.tail = null;
    parts.cockpit = null;
    parts.laser = null;

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

    // collection of laser turret placements
    var laserCoord = {};
    laserCoord.laser1 = new createjs.Point(89,65);
    laserCoord.laser2 = new createjs.Point(89,145);
    laserCoord.laser3 = new createjs.Point(89,255);

    // add containers to shipContainer
    shipContainer.addChild(containers.wings);
    shipContainer.addChild(containers.fuselage);
    shipContainer.addChild(containers.tail);
    shipContainer.addChild(containers.cockpit);
    shipContainer.addChild(containers.laserBeams);
    shipContainer.addChild(containers.laser);

    // other spaceship parts and effects
    var laserTurret = assetManager.getSprite("assets","laserTurret");
    var thrust = assetManager.getSprite("assets", "thrust");
    var smoke = assetManager.getSprite("assets","smoke");
    var turretTween = null;

    // ------------------------------------------------- private methods
    function rotateTurret(which) {
        if (which) {
            // randomly pick direction and start tween
            var dir = 1;
            if (randomMe(0,1) === 1) dir = -1;
            createjs.Tween.get(laserTurret,{loop:true}).to({rotation: ((laserTurret.rotation + 360) * dir)}, 17000);
        } else {
            createjs.Tween.removeTweens(laserTurret);
        }
    }


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

    this.moveLeft = function() {
        shipContainer.x -= 6;
        if (shipContainer.x <= 100) {
            shipContainer.x = 100;
            return false;
        }
        return true;
    };

    this.moveRight = function() {
        shipContainer.x += 6;
        if (shipContainer.x >= 370) {
            shipContainer.x = 370;
            return false;
        }
        return true;
    };

    this.focusOnPart = function(which) {
        var alphaSetting = 0.2;
        if (which === undefined) alphaSetting = 1;
        // set all parts, canvases, and masks to be alphed
        for (var n=0; n<5; n++) containers[partsQueue[n]].alpha = alphaSetting;
        if (which === undefined) return;
        containers[which].alpha = 1;
    };

    this.activateTurret = function() {
        //createjs.Tween.removeAllTweens(laserTurret);
        rotateTurret(true);
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

    this.fireMe = function(target, targetLayer) {
        // convert asteroid x,y relative to shipContainer
        var targetPoint = targetLayer.localToLocal(target.x, target.y, shipContainer);

        // pause turret rotate tween in order to fire
        rotateTurret(false);

        // calculate angle from turret to target asteroid
        var angle = Math.atan2(targetPoint.y - laserTurret.y, targetPoint.x - laserTurret.x);
        // convert to degrees from radians
        angle = angle * (180 / Math.PI);
        // aim turret
        laserTurret.rotation = angle;

        // find free laserBeam shape to draw laser beam on
        var laserBeam = null;
        for (var n=0; n<5; n++) {
            if (!laserBeams[n].active) {
                laserBeam = laserBeams[n];
                laserBeam.alpha = 1;
                laserBeam.active = true;
                containers.laserBeams.addChild(laserBeam);
                break;
            }
        }

        // draw laser beam
        laserBeam.graphics.setStrokeStyle(10, "round");
        laserBeam.graphics.beginStroke("rgba(255,0,0,0.4)");
        laserBeam.graphics.moveTo(laserTurret.x, laserTurret.y);
        laserBeam.graphics.lineTo(targetPoint.x, targetPoint.y);
        laserBeam.graphics.endStroke();
        laserBeam.graphics.setStrokeStyle(4, "round");
        laserBeam.graphics.beginStroke("rgba(255,0,0,0.8)");
        laserBeam.graphics.moveTo(laserTurret.x, laserTurret.y);
        laserBeam.graphics.lineTo(targetPoint.x, targetPoint.y);
        laserBeam.graphics.endStroke();

        // tween beam fading away
        createjs.Tween.get(laserBeam).to({alpha:0}, 300).call(onLaserComplete);
    };

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

        // adjust location since it was in the assemblyLine before
        newPart.x = 0;
        newPart.y = 0;

        if (partType === "laser") {
            // storing ref to new part
            parts[partType] = laserTurret;
            // laserTurret sprite is added instead of passed in assembly line sprite due to reg point requirements
            var point = laserCoord[partName];
            laserTurret.x = point.x;
            laserTurret.y = point.y;
            laserTurret.rotation = 270;
            container.addChild(laserTurret);
        } else {
            parts[partType] = newPart;
            // adding new part to shipContainer
            container.addChild(newPart);
        }

        // if part is cockpit or laser we are done
        if ((partType === "cockpit") || (partType === "laser")) return;

        // setup color canvases and masks
        var colorCanvas = colorCanvases[partType];
        var cacheRect = cacheCoord[partName];
        var colorMask = colorMasks[partType];

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
        parts.cockpit = null;
        parts.laser = null;
        laserTurret.rotation = 0;
        laserBeamIndex = 0;

        // remove all parts of spaceship
        for (var n=0; n<5; n++) containers[partsQueue[n]].removeAllChildren();

        // no focusing on any part
        this.focusOnPart(undefined);
        // clearing out all caches for next round
        colorCanvases.fuselage.uncache();
        colorCanvases.wings.uncache();
        colorCanvases.tail.uncache();
    };

    // ------------------------------------------------- event handlers
    function onLaserComplete(e) {
        // make laserBeam shape inactive and remove from stage
        e.target.active = false;
        e.target.graphics.clear();
        containers.laserBeams.removeChild(e.target);
        // turn back on turret rotation tween
        rotateTurret(true);
    }





};

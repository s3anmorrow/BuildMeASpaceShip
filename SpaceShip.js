var SpaceShip = function() {

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var randomMe = window.randomMe;
    // scope reference fix
    var me = this;
    // width of stage on device
    var stageWidth = stage.canvas.width;
    var baseWidth = window.BASE_WIDTH;

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
    laserCoord.laser1 = new createjs.Point(88,30);
    laserCoord.laser2 = new createjs.Point(88,257);
    laserCoord.laser3 = new createjs.Point(88,357);

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
    //var scorchSmoke = assetManager.getSprite("assets","scorchSmoke");
    var turretTween = null;
    // comet scorch settings
    var scorchWidth = 36;
    var scorchColor = "#000000";

    // ------------------------------------------------- public methods
    this.getShipContainer = function() {
        return shipContainer;
    };

    this.getColorCanvas = function(which) {
        return colorCanvases[which];
    };

    this.getCockpitLocation = function() {
        return (containers.cockpit.localToGlobal(0, parts.cockpit.getBounds().height)).y;
    };

    this.showMeOn = function(screen, locX, locY) {
        shipContainer.x = locX;
        shipContainer.y = locY;
        screen.addChild(shipContainer);
    };

    this.moveMe = function(destX) {
        // destX is relative to device width of stage - must convert destX releative to actual stage width
        destX = (destX/stageWidth) * baseWidth;

        // adjust for top/left registration point
        destX -= 92;

        // check if any movement required
        var dif = shipContainer.x - destX;
        if ((dif > -6) && (dif < 6)) return;

        // move spaceship
        if (shipContainer.x < destX) {
            shipContainer.x += 6;
        } else {
            shipContainer.x -= 6;
        }
    };

    this.focusOnPart = function(which) {
        // set all parts, canvases, and masks to be alphed
        for (var n=0; n<5; n++) {
            parts[partsQueue[n]].alpha = 0.2;
            if (n<3) colorCanvases[partsQueue[n]].alpha = 0.2;
        }

        // adjust targets part to not be alpha
        parts[which].alpha = 1;
        colorCanvases[which].alpha = 1;
    };

    this.unFocusOnParts = function() {
        for (var n=0; n<5; n++) {
            parts[partsQueue[n]].alpha = 1;
            if (n<3) colorCanvases[partsQueue[n]].alpha = 1;
        }
    };

    this.toggleTurret = function(which) {
        if (which) {
            // randomly pick direction and start tween
            var dir = 1;
            //if (randomMe(0,1) === 1) dir = -1;
            createjs.Tween.get(laserTurret,{loop:true}).to({rotation: ((laserTurret.rotation + 360) * dir)}, 17000);
        } else {
            createjs.Tween.removeTweens(laserTurret);
        }
    };

    this.toggleThrust = function(which) {
        if (!which) {
            thrust.stop();
            shipContainer.removeChild(thrust);
            return;
        }
        // position thrust sprite
        thrust.x = 18;
        thrust.y = parts.tail.getBounds().y + parts.tail.getBounds().height;
        thrust.play();
        shipContainer.addChild(thrust);
    };

    this.toggleSmoke = function(which) {
        if (!which) {
            // stopping smoke animation after animation is complete (avoid abrupt ending)
            smoke.on("animationend", function(){
                    smoke.stop();
                    shipContainer.removeChild(smoke);
            }, null, true);
            return;
        }
        // position smoke sprite
        smoke.x = -8;
        smoke.y = parts.tail.getBounds().y + parts.tail.getBounds().height - 60;
        smoke.play();
        shipContainer.addChild(smoke);
    };

    this.toggleCockpit = function(which) {
        var cockpit = parts.cockpit;
        if (which) cockpit.play();
        else cockpit.gotoAndPlay(cockpit.currentAnimation + "Close");
        cockpit.on("animationend", function(e){
            e.target.stop();
        }, null, true);
    };

    this.fireMe = function(target, targetLayer) {
        // convert asteroid x,y relative to shipContainer
        var targetPoint = targetLayer.localToLocal(target.x, target.y, shipContainer);

        // pause turret rotate tween in order to fire
        this.toggleTurret(false);

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
        if (callback != undefined) createjs.Tween.get(shipContainer).to({y:-(shipContainer.getBounds().height + 10)}, 1500, createjs.Ease.cubicIn).call(callback);
        else createjs.Tween.get(shipContainer).to({y:-(shipContainer.getBounds().height + 10)}, 1500, createjs.Ease.cubicIn);

        //createjs.Tween.get(shipContainer).to({y:-(shipContainer.getBounds().height + 10)}, 500, createjs.Ease.cubicIn).call(callback);

        assetManager.getSound("thrust").play();

    };

    this.flyOnStage = function(callback) {
        if (callback != undefined) createjs.Tween.get(shipContainer).to({y:400}, 1500, createjs.Ease.cubicOut).call(callback);
        else createjs.Tween.get(shipContainer).to({y:400}, 1500, createjs.Ease.cubicOut);

        //createjs.Tween.get(shipContainer).to({y:400}, 500, createjs.Ease.cubicOut).call(callback);

        assetManager.getSound("thrust").play();
    };

    this.scorchMe = function(comet, targetLayer) {
        // convert comet x,y relative to shipContainer
        var cometPoint = targetLayer.localToLocal(comet.x, comet.y, shipContainer);

        // only draw scorch marks if comet actually on fuselage
        if ((cometPoint.y < 0) || (cometPoint.y > 400) || (cometPoint.x < 0) || (cometPoint.x > 160)) return;
        if (!comet.soundPlayed) {
            assetManager.getSound("burn").play();
            comet.soundPlayed = true;
        }

        // draw scorch mark on fuselage
        var colorCanvas = colorCanvases.fuselage;
        colorCanvas.graphics.beginFill("rgba(0,0,0,0.5)");
        colorCanvas.graphics.drawCircle(cometPoint.x, cometPoint.y, scorchWidth);
        colorCanvas.graphics.beginFill("rgba(0,0,0,1)");
        colorCanvas.graphics.drawCircle(cometPoint.x, cometPoint.y, scorchWidth - 6);

        // drawing smoke (fades away)
        var scorchSmoke = assetManager.getSprite("assets","scorchSmoke");
        scorchSmoke.x = cometPoint.x;
        scorchSmoke.y = cometPoint.y;
        scorchSmoke.on("animationend", function(e){
            e.target.stop();
            shipContainer.removeChild(e.target);
        }, null, true);
        scorchSmoke.play();
        shipContainer.addChild(scorchSmoke);

        // draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		colorCanvas.updateCache("source-overlay");
        // because the vector paint drop has been drawn to the cache clear it out
		colorCanvas.graphics.clear();

        //assetManager.getSound("burn").play();
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
        this.toggleThrust(false);
        this.toggleSmoke(false);
        this.toggleTurret(false);

        // remove all parts of spaceship
        for (var n=0; n<5; n++) containers[partsQueue[n]].removeAllChildren();

        // clearing out all caches for next round
        colorCanvases.fuselage.graphics.clear();
        colorCanvases.fuselage.uncache();
        colorCanvases.wings.graphics.clear();
        colorCanvases.wings.uncache();
        colorCanvases.tail.graphics.clear();
        colorCanvases.tail.uncache();
    };

    // ------------------------------------------------- event handlers
    function onLaserComplete(e) {
        // make laserBeam shape inactive and remove from stage
        e.target.active = false;
        e.target.graphics.clear();
        containers.laserBeams.removeChild(e.target);
        // turn back on turret rotation tween
        me.toggleTurret(true);
    }





};

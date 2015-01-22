var AssemblyStage = function() {

    // TODO fix swipe functionality so going basically up/down does not fire a left or right swipe

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;

    // private variables
    // the X location of touch to determine direction of swipe
    var downX = null;

    // event to be dispatched when this stage is complete
    //var completeEvent = new createjs.Event("onChooseComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("assembly");
    background.cache(0, 0, background.getBounds().width, background.getBounds().height);
    screen.addChild(background);

    var assemblyLine = new createjs.Container();
    assemblyLine.x = 0;

    var part1 = assetManager.getSprite("assets");
    part1.gotoAndStop("fuselage1");
    part1.x = 400;
    part1.y = 50;
    assemblyLine.addChild(part1);

    var part2 = assetManager.getSprite("assets");
    part2.gotoAndStop("fuselage2");
    part2.x = 600;
    part2.y = 50;
    assemblyLine.addChild(part2);

    var part3 = assetManager.getSprite("assets");
    part3.gotoAndStop("fuselage3");
    part3.x = 800;
    part3.y = 50;
    assemblyLine.addChild(part3);

    var part4 = assetManager.getSprite("assets");
    part4.gotoAndStop("fuselage4");
    part4.x = 1000;
    part4.y = 50;
    assemblyLine.addChild(part4);

    var part5 = assetManager.getSprite("assets");
    part5.gotoAndStop("fuselage5");
    part5.x = 1200;
    part5.y = 50;
    assemblyLine.addChild(part5);

    partWidth = 200;

    var btnOk = assetManager.getSprite("assets");
    btnOk.gotoAndStop("btnOkUp");
    btnOk.x = 440;
    btnOk.y = 460;
    btnOk.addEventListener("mousedown", onOk);
    btnOk.addEventListener("click", onOk);
    screen.addChild(btnOk);


    screen.addChild(assemblyLine);


    // ------------------------------------------------- private methods
    function swipeLeft() {
        var destX = assemblyLine.x - partWidth;
        // tween to new X destination over 250ms
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);

    }

    function swipeRight() {
        var destX = assemblyLine.x + partWidth;
        createjs.Tween.get(assemblyLine).to({x:destX}, 250);
    }



    // ------------------------------------------------- public methods
    this.showMe = function(){
        background.addEventListener("mousedown", onStartSwipe);
        background.addEventListener("pressmove", onSwiping);




        // add screen to root for display
        root.addChild(screen);
    };

    this.hideMe = function(){
        background.removeEventListener("mousedown", onStartSwipe);
        background.removeEventListener("pressmove", onSwiping);




    };


    // ------------------------------------------------- event handlers


    function onStartSwipe(e) {
        downX = stage.mouseX;
    }

    function onSwiping(e) {
        if (!downX) return;

        // calculating change in touch location
        var upY = stage.mouseY;

        var upX = stage.mouseX;
        var diffX = downX - upX;

        // is difference negative or positive?
        if (diffX > 0) {
            console.log("LEFT");
            swipeLeft();
        } else {
            console.log("RIGHT");
            swipeRight();
        }
        // reset values
        downX = null;
    }

    function onOk(e) {
        console.log("e type: " + e.type);

        if (e.type === "mousedown") {
            btnOk.gotoAndStop("btnOkDown");
        } else {
            btnOk.gotoAndStop("btnOkUp");
        }
    }



};

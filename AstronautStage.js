var AstronautStage = function() {

    // TODO bug with turret spinning around

    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var spaceShip = window.spaceShip;
    var background = window.background;

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // screen ready
    var ready = false;

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;

    // astronaut sprite
    var astronaut = assetManager.getSprite("assets","astronautWaving");
    astronaut.x = 327;
    astronaut.y = 120;





    // ------------------------------------------------- public methods
    this.showMe = function(){
        // position and show spaceShip on screen
        spaceShip.showMeOn(screen, 232, 970);
        spaceShip.flyOnStage(onReady);

        // add astronaut to screen
        astronaut.gotoAndPlay("astronautWaving");
        screen.addChild(astronaut);
        // tween astronaut hovering up and down
        createjs.Tween.get(astronaut,{loop:true}).to({y:astronaut.y + 20}, 4000).to({y:astronaut.y}, 4000);



        // set background to stop moving
        background.setMoving(false);

        root.addChild(screen);
    };

    this.hideMe = function(){
        // cleanup
        ready = false;
        astronaut.stop();
        astronaut.removeEventListener("mousedown", onMoveAstronaut);

        root.removeChild(screen);
    };

    // ------------------------------------------------- event handler
    function onMoveAstronaut(e) {

        console.log("save astronaut!");

        // kill looping tweens
        createjs.Tween.removeAllTweens();

        // ???????????????
        // play animation of astronaut while moving

        // open the cockpit on spaceship
        spaceShip.toggleCockpit(true);
        // animate astronaut moving into spaceship
        createjs.Tween.get(astronaut).to({y:spaceShip.getSprite().y + 60,rotation:270}, 3000).call(onRescueAstronaut);
    }

    function onRescueAstronaut(e) {

        // ????????????????????
        // play animation of astronaut entering the spaceship

        // close cockpit
        spaceShip.toggleCockpit(false);
        // remove astronaut
        screen.removeChild(astronaut);
        spaceShip.flyOffStage(onComplete);
    }

    function onReady(e) {
        ready = true;

        // turn off spaceship thrust
        spaceShip.activateThrust(false);
        astronaut.addEventListener("mousedown", onMoveAstronaut);
    }



    function onComplete(e) {
        // kill all tweens
        createjs.Tween.removeAllTweens();
        // stage is complete
        //screen.dispatchEvent(completeEvent);

        console.log("GAME COMPLETE!");

    }

};

var StartStage = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var background = window.background.getSprite();

    // event to be dispatched when this stage is complete
    var completeEvent = new createjs.Event("onStageComplete", true);

    // master container for this stage's screen
    var screen = new createjs.Container();
    screen.snapToPixelEnabled = true;
    var title = assetManager.getSprite("screens","screenStart",0,130,false);
    screen.addChild(title);

    // ------------------------------------------------- public methods
    this.showMe = function(){
        background.addEventListener("pressup", onStartGame);
        root.addChild(screen);
    };

    this.hideMe = function(){
        background.removeEventListener("pressup", onStartGame);
        root.removeChild(screen);
    };

    // ------------------------------------------------- event handler
    function onStartGame(e){
        assetManager.getSound("beep").play();
        // stage is complete
        screen.dispatchEvent(completeEvent);
    };

};

var SpaceShip = function() {
    // local references to important globals
    var assetManager = window.assetManager;
    var root = window.root;
    var scaleRatio = window.scaleRatio;

    // container to hold spaceship parts
    var container = new createjs.Container();




    // ------------------------------------------------- public methods
    this.getSprite = function() {
        return container;
    };

    this.positionMe = function(x, y) {
        container.x = x;
        container.y = y;
    };

    this.assembleMe = function(newPart) {
        // add part to spaceShip container
        newPart.x = 0;
        newPart.y = 0;
        container.addChildAt(newPart, 0);
    };

    this.showMe = function(screen) {
        screen.addChild(container);
    };






    // ------------------------------------------------- event handlers




};

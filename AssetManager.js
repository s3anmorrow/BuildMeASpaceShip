/*
* AssetManager class
* Sean Morrow
* May 6 / 2014
*/

var AssetManager = function() {
    // keep track of assets
    var manifest = null;
    var counter = -1;
    var total = -1;
    // array of spritesheet objects
    var spriteSheets = [];
    // preloader object
    preloader = new createjs.LoadQueue();

    // construct custom event object and initialize it
    var eventAssetLoaded = new createjs.Event("onAssetLoaded");
    var eventAllLoaded = new createjs.Event("onAllAssetsLoaded");

	// ------------------------------------------------------ event handlers
    onLoaded = function(e) {

        console.log("asset loaded: " + e.item.src);

        // what type of asset was loaded?
        switch(e.item.type) {
            case createjs.LoadQueue.IMAGE:
                // spritesheet loaded
                // get id and source from manifest of currently loaded spritesheet
                var id = e.item.id;
                // store a reference to the actual image that was preloaded
                var image = e.result;
                // get data object from manifest of currently loaded spritesheet
                var data = e.item.data;
                // add images property to data object and tack on loaded spritesheet image from LoadQueue
                // this is so that the SpriteSheet constructor doesn't preload the image again
                // it will do this if you feed it the string path of the spritesheet
                data.images = [image];

                // construct Spritesheet object from source
                spriteSheet = new createjs.SpriteSheet(data);

                // store spritesheet object for later retrieval
                spriteSheets[id] = spriteSheet;
                break;
            case createjs.LoadQueue.SOUND:
                // sound loaded
                break;
        }

        // keeping track of how many loaded?
        counter++;
        // an asset has been loaded
        stage.dispatchEvent(eventAssetLoaded);
    };

    //called if there is an error loading the spriteSheet (usually due to a 404)
    onError = function(e) {
        console.log("Preloader > Error Loading asset");
    };

    onComplete = function(e) {
        console.log("All assets loaded");

        // kill event listeners
        preloader.removeEventListener("fileload", onLoaded);
        preloader.removeEventListener("error", onError);
        preloader.removeEventListener("complete", onComplete);
        // dispatch event that all assets are loaded
        stage.dispatchEvent(eventAllLoaded);
    };

	// ------------------------------------------------------ public methods
    this.getSprite = function(id) {
        // construct sprite object to animate the frames (I call this a clip)
        var sprite = new createjs.Sprite(spriteSheets[id]);
        sprite.name = id;
        sprite.x = 0;
        sprite.y = 0;
        sprite.currentFrame = 0;
        return sprite;
    };

    this.getProgress = function() {
        return (counter/total);
    };

    this.loadAssets = function(myManifest) {
        // setup manifest
        manifest = myManifest;
        counter = 0;
        total = manifest.length;
        // if browser doesn't suppot the ogg it will attempt to look for an mp3
        createjs.Sound.alternateExtensions = ["mp3","wav"];
        // registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
        preloader.installPlugin(createjs.Sound);
        preloader.addEventListener("fileload", onLoaded);
        preloader.addEventListener("error", onError);
        preloader.addEventListener("complete", onComplete);
        preloader.setMaxConnections(5);
        // load first spritesheet to start preloading process
        preloader.loadManifest(manifest);
    };
};

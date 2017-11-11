
BasicGame.Preloader = function (game) {};

BasicGame.Preloader.prototype = {
  
    preload: function () {

        /*
        Show the empty preloadbar
        */
        var preloadBarBackground = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'empty_preloader');
        preloadBarBackground.anchor.setTo(0.5, 0.5);
        preloadBarBackground.scale.set(1, 1);
        preloadBarBackground.width = Utils.width(90);
        preloadBarBackground.height = preloadBarBackground.width / 8;

         /*
        Set the preloadbar filler
        */
        var preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
        preloadBar.anchor.setTo(0.5, 0.5);
        preloadBar.scale.set(1, 1);
        preloadBar.width = Utils.width(90) - 6;
        preloadBar.height = preloadBarBackground.width / 8;
        this.load.setPreloadSprite(preloadBar);

         /*
        Add text "LOADING" to preloadbar
        */
        var style = { font: 'bold 20pt proxima_nova_ltthin', fill: '#FCFCFC', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width};
        text = this.game.add.text(0, 0, "LOADING", style);
        text.setTextBounds(0,0, this.game.width, this.game.height);

        /*
        Actually do some preloading
        */
        this.load.spritesheet('star', 'assets/images/spritesheets/star.png', 64, 64);
        this.load.spritesheet('spinner', 'assets/images/spritesheets/loader_spritesheet.gif', 64, 64);
        this.load.spritesheet('logo', 'assets/images/spritesheets/logo.png', 639, 171);
        this.load.spritesheet('arrow_up', 'assets/images/spritesheets/arrow_up.png', 639, 171);
        this.load.spritesheet('linkedin', 'assets/images/spritesheets/linkedin.png', 48, 48);
        this.load.spritesheet('github', 'assets/images/spritesheets/github-logo.png', 64, 64);
        this.load.spritesheet('background', 'assets/images/spritesheets/background.png', 1, 1);


    },

    /*
    Immediately start the main menu state when everything is loaded
    */
    update: function () {
        this.state.start('MainMenu');
    }
};
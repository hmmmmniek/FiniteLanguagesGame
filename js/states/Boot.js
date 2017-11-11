

    BasicGame = {
        orientated: false,
    };

    BasicGame.Boot = function (game) { };

    BasicGame.Boot.prototype = {

        preload: function () {



            this.load.spritesheet('empty_preloader', 'assets/images/spritesheets/empty_preloader.png', 800, 100);
            this.load.spritesheet('preloader', 'assets/images/spritesheets/preloader.png', 1, 1);
            this.game.stage.backgroundColor = Phaser.Color.getColor(252, 0, 252);
        },


        create: function () {

             /*
            Multitouch is not necessary
            */
            this.input.maxPointers = 1;

             /*
            Center the game on the screen
            */
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

             /*
            This just looks nice for the demo
            */
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.state.start('Preloader');
        }
    };



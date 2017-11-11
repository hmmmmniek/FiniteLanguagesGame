BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {



    create: function () {

        /*
        Add a background, which is actually just a big button which will redirect the player to the language selection when pressed
        */
        this.background = this.game.add.button(0,0, "",
            function () {
                this.state.start('LanguagesSelection', true, false);
            }, this, 2, 1, 0);
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        this.background.anchor.setTo(0, 0);

        /*
        Finite languages logo
        */
        var logo = this.game.add.sprite(0, 0, "logo", 1);
        logo.width = Utils.width(90);
        logo.height = Utils.width(24);
        logo.anchor.setTo(.5, .5);

        /*
        Subtitle
        */
        var style = { font: Utils.width(3)+"pt futura_pt", fill: 'black', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width};
        text = this.game.add.text(0, 0, "VOCABULARY PRACTICE, CLICK TO START!", style);
        text.setTextBounds(-this.game.world.centerX, Utils.width(10), this.game.width, 0);

        /*
        Group for convenience so the logo and subtitle move exactly the same
        */
        this.spriteGroup = this.game.add.group();
        this.spriteGroup.add(text);
        this.spriteGroup.add(logo);
        this.spriteGroup.x = this.game.world.centerX;
        this.spriteGroup.y = -Utils.width(12);

        /*
        Bounce the logo and subtitle into the game window woooo
        */
        tween = this.game.add.tween(this.spriteGroup).to({ y: this.game.world.centerY - Utils.width(12)}, 5000, Phaser.Easing.Bounce.Out, true);

        /*
        Group for convenience so all the credits info move exactly the same
        */
        this.creditsGroup = this.game.add.group();

        /*
        This is the little arrow you see above "Contact" in the game
        */
        var creditsarrow = this.game.add.sprite(this.game.world.centerX, Utils.height(96), "arrow_up", 1);
        creditsarrow.width = Utils.width(5);
        creditsarrow.height = Utils.width(5);
        creditsarrow.anchor.setTo(.5, .5);

        /*
        This is an invisible button around the arrow and "Contact" text in the game. When pressed it either makes the info pop up or it hides the info.
        Also, the little arrow rotates WOW!
        */
        creditsButton = this.game.add.button(this.game.world.centerX, this.game.height, "",
            function () {
                if (this.creditsGroup.y == Utils.height(0) ) {
                    this.game.add.tween(this.creditsGroup).to({ y: -Utils.height(10) }, 500, Phaser.Easing.Cubic.InOut, true);
                    this.game.add.tween(creditsarrow).to({ angle: 180 }, 500, Phaser.Easing.Cubic.InOut, true);

                    
                } else {
                    this.game.add.tween(this.creditsGroup).to({ y: Utils.height(0) }, 500, Phaser.Easing.Cubic.InOut, true);
                    this.game.add.tween(creditsarrow).to({ angle: 0 }, 500, Phaser.Easing.Cubic.InOut, true);

                }
            }, this, 2, 1, 0);
        creditsButton.width = Utils.width(70);
        creditsButton.height = Utils.height(20);
        creditsButton.anchor.setTo(.5, .5);

        /*
        The contact info and buttons
        */
        var style = { font: "bold "+Utils.width(3)+'pt proxima_nova_ltthin', fill: 'black', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        creditsText = this.game.add.text(0, 0, "Contact", style);
        creditsText.setTextBounds(0, Utils.height(99), this.game.width, 0);

        var style = { font: "bold " +Utils.width(3) +'pt proxima_nova_ltthin', fill: 'black', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        creditsTextDeveloper = this.game.add.text(0, 0, "Developer: Niek de Wit", style);
        creditsTextDeveloper.setTextBounds(-Utils.width(3), Utils.height(103), this.game.width, 0);

        linkedInIcon = this.game.add.button(this.game.world.centerX + Utils.width(19), Utils.height(101.8) , "linkedin", null, this, 2, 1, 0);
        linkedInIcon.width = Utils.width(4);
        linkedInIcon.height = Utils.width(4);
        linkedInIcon.anchor.setTo(0, 0);

        linkedInButton = this.game.add.button(Utils.width(25), Utils.height(101.8), "",
            function () {
                window.location.href = "https://www.linkedin.com/in/niekdewit/";
            }, this, 2, 1, 0);
        linkedInButton.width = Utils.width(50);
        linkedInButton.height = Utils.width(5);
        linkedInButton.anchor.setTo(0, 0);


        
        creditsTextSource = this.game.add.text(0, 0, "Sourcecode: Github     ", style);
        creditsTextSource.setTextBounds(-Utils.width(3), Utils.height(107), this.game.width, 0);

        githubIcon = this.game.add.button(this.game.world.centerX + Utils.width(19), Utils.height(105.8), "github", null, this, 2, 1, 0);
        githubIcon.width = Utils.width(4);
        githubIcon.height = Utils.width(4);
        githubIcon.anchor.setTo(0, 0);

        githubButton = this.game.add.button(Utils.width(25), Utils.height(105.8), "",
            function () {
                window.location.href = "https://github.com/hmmmmniek/FiniteLanguagesGame";
            }, this, 2, 1, 0);
        githubButton.width = Utils.width(50);
        githubButton.height = Utils.width(4);
        githubButton.anchor.setTo(0, 0);

        this.creditsGroup.add(creditsarrow);
        this.creditsGroup.add(creditsButton);
        this.creditsGroup.add(creditsText);
        this.creditsGroup.add(creditsTextDeveloper);
        this.creditsGroup.add(linkedInButton);
        this.creditsGroup.add(linkedInIcon);
        this.creditsGroup.add(creditsTextSource);
        this.creditsGroup.add(githubButton);
        this.creditsGroup.add(githubIcon);
        this.creditsGroup.y = Utils.height(15);

        /*
        Make the credits button fly in on startup.
        */
        creditstween = this.game.add.tween(this.creditsGroup).to({ y: Utils.height(0) }, 2000, Phaser.Easing.Cubic.InOut, true);

        /*
        These are 2 unending loops which makes the logo and subtitle scale and rotate a little, giving it a breathing effect.
        */
        this.randomScaleTweenLogo();
        this.randomRotationTweenLogo();

    },

    randomScaleTweenLogo: function () {
        var randomScale = Utils.random(0.85, 1.15);
        var randomTime = Utils.random(2000, 5000);
        scalingTween = this.game.add.tween(this.spriteGroup.scale).to({ x: randomScale, y: randomScale }, randomTime, Phaser.Easing.Back.InOut, true);
        scalingTween.onComplete.add(this.randomScaleTweenLogo, this);
    },

    randomRotationTweenLogo: function () {
        var randomRotation = Utils.random(-3, 3);
        var randomTime = Utils.random(2000, 5000);
        scalingTween = this.game.add.tween(this.spriteGroup).to({ angle: randomRotation }, randomTime, Phaser.Easing.Back.InOut, true);
        scalingTween.onComplete.add(this.randomRotationTweenLogo, this);
    }
};

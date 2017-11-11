BasicGame.DifficultySelection = function (game) {
};

BasicGame.DifficultySelection.prototype = {

    init: function (lang1, lang2, amount, difficulty) {
        this.language1 = lang1;
        this.language2 = lang2;
        this.pairAmount = amount;

        if (difficulty) {
            this.selectedDifficulty = difficulty;
        } else {
            this.selectedDifficulty = "Normal";
        }
    },


    create: function () {

        /*
        The blur which will appear when loading the random words
        */
        this.blurryBackground = this.add.sprite(0, 0, 'background');
        this.blurryBackground.width = this.game.width;
        this.blurryBackground.height = this.game.height;
        this.blurryBackground.alpha = 0;

        /*
        The loading icon which will appear when loading the random words
        */
        this.spinner = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spinner');
        this.spinner.animations.add('spin');
        this.spinner.animations.play('spin', 50, true);
        this.spinner.anchor.x = 0.5;
        this.spinner.anchor.y = 0.5;
        this.game.world.sendToBack(this.spinner);

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.lineStyle(1, 0xBABABA, 1);
        graphics.moveTo(20, 80);
        graphics.lineTo(this.game.width - 40, 80);
        graphics.endFill();

        var style = { font: '20pt futura_pt', fill: '#272727', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        text = this.game.add.text(0, 0, "DIFFICULTY OF THE WORDS*", style);
        text.setTextBounds(0, 0, this.game.width, 80);

        backButton = this.game.add.button(10, 65, "arrow_up",
            function () {
                this.state.start('AmountSelection', true, false, this.language1, this.language2, this.pairAmount);
            }, this, 2, 1, 0);
        backButton.name = "back to menu";
        backButton.width = 50;
        backButton.height = 50;
        backButton.anchor.setTo(0, 0);
        backButton.angle = -90;

        /*
        The position an dimentions of the buttons
        width = wd
        radius = rd
        height = hd
        y position = yd

        added the d because it would interfere with the continuebutton parameters otherwise
        */
        var wd = this.game.world.width / 3 - 20 - (20 /3);
        var rd = 3;
        var hd = 100;
        var yd = this.game.world.centerY - 50;

        var xd1 = 20;
        var parentThis = this;
        var easyButton = Utils.AddButton(parentThis, xd1, yd, wd, hd, rd, "Easy", this.selectedDifficulty == "Easy", false,
            function (button) { },
            function (button) {
                if (easyButton.selected) {
                    easyButton.lineStyle(2, 0x272727, 1);
                    easyButton.beginFill(0xFE623C, 1);
                    easyButton.drawRoundedRect(0, 0, wd, hd, rd);
                    easyButton.endFill();
                    easyButton.text.addColor("#FCFCFC", 0);
                    parentThis.game.world.bringToTop(easyButton.text);
                }
            },
            function (button) {
                easyButton.lineStyle(2, 0x272727, 1);
                easyButton.beginFill(0xFE623C, 1);
                easyButton.drawRoundedRect(0, 0, wd, hd, rd);
                easyButton.endFill();
                easyButton.text.addColor("#FCFCFC", 0);
                easyButton.selected = true;
                parentThis.game.world.bringToTop(easyButton.text);

                normalButton.lineStyle(2, 0x272727, 1);
                normalButton.beginFill(0xFCFCFC, 1);
                normalButton.drawRoundedRect(0, 0, wd, hd, rd);
                normalButton.endFill();
                normalButton.text.addColor("#272727", 0);
                normalButton.selected = false;
                parentThis.game.world.bringToTop(normalButton.text);

                hardButton.lineStyle(2, 0x272727, 1);
                hardButton.beginFill(0xFCFCFC, 1);
                hardButton.drawRoundedRect(0, 0, wd, hd, rd);
                hardButton.endFill();
                hardButton.text.addColor("#272727", 0);
                hardButton.selected = false;
                parentThis.game.world.bringToTop(hardButton.text);

                parentThis.setDifficulty("Easy");
            }
        );
        easyButton.text.lineSpacing = -10;

        var xd2 = wd + 20 * 2;
        var parentThis = this;
        var normalButton = Utils.AddButton(parentThis, xd2, yd, wd, hd, rd, "Normal", this.selectedDifficulty == "Normal", false,
            function (button) { },
            function (button) {
                if (normalButton.selected) {
                    normalButton.lineStyle(2, 0x272727, 1);
                    normalButton.beginFill(0xFE623C, 1);
                    normalButton.drawRoundedRect(0, 0, wd, hd, rd);
                    normalButton.endFill();
                    normalButton.text.addColor("#FCFCFC", 0);
                    parentThis.game.world.bringToTop(normalButton.text);
                }
            },
            function (button) {
                normalButton.lineStyle(2, 0x272727, 1);
                normalButton.beginFill(0xFE623C, 1);
                normalButton.drawRoundedRect(0, 0, wd, hd, rd);
                normalButton.endFill();
                normalButton.text.addColor("#FCFCFC", 0);
                normalButton.selected = true;
                parentThis.game.world.bringToTop(normalButton.text);

                easyButton.lineStyle(2, 0x272727, 1);
                easyButton.beginFill(0xFCFCFC, 1);
                easyButton.drawRoundedRect(0, 0, wd, hd, rd);
                easyButton.endFill();
                easyButton.text.addColor("#272727", 0);
                easyButton.selected = false;
                parentThis.game.world.bringToTop(easyButton.text);

                hardButton.lineStyle(2, 0x272727, 1);
                hardButton.beginFill(0xFCFCFC, 1);
                hardButton.drawRoundedRect(0, 0, wd, hd, rd);
                hardButton.endFill();
                hardButton.text.addColor("#272727", 0);
                hardButton.selected = false;
                parentThis.game.world.bringToTop(hardButton.text);

                parentThis.setDifficulty("Normal");
            }
        );
        normalButton.text.lineSpacing = -10;
     
        var xd3 = wd * 2 + 20 * 3;
        var parentThis = this;
        var hardButton = Utils.AddButton(parentThis, xd3, yd, wd, hd, rd, "Hard", this.selectedDifficulty == "Hard", false,
            function (button) { },
            function (button) {
                if (hardButton.selected) {
                    hardButton.lineStyle(2, 0x272727, 1);
                    hardButton.beginFill(0xFE623C, 1);
                    hardButton.drawRoundedRect(0, 0, wd, hd, rd);
                    hardButton.endFill();
                    hardButton.text.addColor("#FCFCFC", 0);
                    parentThis.game.world.bringToTop(hardButton.text);
                }
            },
            function (button) {
                hardButton.lineStyle(2, 0x272727, 1);
                hardButton.beginFill(0xFE623C, 1);
                hardButton.drawRoundedRect(0, 0, wd, hd, rd);
                hardButton.endFill();
                hardButton.text.addColor("#FCFCFC", 0);
                hardButton.selected = true;
                hardButton.game.world.bringToTop(easyButton.text);

                normalButton.lineStyle(2, 0x272727, 1);
                normalButton.beginFill(0xFCFCFC, 1);
                normalButton.drawRoundedRect(0, 0, wd, hd, rd);
                normalButton.endFill();
                normalButton.text.addColor("#272727", 0);
                normalButton.selected = false;
                parentThis.game.world.bringToTop(normalButton.text);

                easyButton.lineStyle(2, 0x272727, 1);
                easyButton.beginFill(0xFCFCFC, 1);
                easyButton.drawRoundedRect(0, 0, wd, hd, rd);
                easyButton.endFill();
                easyButton.text.addColor("#272727", 0);
                easyButton.selected = false;
                parentThis.game.world.bringToTop(easyButton.text);

                parentThis.setDifficulty("Hard");
            }
        );
        hardButton.text.lineSpacing = -10;

        var style = { font: 'bold 11pt proxima_nova_ltthin', fill: '#BABABA', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        text = this.game.add.text(0, 0, "*Easy means the words are short and frequently used in texts, hard is the opposite.", style);
        text.setTextBounds(0, this.game.height - 110, this.game.width, 40);

        var line = this.game.add.graphics(0, 0);
        line.beginFill(0x000000);
        line.lineStyle(1, 0xBABABA, 1);
        line.moveTo(20, this.game.height - 80);
        line.lineTo(this.game.width - 40, this.game.height - 80);
        line.endFill();

        var x = this.game.world.centerX / 2;
        var y = this.game.height - 62;
        var r = 3;
        var w = 400;
        var h = 45;
        var parentThis = this;
        this.continueButtonGraphics = Utils.AddButton(parentThis, x, y, w, h, r, "", false, false,
            function (button) { },
            function (button) { },
            function (button) {
                minCorpusCount = 50000;
                maxCorpusCount = 500000;
                minLength = 5
                maxLength = 15;

                if (parentThis.selectedDifficulty == "Hard") {
                    minCorpusCount = 1000;
                    maxCorpusCount = 100000;
                    minLength = 12;
                    maxLength = 30;
                } else if (parentThis.selectedDifficulty == "Easy") {
                    minCorpusCount = 1000000;
                    maxCorpusCount = -1;
                    minLength = -1;
                    maxLength = 8;
                }
                parentThis.blurryBackground.alpha = 0.9;
                parentThis.game.world.bringToTop(parentThis.blurryBackground);

                parentThis.game.world.bringToTop(parentThis.spinner);

                thisState = parentThis.state;
                Utils.GetRandomCombinations(parentThis.pairAmount, minCorpusCount, maxCorpusCount, minLength, maxLength, parentThis.language1, parentThis.language2, function (result) {
                    thisState.start('Game', true, false, result, parentThis.selectedDifficulty);
                });

            }
        );
        this.continueButtonGraphics.text.lineSpacing = -10;

        this.setDifficulty(this.selectedDifficulty);
    },

    setDifficulty: function (difficulty) {
        if (difficulty == "Easy") {
            this.continueButtonGraphics.text.text = "It's important to start with the most common words first!"
        }
        else if (difficulty == "Normal") {
            this.continueButtonGraphics.text.text = "Let's start with some casual words."
        }
        else if (difficulty == "Hard") {
            this.continueButtonGraphics.text.text = "Hit me up with your most obscure words!";
        }
        this.selectedDifficulty = difficulty;
    }
   
    

};
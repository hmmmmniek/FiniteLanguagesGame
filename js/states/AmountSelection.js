BasicGame.AmountSelection = function (game) {
    /*
    Selection = selected number of pairs
    MaxSelection = maximum amount which is selectable, currently 9 because double digits dont align wel in the slider selector dot thingy
    MinSelection = pretty straigtforward
    MinPosition = minimum x position the dot can move towards
    MaxPosition = maximum x position the dot can move towrards
    SelectionDot = the dot which moves when you drag it
    */
    this.selection;
    this.maxSelection = 9;
    this.minSelection = 2;
    this.minPosition = 100;
    this.maxPosition = game.width - 100;
    this.selectionDot;
};

BasicGame.AmountSelection.prototype = {
    /*
    Optional parameters, will be filled when maintaining game state.
    slider wil automatically move to amount parameter when showing screen.

    Lang1 and Lang2 are 2 languages from the Utils.Translator.Langs array which are needed to start the game, they are always filled.
    */
    init: function (lang1, lang2, amount) {
        this.language1 = lang1;
        this.language2 = lang2;

        if (amount) {
            this.selection = amount;
        }
    },


    create: function () {

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.lineStyle(1, 0xBABABA, 1);
        graphics.moveTo(20, 80);
        graphics.lineTo(this.game.width - 40, 80);
        graphics.endFill();

        var style = { font: '20pt futura_pt', fill: '#272727', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        text = this.game.add.text(0, 0, "NUMBER OF WORD PAIRS ON THE TABLE", style);
        text.setTextBounds(0, 0, this.game.width, 80);

        backButton = this.game.add.button(10, 65, "arrow_up",
            function () {
                this.state.start('LanguagesSelection', true, false, this.language1, this.language2);
            }, this, 2, 1, 0);
        backButton.name = "back to menu";
        backButton.width = 50;
        backButton.height = 50;
        backButton.anchor.setTo(0, 0);
        backButton.angle = -90;

        var line = this.game.add.graphics(100, this.game.world.centerY);
        line.lineStyle(1, 0x272727, 1);
        line.beginFill(0x272727, 1);
        line.drawRect(0, 0, this.game.world.width - 200, 2)
        line.endFill();

        /*
        Create the slider
        */
        this.selectionDot = this.game.add.graphics(0, this.game.world.centerY);
        this.selectionDot.lineStyle(3, 0x272727, 1);
        this.selectionDot.beginFill(0xFE623C, 1);
        this.selectionDot.drawCircle(0, 0, 30)
        this.selectionDot.endFill();
        this.selectionDot.inputEnabled = true;
        this.selectionDot.input.useHandCursor = true;
        this.selectionDot.input.enableDrag(false);
        this.selectionDot.input.setDragLock(true, false);

        var style = { font: 'bold 16pt proxima_nova_ltthin', fill: '#FCFCFC', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        this.selectionDotText = this.game.add.text(250, this.game.world.centerY - 30, "4", style);
        this.selectionDotText.setTextBounds(0, 0, 40, 40);
        this.selectionDotText.anchor.x = 1.4;
        this.selectionDotText.anchor.y = -.4;

        parentThis = this;
        this.selectionDot.events.onDragUpdate.add(function ()
        {
            parentThis.setSelection((parentThis.selectionDot.position.x - parentThis.minPosition) / (parentThis.maxPosition - parentThis.minPosition));
        });

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
        var text = "";
        var parentThis = this;
        this.continueButtonGraphics = Utils.AddButton(parentThis, x, y, w, h, r, text, false, false,
            function (button) { },
            function (button) { },
            function (button) {
                parentThis.state.start('DifficultySelection', true, false, parentThis.language1, parentThis.language2, parentThis.selection);
            }
        );
        this.continueButtonGraphics.text.lineSpacing = -10;

        /*
        Automatically set the selection if there is any from the start
        */
        if (this.selection) {
            var value = this.selection;
            this.setSelection(this.selection / (this.maxSelection + this.minSelection));

        } else {
            this.setSelection(0.5);
        }
    },

    /*
    Making the selection dot snap to whole value positions, I should change this so it will only snap at OnMouseUp
    */
    setSelection: function (value) {
        if (value > 1) {
            value = 1;
        }
        if (value < 0) {
            value = 0;
        }
        value = value * (this.maxSelection - this.minSelection);

        value = Math.round(value);

        this.selection = (value + this.minSelection);
        this.continueButtonGraphics.text.text = this.selection + " pairs of words, please!";
        var xpos = this.minPosition + (((this.maxPosition - this.minPosition) / (this.maxSelection - (this.minSelection ))) * (value));
        this.selectionDot.position.x = xpos;
        this.selectionDotText.position.x = xpos;
        this.selectionDotText.text = this.selection;
    }
};
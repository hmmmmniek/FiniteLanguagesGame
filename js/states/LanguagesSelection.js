BasicGame.LanguagesSelection = function (game) {
    /*
    Utils.Translator.Langs objects
    */
    this.languageSelection1 = null;
    this.languageSelection2 = null;

    this.languageButtons = [];
    this.maxScroll = 0;
    this.minScroll = (100 + Utils.Translator.Langs.length / 2 * 25) * -1;
    this.currentScrollAmount = 0;
};

BasicGame.LanguagesSelection.prototype = {

    /*
    Optional parameters, when the back button is pressed, or when a game is finished, these parameters are filled.
    The buttons list will automatically be selected when they are passed as parameters.

    These are 2 languages from the Utils.Translator.Langs array.
    */
    init: function (lang1, lang2) {
        if (lang1) {
            this.languageSelection1 = lang1;
        }
        else {
            this.languageSelection1 = null;
        }

        if (lang2) {
            this.languageSelection2 = lang2;
        }
        else {
            this.languageSelection2 = null;
        }
    },

    create: function () {

        /*
        Add the scrollbar
        */
        var line = this.game.add.graphics(this.game.width - 50, 100);
        line.lineStyle(1, 0x272727, 1);
        line.beginFill(0x272727, 1);
        line.drawRect(0, 0, 2, this.game.height - 200)
        line.endFill();
  
        this.selectionDot = this.game.add.graphics(this.game.width - 49, 100);
        this.selectionDot.lineStyle(3, 0x272727 , 1);
        this.selectionDot.beginFill(0xFE623C, 1);
        this.selectionDot.drawCircle(0, 0, 30)
        this.selectionDot.endFill();
        this.selectionDot.inputEnabled = true;
        this.selectionDot.input.useHandCursor = true;
        this.selectionDot.input.enableDrag(false);
        this.selectionDot.input.setDragLock(false, true);
        this.selectionDot.anchor.x = .25;        

        parentThis = this;
        this.selectionDot.events.onDragUpdate.add(function () {
            parentThis.scrollTo((parentThis.selectionDot.position.y - 100) / (parentThis.game.height - 200));
        });

        /*
        Added this group so all the buttons can move the exact same way
        */
        this.languageButtonGroup = this.game.add.group();


        /*
        Add all buttons in 2 rows
        */
        for (var i = 0; i < Utils.Translator.Langs.length; i+=2) {
            createButton = function (parentThis, index, leftRight) {

                var selected = (parentThis.languageSelection1 != null && parentThis.languageSelection1.id == Utils.Translator.Langs[index].id) || (parentThis.languageSelection2 != null && parentThis.languageSelection2.id == Utils.Translator.Langs[index].id);

                var offset = 135;
                var positionIndex = index;
                if (leftRight) {
                    offset = -135;
                    positionIndex--;
                }

                var x = parentThis.game.world.centerX - 125 + offset;
                var y = 100 + positionIndex / 2 * 35;
                var r = 3;
                var w = 250;
                var h = 25;
                var text = Utils.Translator.Langs[index].language;
                var button = Utils.AddButton(parentThis, x, y, w, h, r, text, selected, true,
                    function (button) { },
                    function (button) { },
                    function (button) {
                        var language = Utils.Translator.Langs[index];
                        if (parentThis.languageSelection1 == null) {
                            if (parentThis.languageSelection2 == null) {
                                parentThis.languageSelection1 = language;
                            } else {
                                if (parentThis.languageSelection2 == language) {
                                    parentThis.languageSelection2 = null;
                                } else {
                                    parentThis.languageSelection1 = language;
                                }
                            }
                        } else {
                            if (parentThis.languageSelection2 == null) {
                                if (parentThis.languageSelection1 == language) {
                                    parentThis.languageSelection1 = null;
                                } else {
                                    parentThis.languageSelection2 = language;
                                }
                            } else {
                                if (parentThis.languageSelection2 == language) {
                                    parentThis.languageSelection2 = null;
                                } else if (parentThis.languageSelection1 == language) {
                                    parentThis.languageSelection1 = null;
                                } else {
                                    button.lineStyle(2, 0x272727, 1);
                                    button.beginFill(0x272727, 1);
                                    button.selected = false;
                                    button.drawRoundedRect(0, 0, w, h, r)
                                    button.endFill();
                                    button.text.addColor("#FCFCFC", 0);

                                    parentThis.game.world.bringToTop(button.text);
                                }
                            }
                        }

                        if (parentThis.languageSelection1 != null) {
                            if (parentThis.languageSelection2 != null) {
                                parentThis.continueButtonGraphics.text.text = "I want to practice " + parentThis.languageSelection1.language + " and " + parentThis.languageSelection2.language + "!";
                            } else {
                                parentThis.continueButtonGraphics.text.text = "I want to practice " + parentThis.languageSelection1.language + " and... what else?";
                            }
                        }
                        else {
                            if (parentThis.languageSelection2 != null) {
                                parentThis.continueButtonGraphics.text.text = "I want to practice " + parentThis.languageSelection2.language + " and... what else?";
                            } else {
                                parentThis.continueButtonGraphics.text.text = "I want to practice...";
                            }
                        }
                    }
                );
                parentThis.languageButtonGroup.add(button);
                parentThis.languageButtonGroup.add(button.text);
            };

            createButton(this, i, false);
            if (i + 1 < Utils.Translator.Langs.length) {
                createButton(this, i + 1, true);
            }

        }

        /*
        Overlay is necessary to hide the buttons when scrolling, this stuff is added so late because it needs to be on top of the buttons
        */
        this.topOverlay = this.add.sprite(0, 0, 'background');
        this.topOverlay.width = this.game.width;
        this.topOverlay.height = 80;

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.lineStyle(1, 0xBABABA, 1);
        graphics.moveTo(20, 80);
        graphics.lineTo(this.game.width - 40, 80);
        graphics.endFill();

        var style = { font: '20pt futura_pt', fill: '#272727', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width };
        text = this.game.add.text(0, 0, "SELECT THE LANGUAGES WHICH YOU WANT TO LEARN!", style);
        text.setTextBounds(0, 0, this.game.width, 80);

        backButton = this.game.add.button(10, 65, "arrow_up",
            function () {
                this.state.start('MainMenu', true, false);
            }, this, 2, 1, 0);
        backButton.name = "back to menu";
        backButton.width = 50;
        backButton.height = 50;
        backButton.anchor.setTo(0, 0);
        backButton.angle = -90;

        /**
         same reason for this overlay, needs to be on top of the language buttons
         */
        var continueButtonBackground = this.add.sprite(0, this.game.height-80, 'background');
        continueButtonBackground.width = this.game.width;
        continueButtonBackground.height = 80;

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
        var text = "I want to practice...";
        var parentThis = this;
        this.continueButtonGraphics = Utils.AddButton(parentThis, x, y, w, h, r, text, false, false,
            function (button) { },
            function (button) { },
            function (button) {
                if (parentThis.languageSelection1 != null && parentThis.languageSelection2 != null) {
                    parentThis.state.start('AmountSelection', true, false, parentThis.languageSelection1, parentThis.languageSelection2);
                }
            }
        );
        this.continueButtonGraphics.text.lineSpacing = -10;

        /**
        Immediately select the languages when the they are selected, for example when pressing the back button on the next page
        */
        if (this.languageSelection1 != null && this.languageSelection2 != null) {
            this.continueButtonGraphics.text.text = "I want to practice " + this.languageSelection1.language + " and " + this.languageSelection2.language + "!";
        }

        /*
        Add mouse scroll events
        */
        this.game.input.mouse.mouseWheelCallback = function (event) {
            if (event.deltaY < 0) {
                if (parentThis.currentScrollAmount > 0) {
                    parentThis.scrollTo(parentThis.currentScrollAmount - 0.05);
                }
            } else {
                if (parentThis.currentScrollAmount < 1) {
                    parentThis.scrollTo(parentThis.currentScrollAmount + 0.05);
                }
            }
        }

    },

    /*
    This function handles the scrolling, it takes a number from 0 to 1 which determines how far the scroll needs to go.
    */
    scrollTo: function (scrollAmount) {
        if (scrollAmount > 1) {
            scrollAmount = 1;
        }
        if (scrollAmount < 0) {
            scrollAmount = 0;
        }
        this.languageButtonGroup.y = this.minScroll * scrollAmount;

        this.selectionDot.position.y = 100 + ((this.game.height - 200) * scrollAmount);

        this.currentScrollAmount = scrollAmount;

    },    
};

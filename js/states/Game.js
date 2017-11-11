
BasicGame.Game = function (game) {

    /*
    Cards is a list of objects which consists of:
        - typeID: number - cards with the same typeID belong together, there will always be 2 cards with the same typeID
        - text: string - the text to be displayed on the card, this is the word of the specific language
        - language: Utils.Translator.Langs array object - The language in which the text is written.
        - flipped: boolean - whether the card is currently showing its value;

    boardheight: number - is the height of the board in which the cards are shown
    boardwidth: number - is the width of the board in which the cards are shown
    cardmargin: number - is the distance between the cards
    pairamount: number - the amount of pairs on the board
    *selectedcard: card object from the list - the selected cards which are flipped and showing its value
    emmitters: emiter object - for the fabulous star explosion when you find a combination
    */

    this.cards = [];
    this.boardheight = game.height - 80;
    this.boardwidth = game.width;

    this.cardmarginx = 20;
    this.cardmarginy = 20;

    this.pairAmount = 0;

    this.firstSelectedCard;
    this.secondSelectedCard;

    this.emitter1;
    this.emitter2;

    this.cardwidth;
    this.cardheight;
};


BasicGame.Game.prototype = {

    /*
    parameters necessary to start the game
    */

    init: function(data, difficulty) 
    {
        this.cards = [];
        this.words = data.words;
        this.pairAmount = data.words.length;
        this.language1 = data.lang1;
        this.language2 = data.lang2;
        this.difficulty = difficulty;

        this.firstSelectedCard = null;
        this.secondSelectedCard = null;
    },

    create: function () {

        /*
        Overlay and button which are displayed when you finish the game
        */
        this.finishOverlay = this.add.sprite(0, 0, 'background');
        this.finishOverlay.width = this.game.width;
        this.finishOverlay.height = this.game.height;
        this.finishOverlay.alpha = 0;

        var x = this.game.world.centerX - 150;
        var y = this.game.world.centerY + 50;
        var r = 3;
        var w = 300;
        var h = 100;
        var parentThis = this;
        this.finishButton = Utils.AddButton(parentThis, x, y, w, h, r, "Return to game setup", false, false,
            function (button) { },
            function (button) { },
            function (button) {
                parentThis.state.start('LanguagesSelection', true, false, parentThis.language1, parentThis.language2);
            }
        );
        this.finishButton.text.lineSpacing = -10;
        this.finishButton.inputEnabled = false;

        var style = { font: '20pt futura_pt', fill: '#272727', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width - 200 };
        this.finishText = this.game.add.text(0, 0, "AWESOME! YOU FINISHED THE GAME!", style);
        this.finishText.setTextBounds(0, 0, this.game.width, this.game.height);
        this.finishText.alpha = 0;


        /**
         background to overlay the finish components
         */
        var background = this.add.sprite(0, 0, 'background');
        background.width = this.game.width;
        background.height = this.game.height;


        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.lineStyle(1, 0xBABABA, 1);
        graphics.moveTo(20, 80);
        graphics.lineTo(this.game.width - 40, 80);
        graphics.endFill();

        var style = { font: '20pt futura_pt', fill: '#272727', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.world.width - 200 };
        text = this.game.add.text(0, 0, "FIND THE CORRECT COMBINATIONS OF " + this.language1.language.toUpperCase() + " AND " + this.language2.language.toUpperCase() + " WORDS!", style);
        text.setTextBounds(0, 0, this.game.width, 80);

        backButton = this.game.add.button(10, 65, "arrow_up",
            function () {
                this.state.start('DifficultySelection', true, false, this.language1, this.language2, this.pairAmount, this.difficulty);
            }, this, 2, 1, 0);
        backButton.name = "back to menu";
        backButton.width = 50;
        backButton.height = 50;
        backButton.anchor.setTo(0, 0);
        backButton.angle = -90;


        /*
        function to display all the cards on the board
        */
        this.buildCards();

        emitter1 = this.addEmitter();
        emitter2 = this.addEmitter();

    },

    addEmitter: function() {

        var emitter = this.game.add.emitter(0, 0, 200);
        emitter.makeParticles('star');
        emitter.gravity = 0;
        emitter.minParticleScale = 0.3;
        emitter.maxParticleScale = 0.8;
        emitter.setAll('anchor.x', 0.5);
        emitter.setAll('anchor.y', 0.5);
        emitter.setAll('width', 64);
        emitter.setAll('height', 64);
        emitter.minParticleSpeed.setTo(-100, -100);
        emitter.maxParticleSpeed.setTo(200, 200);
        return emitter;
    },

    /*
    create all the buttons and everything thats on the board
    */

    buildCards: function () {
        /*
        Fill the list of cards
        */
        for (var i = 0; i < this.pairAmount; i++) {
            this.cards.push(
                { typeID: i, text: this.words[i].lang1, language: this.language1.language, flipped: false },
                { typeID: i, text: this.words[i].lang2, language: this.language2.language, flipped: false }
            );
        }

        /*
        Randomize the list
        */
        this.cards = this.shuffle(this.cards);


        /*
        calculate how many columns and rows of cards there are
        there will always be completely filled rows and collumns to efficiently fill the board
        */
        var xamount = 0;
        var yamount = 0;
        var divisors = [];
        for (var i = 1; i <= this.cards.length; i++) {
            if (this.cards.length % i == 0) {
                divisors.push(i);
            }
        }

        if (divisors.length % 2 == 0) {
            xamount = divisors[divisors.length / 2 - 1];
            yamount = divisors[divisors.length / 2];
        }
        else {
            xamount = divisors[(divisors.length - 1) / 2];
            yamount = divisors[(divisors.length - 1) / 2];
        }

        if (yamount < xamount) {
            oldyamount = yamount;
            yamount = xamount;
            xamount = oldyamount;
        }

        /**
         calculate how far the game is off from the sides and calculate the size of the cards depending on how many cards there are
         */
        var boardoffsetx = (this.game.width - this.boardwidth) / 2;
        var boardoffsety = (this.game.height - this.boardheight) / 2 + 40;

        this.cardwidth = this.boardwidth / xamount - this.cardmarginx / xamount - this.cardmarginx;
        this.cardheight = this.boardheight / yamount - this.cardmarginy / yamount - this.cardmarginy;

        /**
         actually create the cards, the default button utility function is not used since these buttons flip and stuff, its probably too difficult to add this to the generic function
         */
        var i = 0;
        for (var x = 0; x < xamount; x++) {
            for (var y = 0; y < yamount; y++) {

              
                (function (parentThis, index) {

                    var languageButtonGraphics = parentThis.game.add.graphics(
                        (boardoffsetx + parentThis.cardmarginx + x * (parentThis.cardwidth + parentThis.cardmarginx)) + parentThis.cardwidth / 2,
                        (boardoffsety + parentThis.cardmarginy + y * (parentThis.cardheight + parentThis.cardmarginy)) + parentThis.cardheight / 2);
                    languageButtonGraphics.lineStyle(2, 0x272727, 1);
                    languageButtonGraphics.beginFill(0x272727, 1);
                    languageButtonGraphics.drawRoundedRect(-(parentThis.cardwidth / 2), -(parentThis.cardheight / 2), parentThis.cardwidth, parentThis.cardheight, 3);
                    languageButtonGraphics.endFill();

                    languageButtonGraphics.value = parentThis.cards[index];

                    var style = { font: 'bold 16pt proxima_nova_ltthin', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: 250 };
                    languageButtonGraphics.text = parentThis.game.add.text(languageButtonGraphics.x, languageButtonGraphics.y, languageButtonGraphics.value.text, style);
                    languageButtonGraphics.text.anchor.setTo(0.5, 0.5);
                    var size = (parentThis.cardwidth / 0.8) / languageButtonGraphics.value.text.length;

                    /*
                    an maximum font size, otherwise the text will sometimes be too tall for the cards
                    minimum font size because of obvious reasons, it will split the text if its too small
                    */
                    if (size > 30) {
                        size = 30;
                    } if (size < 16) {
                        size = (parentThis.cardwidth / 0.8) / (Math.ceil(languageButtonGraphics.value.text.length / 2));
                        languageButtonGraphics.text.text = [languageButtonGraphics.value.text.slice(0, Math.ceil(languageButtonGraphics.value.text.length / 2)), '- ', languageButtonGraphics.value.text.slice(Math.ceil(languageButtonGraphics.value.text.length / 2))].join('')
                    }
                    languageButtonGraphics.text.fontSize = size;
                    languageButtonGraphics.text.font = '"Lucida Console", Monaco, monospace';
                    languageButtonGraphics.text.addColor("#FCFCFC", 0);

                    parentThis.game.world.sendToBack(languageButtonGraphics.text);

                    languageButtonGraphics.inputEnabled = true;
                    languageButtonGraphics.input.useHandCursor = true;

                    languageButtonGraphics.events.onInputUp.add(parentThis.onClickCard, parentThis);


                }(this, i));
                
                i++;
            
            }
        }
    },

    /*
    randomize the order of the array
    */
    shuffle: function(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    },


    onClickCard: function ( target)
    {
        if (!(this.firstSelectedCard != null && this.secondSelectedCard != null)) {
            var card = target.value;
            if (!card.flipped) {
                if (this.firstSelectedCard != null) {
                    if (this.secondSelectedCard == null) {
                        this.secondSelectedCard = target;

                        var parentThis = this;
                        if (target.value.typeID == this.firstSelectedCard.value.typeID) {
                            this.flipCard(target, function () {
                                parentThis.game.world.bringToTop(emitter1);
                                parentThis.game.world.bringToTop(emitter2);

                                emitter1.x = parentThis.firstSelectedCard.x;
                                emitter1.y = parentThis.firstSelectedCard.y;
                                emitter1.start(true, 20000, null, 20);

                                emitter2.x = parentThis.secondSelectedCard.x;
                                emitter2.y = parentThis.secondSelectedCard.y;
                                emitter2.start(true, 20000, null, 20);

                                parentThis.firstSelectedCard = null;
                                parentThis.secondSelectedCard = null;

                                var broken = false;
                                for (var i = 0; i < parentThis.cards.length; i++) {
                                    if (!parentThis.cards[i].flipped) {
                                        broken = true;
                                        break;
                                    }
                                }
                                if (!broken) {
                                    parentThis.finishButton.inputEnabled = true;

                                    parentThis.finishOverlay.alpha = .9;
                                    parentThis.finishButton.alpha = 1;
                                    parentThis.finishText.alpha = 1;
                                    parentThis.finishButton.text.alpha = 1;

                                    parentThis.game.world.bringToTop(parentThis.finishOverlay);
                                    parentThis.game.world.bringToTop(parentThis.finishButton);
                                    parentThis.game.world.bringToTop(parentThis.finishButton.text);
                                    parentThis.game.world.bringToTop(parentThis.finishText);
                                }
                            }, this);
                        } else {
                            this.flipCard(target, function () {

                                var tween1 = parentThis.game.add.tween(parentThis.firstSelectedCard).to({ x: parentThis.firstSelectedCard.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                tween1.onComplete.add(function () {
                                    var tween2 = parentThis.game.add.tween(parentThis.firstSelectedCard).to({ x: parentThis.firstSelectedCard.x - 40 }, 100, Phaser.Easing.Cubic.InOut);
                                    tween2.onComplete.add(function () {
                                        var tween3 = parentThis.game.add.tween(parentThis.firstSelectedCard).to({ x: parentThis.firstSelectedCard.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                        tween3.onComplete.add(function () {
                                            parentThis.flipCard(parentThis.firstSelectedCard, function () { parentThis.firstSelectedCard = null; }, parentThis)
                                            parentThis.flipCard(parentThis.secondSelectedCard, function () { parentThis.secondSelectedCard = null; }, parentThis)
                                        });
                                        tween3.start();
                                    });
                                    tween2.start();
                                });
                                tween1.start();

                                var tween4 = parentThis.game.add.tween(parentThis.secondSelectedCard).to({ x: parentThis.secondSelectedCard.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                tween4.onComplete.add(function () {
                                    var tween5 = parentThis.game.add.tween(parentThis.secondSelectedCard).to({ x: parentThis.secondSelectedCard.x - 40 }, 100, Phaser.Easing.Cubic.InOut);
                                    tween5.onComplete.add(function () {
                                        var tween6 = parentThis.game.add.tween(parentThis.secondSelectedCard).to({ x: parentThis.secondSelectedCard.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                        tween6.start();
                                    });
                                    tween5.start();
                                });
                                tween4.start();

                                var tween7 = parentThis.game.add.tween(parentThis.secondSelectedCard.text).to({ x: parentThis.secondSelectedCard.text.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                tween7.onComplete.add(function () {
                                    var tween8 = parentThis.game.add.tween(parentThis.secondSelectedCard.text).to({ x: parentThis.secondSelectedCard.text.x - 40 }, 100, Phaser.Easing.Cubic.InOut);
                                    tween8.onComplete.add(function () {
                                        var tween9 = parentThis.game.add.tween(parentThis.secondSelectedCard.text).to({ x: parentThis.secondSelectedCard.text.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                        tween9.start();
                                    });
                                    tween8.start();
                                });
                                tween7.start();

                                var tween10 = parentThis.game.add.tween(parentThis.firstSelectedCard.text).to({ x: parentThis.firstSelectedCard.text.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                tween10.onComplete.add(function () {
                                    var tween11 = parentThis.game.add.tween(parentThis.firstSelectedCard.text).to({ x: parentThis.firstSelectedCard.text.x - 40 }, 100, Phaser.Easing.Cubic.InOut);
                                    tween11.onComplete.add(function () {
                                        var tween12 = parentThis.game.add.tween(parentThis.firstSelectedCard.text).to({ x: parentThis.firstSelectedCard.text.x + 20 }, 50, Phaser.Easing.Cubic.InOut);
                                        tween12.start();
                                    });
                                    tween11.start();
                                });
                                tween10.start();
                            }, this);
                        }
                    }   
                }
                else {
                    this.firstSelectedCard = target;
                    this.flipCard(target, function () {}, this);
                }
            }
        }
    },
    flipCard: function (target, listenerDone, scope) {


            target.inputEnabled = false;
            var originalXScale = target.scale.x;
            var originalYScale = target.scale.y;


            var tween1 = scope.game.add.tween(target.scale).to({ x: originalXScale * 1.2, y: originalYScale * 1.2 }, 100, Phaser.Easing.Linear.None);
            tween1.onComplete.add(function () {
                var tween2 = scope.game.add.tween(target.scale).to({ x: 0}, 100, Phaser.Easing.Linear.None);
                tween2.onComplete.add(function () {       

                    var languageButtonGraphics = scope.game.add.graphics(
                        target.x,
                        target.y);

                    if (target.value.flipped) {
                        languageButtonGraphics.lineStyle(2, 0x272727, 1);
                        languageButtonGraphics.beginFill(0x272727, 1);

                    } else {
                        languageButtonGraphics.lineStyle(2, 0x272727, 1);
                        languageButtonGraphics.beginFill(0xFE623C, 1);
                    }
                    languageButtonGraphics.drawRoundedRect(-(scope.cardwidth / 2), -(scope.cardheight / 2), scope.cardwidth, scope.cardheight, 3);
                    languageButtonGraphics.endFill();
                    languageButtonGraphics.scale.x = 0;
                    languageButtonGraphics.value = target.value;
                    languageButtonGraphics.text = target.text;
                    languageButtonGraphics.inputEnabled = true;
                    languageButtonGraphics.input.useHandCursor = true;
                    languageButtonGraphics.events.onInputUp.add(scope.onClickCard, scope);

                    if (this.firstSelectedCard == target) {
                        this.firstSelectedCard = languageButtonGraphics;
                    } else if (this.secondSelectedCard == target) {
                        this.secondSelectedCard = languageButtonGraphics;
                    }

                    target.destroy();
                   
                    var tween3 = scope.game.add.tween(languageButtonGraphics.scale).to({ x: originalXScale * 1.2 }, 100, Phaser.Easing.Linear.None);
                    tween3.onComplete.add(function () {
                        var tween4 = scope.game.add.tween(languageButtonGraphics.scale).to({ x: originalXScale, y: originalYScale }, 100, Phaser.Easing.Linear.None);
                        tween4.onComplete.add(function () {

                            if (languageButtonGraphics.value.flipped) {
                                languageButtonGraphics.value.flipped = false;
                                languageButtonGraphics.inputEnabled = true;
                            } else {
                                languageButtonGraphics.value.flipped = true;
                                languageButtonGraphics.inputEnabled = false;
                            }
                            listenerDone();

                        }, scope);
                        tween4.start();
                    }, scope);
                    tween3.start();

                    if (!languageButtonGraphics.value.flipped) {
                        scope.game.world.bringToTop(languageButtonGraphics.text);
                        languageButtonGraphics.text.scale.x = 0;
                        languageButtonGraphics.text.scale.y = 1.1;

                        var tween3_2 = scope.game.add.tween(languageButtonGraphics.text.scale).to({ x: 1.2 }, 100, Phaser.Easing.Linear.None);
                        tween3_2.onComplete.add(function () {
                            var tween4_2 = scope.game.add.tween(languageButtonGraphics.text.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.None);
                            tween4_2.start();
                        }, scope);
                        tween3_2.start();
                    }

                }, scope);
                tween2.start();
            }, scope);
            tween1.start();

            if (target.value.flipped) {
                var tween1_2 = scope.game.add.tween(target.text.scale).to({ x: 1.2, y: 1.2 }, 100, Phaser.Easing.Linear.None);
                tween1_2.onComplete.add(function () {
                    var tween2_2 = scope.game.add.tween(target.text.scale).to({ x: 0 }, 100, Phaser.Easing.Linear.None);
                    tween2_2.onComplete.add(function () {
                        scope.game.world.sendToBack(target.text);
                    });
                    tween2_2.start();
                });
                tween1_2.start();
            } 
        
    }

};
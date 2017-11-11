

Utils = {

    Config: {
        width: 0,
        height: 0,
    },

    width: function (percentage) {
        return Utils.Config.width * (percentage / 100);
    },

    height: function (percentage) {
        return Utils.Config.height * (percentage / 100);
    },

    /*
    Just a random number, nothing special.
    */
    random: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    /*
    Compile a list of random word combinations for two languages.
    First, this function receives random words from the wordnik api, these words are english.
    After this the words are translated to the first language using the google translate api.
    Finally the results from the first translation are then translated into the second language using the google translate api.

    Amount: number - amount of random words to return
    MinCorpusCount: number - Minimum frequency the returned words appear in scanned texts
    MaxCorpusCount: number - Maximum frequency the returned words appear in scanned texts
    MinLength: number - Minimum length of the words returned
    MaxLength: number - Maximum length ofthe words returned
    Language1: object from Utils.Translator.Langs array - The first language to receive words from
    Language2: object from Utils.Translator.Langs array - The second language to receive words from
    Listener: function - Callback function which receives an object, this object consists of:
        - lang1: object from Utils.Translator.Langs array - Language1 from the parameters
        - lang2: object from Utils.Translator.Langs array - Language2 from the parameters
        - words: array of objects - The bulk of the information, the random words in both translations, all the objects in this array consist of:
            - lang1: string - Version of the random word in the first language (Language1 from the parameters)
            - lang2: string - Version of the random word in the second language (Language2 from the parameters)
*/
    GetRandomCombinations: function (amount, minCorpusCount, maxCorpusCount, minLength, maxLength, language1, language2, listener) {
        Utils.Wordnik.getRandomWords(amount, minCorpusCount, maxCorpusCount, minLength, maxLength, function (randomWords) {
            if (randomWords != null) {
                Utils.Translator.Translate({ id: "en" }, language1, randomWords.join('. '), function (lang1Words) {
                    if (lang1Words != null) {

                        lang1WordsArray = [];

                        for (var i = 0; i < lang1Words[0].length; i++) {
                            (function (globalthis, index) {
                                lang1WordsArray.push(lang1Words[0][index][0].replace('.', '').replace(' ', ''));
                            })(this, i);
                        }
                        Utils.Translator.Translate(language1, language2, lang1WordsArray.join('. '), function (lang2Words) {
                            if (lang2Words != null) {
                                var result = { lang1: language1, lang2: language2, words: [] };

                                for (var i = 0; i < lang2Words[0].length; i++) {
                                    (function (globalthis, index) {
                                        if (i != lang2Words[0].length - 1) {
                                            lang2Word = lang2Words[0][index][0].slice(0, -2);
                                            lang1Word = lang2Words[0][index][1].slice(0, -1);
                                            result.words.push({ lang1: lang1Word, lang2: lang2Word });
                                        } else {
                                            lang2Word = lang2Words[0][index][0];
                                            lang1Word = lang2Words[0][index][1];
                                            result.words.push({ lang1: lang1Word, lang2: lang2Word });
                                        }

                                    })(this, i);
                                }
                                listener(result);
                            }
                        });
                    }
                });
            }
        });
    },

    AddButton: function (scope, x, y, w, h, r, text, selected, selectable, onInputOverListener, onInputOutListener, onInputUpListener)
    {
        var languageButtonGraphics = scope.game.add.graphics(x, y);
        languageButtonGraphics.selected = selected;
        languageButtonGraphics.lineStyle(2, 0x272727, 1);
        if (languageButtonGraphics.selected) {
            languageButtonGraphics.beginFill(0xFE623C, 1);
        } else {
            languageButtonGraphics.beginFill(0xFCFCFC, 1);
        }
        languageButtonGraphics.drawRoundedRect(0, 0, w, h, r);
        languageButtonGraphics.endFill();

        var style = { font: 'bold 16pt proxima_nova_ltthin', boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: w };
        languageButtonGraphics.text = scope.game.add.text(0, 0, text, style);
        languageButtonGraphics.text.setTextBounds(x, y, w, h);
        languageButtonGraphics.text.anchor.setTo(0, 0);

        if (languageButtonGraphics.selected) {
            languageButtonGraphics.text.addColor("#FCFCFC", 0);
        } else {
            languageButtonGraphics.text.addColor("#272727", 0);
        }

        languageButtonGraphics.inputEnabled = true;
        languageButtonGraphics.input.useHandCursor = true;
        languageButtonGraphics.events.onInputOver.add(function () {
            languageButtonGraphics.lineStyle(2, 0x272727, 1);
            languageButtonGraphics.beginFill(0x272727, 1);
            languageButtonGraphics.drawRoundedRect(0, 0, w, h, r)
            languageButtonGraphics.endFill();
            languageButtonGraphics.text.addColor("#FCFCFC", 0);

            scope.game.world.bringToTop(languageButtonGraphics.text);

            onInputOverListener(languageButtonGraphics);
        }, scope);
        languageButtonGraphics.events.onInputOut.add(function () {
            languageButtonGraphics.lineStyle(2, 0x272727, 1);

            if (languageButtonGraphics.selected) {
                languageButtonGraphics.beginFill(0xFE623C, 1);
            } else {
                languageButtonGraphics.beginFill(0xFCFCFC, 1);
            }

            languageButtonGraphics.drawRoundedRect(0, 0, w, h, r)
            languageButtonGraphics.endFill();

            if (languageButtonGraphics.selected) {
                languageButtonGraphics.text.addColor("#FCFCFC", 0);

            } else {
                languageButtonGraphics.text.addColor("#272727", 0);


            }

            scope.game.world.bringToTop(languageButtonGraphics.text);

            onInputOutListener(languageButtonGraphics);
        }, scope);
        languageButtonGraphics.events.onInputUp.add(function () {
            languageButtonGraphics.lineStyle(2, 0x272727, 1);

            if (languageButtonGraphics.selected) {
                languageButtonGraphics.beginFill(0x272727, 1);
                languageButtonGraphics.selected = false;
            } else if (selectable) {
                languageButtonGraphics.beginFill(0xFE623C, 1);
                languageButtonGraphics.selected = true;
            } else {
                languageButtonGraphics.beginFill(0x272727, 1);
            }
            languageButtonGraphics.drawRoundedRect(0, 0, w, h, r)
            languageButtonGraphics.endFill();
            languageButtonGraphics.text.addColor("#FCFCFC", 0);

            scope.game.world.bringToTop(languageButtonGraphics.text);

            onInputUpListener(languageButtonGraphics);
        }, scope);

        return languageButtonGraphics;
    }
};


/*
    Namespace designated to make calls to the wordnik api
*/
Utils.Wordnik = {
    Config: {
        BaseURL: "http://api.wordnik.com:80/v4/words.json/",
        ApiKey: "cfb44f25a1f7765cc803e85022a930cd354a36ad8060c8edd"
    },

/*
    Request random english words from the wordnik api

    Amount: number - amount of random words to return
    MinCorpusCount: number - Minimum frequency the returned words appear in scanned texts
    MaxCorpusCount: number - Maximum frequency the returned words appear in scanned texts
    MinLength: number - Minimum length of the words returned
    MaxLength: number - Maximum length ofthe words returned
    Listener: function - Callback function which receives a list of random english words within the specified restrictions

    More information about the api: http://developer.wordnik.com/docs.html
*/
    getRandomWords: function (amount, minCorpusCount, maxCorpusCount, minLength, maxLength, listener) {
        xhr2 = new XMLHttpRequest();
        xhr2.open('GET', this.Config.BaseURL + "randomWords?hasDictionaryDef=true&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=" + maxCorpusCount + "&minDictionaryCount=1&maxDictionaryCount=-1&minLength=" + minLength + "&maxLength=" + maxLength + "&limit=" + amount + "&api_key=" + this.Config.ApiKey, true);
        xhr2.setRequestHeader("Accept", "application/json");
        xhr2.send();
        parentThis = this;
        xhr2.addEventListener("readystatechange", function (e) {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                var response = JSON.parse(xhr2.responseText);

                var words = [];
                for (var i = 0; i < response.length; i++) {
                    var obj = response[i];
                    words.push(obj.word);
                }
                listener(words);

            } else {
                listener(null);
            }
        }, false);
    },
};


/*
    Namespace designated to make calls to the Google Translate api
*/
Utils.Translator = {

    Config: {
        BaseURL: "https://translate.googleapis.com/translate_a/"
    },

/*
    All the languages supported by Google Translate according to their documentation: https://translate.google.com/intl/en/about/languages/
*/
    Langs: [
        { language: "Afrikaans", id: "af" },
        { language: "Albanian", id: "sq" },
        { language: "Amharic", id: "am" },
        { language: "Arabic", id: "ar" },
        { language: "Armenian", id: "hy" },
        { language: "Azeerbaijani", id: "az" },
        { language: "Basque", id: "eu" },
        { language: "Belarusian", id: "be" },
        { language: "Bengali", id: "bn" },
        { language: "Bosnian", id: "bs" },
        { language: "Bulgarian", id: "bg" },
        { language: "Catalan", id: "ca" },
        { language: "Cebuano", id: "ceb" },
        { language: "Chinese (Simplified)", id: "zh-CN" },
        { language: "Chinese (Traditional)", id: "zh-TW" },
        { language: "Corsican", id: "co" },
        { language: "Croatian", id: "hr" },
        { language: "Czech", id: "cs" },
        { language: "Danish", id: "da" },
        { language: "Dutch", id: "nl" },
        { language: "English", id: "en" },
        { language: "Esperanto", id: "eo" },
        { language: "Estonian", id: "et" },
        { language: "Finnish", id: "fi" },
        { language: "French", id: "fr" },
        { language: "Frisian", id: "fy" },
        { language: "Galician", id: "gl" },
        { language: "Georgian", id: "ka" },
        { language: "German", id: "de" },
        { language: "Greek", id: "el" },
        { language: "Gujarati", id: "gu" },
        { language: "Haitian Creole", id: "ht" },
        { language: "Hausa", id: "ha" },
        { language: "Hawaiian", id: "haw" },
        { language: "Hebrew", id: "iw" },
        { language: "Hindi", id: "hi" },
        { language: "Hmong", id: "hmn" },
        { language: "Hungarian", id: "hu" },
        { language: "Icelandic", id: "is" },
        { language: "Igbo", id: "ig" },
        { language: "Indonesian", id: "id" },
        { language: "Irish", id: "ga" },
        { language: "Italian", id: "it" },
        { language: "Japanese", id: "ja" },
        { language: "Javanese", id: "jw" },
        { language: "Kannada", id: "kn" },
        { language: "Kazakh", id: "kk" },
        { language: "Khmer", id: "km" },
        { language: "Korean", id: "ko" },
        { language: "Kurdish", id: "ku" },
        { language: "Kyrgyz", id: "ky" },
        { language: "Lao", id: "lo" },
        { language: "Latin", id: "la" },
        { language: "Latvian", id: "lv" },
        { language: "Lithuanian", id: "lt" },
        { language: "Luxembourgish", id: "lb" },
        { language: "Macedonian", id: "mk" },
        { language: "Malagasy", id: "mg" },
        { language: "Malay", id: "ms" },
        { language: "Malayalam", id: "ml" },
        { language: "Maltese", id: "mt" },
        { language: "Maori", id: "mi" },
        { language: "Marathi", id: "mr" },
        { language: "Mongolian", id: "mn" },
        { language: "Myanmar (Burmese)", id: "my" },
        { language: "Nepali", id: "ne" },
        { language: "Norwegian", id: "no" },
        { language: "Nyanja (Chichewa)", id: "ny" },
        { language: "Pashto", id: "ps" },
        { language: "Persian", id: "fa" },
        { language: "Polish", id: "pl" },
        { language: "Portuguese", id: "pt" },
        { language: "Punjabi", id: "pa" },
        { language: "Romanian", id: "ro" },
        { language: "Russian", id: "ru" },
        { language: "Samoan", id: "sm" },
        { language: "Scots Gaelic", id: "gd" },
        { language: "Serbian", id: "sr" },
        { language: "Sesotho", id: "st" },
        { language: "Shona", id: "sn" },
        { language: "Sindhi", id: "sd" },
        { language: "Sinhala (Sinhalese)", id: "si" },
        { language: "Slovak", id: "sk" },
        { language: "Slovenian", id: "sl" },
        { language: "Somali", id: "so" },
        { language: "Spanish", id: "es" },
        { language: "Sundanese", id: "su" },
        { language: "Swahili", id: "sw" },
        { language: "Swedish", id: "sv" },
        { language: "Tagalog (Filipino)", id: "tl" },
        { language: "Tajik", id: "tg" },
        { language: "Tamil", id: "ta" },
        { language: "Telugu", id: "te" },
        { language: "Thai", id: "th" },
        { language: "Turkish", id: "tr" },
        { language: "Ukrainian", id: "uk" },
        { language: "Urdu", id: "ur" },
        { language: "Uzbek", id: "uz" },
        { language: "Vietnamese", id: "vi" },
        { language: "Welsh", id: "cy" },
        { language: "Xhosa", id: "xh" },
        { language: "Yiddish", id: "yi" },
        { language: "Yoruba", id: "yo" },
        { language: "Zulu", id: "zu" }
    ],



/*
    Translate one language into another language using the Google Translate api.

    SourceLang: object from Utils.Translator.Langs array - The language which the text needs to be translated from
    TargetLang: object from Utils.Translator.Langs array - The language which the text needs to be translated to
    Source: string - The *SourceLang* text which will be translated into *TargetLang*
    Listener: function - Callback function which receives the json output of the Google Translate api

    More information about the api: https://cloud.google.com/translate/docs/
*/
    Translate: function (sourceLang, targetLang, source, listener) {

        xhr2 = new XMLHttpRequest();
        xhr2.open('GET', Utils.Translator.Config.BaseURL + "single?client=gtx&sl=" + sourceLang.id + "&tl=" + targetLang.id + "&dt=t&q=" + source, true);
        xhr2.setRequestHeader("Accept", "application/json");
        xhr2.send();
        parentThis = this;
        xhr2.addEventListener("readystatechange", function (e) {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                var response = JSON.parse(xhr2.responseText);
                listener(response);
            } else {
                listener(null);
            }
        }, false);
    }
};

var element = document.getElementById('game');
var positionInfo = element.getBoundingClientRect();
Utils.Config.height = positionInfo.height;
Utils.Config.width = positionInfo.width;
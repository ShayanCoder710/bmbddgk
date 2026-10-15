// Copyright (c) Jim Garvin (http://github.com/coderifous), 2008.
// Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
// Written by Jim Garvin (@coderifous) for use on LMGTFY.com.
// http://github.com/coderifous/jquery-localize
// Based off of Keith Wood's Localisation jQuery plugin.
// http://keith-wood.name/localisation.html

(function ($) {
    $.localize = function (pkg, options) {
        var $wrappedSet = this;
        var intermediateLangData = {};
        options = options || {};
        var saveSettings = {async: $.ajaxSettings.async, timeout: $.ajaxSettings.timeout};
        $.ajaxSetup({async: false, timeout: (options && options.timeout ? options.timeout : 500)});

        function loadLanguage(pkg, lang, level) {
            level = level || 1;
            var file;
            if (options && options.loadBase && level == 1) {
                intermediateLangData = {};
                file = pkg + '.json';
                jsonCall(file, pkg, lang, level);
            } else if (level === 1) {
                intermediateLangData = {};
                loadLanguage(pkg, lang, 2);
            } else if (level === 2 && lang.length >= 2) {
                file = pkg + '-' + lang.substring(0, 2) + '.json';
                jsonCall(file, pkg, lang, level);
            } else if (level === 3 && lang.length >= 5) {
                file = pkg + '-' + lang.substring(0, 5) + '.json';
                jsonCall(file, pkg, lang, level);
            }
        }

        function jsonCall(file, pkg, lang, level) {
            if (options.pathPrefix) file = options.pathPrefix + "/" + file;
            $.getJSON(file, null, function (d) {
                $.extend(intermediateLangData, d);
                notifyDelegateLanguageLoaded(intermediateLangData);
                loadLanguage(pkg, lang, level + 1);
            });
        }

        function defaultCallback(data) {
            $.localize.data[pkg] = data;
            var keys, value;
            $wrappedSet.each(function () {
                elem = $(this);
                key = elem.attr("rel").match(/localize\[(.*?)\]/)[1];
                value = valueForKey(key, data);
                if (elem.attr('tagName') === "INPUT") {
                    elem.val(value);
                } else {
                    elem.html(value);
                }
            });
        }

        function notifyDelegateLanguageLoaded(data) {
            if (options.callback) {
                options.callback(data, defaultCallback);
            } else {
                defaultCallback(data);
            }
        }

        function valueForKey(key, data) {
            var keys = key.split(/\./);
            var value = data;
            while (keys.length > 0) {
                if (value) {
                    value = value[keys.shift()];
                } else {
                    return null;
                }
            }
            return value;
        }

        function regexify(string_or_regex_or_array) {
            if (typeof (string_or_regex_or_array) == "string") {
                return "^" + string_or_regex_or_array + "$";
            } else if (string_or_regex_or_array.length) {
                var matchers = [];
                var x = string_or_regex_or_array.length;
                while (x--) {
                    matchers.push(regexify(string_or_regex_or_array[x]));
                }
                return matchers.join("|");
            } else {
                return string_or_regex_or_array;
            }
        }

        var lang = normaliseLang(options && options.language ? options.language : $.defaultLanguage);

        if (options.skipLanguage && lang.match(regexify(options.skipLanguage))) return;
        loadLanguage(pkg, lang, 1);

        $.ajaxSetup(saveSettings);
    };

    $.fn.localize = $.localize;

    $.localize.data = {};

    $.defaultLanguage = normaliseLang(navigator.language
        ? navigator.language
        : navigator.userLanguage
    );

    function normaliseLang(lang) {
        lang = lang.replace(/_/, '-').toLowerCase();
        if (lang.length > 3) {
            lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
        }
        return lang;
    }
})(jQuery);

(function ($) {
    $.querystringvalues = $.queryStringValues = $.QueryStringValues = $.QueryStringvalues = $.queryStringValues = $.queryStringvalues = $.querystringValues = $.getqueryString = $.queryString = $.querystring = $.QueryString = $.Querystring = $.getQueryString = $.getquerystring = $.getQuerystring = function (options) {
        defaults = {defaultvalue: null};
        options = $.extend(defaults, options);
        qs = location.search.substring(1, location.search.length);
        if (qs.length == 0) return options.defaultvalue;
        qs = qs.replace(/\+/g, ' ');
        var args = qs.split('&');
        for (var i = 0; i < args.length; i++) {
            var value;
            var pair = args[i].split('=');
            var name = gentlyDecode(pair[0]);

            if (pair.length == 2) {
                value = gentlyDecode(pair[1]);
            } else {
                value = name;
            }
            if (name == options.id || i == options.id - 1) {
                return value;
            }
        }
        return options.defaultvalue;
    };
})(jQuery);

$.sendToClipboard = function (text) {
    var copier = $("#flash_copier");
    if (copier.size() == 0) {
        copier = $('<div id="flash_copier"></div>').appendTo("body");
    }
    copier.html('<embed src="_clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(text) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>');
};

$.fn.centerOver = function (element, topOffset, leftOffset) {
    topOffset = topOffset || 0;
    leftOffset = leftOffset || 0;
    var self = this;
    self.css({
        top: (element.position().top + element.outerHeight() / 2 - self.height() / 2 + topOffset).px(),
        left: (element.position().left + element.outerWidth() / 2 - self.width() / 2 + leftOffset).px()
    });
    return self;
};

function rand(max) {
    return Math.floor(Math.random() * max);
}

Number.prototype.px = function () {
    return this.toString() + "px";
};

function gentlyEncode(string) {
    return (encodeURIComponent
        ? encodeURIComponent(string).replace(/%20(\D)?/g, "+$1").replace(/'/g, escape("'"))
        : escape(string).replace(/\+/g, "%2B").replace(/%20/g, "+"));
}

function gentlyDecode(string) {
    return decodeURIComponent ? decodeURIComponent(string) : unescape(string);
}

$.localize.data.lmgtfy = {
    setup: {
        type_question: ":: کسی به جای داک داک گو کردن از شما سوال پرسیده؟ چیزی که باید داک داک گو می‌کرد رو بنویسید، کلیک کنید و لینکی که تولید می‌شه رو براش بفرستین (:",
        share_link: "لینک زیر رو بفرست.",
        or: "یا"
    },

    play: {
        step_1: "مرحله ۱: سوالت رو تایپ کن",
        step_2: "مرحله ۲: دکمه رو بزن",
        pwnage: "همینقدر سخت بود؟",
        nice: "همینقدر آسون بود."
    },

    link: {
        creating: "در حال ساخت...",
        fetching: "در حال دریافت...",
        copied: "لینک کپی شد",
        shortened: "لینک کوتاه کپی شد"
    }
};

$(function () {
    initializeLocalization();
    initializeAboutLink();
    initializeControls();

    var searchString = $.getQueryString({id: "q"});
    var inputField = $("input[type=text]:first");
    var fakeMouse = $("#fake_mouse");
    var instructions = $("#instructions > p");
    var button = $("#search");
    var inputLink = $("#link input.link");
    var linkButtons = $("#link_buttons");
    var linkMessage = $("#link_message");

    if (searchString) {
        duckItForThem();
    } else
        getTheSearchTerms();

    function initializeAboutLink() {
        $("a[name=about]").click(function () {
            $("#about").toggle();
            $('html,body').animate({scrollTop: $("#about").offset().top}, 1000);
            return false;
        });
        linkifyAbout();
    }

    function initializeControls() {
        $('input.copyable').click(function () {
            $(this).select();
        });
        $("#link").hover(function () {
            linkButtons.fadeIn("fast");
        }, function () {
            linkButtons.fadeOut("fast");
        });
        $("#go").click(function () {
            window.location = inputLink.val();
            return false;
        });
        $("#language select").change(function (e) {
            var l = window.location;
            var hostnameMinusSubdomain = l.hostname.match(/[^.]+\.(?:[^.]+)$/)[0];
            var url = l.protocol + "//" + $(this).val() + "." + hostnameMinusSubdomain + l.pathname;
            window.location = url;
        });
    }

    function initializeLocalization() {
        var localize_opts = {
            pathPrefix: 'lang',
            skipLanguage: /^fa/,
            callback: function (data, defaultCallback) {
                defaultCallback(data);
                linkifyAbout();
            }
        };
        var lang = $.getQueryString({id: "lang"}) || sniffUrlForLanguage();
        if (lang) localize_opts.language = lang;
        $("[rel*=localize]").localize('lmgtfy', localize_opts);
    }

    function sniffUrlForLanguage() {
        return sniffSubdomainForLanguage() || sniffDomainForLanguage();
    }

    function sniffSubdomainForLanguage() {
        var first = window.location.hostname.split(".")[0];
        var match = first.match(/^[a-z]{2}(?:-[a-z]{2})?$/i);
        return match ? match[0] : null;
    }

    function sniffDomainForLanguage() {
        var domainLanguageOverrides = {
            "haddkeressemmegneked": "hu",
            "klingon": "xx-KL"
        };

        for (var domain in domainLanguageOverrides) {
            if (window.location.hostname.match(domain)) {
                return domainLanguageOverrides[domain];
            }
        }
        return null;
    }

    function langString(langkey) {
        var keys = langkey.split(/\./);
        return keys.length === 1 ? $.localize.data.lmgtfy[keys[0]] : $.localize.data.lmgtfy[keys[0]][keys[1]];
    }

    function linkifyAbout() {
        $("#about p").each(function () {
            $(this).html($(this).text().replace(/(@([a-zA-Z0-9_]+))/g, '<a href="http://twitter.com/$2">$1</a>'));
        });
    }

    function instruct(langkey) {
        instructions.html(langString(langkey));
    }

    function linkStatus(langkey, millis, stuck) {
        millis = millis || 2500;
        linkMessage.html(langString(langkey)).show().centerOver(inputLink);
        if (!stuck) {
            setTimeout(function () {
                linkMessage.fadeOut(millis / 4 * 3);
            }, millis / 4);
        }
    }

    function getTheSearchTerms() {
        instruct("setup.type_question");
        inputField.focus().select();

        function doSearch() {
            instruct("setup.share_link");

            var l = window.location;
            var url = l.protocol + "//" + l.hostname + l.pathname + "?";
            var searchString = gentlyEncode(inputField.val());

            strings = ["q=" + searchString];

            url += strings.join("&");

            showTheUrl(url);
        }

        $("form").submit(function (e) {
            e.preventDefault();
            doSearch();
            return false;
        });

        $("#search").click(function (e) {
            e.preventDefault();
            doSearch();
        });
    }

    function showTheUrl(url) {
        $("#link").fadeIn().css("display", "flex");
        inputLink.val(url).focus().select();
    }

    function duckItForThem() {
        if ($.getQueryString({id: "fwd"})) redirect();

        $("body").css("cursor", "wait");
        fakeMouse.show();
        instruct("play.step_1");

        var inputOffset = inputField.offset();
        fakeMouse.animate({
            top: (inputOffset.top + 15).px(),
            left: (inputOffset.left + 10).px()
        }, 1500, 'swing', function () {
            inputField.focus();
            fakeMouse.animate({top: "+=18px", left: "+=10px"}, 'fast', function () {
            });
            type(searchString, 0);
        });

        function type(string, index) {
            var val = string.substr(0, index + 1);
            inputField.attr('value', val);
            if (index < string.length) {
                setTimeout(function () {
                    type(string, index + 1);
                }, Math.random() * 240);
            } else {
                doneTyping();
            }
        }

        function doneTyping() {
            instruct("play.step_2");
            var btnOffset = button.offset();
            fakeMouse.animate({
                top: (btnOffset.top + 20).px(),
                left: (btnOffset.left + 30).px(),
            }, 2000, 'swing', function () {
                var key = $.getQueryString({id: "n"}) === 1 ? "play.nice" : "play.pwnage";
                instruct(key);
                button.focus();
                setTimeout(redirect, 2000);
            });
        }

        function redirect() {
            if ($.getQueryString({id: "debug"})) return;
            window.location = "https://duckduckgo.com/?q=" + gentlyEncode(searchString);
        }
    }

    document.querySelector('div#link > div.close').addEventListener('click', () => {
        document.querySelector('div#link').style.display = 'none'
    })
});
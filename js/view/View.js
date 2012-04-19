function View() {
    // a reference to this object
    var self = this;

    // supported languages
    var langs = ["en", "es", "ja"];

    // the user's language preference, defaults to "en"
    //var lang = (navigator.language || "en-us").split("-")[0];
    var lang;

    // the "Loading ..." element. see styles in app.css
    var msg;

    // language resources by name
    var resources = {};

    // HTML templates by name
    var templates = {};

    // load templates and resources (before doing anything else)
    this._init = function (file, callback) {
    	
    	lang = this.getLanguage();
        /*if (langs.indexOf(lang) === -1) {
            //lang = "en";
            this.setLanguage('en');
        }
        */

        var loaded = { resources: false, templates: false };

        var onload = function () {
            // if everything is loaded, proceed
            if (loaded.resources && loaded.templates) {
                callback.call(self);
            }
        }

        this.loadResources(function () {
            loaded.resources = true;
            onload();
        });

        this.loadTemplates(file, function () {
            loaded.templates = true;
            onload();
        });
    };

    // load language resources from a text file
    this.loadResources = function (callback) {
        var file = "../txt/lang/" + lang + ".txt?" + (+new Date());

        $.get(file, function (text) {
            text = text.split("\n");

            for (var t in text) {
                var s = text[t].trim();
                if (!s.length || s.charAt(0) === "#") {
                    continue;
                }
                s = s.split("=");
                resources[s[0].trim()] = s[1].trim();
            }

            Mark.includes = resources;
            Mark.includes.lang = lang;

            callback();
        }, "html");
    };

    // load HTML templates from a text file
    this.loadTemplates = function (file, callback) {
        file += "?" + (+new Date());

        // load the text file (see "txt" directory)
        $.get(file, function (text) {
            text = text.split("=====").splice(1);

            // split into named templates
            for (var t in text) {
                var i = text[t].indexOf("\n");
                var key = text[t].substr(0, i).trim();
                var val = text[t].substr(i).trim();
                templates[key] = val;
            }

            // run callback in the context of this View
            callback();
        }, "html");
    };

    // get the user's language preference
    this.getLanguage = function () {
    	lang = bc.core.cache('lang');
    	if ( lang == null ) {
    		lang = 'en';
    	}
        return lang;
    };

	this.setLanguage = function(l) {
		lang = l;
		bc.core.cache('lang', lang);
	};
	
    // get HTML template by name
    this.getTemplate = function (name) {
        return templates[name];
    };

    // get a language string by name
    this.translate = function (name) {
        return resources[name];
    };

    // show the "Loading ..." message. see styles in app.css
    this.showLoading = function () {
        if (!msg) {
            msg = document.createElement("div");
            msg.className = "loading";
            msg.innerHTML = this.translate("loading_msg");
            document.body.appendChild(msg);
        }

        msg.style.opacity = 1;
    };

    // hide the "Loading ..." message
    this.hideLoading = function () {
        msg.style.opacity = 0;
    };

    // translate a bc error code into a user-friendly message
    this.getErrorMessage = function (code) {
        return this.translate("error_msg_" + (code || 100)) || "Oops!";
    };
}


/* 
 * View.Toggle is a component for switching display modes in a View. See 
 * hello.html for markup example and app.css for styles. Usage:
 *
 * var toggle = new View.Toggle("toggle");
 */
View.Toggle = function (elemId) {
    // a reference to this object
    var self = this;

    // the element wrapped by this object
    var elem = document.getElementById(elemId);

    // the list item elements
    var items = $(elem).find("li");

    // the current index
    var idx = 0;

    // trigger a jquery event when the index changes
    var dispatch = function (value, idx) {
        $(self).trigger("toggle", {
            id: elemId,
            value: value,
            index: idx
        });
    };

    // listen for tap events on <li> elements
    items.bind("tap", function (evt) {
        var i = items.index(this);

        // if not the current index ...
        if (i !== idx) {
            // update styles
            items.removeClass("accent");
            $(this).addClass("accent");

            // and trigger a "toggle" event
            dispatch($(this).data("value"), i);

            idx = i;
        }
    });

	this.initToggle = function(lang) {
		for (var i = 0; i < items.length; i++) {
			if (items[i].getAttribute("data-value") == lang) {
				idx = i;
			}
		}
		items.removeClass("accent");
		$(items[idx]).addClass("accent");

	};
	
    // set <li> labels. e.g. setLabels("List", "Map")
    this.setLabels = function () {
        for (var i = 0; i < arguments.length; i++) {
            items[i].innerText = arguments[i];
        }
    };

    // get the index of the currently selected item
    this.getIndex = function () {
        return idx;
    };

    // get the value of the currently selected item
    this.getValue = function () {
        return items[idx].getAttribute("data-value");
    };

    // get the label of the currently selected item
    this.getLabel = function () {
        return items[idx].innerText;
    };

    // immediately highlight the first item
    items.first().addClass("accent");
};


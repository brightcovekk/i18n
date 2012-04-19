function HelloView() {
    var self = this;
	var toggle = new View.Toggle('toggle');
	
    this.init = function () {
    	toggle.initToggle(self.getLanguage());
        self._init("../txt/markup/hello.txt", render);
        initToggleListener();
    };

    var render = function () {
        self.showLoading();

		//bc.device.alert('Lang = ' + navigator.language);
        renderIntro();
        renderNews();
    };

    var renderIntro = function () {
        var template = self.getTemplate("hello-intro");
        var context = { user: { first: "John" } };
        var markup = Mark.up(template, context);

        $("#intro").html(markup);
    };

    var renderNews = function () {
        var onsuccess = function (data) {
            var template = self.getTemplate("hello-news");
            var context = { results: data };
            var markup = Mark.up(template, context);

            $("#results").html(markup);

            self.hideLoading();
        };

        var onerror = function (error) {
            bc.device.alert(self.getErrorMessage(error.errorCode));
        };

        var options = {
            parameterizedFeedValues: { "lang": self.getLanguage() }
        };

        bc.core.getData("google-news", onsuccess, onerror, options);
    };
    
    var initToggleListener = function() {
    	// listen for a toggle change event
        var loaded = { resources: false, templates: false };

        var onload = function () {
            // if everything is loaded, proceed
            if (loaded.resources && loaded.templates) {
                render();
            }
        }
    	
    	$(toggle).bind("toggle", function(evt, params){
    		self.setLanguage(params.value);
    		self.loadResources( function(){
    			loaded.resources = true;
    			onload();
    		} );
    		self.loadTemplates( '../txt/markup/hello.txt', function() {
    			loaded.templates = true;
    			onload();
    		} );
    	});
    }
}

HelloView.prototype = new View();

function GoodbyeView() {
    var self = this;

    this.init = function () {
        $(bc).bind( "viewfocus", onfocus );
        self._init("../txt/markup/goodbye.txt", render);
        //self._init("../txt/markup/goodbye.txt");
        //self.loadResources(render);
        //bc.device.alert('got here');
        
    };

    var render = function () {
        var template = self.getTemplate("goodbye-intro");
        var context = { user: { first: "John" } };
        var markup = Mark.up(template, context);

        $("#intro").html(markup);
    };
    
    var onfocus = function() {
    	//bc.device.alert('got here:' + self.getLanguage());
    	lang = self.getLanguage();
    	self.loadResources(render);
    	//render();
    }
}

GoodbyeView.prototype = new View();

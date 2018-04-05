
define(['backbone','models/panel_m'], function (Backbone, Panel_m) {



	var Panels_c = Backbone.Collection.extend({
		model: Panel_m,
        test:function() {
            console.log("this is a test");
        }

	});

	return Panels_c;

});

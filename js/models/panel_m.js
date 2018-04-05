define(['backbone'], function (Backbone) {

	var Panel_m = Backbone.Model.extend({
		defaults:{
			"title":"Speaking and screen time by lead type and gender",
			"id":"",
			"color":"#E5E5E5",
			"height":600
		}
	});

	return Panel_m;

});

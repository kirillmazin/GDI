define(['backbone'], function (Backbone) {

	var Model_m = Backbone.Model.extend({
		defaults:{
            "name": "CINDERELLA (2015)",
            "ratings": "PG",
            "genre": "Fantasy",
            "female_on_screen_time": 51.68,
            "female_speaking_time": 63.94,
            "lead_type": "Female Lead",
            "gross_revenue": 201000000,
            "screen_number": 0,
			"male_on_screen_time":0,
			"male_speaking_time":0,
			"difference_speaking_time":0,
			"difference_on_screen_time":0,
			"default_order":0,
			"male_and_female_on_screen_time":0,
			"year":2015
		}
	});

	return Model_m;

});
2

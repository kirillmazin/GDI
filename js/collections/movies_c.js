
define(['backbone','models/movie_m'], function (Backbone, movie_m) {



	var Movies_c = Backbone.Collection.extend({
		model: movie_m,
        test:function() {
            console.log("this is a test");
        }

	});

	return Movies_c;

});

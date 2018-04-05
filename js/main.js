require.config({

	paths: {
        jquery:'libs/jquery-3.0.0',
		domReady:'libs/domReady',
		text: 'libs/text',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		raphael: 'libs/raphael'
	},
	shim : {
		backbone: {
			deps: ['jquery','underscore']
		},
		raphael: {
			exports: 'Raphael'

		}


	}


});





require([
	'domReady',
	'views/app_v'
], function (domReady,app_v, content_block_v, nav_v) {



	domReady( function () {

				this.app = new app_v();




	});

});

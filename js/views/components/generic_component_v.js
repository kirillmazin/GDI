define(["jquery", "underscore", "backbone", "raphael"],
    function($, _, Backbone, Raphael) {

        var Generic_component_v = Backbone.View.extend({
            initialize: function() {
            //    this.test = "I am testing this";





            this.color_male_speaking_time = "#B3DB6E";
            this.color_male_speaking_time = "#aabf3e";




                this.color_male_screen_time = "#119FB0";
                this.color_male_screen_time = "#2f9798";



                this.color_female_speaking_time = "#FFA55C";
                this.color_female_speaking_time = "#ee594d";


                this.color_female_screen_time = "#BA537E";
                this.color_female_screen_time = "#ad205f";



            },
            draw_bar: function(color, model_property, opacity, xpos) {
                var m = this.model;

                var r = this;






                var container = this.paper.rect(xpos, this.ypos, 1, this.bar_height);

                container.attr({
                    fill: color,
                    'stroke-width': 0,
                    'opacity': opacity,
                    'stroke': color

                })

                container.animate({

                    'width': model_property*r.scale_change

                }, 500, 'easeOut');



                return container;


            }
        });
        return Generic_component_v;


    });

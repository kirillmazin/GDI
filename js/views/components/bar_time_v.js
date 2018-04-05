define(["jquery", "underscore", "backbone", "raphael", "views/components/bar_legend_v","views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Bar_legend_v, Generic_component_v) {

        var Bar_time_v = Generic_component_v.extend({
            initialize: function(o) {


                Bar_time_v.__super__.initialize.apply(this);


                this.year = o.year;

                this.scale_change = 4;
                this.diff_screen_time = o.diff_screen_time * this.scale_change;
                this.diff_speaking_time = o.diff_speaking_time * this.scale_change;
                this.paper = o.paper;
                this.color = o.color;
                this.root = this.paper.set();
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.rectangle;
                this.bar_length = this.diff_screen_time;


                this.bar_screen_time;
                this.bar_speaking_time;


                this.bar_speaking_time_female;
                this.bar_screen_time_female;




                this.abs_bar_length = Math.abs(this.bar_length);
                this.bar_height = o.bar_height;

                this.bar_group = this.paper.set();


                this.speaking_time_color;
                this.screen_time_color;

                this.opacity_initial = 0.7;
                this.opacity_mouseover = 0.4;






                screen_time_x = this.xpos - this.model.get("female_on_screen_time") * this.scale_change;
                speaking_time_x = this.xpos - this.model.get("female_speaking_time") * this.scale_change;






                this.bar_screen_time = this.draw_bar(this.color_male_screen_time, "male_on_screen_time", 1, this.xpos);
                this.bar_speaking_time = this.draw_bar(this.color_male_speaking_time, "male_speaking_time", this.opacity_initial, this.xpos);
                this.bar_screen_time_female = this.draw_bar(this.color_female_screen_time, "female_on_screen_time", 1, screen_time_x);
                this.bar_speaking_time_female = this.draw_bar(this.color_female_speaking_time, "female_speaking_time", this.opacity_initial, speaking_time_x);





                this.bar_group.push(this.bar_speaking_time, this.bar_screen_time, this.bar_screen_time_female, this.bar_speaking_time_female);

                var r = this;

                this.bar_group.mouseover(



                    function() {



                        r.bar_screen_time.animate({
                            opacity: .4


                        }, 300);

                        r.bar_speaking_time.animate({
                            opacity: .4


                        }, 300);
                    }
                )

                this.bar_group.mouseout(


                    function() {


                        r.bar_screen_time.animate({
                            opacity: 1


                        }, 300);

                        r.bar_speaking_time.animate({
                            opacity: r.opacity_initial


                        }, 300);
                    }
                )

            

            },
            get_root: function() {
                return this.bar_group;
            },

            disable: function(o) {


                if (o.name != this.model.get(o.type)) {




                    this.bar_group.animate({
                        'fill': '#D8D8D8',
                        'opacity': .3
                    }, 500)



                } else {
                    this.restore();
                }
            },

            restore: function() {



                this.bar_screen_time.animate({
                    'fill': this.color_male_screen_time,
                    'opacity': 1
                }, 500)

                this.bar_speaking_time.animate({
                    'fill': this.color_male_speaking_time,
                    'opacity': this.opacity_initial
                }, 500)

                this.bar_screen_time_female.animate({
                    'fill': this.color_female_screen_time,
                    'opacity': 1
                }, 500)

                this.bar_speaking_time_female.animate({
                    'fill': this.color_female_speaking_time,
                    'opacity': this.opacity_initial
                }, 500)






            },

            hide: function() {
                this.bar_group.hide().animate({
                    opacity: 0
                });
            },
            show: function() {
                this.bar_group.show()
                this.restore();

            },
            move_bars: function(o) {
                this.ypos = o.ypos;


                this.bar_group.animate({
                    y: o.ypos
                }, 500);


            },





            update: function(o) {
                if (o.type == "hide_year") {
                    if (o.year != this.year) {
                        this.hide();
                    }
                    if (o.year == this.year) {
                        this.show();
                    }
                }


                if (o.type == "disable_bars") {
                    if (o.name != "All") {
                        this.disable({
                            type: o.category,
                            name: o.name
                        });
                    } else {
                        this.restore();
                    }
                }
            }
        });
        return Bar_time_v;


    });

define(["jquery", "underscore", "backbone", "raphael", "views/components/bar_legend_v", "views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Bar_legend_v, Generic_component_v) {

        var Bar_action_v = Generic_component_v.extend({
            initialize: function(o) {



                Bar_action_v.__super__.initialize.apply(this);
                this.type = o.type;

                this.year = o.year;

                this.scale_change = 3;
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



                this.rating = this.model.get("ratings");
                this.genre = this.model.get("genre");


                // defaults
                this.active_rating = "All";
                this.active_genre = "All";

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
                this.segments = {};









                var total_screen_time = this.model.get("female_on_screen_time") + this.model.get("male_on_screen_time");
                var total_speaking_time = this.model.get("female_speaking_time") + this.model.get("male_speaking_time");

                this.male_on_screen_time = Math.round(this.model.get("male_on_screen_time") / total_screen_time * 100);
                this.female_on_screen_time = Math.round(this.model.get("female_on_screen_time") / total_screen_time * 100);

                this.male_speaking_time = Math.round(this.model.get("male_speaking_time") / total_speaking_time * 100);
                this.female_speaking_time = Math.round(this.model.get("female_speaking_time") / total_speaking_time * 100);




                f_screen_time_x = this.xpos - this.female_on_screen_time * this.scale_change;



                f_speaking_time_x = this.xpos - this.female_speaking_time * this.scale_change;

                if(this.type == "screen"){
                    this.bar_screen_time_male = this.draw_bar(this.color_male_screen_time, this.male_on_screen_time, 1, this.xpos);
                    this.bar_screen_time_female = this.draw_bar(this.color_female_screen_time, this.female_on_screen_time, 1, f_screen_time_x);
                    this.bar_white = this.draw_bar("#ffffff", this.male_on_screen_time + this.female_on_screen_time, 0, f_screen_time_x);
                }

                if(this.type == "speak"){
                    this.bar_speaking_time_male = this.draw_bar(this.color_male_speaking_time, this.male_speaking_time, 1, this.xpos);
                    this.bar_speaking_time_female = this.draw_bar(this.color_female_speaking_time, this.female_speaking_time, 1, f_speaking_time_x);
                    this.bar_white = this.draw_bar("#ffffff", this.male_speaking_time + this.female_speaking_time, 0, f_speaking_time_x);
                }








                this.segments.m_speak = this.male_speaking_time / 100;
                this.segments.f_speak = this.female_speaking_time / 100;

                this.segments.m_screen = this.male_on_screen_time / 100;
                this.segments.f_screen = this.female_on_screen_time / 100;


                this.bar_group.push(this.bar_speaking_time_male, this.bar_speaking_time_female, this.bar_screen_time_male, this.bar_screen_time_female,  this.bar_white_screen, this.bar_white_speak);






                this.enable_white();






            },

            get_root: function() {
                return this.bar_group;
            },

            enable_white: function() {


                var r = this;
                this.bar_white.show();

                this.bar_white.mouseover(function() {


                    r.trigger("update", {
                        type: "show_pie_legend",
                        segments: r.segments,
                        chart_type: r.type,
                        chart_label: "This is my label",
                        element_data: {
                            x: r.xpos + 200,
                            y: r.ypos - 31
                        }
                    })


                    this.attr({
                        opacity: 0.5
                    })
                });

                this.bar_white.mouseout(function() {
                    r.trigger("update", {
                        type: "hide_pie_legend"
                    })

                    this.attr({
                        opacity: 0
                    })
                });








            },






            update: function(o) {



            }
        });
        return Bar_action_v;


    });

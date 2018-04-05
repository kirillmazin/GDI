/*
* Used in Gender Representation by lead type infographic
*/

define(["jquery", "underscore", "backbone", "raphael", "views/components/bar_legend_v", "views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Bar_legend_v, Generic_component_v) {

        var Bar_time_lead_type_v = Generic_component_v.extend({
            initialize: function(o) {


                Bar_time_lead_type_v.__super__.initialize.apply(this);
                this.type = o.type;


                this.gender = o.gender;

                //console.log(this.gender + ' type ' +  this.type);
                this.year = o.year;

                this.scale_change = 3;
                this.diff_screen_time = o.diff_screen_time * this.scale_change;
                this.diff_speaking_time = o.diff_speaking_time * this.scale_change;
                this.paper = o.paper;

                this.root = this.paper.set();
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.rectangle;
                this.bar_length = this.diff_screen_time;

                this.color = o.color;

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










                var data_to_use;



                // chart male data for female leads and female data for male leads
                if(this.type == "screen"){
                    if(this.gender  == "male"){
                        data_to_use = this.female_on_screen_time;

                    }

                    if(this.gender == "female"){
                        data_to_use = this.male_on_screen_time;
                    }
                } else {
                    if(this.gender  == "male"){
                        data_to_use = this.female_speaking_time;

                    }

                    if(this.gender == "female"){
                        data_to_use = this.male_speaking_time;
                    }

                }

                this.bar_time = this.draw_bar(this.color, data_to_use , 1, this.xpos);
                this.bar_white = this.draw_bar("#ffffff", data_to_use , 0, this.xpos);






                this.segments.m_speak = this.male_speaking_time / 100;
                this.segments.f_speak = this.female_speaking_time / 100;

                this.segments.m_screen = this.male_on_screen_time / 100;
                this.segments.f_screen = this.female_on_screen_time / 100;



                this.bar_group.push(this.bar_time);

                this.enable_white_bar();


            },

            get_root: function() {
                return this.bar_group;
            },

            enable_white_bar: function() {


                var r = this;
                this.bar_white.show();

                this.bar_white.mouseover(function() {


                    r.trigger("update", {
                        type: "show_pie_legend",
                        segments: r.segments,
                        chart_type: r.type,
                        chart_label: "This is my label",
                        gender: r.gender,
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










            _hide_all_elements:function() {
                this.bar_white.hide();

                this.bar_time.hide();



            },

            _show_all_elements:function() {



                this.bar_white.show();

                this.bar_time.show();


            },




            update: function(o) {


                // show hide the right year;

                if (o.type == "hide_year") {




                    this.active_year = o.year;
                    if (o.year != this.year) {

                        this._hide_all_elements();

                    }

                    if (o.year == this.year) {


                        this._show_all_elements();

                    }

                }





            }
        });
        return Bar_time_lead_type_v;


    });

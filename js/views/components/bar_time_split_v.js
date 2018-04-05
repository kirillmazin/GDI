define(["jquery", "underscore", "backbone", "raphael", "views/components/bar_legend_v", "views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Bar_legend_v, Generic_component_v) {

        var Bar_time_split_v = Generic_component_v.extend({
            initialize: function(o) {


                Bar_time_split_v.__super__.initialize.apply(this);
                this.type = "screen";

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



                this.bar_screen_time_male = this.draw_bar(this.color_male_screen_time, this.male_on_screen_time, 1, this.xpos);
                this.bar_speaking_time_male = this.draw_bar(this.color_male_speaking_time, this.male_speaking_time, 1, this.xpos);
                this.bar_screen_time_female = this.draw_bar(this.color_female_screen_time, this.female_on_screen_time, 1, f_screen_time_x);
                this.bar_speaking_time_female = this.draw_bar(this.color_female_speaking_time, this.female_speaking_time, 1, f_speaking_time_x);


                this.bar_white_screen = this.draw_bar("#ffffff", this.male_on_screen_time + this.female_on_screen_time, 0, f_screen_time_x);
                this.bar_white_speak = this.draw_bar("#ffffff", this.male_speaking_time + this.female_speaking_time, 0, f_speaking_time_x);

                //this.bar_white_screen = this.draw_bar("red", this.male_on_screen_time + this.female_on_screen_time, 0.5, f_screen_time_x);
                //this.bar_white_speak = this.draw_bar("blue", this.male_speaking_time + this.female_speaking_time, 0.5, f_speaking_time_x);

                this.segments.m_speak = this.male_speaking_time / 100;
                this.segments.f_speak = this.female_speaking_time / 100;

                this.segments.m_screen = this.male_on_screen_time / 100;
                this.segments.f_screen = this.female_on_screen_time / 100;


                this.bar_group.push(this.bar_speaking_time_male, this.bar_speaking_time_female, this.bar_screen_time_male, this.bar_screen_time_female,  this.bar_white_screen, this.bar_white_speak);

                var r = this;


                this.bar_group.mouseover(function() {
                //    console.log(r.model.attributes);
                });









            },

            get_root: function() {
                return this.bar_group;
            },

            enable_white_bar_screen: function() {


                var r = this;
                this.bar_white_screen.show();
                this.bar_white_speak.hide();
                this.bar_white_screen.mouseover(function() {


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

                this.bar_white_screen.mouseout(function() {
                    r.trigger("update", {
                        type: "hide_pie_legend"
                    })

                    this.attr({
                        opacity: 0
                    })
                });








            },


            enable_white_bar_speak: function() {

                var r = this;
                this.bar_white_speak.show();
                this.bar_white_screen.hide();

                this.bar_white_speak.mouseover(function() {


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

                this.bar_white_speak.mouseout(function() {
                    r.trigger("update", {
                        type: "hide_pie_legend"

                    })

                    this.attr({
                        opacity: 0
                    })
                });
            },
            disable_white_bar_speak: function() {
                this.bar_white_speak.unmouseover();
                this.bar_white_speak.unmouseout();
                this.bar_white_speak.attr({opacity:0})







            },

            disable_white_bar_screen: function() {
                this.bar_white_screen.unmouseover();
                this.bar_white_screen.unmouseout();

                this.bar_white_screen.attr({opacity:0})




            },

            set_type: function(type) {



                if (type == "speaking") {

                    //console.log("----- SPEAKING" );
                    this.enable_white_bar_speak();
                    this.disable_white_bar_screen();
                    this.hide_screen();

                    this.bar_screen_time_male.animate({
                        'fill': this.color_male_screen_time,
                        'opacity': 0
                    }, 0)


                    this.bar_screen_time_female.animate({
                        'fill': this.color_female_screen_time,
                        'opacity': 0
                    }, 0)

                    this.bar_speaking_time_male.animate({
                        'fill': this.color_male_speaking_time,
                        'opacity': 1
                    }, 500)

                    this.bar_speaking_time_female.animate({
                        'fill': this.color_female_speaking_time,
                        'opacity': 1
                    }, 500);


                    this.bar_white_screen.attr({
                        'opacity': 0
                    }, 0)
                }

                if (type == "screen") {

                        //console.log("----- SCREEN ");

                    this.enable_white_bar_screen();
                    this.disable_white_bar_speak();
                    this.hide_speaking();

                    this.bar_screen_time_male.animate({
                        'fill': this.color_male_screen_time,
                        'opacity': 1
                    }, 500)


                    this.bar_screen_time_female.animate({
                        'fill': this.color_female_screen_time,
                        'opacity': 1
                    }, 500)


                    this.bar_speaking_time_male.animate({
                        'fill': this.color_male_speaking_time,
                        'opacity': 0
                    }, 0)

                    this.bar_speaking_time_female.animate({
                        'fill': this.color_female_speaking_time,
                        'opacity': 0
                    }, 0)

                    this.bar_white_speak.attr({
                        'opacity': 0
                    }, 0)
                    //this.bar_white_screen.hide();
                    //this.bar_white_speak.hide();
                }
            },
            hide_speaking: function() {
                this.bar_speaking_time_male.animate({

                    'opacity': 0
                }, 0);

                this.bar_speaking_time_female.animate({

                    'opacity': 0
                }, 0);

                this.disable_white_bar_speak();

            },

            hide_screen: function() {
                this.bar_screen_time_male.animate({

                    'opacity': 0
                }, 0);

                this.bar_screen_time_female.animate({

                    'opacity': 0
                }, 0);

                    this.bar_white_screen.attr({opacity: 0});


            },
            _show_disable_screen: function() {
                this.bar_screen_time_male.animate({
                    'fill': '#D8D8D8',
                    'opacity': .3
                }, 500);


                this.bar_screen_time_female.animate({
                    'fill': '#D8D8D8',
                    'opacity': .3
                }, 500);
                this.bar_white_speak.attr({opacity: 0});
                this.disable_white_bar_speak();

            },
            _show_disable_speaking: function() {
                this.bar_speaking_time_male.animate({
                    'fill': '#D8D8D8',
                    'opacity': .3
                }, 500)

                this.bar_speaking_time_female.animate({
                    'fill': '#D8D8D8',
                    'opacity': .3
                }, 500);
                this.bar_white_screen.attr({opacity: 0});
                this.disable_white_bar_screen();
            },


            restore: function() {



                this.bar_screen_time_male.animate({
                    'fill': this.color_male_screen_time,
                    'opacity': 1
                }, 0)


                this.bar_screen_time_female.animate({
                    'fill': this.color_female_screen_time,
                    'opacity': 1
                }, 0)

                this.bar_speaking_time_male.animate({
                    'fill': this.color_male_speaking_time,
                    'opacity': 1
                }, 0)

                this.bar_speaking_time_female.animate({
                    'fill': this.color_female_speaking_time,
                    'opacity': 1
                }, 0)






            },

            hide: function() {
                this.bar_group.attr({opacity:0});
                this.disable_white_bar_speak();
                this.disable_white_bar_screen();
                this.set_type(this.type);
            },
            show: function() {
                this.bar_group.show();




                this.set_type(this.type);

            },
            move_bars: function(o) {
                this.ypos = o.ypos;


                this.bar_group.animate({
                    y: o.ypos
                }, 500);


            },

            // when filters are used
            disable: function(o) {



                // Genre is activated


                if (o.active_genre != this.genre && o.active_rating == "All" && o.active_genre!="All") {


                    if (this.type == "speaking") {

                        this._show_disable_speaking();

                    }

                    if (this.type == "screen") {

                        this._show_disable_screen();

                    }
                }


                if (o.active_genre == this.genre && o.active_rating == "All") {


                    this._show_elements(this.type);

                }


                // Ratings  are activated



                if (o.active_genre == "All" && o.active_rating != this.rating &&  o.active_rating !="All") {



                    if (this.type == "speaking") {

                        this._show_disable_speaking();

                    }

                    if (this.type == "screen") {

                        this._show_disable_screen();

                    }


                }


                if (o.active_genre == "All" && o.active_rating == this.rating) {

                //    this.restore();
                    this._show_elements(this.type);


                }



                // Genre & Ratings are activated
                if (o.active_genre != this.genre && o.active_rating != this.rating && o.active_genre != "All" && o.active_rating !="All") {


                    // enable



                    if (this.type == "speaking") {

                        this._show_disable_speaking();

                    }

                    if (this.type == "screen") {

                        this._show_disable_screen();

                    }
                }




                if (o.active_genre == this.genre && o.active_rating == this.rating) {
                    // enable
                //    this.restore();
                    this._show_elements(this.type);



                }

                if (o.active_genre == this.genre && o.active_rating != this.rating && o.active_rating != "All") {
                    // enable



                    if (this.type == "speaking") {

                        this._show_disable_speaking();

                    }

                    if (this.type == "screen") {

                        this._show_disable_screen();

                    }



                }


                if (o.active_genre != this.genre && o.active_rating == this.rating && o.active_genre != "All") {
                    // enable


                    if (this.type == "speaking") {

                        this._show_disable_speaking();

                    }

                    if (this.type == "screen") {

                        this._show_disable_screen();

                    }



                }










                // show everything
                if (o.active_genre == "All" && o.active_rating == "All") {

                    this._show_elements(this.type);
                }


            },
            _hide_speaking_elements:function(){
                this.bar_speaking_time_male.hide();
                this.bar_speaking_time_female.hide();
                this.bar_white_speak.hide();
                //this.disable_white_bar_speak();
            },
            _hide_screen_elements:function(){
                this.bar_screen_time_female.hide();
                this.bar_screen_time_male.hide();

                this.bar_white_screen.hide();
            //    this.disable_white_bar_screen();
            },

            _show_speaking_elements:function(){
                this.bar_speaking_time_male.show();
                this.bar_speaking_time_female.show();
                this.bar_speaking_time_male.attr({'fill':this.color_male_speaking_time, 'opacity':1});
                this.bar_speaking_time_female.attr({'fill':this.color_female_speaking_time,'opacity':1});
                this.bar_white_speak.show();
                this.enable_white_bar_speak();

            },
            _show_screen_elements:function(){
                this.bar_screen_time_male.show();
                this.bar_screen_time_female.show();
                this.bar_screen_time_male.attr({'fill':this.color_male_screen_time,'opacity':1});
                this.bar_screen_time_female.attr({'fill':this.color_female_screen_time,'opacity':1});

                this.bar_white_screen.show();
                this.enable_white_bar_screen();
            },


            _hide_all_elements:function() {
                

                this._hide_speaking_elements();
                this._hide_screen_elements();


            },

            _show_all_elements:function() {


                this._show_speaking_elements();
                this._show_screen_elements();


            },
            _show_elements:function(type){
                if(type == "speaking"){


                    this._hide_screen_elements();
                    this._show_speaking_elements();


                }
                if(type == "screen"){

                    this._hide_speaking_elements();
                    this._show_screen_elements();


                }
            },




            update: function(o) {


                // show hide the right year;

                if (o.type == "hide_year") {




                    this.active_year = o.year;
                    if (o.year != this.year) {

                        this._hide_all_elements();

                    }

                    if (o.year == this.year) {

                        //this._show_all_elements();
                        this.disable({
                            active_rating: this.active_rating,
                            active_genre: this.active_genre
                        });
                        this._show_elements(this.type);

                    }

                }


                if (o.type == "disable_bars") {



                    if (o.category == "genre") {
                        this.active_genre = o.name;
                    }

                    if (o.category == "ratings") {
                        this.active_rating = o.name;
                    }

                    if(this.active_year == this.year){
                        this.disable({


                            active_rating: o.active_rating,
                            active_genre: o.active_genre
                        });
                    }



                }
                // show hide speaking / screen
                if (o.type == "resort_data") {





                    if (o.sort_by == "Speaking time") {
                        this.type = "speaking";


                    }

                    if (o.sort_by == "Screen time") {
                        this.type = "screen";

                    }
                    if(this.active_year == this.year){
                        this.disable({
                            active_rating: this.active_rating,
                            active_genre: this.active_genre
                        });
                        this._show_elements(this.type);


                    }



                }



            }
        });
        return Bar_time_split_v;


    });

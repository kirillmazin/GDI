define(["jquery", "underscore", "backbone","raphael","views/components/legend_v","views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Legend_v, Generic_component_v) {






        var Bar_vertical_v = Generic_component_v.extend({



            initialize: function(o) {



                Bar_vertical_v.__super__.initialize.apply(this);
                this.year = o.year;


                this.scale_change = 3;
                this.diff_screen_time = o.diff_screen_time*this.scale_change;
                this.diff_speaking_time = o.diff_speaking_time*this.scale_change;
                this.paper = o.paper;
                this.color = o.color;
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.rectangle;
                this.bar_length = this.diff_screen_time;

                this.bar_speaking_time;

                this.abs_bar_length = Math.abs(this.bar_length);
                this.bar_width = o.bar_width;


                this.bar_group = this.paper.set();


                this.speaking_time_color;
                this.screen_time_color;

                this.opacity_initial= 0.7;
                this.opacity_mouseover = 0.4;



                this.draw_screen_time();
                this.draw_speaking_time();




            },
            disable:function(o){


                if(o.name != this.model.get(o.type)){

                    this.bar_speaking_time.animate({
                    'fill':'#D8D8D8',
                    'opacity':.3



                    },500)

                    this.rectangle.animate({
                    'fill':'#D8D8D8',
                    'opacity':.3



                    },500)

                } else {

                    this.restore();
                }
            },
            restore:function(){
                this.bar_speaking_time.animate({
                'fill':this.speaking_time_color,
                'opacity':this.opacity_initial



                },500)

                this.rectangle.animate({
                'fill':this.screen_time_color,
                'opacity':1



                },500)

            },
            move_bars:function(o){




                    this.bar_speaking_time.animate({
                        'x':o.xpos+this.bar_width
                    },500);

                    this.rectangle.animate({
                        'x':o.xpos
                    },500)

            },


            draw_speaking_time:function(){

                var r = this;

                var speaking_time_x = this.xpos;
                if(this.diff_speaking_time > 0){
                    this.speaking_time_color = r.color_male_speaking_time;;

                } else {
                    this.speaking_time_color = r.color_female_speaking_time;
                    //speaking_time_x = this.xpos -Math.abs(this.diff_speaking_time);
                }

                    this.bar_speaking_time = this.paper.rect(this.xpos, this.ypos-Math.abs(this.diff_speaking_time), this.bar_width, 1 );

                    this.bar_speaking_time.attr(
                        {fill:this.speaking_time_color,
                            'stroke-width':0,
                            'opacity':this.opacity_initial
                        }

                    );


                    this.bar_speaking_time.animate({
                        'height':Math.abs(this.diff_speaking_time)


                    },500,'easeOut');



                    var m = this.model;

                    var r = this;
                    this.bar_speaking_time.mouseover(
                        function(){
                            this.animate({
                                opacity:r.opacity_mouseover


                            },300);
                        }
                    )

                    this.bar_speaking_time.mouseout(
                        function(){

                            this.animate({
                                opacity:r.opacity_initial


                            },300);
                        }
                    )

                    this.bar_group.push(this.bar_speaking_time);

            },

            // screen time
            draw_screen_time:function(){
                var r = this;
                var screen_time_x = this.xpos;
                if(this.bar_length > 0){
                    this.screen_time_color = r.color_male_screen_time;

                } else {
                    this.screen_time_color = r.color_female_screen_time;

                    //screen_time_x = this.xpos -this.abs_bar_length;

                }



                this.rectangle = this.paper.rect(this.xpos+this.bar_width, this.ypos-this.abs_bar_length , this.bar_width, 1 );

                this.rectangle.attr(
                    { fill:this.screen_time_color,
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':this.color

                    }
                )

                this.rectangle.animate({
                    'height':this.abs_bar_length


                },500,'easeOut');

                var m = this.model;

                var r = this;

                this.rectangle.mouseover(
                    function(){
                        //console.log("this is a mouse over thing");
                        // console.log("SCREEN TIME " + m.get("name") + ' speaking time ' + m.get("difference_speaking_time") + ' screen time ' + m.get("difference_screen_time"))
                        //console.log(m.attributes);
                        this.animate({
                            opacity:r.opacity_mouseover


                        },300);
                    }
                )


                this.rectangle.mouseout(
                    function(){
                        //console.log("this is a mouse over thing");
                        this.animate({
                            opacity:1

                        },300);
                    }
                )

                this.bar_group.push(this.rectangle);

            },

            hide:function(){
                this.bar_group.hide().animate({opacity:0});
            },
            show:function(){
                this.bar_group.show()
                this.restore();

            },
            update:function(o){


                if(o.type == "hide_year"){

                    if(o.year != this.year){
                        this.hide();
                    }

                    if(o.year == this.year){
                        this.show();
                    }
                }


                if(o.type == "disable_bars"){
                    if(o.name != "All"){
                        this.disable({type:o.category, name:o.name});
                    } else{
                        this.restore();
                    }

                }


            }








        });

        return Bar_vertical_v;


    });

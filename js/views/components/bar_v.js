define(["jquery", "underscore", "backbone","raphael","views/components/bar_legend_v","views/components/generic_component_v"],
    function($, _, Backbone, Raphael,  Bar_legend_v, Generic_component_v) {






        var Bar_v = Generic_component_v.extend({



            initialize: function(o) {

                Bar_v.__super__.initialize.apply(this);

                this.year = o.year;




                this.scale_change = 6;
                this.diff_screen_time = o.diff_screen_time*this.scale_change;
                this.diff_speaking_time = o.diff_speaking_time*this.scale_change;
                this.paper = o.paper;
                this.color = o.color;
                this.root = this.paper.set();
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.rectangle;
                this.bar_length = this.diff_screen_time;

                this.bar_speaking_time;

                this.abs_bar_length = Math.abs(this.bar_length);
                this.bar_height = o.bar_height;
                this.bar_group = this.paper.set();


                this.speaking_time_color;
                this.screen_time_color;

                this.opacity_initial= 0.7;
                this.opacity_mouseover = 0.4;




                this.draw_screen_time();
                this.draw_speaking_time();





                this.build_caption();


                var r = this;
                var m = this.model;

                this.bar_group.push(this.rectangle, this.bar_speaking_time);


                this.bar_group.mouseover(


                    function(){

                        r.show_captions();
                        r.rectangle.animate({
                            opacity:.4


                        },300);

                        r.bar_speaking_time.animate({
                            opacity:.4


                        },300);
                    }
                )

                this.bar_group.mouseout(


                    function(){

                        r.hide_captions();
                        // console.log( m.get("name") + ' speaking time ' + m.get("difference_speaking_time") + ' screen time ' + m.get("difference_screen_time")+ ' gross revenue ' + m.get("gross_revenue")/1000000)
                        r.rectangle.animate({
                            opacity:1


                        },300);

                        r.bar_speaking_time.animate({
                            opacity:r.opacity_initial


                        },300);
                    }
                )

                //this.bar_legend_v = new Bar_legend_v({paper:this.paper});




            },
            get_root:function () {
                return this.bar_group;
            },
            build_caption:function(){

                var label_position  = 0;
                var color_speak     = '#7FCDEF';
                var color_screen    = '#456F7F';



                var r = this;

                if(this.diff_screen_time > this.diff_speaking_time){
                    label_position = this.diff_screen_time;
                } else {
                    label_position = this.diff_speaking_time;
                }


                this.legend_label = this.paper.text(this.xpos-230+25,this.ypos+3,'This is my label');
                this.label_screen_time = this.paper.text(this.xpos-230,this.ypos+3,'This is my label');

                if(this.diff_speaking_time < 0){
                    var color_speak    = '#E5BAB1';
                    //this.legend_label = this.paper.text(this.xpos-this.diff_speaking_time-15,this.ypos+3,'This is my label');
                    //this.legend_label.attr({'text-anchor':'end'});
                        this.legend_label.attr({'text-anchor':'start'});

                } else{
                //    this.legend_label = this.paper.text(this.xpos+label_position+15,this.ypos+3,'This is my label');

                    this.legend_label.attr({'text-anchor':'start'});


                }

                if(this.diff_screen_time < 0){
                    var color_screen     = '#B96555';
                //    this.label_screen_time = this.paper.text(this.xpos,this.ypos+3,'This is my label');
                    this.label_screen_time.attr({'text-anchor':'start'});
                } else {
                    //this.label_screen_time = this.paper.text(this.xpos+label_position+40,this.ypos+3,'This is my label');


                    this.label_screen_time.attr({'text-anchor':'start'});

                }








                var diff_speaking_time = Math.round(this.model.get("difference_speaking_time"));
                var diff_screen_time = Math.round(this.model.get("difference_screen_time"));


                this.legend_label.attr({text:Math.abs(diff_speaking_time)+"%"});
                this.legend_label.attr({
                    'font-size':10,
                    'font-family':'Roboto',
                    'font-weight':'700',
                    'fill':color_speak


                })

                this.label_screen_time.attr({text:Math.abs(diff_screen_time)+"%"});
                this.label_screen_time.attr({
                    'font-size':10,
                    'font-family':'Roboto',
                    'font-weight':'700',
                    'fill':color_screen


                })

                this.legend_label.hide();
                this.label_screen_time.hide();
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

            hide:function(){
                this.bar_group.hide().animate({opacity:0});
            },
            show:function(){
                this.bar_group.show()
                this.restore();

            },
            move_bars:function(o){

                this.ypos = o.ypos;


                this.rectangle.animate({
                    'y':o.ypos



                },500)



               this.bar_speaking_time.animate({
                    'y':o.ypos



                },500);
                this.legend_label.animate({
                     'y':o.ypos+3



                 },0);

                 this.label_screen_time.animate({
                      'y':o.ypos+3



                  },0);

                //this.bar_legend_v.move(this.xpos,this.ypos);

            },


            draw_speaking_time:function(){

                // male bias
                var r = this;
                var speaking_time_x = this.xpos;
                if(this.diff_speaking_time > 0){
                    this.speaking_time_color = r.color_male_speaking_time;

                } else {
                    this.speaking_time_color = r.color_female_speaking_time;
                    speaking_time_x = this.xpos -Math.abs(this.diff_speaking_time);
                }



                    this.bar_speaking_time = this.paper.rect(speaking_time_x, this.ypos, 1, this.bar_height );

                    var r = this;
                    this.bar_speaking_time.attr(
                        {fill:this.speaking_time_color,
                            'stroke-width':0,
                            'opacity':r.opacity_initial
                        }

                    );


                    this.bar_speaking_time.animate({
                        'width':Math.abs(this.diff_speaking_time)


                    },500,'easeOut');



                //    console.log(" speaking time " + this.diff_speaking_time);



                    var m = this.model;

                    var r = this;



            },

            // screen time
            draw_screen_time:function(){
                var r = this;

                var screen_time_x = this.xpos;
                if(this.bar_length > 0){
                    this.screen_time_color = r.color_male_screen_time;

                } else {
                    this.screen_time_color = r.color_female_screen_time;

                    screen_time_x = this.xpos -this.abs_bar_length;

                }



                this.rectangle = this.paper.rect(screen_time_x, this.ypos, 1, this.bar_height );
                this.rectangle.attr(
                    { fill:this.screen_time_color,
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':this.color

                    }
                )

                this.rectangle.animate({
                    'width':this.abs_bar_length


                },500,'easeOut');

                var m = this.model;




            },


            show_captions:function(){
                //    disable for now

                /*

                    var f_speaking_time = this.model.get("female_speaking_time");

                    this.legend_label.show();
                    this.label_screen_time.show();
                    //console.log(this.legend_label);*/


            },

            hide_captions:function () {

                this.legend_label.hide();
                this.label_screen_time.hide();
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

        return Bar_v;


    });

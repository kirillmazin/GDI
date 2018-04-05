define(["jquery", "underscore", "backbone","raphael","views/components/legend_generic_v"],
    function($, _, Backbone,Raphael, Legend_generic_v) {






        var Legend_v = Legend_generic_v.extend({



            initialize: function(o) {


                this.paper =  o.paper;



                this.legend_background;
                this.chart_legend_v = this.paper.set();
                this.color_background = "#F3F3F3";
                this.color_1 = "#b96555";
                this.color_2 = "#edcfc8";
                this.color_3 = "#ccebf9";
                this.color_4 = "#456f7f";

                this.stroke_color = "#FFF";




                this.build_legend();



                //this.draw_pie_chart(this.pie_data);

                //this.pie.translate(0,100);






            },



            build_legend:function(){


                        this.paper.image('imgs/arrow_up.png', 960-7,7, 7,46);
                        /*
                        this.legend_background = this.paper.rect(0, 0, 200, 90);
                        this.legend_background.attr({
                            'fill':this.color_background,
                            'stroke-width':0,
                        })
                        */
                        this.legend_label = this.paper.text(960-25,25,'This is my label');

                        this.labels_group = this.paper.set(this.legend_label);
                        this.labels_group.attr({
                            'font-size':14,
                            'font-family':'Ubuntu',
                            'font-weight':'400',
                            'fill':'#9B9B9B',
                            'text-anchor':'end',
                            'width':'10'
                        })
                        //this.legend_group = this.paper.set();
                        //this.legend_group.push(this.legend_label, this.legend_background, this.pie);

                        //this.legend_group.translate(600, 0);

            },


            draw_speaking_time:function(){

                // male bias

                var speaking_time_x = this.xpos;
                if(this.diff_speaking_time > 0){
                    this.speaking_time_color = "#7FCDEF";

                } else {
                    this.speaking_time_color = "#E5BAB1";
                    speaking_time_x = this.xpos -Math.abs(this.diff_speaking_time);
                }

                    this.bar_speaking_time = this.paper.rect(speaking_time_x, this.ypos, 1, this.bar_height );

                    this.bar_speaking_time.attr(
                        {fill:this.speaking_time_color,
                            'stroke-width':0,
                            'opacity':this.opacity_initial
                        }

                    );


                    this.bar_speaking_time.animate({
                        'width':Math.abs(this.diff_speaking_time)


                    },500,'easeOut');



                    var m = this.model;

                    var r = this;
                    this.bar_speaking_time.mouseover(
                        function(){
                            //console.log("this is a mouse over thing");
                            console.log("SPEAKING TIME " + m.get("name") + ' speaking time ' + m.get("difference_speaking_time") + ' screen time ' + m.get("difference_screen_time"))
                            //console.log(m.attributes);
                            this.animate({
                                opacity:r.opacity_mouseover


                            },300);
                        }
                    )

                    this.bar_speaking_time.mouseout(
                        function(){
                            //console.log("this is a mouse over thing");
                            //console.log("SPEAKING TIME " + m.get("name") + ' speaking time ' + m.get("difference_speaking_time") + ' screen time ' + m.get("difference_screen_time"))
                            //console.log(m.attributes);
                            this.animate({
                                opacity:r.opacity_initial


                            },300);
                        }
                    )

            },

            // screen time
            draw_screen_time:function(){

                var screen_time_x = this.xpos;
                if(this.bar_length > 0){
                    this.screen_time_color = "#456F7F";

                } else {
                    this.screen_time_color = "#B96555";

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

                var r = this;

                this.rectangle.mouseover(
                    function(){
                        //console.log("this is a mouse over thing");
                        console.log("SCREEN TIME " + m.get("name") + ' speaking time ' + m.get("difference_speaking_time") + ' screen time ' + m.get("difference_screen_time"))
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



            },









            render: function() {



            }

        });

        return Legend_v;


    });

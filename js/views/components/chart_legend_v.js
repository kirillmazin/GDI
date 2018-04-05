define(["jquery", "underscore", "backbone","raphael","views/components/generic_component_v"],
    function($, _, Backbone,Raphael, Generic_component_v) {






        var Chart_legend_v = Generic_component_v.extend({



            initialize: function(o) {

                Chart_legend_v.__super__.initialize.apply(this);


                this.paper =  o.paper;
                this.chart_legend_v = this.paper.set();


                this.legend_background;

                this.color_background = "#F3F3F3";




                this.build_legend();
            },




            move:function(x,y){
                this.chart_legend_v.transform("t "+x+","+y)
            },
            build_legend:function(){


                    this.legend_background = this.paper.rect(0, 0, 180, 80);
                    this.legend_background.attr({
                        'fill':this.color_background,
                        'stroke-width':0,
                    })

                    this.legend_background.attr({
                        'fill':'white',
                        'stroke-width':0,
                    })



                        var r = this;
                        var l_screen_time   = this.paper.text(80,27,'Screen time');
                        var l_speaking_time = this.paper.text(80,45,'Speaking time');


                        var l_male          = this.paper.text(138,7,'Male');
                        var l_female        = this.paper.text(90,7,'Female');


                        var lg_bold = this.paper.set(l_screen_time,l_speaking_time );
                        lg_bold.attr({
                            'font-size':12,
                            'font-family':'Ubuntu',
                            'font-weight':'400',
                            'fill':'#4A4A4A',
                            'text-anchor':'end',
                            'width':'10'
                        })

                        var lg_regular = this.paper.set(l_male,l_female);


                        var l_c_female_screen= this.paper.rect(90, 20, 40, 16);
                        var l_c_female_speak = this.paper.rect(90, 36, 40, 16);


                        //var l_c_female_screen = this.paper.rect(138, 20, 40, 16);
                        //var l_c_female_speak = this.paper.rect(138, 36, 40, 16);

                        var l_c_male_screen= this.paper.rect(138, 20, 40, 16);
                        var l_c_male_speak = this.paper.rect(138, 36, 40, 16);


                        l_c_male_screen.attr({
                            'fill':r.color_male_screen_time,
                            'stroke-width':0,
                        });

                        l_c_male_speak.attr({
                            'fill':r.color_male_speaking_time,
                            'stroke-width':0,
                        })

                        l_c_female_screen.attr({
                            'fill':r.color_female_screen_time,
                            'stroke-width':0,
                        });

                        l_c_female_speak.attr({
                            'fill':r.color_female_speaking_time,
                            'stroke-width':0,
                        })





                        lg_regular.attr({
                            'font-size':12,
                            'font-family':'Ubuntu',
                            'font-weight':'700',
                            'fill':'#4A4A4A',
                            'text-anchor':'start',
                            'width':'10'
                        })


                        this.chart_legend_v.push(this.legend_background,l_c_male_screen,l_c_male_speak, l_c_female_screen,l_c_female_speak, l_screen_time,l_speaking_time,l_male,l_female );



            }
        });

        return Chart_legend_v;


    });

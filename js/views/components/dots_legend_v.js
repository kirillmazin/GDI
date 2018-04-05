define(["jquery", "underscore", "backbone","raphael","views/components/legend_generic_v"],
    function($, _, Backbone,Raphael, Legend_generic_v) {






        var Dots_legend_v = Backbone.View.extend({



            initialize: function(o) {


                this.paper =  o.paper;
                this.chart_legend_v = this.paper.set();


                this.legend_background;

                this.color_background = "#F3F3F3";


                this.l_revenue;


                this.l_male_speak;
                this.l_male_screen;

                this.l_female_speak;
                this.l_female_screen;

                this.build_legend();



                //this.draw_pie_chart(this.pie_data);

                //this.pie.translate(0,100);






            },



            update_text:function(o){
                this.l_female_speak.attr({text:o.f_speak+"%"});
                this.l_female_screen.attr({text:o.f_screen+"%"});
                    this.l_male_screen.attr({text:o.m_screen+"%"});
                    this.l_male_speak.attr({text:o.m_speak+"%"});
                    this.l_revenue.attr({text:"$"+o.gross_revenue});
            },
            move:function(x,y){
                this.chart_legend_v.show();
                this.chart_legend_v.animate({transform : "t "+x+","+y},500);
            },
            hide:function(x,y){
                this.chart_legend_v.hide();
            },
            build_legend:function(){


                    this.legend_background = this.paper.rect(0, 0, 240, 105);
                    this.legend_background.attr({
                        'fill':"#ffffff",
                        'stroke-width':1,
                        'opacity':1,
                        'stroke':'#ebebeb'
                    })

                        var line_0_y = 18;
                        var line_1_y = 40;
                        var line_2_y = 62;
                        var line_3_y = 84;


                        var line_1_x = 110;
                        var line_2_x = 125;
                        var line_3_x = 175;

                        var l_screen_time   = this.paper.text(line_1_x ,line_1_y,'Screen time');
                        var l_speaking_time = this.paper.text(line_1_x ,line_2_y,'Speaking time');
                        var l_gross_revenue = this.paper.text(line_1_x ,line_3_y,'Gross revenue');

                        var l_male          = this.paper.text(line_2_x ,line_0_y,'Male');
                        var l_female        = this.paper.text(line_3_x,line_0_y,'Female');


                        this.l_male_screen = this.paper.text(line_2_x,line_1_y,'Screen');




                        this.l_male_speak  = this.paper.text(line_2_x,line_2_y,'Speak');


                        this.l_revenue        = this.paper.text(line_2_x,line_3_y,'Revenue');


                        this.l_female_screen = this.paper.text(line_3_x,line_1_y,'Screen');

                        this.l_female_speak = this.paper.text(line_3_x,line_2_y,'Speak');

                        var lg_bold = this.paper.set(l_screen_time,l_speaking_time,l_gross_revenue );
                        lg_bold.attr({
                            'font-size':14,
                            'font-family':'Ubuntu',
                            'font-weight':'400',
                            'fill':'#4A4A4A',
                            'text-anchor':'end',

                        })

                        var lg_regular = this.paper.set(l_male,l_female,this.l_revenue,this.l_male_speak,this.l_male_screen,this.l_female_screen,this.l_female_speak);








                        lg_regular.attr({
                            'font-size':14,
                            'font-family':'Ubuntu',
                            'font-weight':'700',
                            'fill':'#4A4A4A',
                            'text-anchor':'start',
                            'width':'10'
                        })

                        this.l_male_screen.attr({
                            'font-weight':'700',
                            'fill':"#119FB0",
                            'fill':"#2f9798"

                        });

                        this.l_male_speak.attr({
                            'font-weight':'700',
                            'fill':"#119FB0",
                            'fill':"#2f9798"
                        });

                        this.l_female_screen.attr({
                            'font-weight':'700',
                            'fill':"#BA537E",
                            'fill':"#ac255f"
                        });

                        this.l_female_speak.attr({
                            'font-weight':'700',
                            'fill':"#BA537E",
                            'fill':"#ac255f"
                        });


                        this.chart_legend_v.push(this.legend_background, this.l_revenue,l_gross_revenue, l_screen_time,l_speaking_time,l_male,l_female,this.l_male_speak,this.l_male_screen,this.l_female_screen,this.l_female_speak);
                        this.chart_legend_v.hide();


            }
        });

        return Dots_legend_v;


    });

define(["jquery", "underscore", "backbone","raphael","views/components/generic_component_v"],
    function($, _, Backbone,Raphael, Generic_component_v) {






        var Pie_chart_legend_v = Generic_component_v.extend({



            initialize: function(o) {

                Pie_chart_legend_v.__super__.initialize.apply(this);
                this.paper =  o.paper;
                this.type = o.type;


                this.chart_legend_v = this.paper.set();


                this.legend_background;

                this.color_background = "#F3F3F3";




                this.l_screen_time;
                this.l_speaking_time;

                this.l_male_data;
                this.l_female_data;



                this.build_legend();

/*

                //this.draw_pie_chart(this.pie_data);

                //this.pie.translate(0,100);


                */



            },



            update_text:function(o){



            //    console.log(o.legend_label + ' /// ' + o.m_speak + ' /// ' + o.f_speak)




                    if(o.chart_type == "screen"){


                        var c_1 = '#119fb0';
                        var c_2 = '#ba537e';
                        var c_2 = '#ac255f';
                        var label = "Screen time";
                        var m_time = o.m_screen+"%"
                        var f_time = o.f_screen+"%"
                    }

                    if(o.chart_type == "speaking" || o.chart_type == "speak"){

                        var c_1 = '#b3db6e';
                        var c_1 = '#aabf3e';
                        var c_2 = '#ffa55c';
                        var c_2 = '#ee594d';
                        var label = "Speaking time";
                        var m_time = o.m_speak+"%"
                        var f_time = o.f_speak+"%"

                    }


                    this.l_male_screen_data.attr({    'fill':c_1});
                    this.l_female_screen_data.attr({    'fill':c_2});
                    this.l_screen_time.attr({text:label});
                    this.l_male_screen_data.attr({text:m_time});
                    this.l_female_screen_data.attr({text:f_time });




            },
            move:function(x,y){
                this.chart_legend_v.show();
                this.chart_legend_v.animate({transform : "t "+x+","+y},500);
            },
            hide:function(x,y){
                this.chart_legend_v.hide();
            },
            build_legend:function(){

                    var r = this;

                    //this.legend_background = this.paper.rect(0, 0, 200, 70);
                    this.legend_background = this.paper.rect(0, 0, 240, 60);
                    this.legend_background.attr({
                        'fill':"#ffffff",
                        'stroke-width':1,
                        'opacity':1,
                        'stroke':'#ebebeb'
                    })

                    var line_0_y = 18;
                    var line_1_y = 40;
                    var line_2_y = 62;

                    var line_1_x = 110;
                    var line_2_x = 125;
                    var line_3_x = 185;

                        this.l_screen_time = this.paper.text(line_1_x,line_1_y,'Screen time');
                    /*    this.l_speaking_time = this.paper.text(90,line_2_y ,'Speaking time');*/

                        var l_male          = this.paper.text(line_3_x,line_0_y,'Male');
                        var l_female        = this.paper.text(line_2_x,line_0_y,'Female');


                        this.l_male_screen_data = this.paper.text(line_3_x,line_1_y,'Screen');
                        this.l_female_screen_data = this.paper.text(line_2_x,line_1_y,'Screen');

                        /*
                        this.l_male_speaking_data   = this.paper.text(100,line_2_y ,'45%');
                        this.l_female_speaking_data = this.paper.text(148,line_2_y ,'99%');
*/


                        var lg_bold = this.paper.set(this.l_screen_time, this.l_speaking_time);
                        lg_bold.attr({
                            'font-size':14,
                            'font-family':'Ubuntu',
                            'font-weight':'400',
                            'fill':'#4A4A4A',
                            'text-anchor':'end',

                        })

                        var lg_regular = this.paper.set(l_male,l_female,this.l_male_screen_data ,this.l_female_screen_data);





                        lg_regular.attr({
                            'font-size':14,
                            'font-family':'Ubuntu',
                            'font-weight':'700',
                            'fill':'#4A4A4A',
                            'text-anchor':'start',
                            'width':'10'
                        })




                        this.l_male_screen_data.attr({
                            'fill':'#119fb0'
                        });



                        this.l_female_screen_data.attr({
                            'fill':'#ba537e'
                        });

                        /*this.l_male_speaking_data.attr({
                            'fill':r.color_male_speaking_time
                        });

                        this.l_female_speaking_data.attr({
                            'fill':r.color_female_speaking_time
                        });*/






                        this.chart_legend_v.push(this.legend_background,l_male,l_female,this.legend_background, this.l_screen_time, this.l_speaking_time, this.l_male_screen_data,this.l_female_screen_data,this.l_male_speaking_data,this.l_female_speaking_data);

                        this.chart_legend_v.hide();


            }
        });

        return Pie_chart_legend_v;


    });

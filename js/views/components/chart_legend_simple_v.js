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





                        var r = this;

                        var l_male          = this.paper.text(138,7,'Male');
                        var l_female        = this.paper.text(70,7,'Female');

                        var lg_regular = this.paper.set(l_male,l_female);

                        lg_regular.attr({
                            'font-size':16,
                            'font-family':'Ubuntu',
                            'font-weight':'700',
                            'fill':'#4A4A4A',
                            'text-anchor':'start',
                            'width':'10'
                        })



                        this.chart_legend_v.push(l_male,l_female );



            }
        });

        return Chart_legend_v;


    });

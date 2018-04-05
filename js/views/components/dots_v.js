define(["jquery", "underscore", "backbone","raphael","views/components/generic_component_v"],
    function($, _, Backbone,Raphael,Generic_component_v) {

        var Dot_v = Generic_component_v.extend({



            initialize: function(o) {
                Dot_v.__super__.initialize.apply(this);

                this.paper = o.paper;
                this.color = o.color;
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;

                this.revenue = this.model.get("gross_revenue");
                this.revenue_millions = Math.round(this.revenue  / 5000);

                //var area = Math.PI * Math.pow(radius, 2);

                this.radius = Math.sqrt(this.revenue_millions / Math.PI)


                this.opacity_initial = 0.1;
                this.draw_element();

            },

            draw_element:function(){

                this.circle  = this.paper.circle(this.xpos,this.ypos,1);



                var r = this;
                this.circle.attr({

                    'stroke-width':1,
                    'stroke':this.color,
                    'opacity':.4
                });


                this.circle.animate(
                    {r:this.radius
                    },1000);


                var m = this.model;
                this.circle.mouseover(function(){
                    //console.log(this.attrs.r);

                    r.trigger("update",{type:"show_legend",m:m,element_data:this.attrs});
                    var revenue = m.get("gross_revenue")/10000000;
                    var name = m.get("name");
                    var screen_time = m.get("difference_screen_time");
                    var speak_time = m.get("difference_speaking_time");

                    var n_r = this.attrs.r+20;
                    this.animate({
                        opacity:1,
                        'stroke-width':5

                    },300);
                });
                this.circle.mouseout(function(){

                    r.trigger("update",{type:"hide_legend"});
                    this.transform('');
                    this.animate({
                        opacity:.4,
                        'stroke-width':1

                    },300);
                });


                //this.pos({});
            },
            move:function(o){


                //console.log(o.ypos);

                this.circle.animate({
                    'cy':o.ypos



                },1000,'easeOut')

              /* this.bar_speaking_time.animate({
                    'y':o.ypos



                },500)*/
            },
            disable:function(o){
                //console.log('disable');

                if(o.name != this.model.get(o.type)){

                    this.circle.animate({
                    'fill':'#D8D8D8',
                    'opacity':.3



                    },500)



                } else {

                    this.enable();
                }



            },
            enable:function(o){
                this.circle.animate({
                'fill':this.color,
                'opacity':this.opacity_initial



                },500)
            }







        });

        return Dot_v;


    });

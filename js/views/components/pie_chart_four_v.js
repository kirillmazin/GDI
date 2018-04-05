define(["jquery", "underscore", "backbone","raphael","views/components/legend_generic_v"],
    function($, _, Backbone,Raphael, Legend_generic_v) {






        var Pie_chart_four_v = Legend_generic_v.extend({



            initialize: function(o) {


                Pie_chart_four_v.__super__.initialize.apply(this);
                this.type = o.type;
                this.paper =  o.paper;
                this.pie  = this.paper.set();

                this.TWO_PI = Math.PI * 2;
                this.radius = o.radius;
                this.offset_angle = 0;
                this.resolution = 0.1;
                this.segments = o.segments;
                this.used_color_1;
                this.used_color_2;

                this.xpos;
                this.ypos;

                this.legend_background;
                this.color_background = "#F3F3F3";


                this.color_f_screen = "#EF6406";
                this.color_f_speak = "#FCD0D0";
                this.color_m_screen = "#4D847F";
                this.color_m_speak = "#C7E2B5";


                this.color_m_speak = "#B3DB6E";



                    this.color_m_screen = "#119FB0";

                    this.color_f_speak = "#FFA55C";

                    this.color_f_screen = "#BA537E";



                if(this.type == "speaking"){
                    var color_1 = this.color_f_speak;
                    var color_2 = this.color_m_speak;

                //    this.used_color_1 = this.color_f_speak;
                //    this.used_color_2 = this.color_m_speak;
                }
                if(this.type == "screen"){
                    var color_1 = this.color_f_screen;
                    var color_2 = this.color_m_screen;

                //    this.used_color_1 = this.color_f_speak;
                //    this.used_color_2 = this.color_m_speak;

                }




                this.stroke_color = "#FFF";



                this.pie_data = {
                    radius : this.radius,
                    segments : [

                        {value : this.segments.m_screen, fill : this.color_m_screen, stroke : this.color_m_screen},
                        {value : this.segments.m_speak, fill : this.color_m_speak, stroke : this.color_m_speak},
                        {value : this.segments.f_screen, fill : this.color_f_screen, stroke : this.color_f_screen},
                        {value : this.segments.f_speak, fill : this.color_f_speak, stroke : this.color_f_speak}

                    ],
                    resolution : this.resolution
                };
                this.draw_pie_chart(this.pie_data);
                //this.pie.translate(0,100);
                //this.move(0,0);
            },
            get_root:function(){
                    return this.pie;
            },
            draw_pie_chart:function(pie_data){

                var length = pie_data.segments.length;
                var r = this;



                for(var i=0;i<length;i++){

                    var segment_data = pie_data.segments[i];
                    var angle = this.TWO_PI * segment_data.value;
                    var seg = this.draw_segment(pie_data.radius, angle, this.offset_angle, pie_data.resolution);
                    seg.attr({stroke:segment_data.stroke,fill:segment_data.fill,'stroke-width':1});

                    this.pie.push(seg);
                    this.offset_angle += angle;
                }








                    this.circle  = this.paper.circle(this.xpos,this.ypos,this.radius);
                    this.circle.attr({
                        opacity:0,
                        fill:"#FFFFFF",
                        'stroke-width':1,
                        stroke:"#FFFFFF"

                    })

                    var label = "Screen time";
                    if(this.type == "speaking") {
                        label = "Speaking time";
                    }
                    this.circle.mouseover(function(){
                        this.attr({
                            opacity:.4
                        })


                        r.trigger("update",
                        {
                            type:"show_pie_legend",
                            segments:r.segments,
                            chart_type:r.type,
                            chart_label:label,
                            element_data:{x:r.xpos, y:r.ypos}
                        })

                    });



                    this.circle.mouseout(function(){
                        this.attr({
                            opacity:0
                        })
                            r.trigger("update",{type:"hide_pie_legend",segments:r.segments, chart_type:r.type,element_data:{x:r.xpos, y:r.ypos}})
                    });



                this.pie.push(this.circle);




            },
            move:function(x,y){
                this.xpos = x;
                this.ypos = y;

                this.pie.translate(this.xpos,this.ypos)
            },
            draw_segment:function(radius, value, rotation, resolution) {
                if (!resolution) resolution = 0.1;
                    var path = "M 0 0 ";

                    for (var i = 0; i < value; i+=resolution){
                        path += this.polar_path(radius, i, rotation);
                    }
                    path += this.polar_path(radius, value, rotation);

                    path += "L 0 0";
                    var seg = this.paper.path(path);
                    return seg;
            },
            polar_path:function(radius, theta, rotation){
                var x, y;
                x = radius * Math.cos(theta + rotation);
                y = radius * Math.sin(theta + rotation);
                return "L " + x + " " + y + " ";
            }
        });

        return Pie_chart_four_v;


    });

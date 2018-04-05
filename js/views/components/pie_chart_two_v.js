define(["jquery", "underscore", "backbone","raphael","views/components/legend_generic_v"],
    function($, _, Backbone,Raphael, Legend_generic_v) {






        var Pie_chart_two_v = Legend_generic_v.extend({



            initialize: function(o) {

                this.type = "screen";
                this.visible = false;
                this.year = o.year;
                Pie_chart_two_v.__super__.initialize.apply(this);
                this.type = o.type;
                this.paper =  o.paper;
                this.pie_speaking  = this.paper.set();
                this.pie_screen    = this.paper.set();
                this.pies = this.paper.set();


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
                this.color_white_line = "#fff";






                this.color_m_speak = "#B3DB6E";
                this.color_m_speak = "#aabf3e";
                this.color_m_screen = "#119FB0";
                this.color_m_screen = "#2f9798";

                this.color_f_speak = "#FFA55C";
                this.color_f_screen = "#BA537E";

                this.color_f_screen = "#ac255f";

                    this.color_f_speak = "#ee594d";



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



                this.pie_data_speaking = {
                    radius : this.radius,
                    segments : [


                        {value : this.segments.m_speak, fill : this.color_m_speak, stroke : this.stroke_color},
                        {value : this.segments.f_speak, fill : this.color_f_speak, stroke : this.stroke_color}

                    ],
                    resolution : this.resolution
                };


                this.pie_data_screen = {
                    radius : this.radius,
                    segments : [

                        {value : this.segments.m_screen, fill : this.color_m_screen, stroke : this.stroke_color},
                        {value : this.segments.f_screen, fill : this.color_f_screen, stroke : this.stroke_color}

                    ],
                    resolution : this.resolution
                };




                this.pie_speaking = this.draw_pie_chart(this.pie_data_speaking);
                this.pie_screen = this.draw_pie_chart(this.pie_data_screen);

                this.pies.push(this.pie_speaking, this.pie_screen);

            },
            get_root:function(){
                    return this.pies;
            },
            draw_pie_chart:function(pie_data){

                var length = pie_data.segments.length;
                var r = this;

                var pie = this.paper.set();

                for(var i=0;i<length;i++){

                    var segment_data = pie_data.segments[i];
                    var angle = this.TWO_PI * segment_data.value;
                    var seg = this.draw_segment(pie_data.radius, angle, this.offset_angle, pie_data.resolution);
                    seg.attr({stroke:segment_data.stroke,fill:segment_data.fill,'stroke-width':1});

                    pie.push(seg);
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



                pie.push(this.circle);

                return pie;


            },
            move:function(x,y){
                this.xpos = x;
                this.ypos = y;

                this.pies.translate(this.xpos,this.ypos)
            //  this.pie_screen.translate(this.xpos,this.ypos)
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
            },
            set_type:function (type) {

                if(type == "speaking" ){


                    this.pie_speaking.show();
                    this.pie_screen.hide();
                }

                if(type == "screen"){
                    this.pie_speaking.hide();
                    this.pie_screen.show();
                }

            },
            hide:function(o){
                this.pies.hide();
                this.visible = false;

            },
            show:function(o){
                this.pies.show();

                this.set_type(this.type);

            },
            update:function(o){


                if(o.type == "resort_data"){

                    //console.log("year " + o.year + " this year " + this.year)
                    if(o.sort_by == "Speaking time"){
                        this.type = "speaking";
                        this.set_type(this.type);

                    }

                    if(o.sort_by == "Screen time"){
                        this.type = "screen";
                        this.set_type(this.type);
                    }

                    if (o.year != this.year) {
                        this.hide();
                    }
                }



                if(o.type == "hide_year"){


                    if (o.year != this.year) {
                        this.hide();
                    }
                    if (o.year == this.year) {
                        this.show();
                    }

                }



            }
        });

        return Pie_chart_two_v;


    });

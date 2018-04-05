define(["jquery", "underscore", "backbone","raphael","views/components/bar_time_lead_type_v","views/components/legend_v","views/components/pie_chart_two_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Bar_time_lead_type_v,Legend_v, Pie_chart_two_v, Generic_section_v) {






        var Bars_time_lead_type_v = Generic_section_v.extend({



            initialize: function(o) {
                this.bar_height = 8;
                this.bar_spacing = 1;
                this.spacing_between_sections = 16;
                this.scale_change = 3;
                this.section_id = o.section_id;
                this.section_label = o.section_label;
                this.type = o.type;
                this.gender = o.gender;

                this.paper = o.paper;
                this.gender = o.gender;

                this.root = this.paper.set();


                this.year  = o.year;

                this.offset = o.offset;


                this.previous_section_length = o.previous_section_length;

                this.all_bars = [];

                this.s_height = (this.bar_height+this.bar_spacing) * this.collection.models.length+this.spacing_between_sections;
                this.ypos = (this.bar_height+this.bar_spacing) * this.previous_section_length +((this.section_id-1)*this.spacing_between_sections)+this.spacing_between_sections +this.offset;




                this.xpos = o.xpos;

                this.label_offset = 120;
                //this.xpos = o.xpos;
                this.listenTo(this.collection,"sort",this.reorder)



                // filters
                this.active_year;
                this.active_type;
                this.active_genre  = "All";
                this.active_rating = "All";



                var segmens = this.calculate_totals();


                var pie_radius = 30;

                this.avg_f_screen;
                this.avg_f_speak;

                this.avg_m_screen;
                this.avg_m_speak;

                this.total_avg_speak_screen;


                this.draw_percentage_grid();

                this.chart_bars();
                this.create_header_line();

                this.update({type:"resort_data", comparator:"abs_difference_on_screen_time"});

            },

            calculate_totals:function(){

                var average_female_on_screen_time = 0;
                var average_female_speaking_time = 0;
                var average_male_on_screen_time = 0;
                var average_male_speaking_time = 0;


                var total = this.collection.models.length;

                for(var i=0;i<this.collection.models.length;i++){

                    var m = this.collection.models[i];
                    var female_on_screen_time = this.collection.models[i].get("female_on_screen_time");
                    var female_speaking_time = this.collection.models[i].get("female_speaking_time");

                    var male_on_screen_time = this.collection.models[i].get("male_on_screen_time");
                    var male_speaking_time = this.collection.models[i].get("male_speaking_time");

                    average_female_on_screen_time += female_on_screen_time;
                    average_female_speaking_time += female_speaking_time;

                    average_male_on_screen_time += male_on_screen_time;
                    average_male_speaking_time += male_speaking_time;

                }

                this.avg_f_speak = average_female_speaking_time/total;
                this.avg_m_speak = average_male_speaking_time/total;




                this.avg_f_screen = average_female_on_screen_time/total;
                this.avg_m_screen = average_male_on_screen_time/total;




                this.total_avg_speak = this.avg_f_speak+this.avg_m_speak;

                this.total_avg_screen = this.avg_f_screen+this.avg_m_screen;

                this.avg_f_speak = this.avg_f_speak/this.total_avg_speak;
                this.avg_m_speak = this.avg_m_speak/this.total_avg_speak;

                this.avg_m_screen = this.avg_m_screen/this.total_avg_screen;
                this.avg_f_screen = this.avg_f_screen/this.total_avg_screen;






            },
            create_header_line:function(){
                this.rectangle = this.paper.rect(this.xpos, this.ypos+1, 900/2, 1 );
                this.rectangle.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC'

                    }
                )

                var section_label = this.paper.text(this.xpos,this.ypos+28,this.section_label);
                var labels_group = this.paper.set(section_label);

                labels_group.attr({
                    'font-size':11,
                    'font-family':'Ubuntu',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'start',
                    'width':100
                })

                var data_to_use;
                if(this.gender == "male"){
                    data_to_use = this.avg_f_screen;

                }
                if(this.gender == "female"){
                        data_to_use = this.avg_m_screen;

                }





                this.line_avg = this.paper.rect(Math.round(this.xpos+ data_to_use*100*this.scale_change)+this.label_offset, this.ypos+1, 2,  this.s_height );

                this.line_avg.attr({'fill':'#ff8244','stroke-width':0});


                this.root.push(this.rectangle,section_label,this.line_avg);
                this.hide_speaking();
            },
            draw_percentage_grid:function(){
                // grey lines


                var line_0 =  this.paper.rect(this.xpos+this.label_offset,this.ypos+1, 1, this.s_height );
                var line_25 = this.paper.rect(this.xpos+this.label_offset+25*this.scale_change,this.ypos+1, 1, this.s_height);
                var line_50 = this.paper.rect(this.xpos+this.label_offset+50*this.scale_change,this.ypos+1, 1, this.s_height);
                var line_75 = this.paper.rect(this.xpos+this.label_offset+75*this.scale_change,this.ypos+1, 1, this.s_height);
                var line_100 = this.paper.rect(this.xpos+this.label_offset+100*this.scale_change,this.ypos+1, 1, this.s_height);
                var line_group = this.paper.set( line_0,line_25, line_50, line_75, line_100 );

                line_group.attr(
                    { fill:'#4A4A4A',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#f2f2f2',
                        'fill':'#f2f2f2'

                    }
                )

                this.root.push(line_0, line_25, line_50, line_75, line_100);

            },
            show_speaking:function () {
            //    this.line_f_speaking_avg.animate({opacity:1},500);
            //    this.line_m_speaking_avg.animate({opacity:1},500);


            },
            hide_speaking:function(){
                //this.line_f_speaking_avg.attr({opacity:0});
                //this.line_m_speaking_avg.attr({opacity:0});

            },
            show_screen:function(){
            //    this.line_f_screen_avg.animate({opacity:1},500);
            //    this.line_m_screen_avg.animate({opacity:1},500);
            },
            hide_screen:function(){
            //    this.line_f_screen_avg.attr({opacity:0});
            //    this.line_m_screen_avg.attr({opacity:0});


            },
            chart_bars:function(){

                var total = this.collection.models.length;


                for(var i=0;i<total;i++){



                    var m = this.collection.at(i);
                    m.set("starting_order",i);

                    var female_on_screen_time = m.get("female_on_screen_time");
                    var male_on_screen_time = 100-female_on_screen_time;

                    var color;


                    var bar_length = m.get("difference_speaking_time");
                    var diff_speaking_time = m.get("difference_speaking_time");
                    var diff_screen_time = m.get("difference_screen_time");

                    if(this.gender == "female"){
                        if(this.type == "speak"){
                            color = "#b2dd67";
                            color = "#aabf3e";
                        }

                        if(this.type == "screen"){
                            color = "#009fb1";

                        }

                    } else {

                        if(this.type == "speak"){
                            color = "#ffa554";
                            color = "#ed594d";
                        }

                        if(this.type == "screen"){
                            color = "#bc517e";
                            color = "#ac255f";

                        }
                    }



                    this.all_bars[i] = new Bar_time_lead_type_v({gender:this.gender, color:color,type:this.type, year:this.year,model:m, paper: this.paper, bar_length:bar_length, bar_height:this.bar_height, color:color,xpos:this.xpos+this.label_offset,ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos,id:i,diff_screen_time:diff_screen_time,diff_speaking_time:diff_speaking_time});



                    this.all_bars[i].listenTo(this,"update",this.all_bars[i].update);
                    this.listenTo(this.all_bars[i], "update", this.pie_chart_updates)



                }
            },
            reorder:function(){
                var total = this.collection.models.length;

                for(var i=0;i<this.collection.models.length;i++){


                    var m = this.collection.at(i);
                    var order =  m.get("starting_order");




                    this.all_bars[order].move_bars({xpos:this.xpos, ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos});
                    }



            },
            resort_data:function(comparator){
                this.collection.comparator = comparator;
                this.collection.sort();

            },


            hide:function() {

                //this.root.hide()
                    this.root.attr({opacity:0});

            },
            show:function(){

            //    this.root.show();
                this.root.attr({opacity:0});
                this.root.animate({opacity:1},300);



            },
            update:function(o){

                if(o.type == "hide_year"){




                    if(o.year == this.year){
                        this.show();


                    } else{
                       this.hide();
                    }

                    this.active_year = o.year;
                    this.trigger("update",{type:"hide_year",year:o.year});


                }



            }





        });

        return Bars_time_lead_type_v;


    });

define(["jquery", "underscore", "backbone","raphael","views/components/bar_action_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Bar_action_v,  Generic_section_v) {






        var Section_action_v = Generic_section_v.extend({



            initialize: function(o) {





                this.bar_height = 8;
                this.bar_spacing = 1;
                this.spacing_between_sections = 16;
                this.scale_change = 3;
                this.section_id = o.section_id;
                this.section_label = o.section_label;

                this.paper = o.paper;

                this.root = this.paper.set();

                this.type = o.type;
                this.year  = o.year;

                this.offset = o.offset;


                this.previous_section_length = o.previous_section_length;

                this.all_bars = [];


                this.ypos = (this.bar_height+this.bar_spacing) * this.previous_section_length +((this.section_id-1)*this.spacing_between_sections)+this.spacing_between_sections +this.offset;




                this.xpos = o.xpos;

                this.listenTo(this.collection,"sort",this.reorder)





                var segmens = this.calculate_totals();


                var pie_radius = 30;






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
                this.baseline = this.paper.rect(0, this.ypos+1, 960, 1 );
                this.baseline.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC'

                    }
                )

                var section_label = this.paper.text(0,this.ypos+20,this.section_label);
                var labels_group = this.paper.set(section_label);

                labels_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'start'
                })


                var s_height = (this.bar_height+this.bar_spacing) * this.collection.models.length+this.spacing_between_sections;


//





                // SCREEN TIME
                var m_data_to_use;
                var f_data_to_use;

                if(this.type == "screen"){


                    m_data_to_use = this.avg_m_screen;
                    f_data_to_use = this.avg_f_screen;

                }



                // SPEAKING TIME

                if(this.type == "speak"){

                    m_data_to_use = this.avg_m_speak;
                    f_data_to_use = this.avg_f_speak;
                }


                this.line_f_avg = this.paper.rect(Math.round(this.xpos - f_data_to_use*100*this.scale_change), this.ypos+1, 2,  s_height );
                this.line_f_avg.attr({'fill':'#ff8244','stroke-width':0});


                this.line_f_avg = this.paper.rect(Math.round(this.xpos+ m_data_to_use*100*this.scale_change), this.ypos+1, 2,  s_height );
                
                this.line_f_avg.attr({'fill':'#ff8244','stroke-width':0});



                this.root.push(this.rectangle,section_label,this.line_f_avg, this.line_m_avg);

            },


            chart_bars:function(){

                var total = this.collection.models.length;


                for(var i=0;i<total;i++){

                    var m = this.collection.at(i);


                    var female_on_screen_time = m.get("female_on_screen_time");
                    var male_on_screen_time = 100-female_on_screen_time;
                    var color = "#5E96AA";








                    var bar_length = m.get("difference_speaking_time");
                    var diff_speaking_time = m.get("difference_speaking_time");
                    var diff_screen_time = m.get("difference_screen_time");

                    this.all_bars[i] = new Bar_action_v({type:this.type, gender:"male",year:this.year,model:m, paper: this.paper, bar_length:bar_length, bar_height:this.bar_height, color:color,xpos:this.xpos,ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos,id:i,diff_screen_time:diff_screen_time,diff_speaking_time:diff_speaking_time})
                    this.all_bars[i].listenTo(this,"update",this.all_bars[i].update);
                    this.listenTo(this.all_bars[i], "update", this.pie_chart_updates)


                }
            },




            update:function(o){


            }





        });

        return Section_action_v;


    });

define(["jquery", "underscore", "backbone","raphael","views/components/bar_time_split_v","views/components/legend_v","views/components/pie_chart_two_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Bar_time_split_v,Legend_v, Pie_chart_two_v, Generic_section_v) {






        var Bars_time_section_split_v = Generic_section_v.extend({



            initialize: function(o) {
                this.bar_height = 8;
                this.bar_spacing = 1;
                this.spacing_between_sections = 16;
                this.scale_change = 3;
                this.section_id = o.section_id;
                this.section_label = o.section_label;

                this.paper = o.paper;

                this.root = this.paper.set();


                this.year  = o.year;

                this.offset = o.offset;


                this.previous_section_length = o.previous_section_length;

                this.all_bars = [];


                this.ypos = (this.bar_height+this.bar_spacing) * this.previous_section_length +((this.section_id-1)*this.spacing_between_sections)+this.spacing_between_sections +this.offset;




                this.xpos = o.xpos;
                this.xpos = 900/2;
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


                 this.pie_chart_screen_time_v = new Pie_chart_two_v({year:this.year, type:"screen",paper:this.paper, radius:pie_radius, segments:{f_screen:this.avg_f_screen,f_speak:this.avg_f_speak,m_screen:this.avg_m_screen,m_speak:this.avg_m_speak} });

                 this.pie_chart_screen_time_v.listenTo(this, "update",this.pie_chart_screen_time_v.update);



                 this.pie_chart_screen_time_v.move(pie_radius+2,this.ypos+pie_radius*2.3);

                 this.listenTo(this.pie_chart_screen_time_v,"update", this.pie_chart_updates);



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
                this.rectangle = this.paper.rect(0, this.ypos+1, 960, 1 );
                this.rectangle.attr(
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


                var color_avg_line = "#ff8244";

                // female average screen time
                this.line_f_screen_avg = this.paper.rect(Math.round(this.xpos- this.avg_f_screen*100*this.scale_change), this.ypos+1, 2,  s_height );
                //this.line_f_screen_avg.attr({'fill':'#FFCBE1','stroke-width':0});
                this.line_f_screen_avg.attr({'fill':color_avg_line,'stroke-width':0});

                this.line_m_screen_avg = this.paper.rect(Math.round(this.xpos+ this.avg_m_screen*100*this.scale_change), this.ypos+1, 2,  s_height );
                //this.line_m_screen_avg.attr({'fill':'#98E3EB','stroke-width':0});
                this.line_m_screen_avg.attr({'fill':color_avg_line,'stroke-width':0});
                // female average speaking time
                this.line_f_speaking_avg = this.paper.rect(Math.round(this.xpos- this.avg_f_speak*100*this.scale_change), this.ypos+1, 2,  s_height );
                this.line_f_speaking_avg.attr({'fill':'#FEDEC1','stroke-width':0});
                this.line_f_speaking_avg.attr({'fill':color_avg_line,'stroke-width':0});

                this.line_m_speaking_avg = this.paper.rect(Math.round(this.xpos+ this.avg_m_speak*100*this.scale_change), this.ypos+1, 2,  s_height );
                this.line_m_speaking_avg.attr({'fill':'#D4F798','stroke-width':0});
                this.line_m_speaking_avg.attr({'fill':color_avg_line,'stroke-width':0});

                this.root.push(this.rectangle,section_label,this.line_f_screen_avg, this.line_m_screen_avg,this.line_f_speaking_avg, this.line_m_speaking_avg);
                this.hide_speaking();
            },

            show_speaking:function () {
                this.line_f_speaking_avg.animate({opacity:1},500);
                this.line_m_speaking_avg.animate({opacity:1},500);


            },
            hide_speaking:function(){
                this.line_f_speaking_avg.attr({opacity:0});
                this.line_m_speaking_avg.attr({opacity:0});

            },
            show_screen:function(){
                this.line_f_screen_avg.animate({opacity:1},500);
                this.line_m_screen_avg.animate({opacity:1},500);
            },
            hide_screen:function(){
                this.line_f_screen_avg.attr({opacity:0});
                this.line_m_screen_avg.attr({opacity:0});


            },
            chart_bars:function(){

                var total = this.collection.models.length;


                for(var i=0;i<total;i++){



                    var m = this.collection.at(i);
                    m.set("starting_order",i);

                    var female_on_screen_time = m.get("female_on_screen_time");
                    var male_on_screen_time = 100-female_on_screen_time;
                    var color = "#5E96AA";








                    var bar_length = m.get("difference_speaking_time");
                    var diff_speaking_time = m.get("difference_speaking_time");
                    var diff_screen_time = m.get("difference_screen_time");

                    this.all_bars[i] = new Bar_time_split_v({type:"male",year:this.year,model:m, paper: this.paper, bar_length:bar_length, bar_height:this.bar_height, color:color,xpos:this.xpos,ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos,id:i,diff_screen_time:diff_screen_time,diff_speaking_time:diff_speaking_time})
                    this.all_bars[i].listenTo(this,"update",this.all_bars[i].update);
                    this.listenTo(this.all_bars[i], "update", this.pie_chart_updates)

                  // this.root.push(this.all_bars[i].get_root());
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

                this.root.hide()

            },
            show:function(){

                this.root.show();



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

                if(o.type == "disable_bars"){
                    //console.log(o)

                    if(o.category == "ratings"){
                        this.active_rating = o.name;
                    }

                    if(o.category == "genre"){
                        this.active_genre = o.name;

                    }
                    this.trigger("update",{type:"disable_bars",category:o.category, name:o.name, active_genre:this.active_genre, active_year: this.active_year, active_rating: this.active_rating});


                }

                if(o.type == "resort_data"){


                    //console.log(o.sort_by);

                    if(o.sort_by == "Speaking time"){
                        this.show_speaking();
                        this.hide_screen();
                    }

                    if(o.sort_by == "Screen time"){
                        this.show_screen();
                        this.hide_speaking();

                    }
                    o.year = this.active_year ;
                    this.trigger("update",o);
                    this.resort_data(o.comparator);
                }

            }





        });

        return Bars_time_section_split_v;


    });

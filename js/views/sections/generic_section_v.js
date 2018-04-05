define(["jquery", "underscore", "backbone","raphael","views/components/bar_time_v","views/components/legend_v","views/components/pie_chart_four_v"],
    function($, _, Backbone,Raphael, Bar_time_v,Legend_v, Pie_chart_four_v) {






        var Bars_time_section_v = Backbone.View.extend({



            initialize: function(o) {



            },
            pie_chart_updates:function (o) {

                this.trigger("update", o);
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




                this.total_avg_speak_screen = this.avg_f_speak+this.avg_m_speak+this.avg_f_screen+this.avg_m_screen;



                this.avg_f_speak = this.avg_f_speak/this.total_avg_speak_screen;
                this.avg_m_speak = this.avg_m_speak/this.total_avg_speak_screen;

                this.avg_m_screen = this.avg_m_screen/this.total_avg_speak_screen;
                this.avg_f_screen = this.avg_f_screen/this.total_avg_speak_screen;




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
                    'font-size':14,
                    'font-family':'Roboto',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'start'
                })

                this.root.push(this.rectangle,section_label);

            },
            reorder:function(){
                var total = this.collection.models.length;

                for(var i=0;i<this.collection.models.length;i++){


                    var m = this.collection.at(i);
                    var order =  m.get("starting_order");



                    //this.all_bars[order].move_bars({xpos:this.xpos, ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos});
                    this.all_bars[order].move_bars({xpos:this.xpos, ypos:(total-i)*(this.bar_height+this.bar_spacing)+this.ypos});
                    }



            },
            resort_data:function(comparator){
                this.collection.comparator = comparator;
                this.collection.sort();

            },
            disable_bars:function(o){
                for(var i=0;i< this.all_bars.length;i++){
                    if(o.name!= "All"){
                        this.all_bars[i].disable(o);
                    }
                    if(o.name== "All"){
                        this.all_bars[i].restore();
                    }
                }
            },
            hide:function() {
                this.root.hide()
            },
            show:function(){
                this.root.show();
            },
            update:function(o){
                if(o.type == "hide_year"){
                    this.trigger("update",{type:"hide_year",year:o.year});
                    if(o.year == this.year){
                        this.show();
                    } else{
                       this.hide();
                    }
                }

                if(o.type == "disable_bars"){
                    this.trigger("update",{type:"disable_bars",category:o.category, name:o.name});
                }

                if(o.type == "resort_data"){
                    this.resort_data(o.comparator);
                }

            }





        });

        return Bars_time_section_v;


    });

define([
"jquery",
"underscore",
"backbone",
"raphael",
"views/components/pies_revenue_v",
"views/components/legend_v",
"views/components/pie_chart_v",
"views/components/dots_legend_v","views/components/pie_chart_four_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Pies_revenue_v, Legend_v, Pie_chart_v, Dots_legend_v, Pie_chart_four_v, Generic_section_v) {






        var Pies_section_v = Generic_section_v.extend({



            initialize: function(o) {
                this.year = o.year;
                this.active_year;
                this.bar_height = 6;
                this.bar_spacing = 1;
                this.spacing_between_sections = 10;
                this.section_id = o.section_id;
                this.section_label = o.section_label;
                this.color = o.color;
                this.paper = o.paper;
                this.xpos = o.xpos;
                this.root = this.paper.set();
                this.previous_section_length = o.previous_section_length;

                this.all_chart_elements = [];

                this.average;
                this.ypos = (this.bar_height+this.bar_spacing) * this.previous_section_length +((this.section_id-1)*this.spacing_between_sections) ;






                this.listenTo(this.collection,"sort",this.reorder)



                this.all_heights = [];


                this.chart_elements();
                this.align_elements();

                var pie_radius = 30;
                this.avg_f_screen;
                this.avg_f_speak;

                this.avg_m_screen;
                this.avg_m_speak;

                this.calculate_totals();

                var xpos = 70;

                this.average_revenue = 0;
                //this.pie_chart_screen_time_v = new Pie_chart_four_v({type:"screen",paper:this.paper, radius:pie_radius, segments:{f_screen:this.avg_f_screen,f_speak:this.avg_f_speak,m_screen:this.avg_m_screen,m_speak:this.avg_m_speak} });
                //this.pie_chart_screen_time_v.move(this.xpos+xpos,820);

                //this.listenTo(this.pie_chart_screen_time_v,"update", this.pie_chart_updates);
                //this.root.push(this.pie_chart_screen_time_v.get_root());


            },
            pie_chart_updates:function (o) {

                this.trigger("update", o);
            },


            chart_elements:function(){

                var total_revenue = 0;
                this.average_revenue = 0;

                var total = this.collection.models.length;
                for(var i=0;i<this.collection.models.length;i++){
                    var m = this.collection.at(i)
                    m.set("starting_order",i);

                    var revenue = Math.round(m.get("gross_revenue"));

                    this.average_revenue += revenue;

                //    console.log("REVENUE " +  revenue);



                        this.all_chart_elements[i] = new Pies_revenue_v({model:m, paper: this.paper, color:'#4A4A4A',mouseover_color:this.color, xpos:this.xpos,ypos:(total-i)*15+120,thickness:1, initial_opacity:.1, amount: revenue});
                        this.all_chart_elements[i].listenTo(this, "update", this.all_chart_elements[i].update);

                        this.listenTo(this.all_chart_elements[i],"update",this.handle_dot_updates);
                        this.root.push(this.all_chart_elements[i].get_root());

                }
                this.average_revenue = Math.round(this.average_revenue/total);
                //this.draw_average();


            },
            draw_average:function(){
                var m = this.collection.at(0);
                m.set("gross_revenue",this.average_revenue);
                this.average = new Dots_outline_v({model:m, paper: this.paper, color:this.color ,mouseover_color:this.color, xpos:this.xpos, thickness:3, initial_opacity:1,amount: this.average_revenue});
                this.listenTo(this.average,"update",this.handle_dot_updates)
                this.root.push(this.average.get_root());
            },
            align_elements:function(){

                var prev_height = 0;
                var total_height = 0;




                var total = this.collection.models.length;

                var row     = 10;
                var column  = 10;






                    console.log("----------");
                    var t=0;
                    for(var k=0;k<column;k++){
                            console.log("k " + (k));
                                console.log("----------");
                            for(var m=0;m<row;m++){

                                console.log("m " + m)
                                console.log("t " + t)
                                t++;

                                this.all_chart_elements[t].move({xpos:k*100+50,ypos:m*100+50});
                            }

                    }







            },
            handle_dot_updates:function(o) {


                        this.trigger("update",o);
            },
            get_prev_heights:function(id){
                var t_height = 0;
                for(var i=0;i<id;i++){

                    var m = this.collection.at(i);
                    var order =  m.get("starting_order");







                    t_height += this.all_heights[order];


                }
                var m_2 = this.collection.at(id);
                revenue = Math.round(m_2.get("gross_revenue")/15000000);

                return t_height+revenue+40;

            },
            reorder:function(){






                var total = this.collection.models.length;
                var total_height = 0;

                for(var i=0;i<this.collection.models.length;i++){


                    var m = this.collection.at(i);

                    var order =  m.get("starting_order");
                    var revenue = Math.round(m.get("gross_revenue")/15000000)*2;



                   this.all_chart_elements[order].move({xpos:this.xpos,ypos:this.get_prev_heights(i)});

                    }



            },

            disable:function(o){


                for(var i=0;i< this.all_chart_elements.length;i++){
                    if(o.name!= "All"){
                    this.all_chart_elements[i].disable(o);
                    }

                    if(o.name== "All"){
                        this.all_chart_elements[i].show();
                    }
                }
            },
            update:function(o){
                if(o.type == "resort_data"){

                    this.resort_data(o.comparator);
                }

                if(o.type == "disable"){

                   this.trigger("update",{type:"disable_bars",category:o.category, name:o.name});
                   this.disable({name:o.name,type:o.category});


                }

                if(o.type == "hide_year"){


                    this.trigger("update",{type:"hide_year",year:o.year});


                    this.active_year = o.year;
                    if(o.year == this.year){
                        this.show();
                    } else{
                       this.hide();
                    }
                }

                if(o.type == "show_leads" && this.year == this.active_year){
                    console.log(" show leads " + o.name);
                    this.trigger("update",o);
                }
            }





        });

        return Pies_section_v;


    });

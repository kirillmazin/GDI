define(["jquery", "underscore", "backbone","raphael","views/components/dots_v","views/filters/filtering_menu_v","views/sections/bars_totals_section_v","views/components/legend_v","collections/movies_c",
"views/components/dots_legend_v",
"views/components/pie_chart_legend_v","views/chart_generic_v","views/sections/revenue_averages_section_v"],
    function($, _, Backbone,Raphael, Dots_v, Filtering_menu_v, Bars_totals_section_v,Legend_v, Movies_c, Dots_legend_v,Pie_chart_legend_v,Chart_generic_v, Revenue_averages_section_v) {






        var Chart_totals_v = Chart_generic_v.extend({



            initialize: function(o) {



                this.target_container = o.target_container;




                // Create collections
                this.male_leads_c   = [];
                this.female_leads_c = [];
                this.mf_leads_c     = [];
                this.bar_width      = 8;
                this.spacer         = 18;
                this.canvas_width = 900;

                this.paper = Raphael(this.target_container +"_canvas", this.canvas_width , 450);
                this.m_rectangles =[];
                this.f_rectangles =[];


                this.f_circles  = [];
                this.m_circles  = [];
                this.mf_circles  = [];

                this.all_dots    = [];


                this.default_circle_radius = 5;
                this.div_filters = "#"+this.target_container+"_filters";



                this.section_female_leads;
                this.section_male_leads;
                this.section_mf_leads;




                this.build_filters();



            },



            build_filters: function(){


                var all_lead_types = _.uniq(this.collection.pluck("lead_type"));
                var all_genres    = _.uniq(this.collection.pluck("genre"));
                var all_ratings   = _.uniq(this.collection.pluck("ratings"));
                all_genres.unshift("All")
                all_ratings.unshift("All")






                this.filtering_menu_years = new Filtering_menu_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_year",type:"year",label:"Year",style:"large"});
                this.filtering_menu_years.add_menu_items(["2014","2015"]);
                this.filtering_menu_years.select(0);



                this.listenTo(this.filtering_menu_genre,"update", this.process_filters);
                this.listenTo(this.filtering_menu_ratings,"update", this.process_filters);
                this.listenTo(this.filtering_menu_years,"update", this.process_filters);
                this.listenTo(this.filtering_menu_lead_type,"update", this.process_filters);
            },
            process_filters:function(o){


                var comparator;

                if(o.type == "sort_by"){

                    if(o.name == "Gross revenue"){
                        comparator = 'gross_revenue';
                        //this.legend_v.update_text("Higher gross revenue amount");
                    }

                    if(o.name == "Screen time"){
                        comparator = 'abs_difference_on_screen_time';
                        //        this.legend_v.update_text("Screen time difference");
                    }

                    if(o.name == "Speaking time"){
                        comparator = 'abs_difference_speaking_time';
                        //        this.legend_v.update_text("Speaking time difference");

                    }


                    this.trigger('update',{type:"resort_data",comparator:comparator});

                }



                if(o.type == "ratings"){

                        comparator = 'ratings';
                        this.trigger('update',{type:"disable",name:o.name,category:o.type});



                }

                if(o.type == "genre"){
                    comparator = 'ratings';
                    this.trigger('update',{type:"disable",name:o.name,category:o.type});
                }

                if(o.type == "year"){
                    this.switch_years(o.name);
                }

                if(o.type == "lead"){
                    this.trigger('update',{type:"show_leads",name:o.name});
                }








            },
            handle_dot_updates:function(o) {






                if(o.type == "show_legend"){

                    var chart_x = o.element_data.x+8;
                if((chart_x  + 240) > 900){

                    chart_x = o.element_data.x-240;
                }
                this.dots_legend_v.move(chart_x,100);

                var gross_revenue = o.amount/1000000+"M";


                var m_screen = Math.round(o.m.get("male_on_screen_time"));
                var m_speak = Math.round(o.m.get("male_speaking_time"));
                var f_screen = Math.round(o.m.get("female_on_screen_time"));
                var f_speak =  Math.round(o.m.get("female_speaking_time"));


                var t_screen = m_screen + f_screen;
                var t_speak = m_speak + f_speak;

                m_screen = Math.round(m_screen/t_screen *100);
                f_screen = Math.round(f_screen/t_screen *100);


                m_speak = Math.round(m_speak/t_speak *100);
                f_speak = Math.round(f_speak/t_speak *100);

                this.dots_legend_v.update_text({gross_revenue:gross_revenue,m_screen:m_screen,m_speak:m_speak,f_screen:f_screen,f_speak:f_speak});
            }
                    if(o.type == "hide_legend"){
                        this.dots_legend_v.hide();
                    }



            },
            add_female_leads:function(c) {


                this.female_leads_c = c;


                var fl_2014 = c.where({"year": 2014});
                var fl_2015 = c.where({"year": 2015});




                this.section_female_leads_2014_c = new Movies_c(fl_2014);
                this.section_female_leads_2015_c = new Movies_c(fl_2015);



                var t =0 ;
            for(var i=0;i<this.section_female_leads_2015_c.models.length;i++){



                var m = this.section_female_leads_2015_c.at(i);


                var g_r = m.get("gross_revenue");
                var name = m.get("name");

                t+=g_r;

            }






                var x_loc = this.canvas_width /2;
                var x_loc = 0;

                this.section_female_leads_2014 = new Bars_totals_section_v({bar_width: this.bar_width, year:"2014", collection: this.section_female_leads_2014_c, paper: this.paper,xpos: x_loc,ypos:30,previous_section_length:0, section_id: 1, section_label:"Female\nleads",label_offset:0,color:"#ed594d"});

                this.section_female_leads_2015 = new Bars_totals_section_v({bar_width: this.bar_width, year:"2015",collection: this.section_female_leads_2015_c, paper: this.paper,xpos: x_loc,ypos:0,previous_section_length:0, section_id: 1, section_label:"Female\nleads",label_offset:0,color:"#ed594d"});


                this.section_female_leads_2014.listenTo(this,"update",this.section_female_leads_2014.update);
                this.section_female_leads_2015.listenTo(this,"update",this.section_female_leads_2015.update);



                this.listenTo(this.section_female_leads_2014,"update", this.handle_dot_updates);
                this.listenTo(this.section_female_leads_2015,"update", this.handle_dot_updates);






                this.listenTo(this.section_female_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2015,"update",this.pie_chart_updates);



            },
            add_mf_leads:function(c){
                this.mf_leads_c = c;



                var mfl_2014 = c.where({"year": 2014});
                var mfl_2015 = c.where({"year": 2015});

                this.section_mf_leads_2014_c = new Movies_c(mfl_2014);
                this.section_mf_leads_2015_c = new Movies_c(mfl_2015);






                //old loc 310
                var x_loc_2014 = this.section_female_leads_2014_c.models.length*this.bar_width+this.spacer;

                var x_loc_2015 = this.section_female_leads_2015_c.models.length*this.bar_width+this.spacer;

                this.section_mf_leads_2014 = new Bars_totals_section_v({bar_width: this.bar_width,year:"2014",collection: this.section_mf_leads_2014_c, paper: this.paper, xpos: x_loc_2014,ypos:0,previous_section_length:0, section_id: 2, section_label:"Male-female co-leads\n",label_offset:10,color:"#ed594d"});

                this.section_mf_leads_2015 = new Bars_totals_section_v({bar_width: this.bar_width,year:"2015",collection: this.section_mf_leads_2015_c, paper: this.paper, xpos: x_loc_2015 ,ypos:0,previous_section_length:0, section_id: 2, section_label:"Male-female co-leads\n",label_offset:10,color:"#ed594d"});


                this.section_mf_leads_2014.listenTo(this,"update",this.section_mf_leads_2014.update);
                this.section_mf_leads_2015.listenTo(this,"update",this.section_mf_leads_2015.update);

                this.listenTo(this.section_mf_leads_2014,"update", this.handle_dot_updates);
                this.listenTo(this.section_mf_leads_2015,"update", this.handle_dot_updates);

                this.listenTo(this.section_mf_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_mf_leads_2015,"update",this.pie_chart_updates);

            },
            add_male_leads:function(c){
        

                this.male_leads_c = c;


                var m_2014 = c.where({"year": 2014});
                var m_2015 = c.where({"year": 2015});

                this.section_male_leads_2014_c = new Movies_c(m_2014);
                this.section_male_leads_2015_c = new Movies_c(m_2015);


                //var x_loc =this.section_male_leads_2014_c.models.length*8;

                var x_loc_2014 = this.section_female_leads_2014_c.models.length*this.bar_width+this.section_mf_leads_2014_c.models.length*this.bar_width+this.spacer*2;

                this.section_male_leads_2014 = new Bars_totals_section_v({bar_width: this.bar_width, year:"2014",collection: this.section_male_leads_2014_c, paper: this.paper,xpos: x_loc_2014,ypos:0,previous_section_length:0, section_id: 2, section_label:"Male leads",label_offset:10, color:"#ed594d"});

                var x_loc_2015 =this.section_female_leads_2015_c.models.length*this.bar_width+this.section_mf_leads_2015_c.models.length*this.bar_width+this.spacer*2;

                this.section_male_leads_2015 = new Bars_totals_section_v({bar_width: this.bar_width, year:"2015",collection: this.section_male_leads_2015_c, paper: this.paper,xpos: x_loc_2015,ypos:0,previous_section_length:0, section_id: 2, section_label:"Male leads",label_offset:10,color:"#ed594d"});


                this.section_male_leads_2014.listenTo(this,"update",this.section_male_leads_2014.update);

                this.section_male_leads_2015.listenTo(this,"update",this.section_male_leads_2015.update);



                this.listenTo(this.section_male_leads_2014,"update", this.handle_dot_updates);
                this.listenTo(this.section_male_leads_2015,"update", this.handle_dot_updates);

                this.listenTo(this.section_male_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2015,"update",this.pie_chart_updates);


                //this.draw_scale({items:this.collection.models.length/2, sections:3});





            },
            calculate_percentages:function(){


                var f_r_2014 = this.section_female_leads_2014.get_revenue();
                var mf_r_2014 = this.section_mf_leads_2014.get_revenue();
                var m_r_2014 = this.section_male_leads_2014.get_revenue();

                var t_2014 = f_r_2014+mf_r_2014+m_r_2014;

                this.section_female_leads_2014.set_percentage(t_2014);
                this.section_mf_leads_2014.set_percentage(t_2014);
                this.section_male_leads_2014.set_percentage(t_2014);



                var f_r_2015 = this.section_female_leads_2015.get_revenue();
                var mf_r_2015 = this.section_mf_leads_2015.get_revenue();
                var m_r_2015 = this.section_male_leads_2015.get_revenue();


                var t_2015 =  f_r_2015+mf_r_2015+m_r_2015;

                this.section_female_leads_2015.set_percentage(t_2015);
                this.section_mf_leads_2015.set_percentage(t_2015);
                this.section_male_leads_2015.set_percentage(t_2015);


            },
            show_averages:function(){

                //console.log("Let's show some averages");

                var x_loc = this.canvas_width /2;
                //this.revenue_averages_female_2014 = new Revenue_averages_section_v({year:"2014", female_leads_collection:this.section_female_leads_2014_c, mf_leads_collection:this.section_mf_leads_2014_c, male_leads_collection: this.section_male_leads_2014_c,paper: this.paper,xpos: x_loc,ypos:0,previous_section_length:0, section_id: 1, section_label:"Female lead",color:"#ba537e"});

                //this.revenue_averages_female_2014.listenTo(this,"update",this.section_female_leads_2014.update);



                //this.revenue_averages_female_2015 = new Revenue_averages_section_v({year:"2015", female_leads_collection: this.section_female_leads_2015_c, mf_leads_collection:this.section_mf_leads_2015_c, male_leads_collection: this.section_male_leads_2015_c,paper: this.paper,xpos: x_loc,ypos:0,previous_section_length:0, section_id: 1, section_label:"Female lead",color:"#ba537e"});

                //this.revenue_averages_female_2015.listenTo(this,"update",this.section_female_leads_2015.update);


                //this.pie_chart_legend_v = new Pie_chart_legend_v({paper:this.paper,type:"speak"});





                this.calculate_percentages();

                this.dots_legend_v = new Dots_legend_v({paper:this.paper});
                this.switch_years("2014");
            }



        });

        return Chart_totals_v;


    });

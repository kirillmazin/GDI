define(["jquery",
        "underscore",
        "backbone",
        "text!templates/panels_block.html",
        "raphael",
        "views/components/bar_v",
        "views/filters/filtering_menu_v",
        "views/filters/filtering_menu_drop_down_v",
        "views/sections/bars_time_section_split_v",
        "views/components/pie_chart_v",
        "views/components/legend_v",
        "collections/movies_c",
        "views/components/chart_legend_simple_v",
        "views/components/pie_chart_legend_v",
        "views/chart_generic_v"

    ],
    function($, _, Backbone,Content_tmpl,Raphael, Bar_v, Filtering_menu_v,Filtering_menu_drop_down_v,Bars_time_section_split_v,Pie_chart_v,Legend_v, Movies_c, Chart_legend_simple_v, Pie_chart_legend_v,Chart_generic_v) {






        var Chart_time_split_v = Chart_generic_v.extend({
            template:_.template(Content_tmpl),


            initialize: function(o) {



                this.target_container = o.target_container;


                this.male_leads_c   = [];
                this.female_leads_c = [];
                this.mf_leads_c     = [];

                this.active_year = 2015;
                this.canvas_width = 900;


                // variables to store all the leads


                // male leads

                this.section_male_leads;


                this.section_male_leads_2015;
                this.section_male_leads_2014;



                // female leads

                this.section_female_leads_2015;
                this.section_female_leads_2014;


                // male/female leads

                this.section_mf_leads;

                this.section_mf_leads_2015;
                this.section_mf_leads_2014;





                this.scale_change = 3;
                this.bar_height = 8;
                this.bar_spacing = 1;
                this.spacing_between_sections = 16;
                this.paper = Raphael(this.target_container+"_canvas", this.canvas_width, 1000);
                this.offset = 10;
                this.all_bars = [];

                this.m_rectangles =[];
                this.f_rectangles =[];


                // Filtering menus
                this.filtering_menu_genre;
                this.filtering_menu_ratings;
                this.filtering_menu_lead_types;





                this.chart_legend_v = new Chart_legend_simple_v({paper:this.paper});
                this.chart_legend_v.move(320,0);







                this.draw_scale({items:this.collection.models.length/2, sections:3});
                this.render();


                this.build_filters();

            },
            draw_scale:function(o){
                line_ypos = o.items*(this.bar_height+this.bar_spacing)+this.spacing_between_sections*4+1+this.offset;

                this.rectangle = this.paper.rect(0, line_ypos, this.canvas_width, 1 );
                this.rectangle.attr(
                    { fill:'#4A4A4A',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC'

                    }
                )

                var line_height = 946;
                var y_pos       = 28;
                var line_0 = this.paper.rect(this.canvas_width/2,y_pos, 1, line_height );
                var line_25 = this.paper.rect(this.canvas_width/2+25*this.scale_change, y_pos, 1, line_height);
                var line_50 = this.paper.rect(this.canvas_width/2+50*(this.scale_change), y_pos, 1, line_height );
                var line_75 = this.paper.rect(this.canvas_width/2+75*(this.scale_change), y_pos, 1, line_height );
                var line_100 = this.paper.rect(this.canvas_width/2+100*(this.scale_change), y_pos, 1, line_height );

                var line_m0 = this.paper.rect(this.canvas_width/2, y_pos, 1, line_height );
                var line_m25 = this.paper.rect(this.canvas_width/2-25*(this.scale_change), y_pos, 1, line_height );
                var line_m50 = this.paper.rect(this.canvas_width/2-50*(this.scale_change), y_pos, 1, line_height );
                var line_m75 = this.paper.rect(this.canvas_width/2-75*(this.scale_change), y_pos, 1, line_height );
                var line_m100 = this.paper.rect(this.canvas_width/2-100*(this.scale_change), y_pos, 1, line_height );

                var line_group = this.paper.set(line_75, line_m75, line_0, line_25,line_50, line_100, line_m0, line_m25, line_m50, line_m75, line_m100 );

                line_group.attr(
                    { fill:'#4A4A4A',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#f2f2f2',
                        'fill':'#f2f2f2'

                    }
                )

                var text_0 = this.paper.text(this.canvas_width/2,line_ypos+15,'0%');
                var text_25 = this.paper.text(this.canvas_width/2+25*this.scale_change,line_ypos+15,'25%');
                var text_50 = this.paper.text(this.canvas_width/2+50*(this.scale_change),line_ypos+15,'50%');
                var text_75 = this.paper.text(this.canvas_width/2+75*(this.scale_change),line_ypos+15,'75%');
                var text_100 = this.paper.text(this.canvas_width/2+100*(this.scale_change),line_ypos+15,'100%');


                var text_m25 = this.paper.text(this.canvas_width/2-25*(this.scale_change),line_ypos+15,'25%');
                var text_m50 = this.paper.text(this.canvas_width/2-50*(this.scale_change),line_ypos+15,'50%');
                var text_m75 = this.paper.text(this.canvas_width/2-75*(this.scale_change),line_ypos+15,'75%');

                var text_m100 = this.paper.text(this.canvas_width/2-100*(this.scale_change),line_ypos+15,'100%');


                var text_avg = this.paper.text(0,7,'Average time');



                var numbers_group = this.paper.set(text_0,text_25,text_50,text_75,text_m25,text_m50,text_m75,text_75, text_100,text_m100,text_avg);

                numbers_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'fill':'#4A4A4A',
                    'text-anchor':'middle'
                });

                text_avg.attr({
                    'text-anchor':'start'
                });



            },
            // create all the filters to manipulate the sorting menus
            build_filters: function(){


                var all_lead_types = _.uniq(this.collection.pluck("lead_type"));
                var all_genres    = _.uniq(this.collection.pluck("genre"));
                var all_ratings   = _.uniq(this.collection.pluck("ratings"));

                all_genres.sort();
                all_ratings.sort();

                all_genres.unshift("All");
                all_ratings.unshift("All");



                this.filtering_menu_sort_by = new Filtering_menu_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_sort_by",type:"sort_by",label:"Type",style:"large"});
                this.filtering_menu_sort_by.add_menu_items(["Screen time", "Speaking time"]);
                this.filtering_menu_sort_by.select(0);

                this.filtering_menu_years = new Filtering_menu_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_year",type:"year",label:"Year",style:"large"});
                this.filtering_menu_years.add_menu_items(["2014","2015"]);
                this.filtering_menu_years.select(0);

                this.filtering_menu_genre = new Filtering_menu_drop_down_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_genre",type:"genre",label:"Genre",style:"small"});
                this.filtering_menu_genre.add_menu_items(all_genres);
                this.filtering_menu_genre.select(0);

                this.filtering_menu_ratings = new Filtering_menu_drop_down_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_ratings",type:"ratings",label:"Rating",style:"small"});
                this.filtering_menu_ratings.add_menu_items(all_ratings);


                this.filtering_menu_ratings.select(0);





                this.listenTo(this.filtering_menu_genre,"update", this.process_filters);
                this.listenTo(this.filtering_menu_ratings,"update", this.process_filters);
                this.listenTo(this.filtering_menu_years,"update", this.process_filters);
                this.listenTo(this.filtering_menu_sort_by,"update", this.process_filters);




            },
            process_filters:function(o){


                var comparator;

                if(o.type == "sort_by"){

                    if(o.name == "Gross revenue"){
                        comparator = 'gross_revenue';

                    }

                    if(o.name == "Screen time"){
                        comparator = 'abs_difference_on_screen_time';

                    }

                    if(o.name == "Speaking time"){
                        comparator = 'abs_difference_speaking_time';



                    }




                    this.trigger('update',{type:"resort_data",comparator:comparator,sort_by:o.name});



                }

                if(o.type == "ratings"){

                        comparator = 'ratings';


                        this.disable_bars({type:o.type,name:o.name});


                }

                if(o.type == "genre"){

                        comparator = 'ratings';

                        this.disable_bars({type:o.type,name:o.name});

                }

                if(o.type == "year"){


                    this.switch_years(o.name);


                }

            },
            add_female_leads:function(c) {
                this.female_leads_c = c;


                var fl_2014 = c.where({"year": 2014});
                var fl_2015 = c.where({"year": 2015});




                this.section_female_leads_2014_c = new Movies_c(fl_2014);
                this.section_female_leads_2015_c = new Movies_c(fl_2015);




                this.section_female_leads_2014 = new Bars_time_section_split_v({year: "2014",collection: this.section_female_leads_2014_c, paper: this.paper,xpos:700,ypos:0,previous_section_length:0, section_id: 1, section_label:"Female leads",offset:this.offset});
                this.section_female_leads_2015 = new Bars_time_section_split_v({year: "2015",collection: this.section_female_leads_2015_c, paper: this.paper,xpos:300,ypos:0,previous_section_length:0, section_id: 1, section_label:"Female leads",offset:this.offset});

                this.section_female_leads_2014.listenTo(this,"update",this.section_female_leads_2014.update);
                this.section_female_leads_2015.listenTo(this,"update",this.section_female_leads_2015.update);

                this.listenTo(this.section_female_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2015,"update",this.pie_chart_updates);


            },
            disable_bars:function(o){


                        this.trigger('update',{type:"disable_bars",name:o.name,category:o.type});
            },

            add_mf_leads:function(c){
                this.mf_leads_c = c;

                var mfl_2014 = c.where({"year": 2014});
                var mfl_2015 = c.where({"year": 2015});

                this.section_mf_leads_2014_c = new Movies_c(mfl_2014);
                this.section_mf_leads_2015_c = new Movies_c(mfl_2015);


                var p_s_l_2014 = this.section_male_leads_2014_c.models.length+ this.section_female_leads_2014_c.models.length;
                var p_s_l_2015 = this.section_male_leads_2015_c.models.length+ this.section_female_leads_2015_c.models.length;


                this.section_mf_leads_2014 = new Bars_time_section_split_v(
                    {year: "2014",collection: this.section_mf_leads_2014_c, paper: this.paper, ypos:330, previous_section_length: p_s_l_2014, xpos:700,section_id: 3, section_label:"Co-leads",offset:this.offset}
                );

                this.section_mf_leads_2015 = new Bars_time_section_split_v(
                    {year: "2015",collection: this.section_mf_leads_2015_c, paper: this.paper, ypos:330, previous_section_length:p_s_l_2015, xpos:300,section_id: 3, section_label:"Co-leads",offset:this.offset}
                );




                this.section_mf_leads_2014.listenTo(this,"update",this.section_mf_leads_2014.update);
                this.section_mf_leads_2015.listenTo(this,"update",this.section_mf_leads_2015.update);

                this.listenTo(this.section_mf_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_mf_leads_2015,"update",this.pie_chart_updates);

                this.pie_chart_legend_v = new Pie_chart_legend_v({paper:this.paper,type:"speak"});


            },

            pie_chart_updates: function(o){

                Chart_time_split_v.__super__.pie_chart_updates.apply(this,arguments);
                if(o.type == "show_pie_legend"){

                        var x = Math.round( o.element_data.x);
                        var y = Math.round(o.element_data.y);


                        this.pie_chart_legend_v.move(x,y+40)
                }





            },
            add_male_leads:function(c){

                this.male_leads_c = c;


                var m_2014 = c.where({"year": 2014});
                var m_2015 = c.where({"year": 2015});

                this.section_male_leads_2014_c = new Movies_c(m_2014);
                this.section_male_leads_2015_c = new Movies_c(m_2015);



                var p_s_l_2014 = this.section_female_leads_2014_c.models.length;
                var p_s_l_2015 = this.section_female_leads_2015_c.models.length;

                this.section_male_leads_2014 = new Bars_time_section_split_v({year: "2014", collection: this.section_male_leads_2014_c, paper: this.paper, ypos:330, xpos:700,previous_section_length:p_s_l_2014, section_id: 2, section_label:"Male leads",offset:this.offset});

                this.section_male_leads_2015 = new Bars_time_section_split_v({year: "2015",collection: this.section_male_leads_2015_c, paper: this.paper, ypos:330, xpos:300,previous_section_length:p_s_l_2015, section_id: 2, section_label:"Male leads",offset:this.offset});

                this.section_male_leads_2014.listenTo(this,"update",this.section_male_leads_2014.update);
                this.section_male_leads_2015.listenTo(this,"update",this.section_male_leads_2015.update);



                this.listenTo(this.section_male_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2015,"update",this.pie_chart_updates);





            }

        });
        return Chart_time_split_v;
    });

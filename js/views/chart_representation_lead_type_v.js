define(["jquery",
        "underscore",
        "backbone",
        "text!templates/panels_block.html",
        "raphael",
        "views/components/bar_v",
        "views/filters/filtering_menu_v",
        "views/filters/filtering_menu_drop_down_v",
        "views/sections/bars_time_lead_type_v",
        "views/components/pie_chart_v",
        "views/components/legend_v",
        "collections/movies_c",
        "views/components/pie_chart_legend_v",
        "views/chart_generic_v"

    ],
    function($, _, Backbone,Content_tmpl,Raphael, Bar_v, Filtering_menu_v,Filtering_menu_drop_down_v,Bars_time_lead_type_v,Pie_chart_v,Legend_v, Movies_c, Pie_chart_legend_v,Chart_generic_v) {






        var Chart_representation_lead_type_v = Chart_generic_v.extend({
            template:_.template(Content_tmpl),


            initialize: function(o) {



                this.target_container = o.target_container;


                this.male_leads_c   = [];
                this.female_leads_c = [];
                this.mf_leads_c     = [];

                this.active_year = 2015;
                this.canvas_width = 900;
                this.chart_height = 750;




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
                this.paper = Raphael(this.target_container+"_canvas", this.canvas_width, this.chart_height);
                this.numbers_group =  this.paper.set(); // group to store the numbers
                this.offset = 10;
                this.all_bars = [];

                this.m_rectangles =[];
                this.f_rectangles =[];


                // Filtering menus
                this.filtering_menu_genre;
                this.filtering_menu_ratings;
                this.filtering_menu_lead_types;
















                this.build_filters();

            },
            draw_scale:function(o){
                line_ypos = o.items*(this.bar_height+this.bar_spacing)+this.spacing_between_sections*2+27;




                this.baseline = this.paper.rect(0, line_ypos, this.canvas_width, 1 );
                this.baseline.attr(
                    { fill:'#4A4A4A',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC'

                    }
                )




                this.label_offset = 120;



                this.numbers_group.push(this.create_percentages(this.label_offset));
                this.numbers_group.push(this.create_percentages(this.label_offset+460));

            },

            reposition_the_scale:function(year){

                    var items;
                    if(year == 2014){
                        items = this.section_female_leads_2014_c.models.length + this.section_male_leads_2014_c.models.length
                    }

                    if(year == 2015){
                        items = this.section_female_leads_2015_c.models.length + this.section_male_leads_2015_c.models.length
                    }

                    //var line_ypos = items*(this.bar_height+this.bar_spacing)+this.spacing_between_sections*4+1+this.offset;
                    var    line_ypos = items*(this.bar_height+this.bar_spacing)+this.spacing_between_sections*2+27;
                    //this.numbers_group.attr({y:line_ypos+15});
                    this.numbers_group.attr({opacity:0});
                    this.numbers_group.animate({y:line_ypos+15, opacity:1},300);
                    this.baseline.attr({opacity:0});
                    this.baseline.animate({y:line_ypos,opacity:1},300);

            },

            create_percentages:function (start_x) {
                var text_0 = this.paper.text(start_x,line_ypos+15,'0%');
                var text_25 = this.paper.text(start_x+25*this.scale_change,line_ypos+15,'25%');
                var text_50 = this.paper.text(start_x+50*(this.scale_change),line_ypos+15,'50%');
                var text_75 = this.paper.text(start_x+75*(this.scale_change),line_ypos+15,'75%');
                var text_100 = this.paper.text(start_x+100*(this.scale_change),line_ypos+15,'100%');
                var numbers_group = this.paper.set(text_0,text_25,text_50,text_75,text_75, text_100);


                numbers_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'fill':'#4A4A4A',
                    'text-anchor':'middle'
                });

                return numbers_group;

            },

            build_filters: function(){





                this.filtering_menu_years = new Filtering_menu_v({el:"#"+this.target_container+"_filters",collection:this.collection, id:this.target_container+"_filters_year",type:"year",label:"Year",style:"large"});
                this.filtering_menu_years.add_menu_items(["2014","2015"]);
                this.filtering_menu_years.select(0);


                this.listenTo(this.filtering_menu_years,"update", this.process_filters);





            },
            process_filters:function(o){


                var comparator;



                if(o.type == "year"){


                    this.switch_years(o.name);
                    this.reposition_the_scale(o.name);

                }

            },
            add_female_leads:function(c) {
                this.female_leads_c = c;


                var fl_2014 = c.where({"year": 2014});
                var fl_2015 = c.where({"year": 2015});




                this.section_female_leads_2014_c = new Movies_c(fl_2014);
                this.section_female_leads_2015_c = new Movies_c(fl_2015);



                // 2014 screen
                this.section_female_leads_2014_screen = new Bars_time_lead_type_v({year: "2014",collection: this.section_female_leads_2014_c, paper: this.paper,xpos:0,ypos:0,previous_section_length:0, section_id: 1, section_label:"Male screen time\nin movies with\nfemale leads",offset:this.offset, type:"screen", gender:"female"});


                // 2014 screen
                this.section_female_leads_2014_speak = new Bars_time_lead_type_v({year: "2014",collection: this.section_female_leads_2014_c, paper: this.paper,xpos:460,ypos:0,previous_section_length:0, section_id: 1, section_label:"Male speaking\ntime in movies\nwith female leads",offset:this.offset, type:"speak", gender:"female"});



                // 2015 screen
                this.section_female_leads_2015_screen = new Bars_time_lead_type_v({year: "2015",collection: this.section_female_leads_2015_c, paper: this.paper,xpos:0,ypos:0,previous_section_length:0, section_id: 1, section_label:"Male screen time\nin movies with\nfemale leads",offset:this.offset, type:"screen", gender:"female"});

                // 2015 screen
                this.section_female_leads_2015_speak = new Bars_time_lead_type_v({year: "2015",collection: this.section_female_leads_2015_c, paper: this.paper,xpos:460,ypos:0,previous_section_length:0, section_id: 1, section_label:"Male speaking\ntime in movies\nwith female leads",offset:this.offset, type:"speak", gender:"female"});


                this.section_female_leads_2014_screen.listenTo(this,"update",this.section_female_leads_2014_screen.update);
                this.section_female_leads_2014_speak.listenTo(this,"update",this.section_female_leads_2014_speak.update);
                this.section_female_leads_2015_screen.listenTo(this,"update",this.section_female_leads_2015_screen.update);
                this.section_female_leads_2015_speak.listenTo(this,"update",this.section_female_leads_2015_speak.update);


                this.listenTo(this.section_female_leads_2014_screen,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2014_speak,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2015_screen,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2015_speak,"update",this.pie_chart_updates);


            },
            disable_bars:function(o){


                        this.trigger('update',{type:"disable_bars",name:o.name,category:o.type});
            },



            pie_chart_updates: function(o){





                Chart_representation_lead_type_v.__super__.pie_chart_updates.apply(this,arguments);


                if(o.type == "show_pie_legend"){

                        var x = Math.round( o.element_data.x);
                        var y = Math.round(o.element_data.y);




                        if(o.chart_type == "speak"){
                        
                            this.pie_chart_legend_v.move(x-470,y+40);
                        } else {
                            this.pie_chart_legend_v.move(x,y+40);


                        }
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





                this.section_male_leads_2014_screen = new Bars_time_lead_type_v({year: "2014", collection: this.section_male_leads_2014_c, paper: this.paper, ypos:120, xpos:0,previous_section_length:p_s_l_2014, section_id: 2, section_label:"Female screen time\nin movies with\nmale leads",offset:this.offset,type:"screen", gender:"male"});
                this.section_male_leads_2014_speak = new Bars_time_lead_type_v({year: "2014",collection: this.section_male_leads_2014_c, paper: this.paper, ypos:330, xpos:460,previous_section_length:p_s_l_2014, section_id: 2, section_label:"Female speaking\ntime in movies with\nmale leads",offset:this.offset, type:"speak", gender:"male"});

                this.section_male_leads_2014_screen.listenTo(this,"update",this.section_male_leads_2014_screen.update);
                this.section_male_leads_2014_speak.listenTo(this,"update",this.section_male_leads_2014_speak.update);

                this.section_male_leads_2015_screen = new Bars_time_lead_type_v({year: "2015", collection: this.section_male_leads_2015_c, paper: this.paper, ypos:120, xpos:0,previous_section_length:p_s_l_2015, section_id: 2, section_label:"Female screen\ntime in movies with\nmale leads",offset:this.offset,type:"screen", gender:"male"});
                this.section_male_leads_2015_speak = new Bars_time_lead_type_v({year: "2015",collection: this.section_male_leads_2015_c, paper: this.paper, ypos:330, xpos:460,previous_section_length:p_s_l_2015, section_id: 2, section_label:"Female speaking\ntime in movies with\nmale leads",offset:this.offset, type:"speak", gender:"male"});

                this.section_male_leads_2015_screen.listenTo(this,"update",this.section_male_leads_2015_screen.update);
                this.section_male_leads_2015_speak.listenTo(this,"update",this.section_male_leads_2015_speak.update);



                this.listenTo(this.section_male_leads_2014_screen,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2014_speak,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2015_screen,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2015_speak,"update",this.pie_chart_updates);






                this.draw_scale({items:this.section_female_leads_2014_c.models.length + this.section_male_leads_2014_c.models.length});
                    this.pie_chart_legend_v = new Pie_chart_legend_v({paper:this.paper,type:"speak"});



            }

        });
        return Chart_representation_lead_type_v;
    });

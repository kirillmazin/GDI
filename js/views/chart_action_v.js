define(["jquery",
        "underscore",
        "backbone",
        "raphael",
        "views/components/bar_v",
        "views/sections/section_action_v",
        "views/components/legend_v",
        "collections/movies_c",
        "views/components/pie_chart_legend_v",
        "views/chart_generic_v"

    ],
    function($, _, Backbone,Raphael, Bar_v, Section_action_v,Legend_v, Movies_c,  Pie_chart_legend_v,Chart_generic_v) {






        var Chart_action_v = Chart_generic_v.extend({



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
                this.paper = Raphael(this.target_container+"_canvas", this.canvas_width, 600);
                this.offset = 10;
                this.all_bars = [];

                this.m_rectangles =[];
                this.f_rectangles =[];


                // Filtering menus
                this.filtering_menu_genre;
                this.filtering_menu_ratings;
                this.filtering_menu_lead_types;


                this.draw_scale({items:this.collection.models.length*2, sections:3});


            },
            draw_scale:function(o){
               line_ypos = o.items*(this.bar_height+this.bar_spacing)+this.spacing_between_sections*o.sections+this.offset;


                //    line_ypos = o.items*(this.bar_height+this.bar_spacing)

                this.rectangle = this.paper.rect(0, line_ypos, this.canvas_width, 1 );
                this.rectangle.attr(
                    { fill:'#4A4A4A',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC'

                    }
                )

                //var line_height = 946;
                var line_height = o.items*(this.bar_height+this.bar_spacing)+this.offset+this.spacing_between_sections+4;
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

                var text_offset_x = 5;
                var text_0 = this.paper.text(this.canvas_width/2,line_ypos+15,'0%');
                var text_25 = this.paper.text(this.canvas_width/2+25*this.scale_change+text_offset_x,line_ypos+15,'25%');
                var text_50 = this.paper.text(this.canvas_width/2+50*this.scale_change+text_offset_x,line_ypos+15,'50%');
                var text_75 = this.paper.text(this.canvas_width/2+75*this.scale_change+text_offset_x,line_ypos+15,'75%');
                var text_100 = this.paper.text(this.canvas_width/2+100*this.scale_change+text_offset_x,line_ypos+15,'100%');


                var text_m25 = this.paper.text(this.canvas_width/2-25*this.scale_change+text_offset_x,line_ypos+15,'25%');
                var text_m50 = this.paper.text(this.canvas_width/2-50*this.scale_change+text_offset_x,line_ypos+15,'50%');
                var text_m75 = this.paper.text(this.canvas_width/2-75*this.scale_change+text_offset_x,line_ypos+15,'75%');

                var text_m100 = this.paper.text(this.canvas_width/2-100*this.scale_change+text_offset_x,line_ypos+15,'100%');






                var numbers_group = this.paper.set(text_0,text_25,text_50,text_75,text_m25,text_m50,text_m75,text_75, text_100,text_m100);

                numbers_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'text-anchor':'middle',
                    'fill':'#4A4A4A'
                });





            },

            add_action_data:function(c) {

            




            this.action_films_c = c;



            this.section_screen = new Section_action_v({type:"screen", year: "2014",collection: this.action_films_c, paper: this.paper,xpos:450,ypos:300,previous_section_length:0, section_id: 1, section_label:"Screen time",offset:this.offset});
            this.section_screen.listenTo(this,"update",this.section_screen.update);


            this.section_speaking = new Section_action_v({type:"speak",year: "2014",collection: this.action_films_c, paper: this.paper,xpos:450,ypos:40,previous_section_length:20, section_id: 2, section_label:"Speaking time",offset:this.offset});
            this.section_speaking.listenTo(this,"update",this.section_speaking.update);

            this.listenTo(this.section_screen,"update",this.pie_chart_updates);
            this.listenTo(this.section_speaking,"update",this.pie_chart_updates);

            this.pie_chart_legend_v = new Pie_chart_legend_v({paper:this.paper,type:"speak"});


            },




            pie_chart_updates: function(o){

                Chart_action_v.__super__.pie_chart_updates.apply(this,arguments);
                if(o.type == "show_pie_legend"){

                        var x = Math.round( o.element_data.x);
                        var y = Math.round(o.element_data.y);


                        this.pie_chart_legend_v.move(x,y+40)
                }





            }

        });
        return Chart_action_v;
    });

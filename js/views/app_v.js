define([
    "jquery",
    "underscore",
    "backbone",
    "views/chart_totals_v",
    "views/filters/filtering_menu_v",
    "collections/movies_c",
    "views/chart_time_split_v",
    "views/chart_dots_amounts_v",
    "views/chart_representation_lead_type_v",
    "views/chart_action_v"
    ],
    function(
        $,
        _,
        Backbone,
        Chart_totals_v,
        Filtering_menu_v,
        movies_c,
        Chart_time_split_v,
        Chart_dots_amounts_v,
        Chart_representation_lead_type_v,
        Chart_action_v) {

        var App_v = Backbone.View.extend({



            initialize: function() {



                // only action films




                // parse data by lead type
                this.lead_type_female_c     = new movies_c();
                this.lead_type_male_c       = new movies_c();
                this.lead_type_mf_c         = new movies_c();

                this.action_c         = new movies_c();




                this.movies_c = new movies_c();
                this.movies_c.comparator = 'gross_revenue';
                this.movies_c.url = "js/data/movies_data_15_14_no_name.json";
                this.movies_c.fetch(
                    {success: $.proxy(this.movies_loaded,this)}

                );


                this.listenTo(this.nav_v,"update", this.handle_nav);




            },



            movies_loaded:function (o) {






                // Let's parse data by lead type
                var f_count = 0;
                var m_count = 0;
                var mf_count = 0;
                for(var i=0;i<o.models.length;i++){
                    var m = o.models[i];

                    var genre     = m.get('genre');




                    var id = i;
                    var female_speaking_time = m.get('female_speaking_time');
                    var female_on_screen_time = m.get('female_on_screen_time');



                    var male_speaking_time          = m.get('male_speaking_time');
                    var male_on_screen_time         = m.get('male_on_screen_time');


                    var total_speaking_perc =  male_speaking_time+female_speaking_time;
                    var total_screen_perc   = male_on_screen_time+female_on_screen_time;

                    // male female percentages in relation to each other

                    var abs_female_speaking_time = female_speaking_time/total_speaking_perc*100;
                    var abs_male_speaking_time =   male_speaking_time/total_speaking_perc*100;


                    var abs_female_screen_time = female_on_screen_time/total_screen_perc*100;
                    var abs_male_screen_time =   male_on_screen_time/total_screen_perc*100;



                    var difference_speaking_time    = abs_male_speaking_time-abs_female_speaking_time;
                    var difference_on_screen_time   = abs_male_screen_time-abs_female_screen_time;

                    var difference_speaking_time  = male_speaking_time-female_speaking_time;
                    var difference_on_screen_time =  male_on_screen_time-female_on_screen_time;


                    var abs_difference_speaking_time = Math.abs(difference_speaking_time);
                    var abs_difference_on_screen_time = Math.abs(difference_on_screen_time );





                    o.models[i].set("male_speaking_time", male_speaking_time);
                    o.models[i].set("male_on_screen_time", male_on_screen_time);
                    o.models[i].set("difference_speaking_time", difference_speaking_time);
                    o.models[i].set("difference_screen_time", difference_on_screen_time);
                    o.models[i].set("abs_difference_speaking_time", abs_difference_speaking_time);
                    o.models[i].set("abs_difference_on_screen_time", abs_difference_on_screen_time);
                    o.models[i].set("default_order",i);





                    var lead_type = m.get('lead_type');



                    if(lead_type == "Female Lead"){
                        f_count++;
                        this.lead_type_female_c.add(o.models[i]);
                    }

                    if(lead_type == "Male Lead"){
                        m_count++;
                        this.lead_type_male_c.add(o.models[i]);
                    }

                    if(lead_type == "MF Co-Lead"){
                        mf_count++;
                        this.lead_type_mf_c.add(o.models[i]);
                    }


                    if(genre == "Action/Adventure"){
                        this.action_c.add(o.models[i]);
                    }



                }









                this.chart = new Chart_time_split_v({collection:o, target_container:"panel_01"});
                this.chart.add_female_leads(this.lead_type_female_c);
                this.chart.add_male_leads(this.lead_type_male_c);
                this.chart.add_mf_leads(this.lead_type_mf_c);
                this.chart.switch_years("2014");

                this.chart.process_filters({type:"sort_by", name:"Screen time"});


                this.chart_dots_v = new Chart_totals_v({collection:o,target_container:"panel_02"});
                this.chart_dots_v.add_female_leads(this.lead_type_female_c);
                this.chart_dots_v.add_mf_leads(this.lead_type_mf_c);
                this.chart_dots_v.add_male_leads(this.lead_type_male_c);

                this.chart_dots_v.show_averages();



                this.chart_represenation_lead_type_v = new Chart_representation_lead_type_v({collection:o, target_container:"panel_03"});
                this.chart_represenation_lead_type_v.add_female_leads(this.lead_type_female_c);
                this.chart_represenation_lead_type_v.add_male_leads(this.lead_type_male_c);

                this.chart_represenation_lead_type_v.switch_years("2014");






                this.chart_action = new Chart_action_v({collection:this.action_c, target_container:"panel_04"});
                this.chart_action.add_action_data(this.action_c);



            },
            build_filtering_menus:function (collection) {

            }


        });

        return App_v;


    });

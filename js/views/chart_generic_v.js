define(["jquery",
        "underscore",
        "backbone",
        "text!templates/panels_block.html",
        "raphael",
        "views/components/bar_v",
        "views/filters/filtering_menu_v",
        "views/components/pie_chart_v",
        "views/components/legend_h_v",
        "collections/movies_c",
        "views/components/chart_legend_v",
        "views/components/pie_chart_legend_v"],
    function($, _, Backbone,Content_tmpl,Raphael, Bar_v, Filtering_menu_v,Pie_chart_v, Legend_h_v, Movies_c,Chart_legend_v, Pie_chart_legend_v) {






        var Chart_generic_v = Backbone.View.extend({
            template:_.template(Content_tmpl),


            initialize: function(o) {



            },

            // update the numbers in the pie chart legend
            pie_chart_updates: function(o){

            //    console.log("update");

                if(o.type == "show_pie_legend"){



                        var x = Math.round( o.element_data.x);
                        var y = Math.round(o.element_data.y);


                        this.pie_chart_legend_v.move(x,y+20)

                        var f_speak = Math.round(o.segments.f_speak*100);
                        var m_speak = Math.round(o.segments.m_speak*100);

                        var f_screen = Math.round(o.segments.f_screen*100);
                        var m_screen = Math.round(o.segments.m_screen*100);

                        this.pie_chart_legend_v.update_text({legend_label:o.chart_label, f_speak:f_speak, m_speak:m_speak,f_screen:f_screen,m_screen:m_screen,chart_type:o.chart_type});
                    }

                if(o.type == "hide_pie_legend"){

                    this.pie_chart_legend_v.hide();

                }
            },

            create_pie_chart_legend:function(){
                this.pie_chart_legend_v = new Pie_chart_legend_v({paper:this.paper,type:"speak"});
                this.listenTo(this.section_female_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_female_leads_2015,"update",this.pie_chart_updates);
                this.listenTo(this.section_mf_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_mf_leads_2015,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2014,"update",this.pie_chart_updates);
                this.listenTo(this.section_male_leads_2015,"update",this.pie_chart_updates);

            },
            switch_years:function(year){


                        this.trigger('update',{type:"hide_year",year:year});
            },

        });
        return Chart_generic_v;
    });

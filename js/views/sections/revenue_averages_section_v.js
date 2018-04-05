/*
* BARS ABOVE THE CIRCLES
*/

define(["jquery", "underscore", "backbone","raphael","views/components/dots_outline_v","views/components/legend_v","views/components/pie_chart_v","views/components/dots_legend_v","views/components/pie_chart_four_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Dots_outline_v, Legend_v, Pie_chart_v, Dots_legend_v, Pie_chart_four_v, Generic_section_v) {






        var Revenue_averages_section_v = Generic_section_v.extend({



            initialize: function(o) {
                this.year = o.year;


                this.female_leads_collection  = o.female_leads_collection;
                this.male_leads_collection    = o.male_leads_collection;
                this.mf_leads_collection      = o.mf_leads_collection;


                this.female_leads_length      = 0;


                this.charting_scale = 700;



                this.mil = 1000000;

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


                this.male_leads_avg_revenue     = this.calculate_averages(this.male_leads_collection);
                this.mf_leads_avg_revenue       = this.calculate_averages(this.mf_leads_collection);
                this.female_leads_avg_revenue   = this.calculate_averages(this.female_leads_collection);


                this.male_leads_length      = this.get_radius(this.male_leads_avg_revenue);
                this.mf_leads_length        = this.get_radius(this.mf_leads_avg_revenue);
                this.female_leads_length    = this.get_radius(this.female_leads_avg_revenue);

                this.create_legend();
                this.draw_average();
                //console.log("Male leads length " + this.male_leads_length);

                //this.chart_elements();


                this.align_elements();


                var pie_radius = 30;
                this.avg_f_screen;
                this.avg_f_speak;

                this.avg_m_screen;
                this.avg_m_speak;



                var xpos = 70;

                this.average_revenue = 0;
















            },
            draw_average:function(){
                var m = this.female_leads_collection.at(0);


                m.set("gross_revenue",this.average_revenue);

                var line_thickness = 4;
                this.female_leads_avg = new Dots_outline_v({model:m, paper: this.paper, color:"#ac255f" ,mouseover_color:"#ac255f", xpos:this.xpos, thickness:line_thickness, initial_opacity:1,amount: this.female_leads_avg_revenue*700});
                this.male_leads_avg = new Dots_outline_v({model:m, paper: this.paper, color:"#2f9798" ,mouseover_color:"#2f9798", xpos:this.xpos, thickness:line_thickness, initial_opacity:1,amount: this.male_leads_avg_revenue*700});
                this.mf_leads_avg = new Dots_outline_v({model:m, paper: this.paper, color:"#ee594d" ,mouseover_color:"#ee594d", xpos:this.xpos, thickness:line_thickness, initial_opacity:1,amount: this.mf_leads_avg_revenue*700});
                //this.female_leads_length = this.female_leads.get_radius();

                this.root.push(this.female_leads_avg.get_root());
                this.root.push(this.male_leads_avg.get_root());
                this.root.push(this.mf_leads_avg.get_root());
            },
            pie_chart_updates:function (o) {

                this.trigger("update", o);
            },

            create_legend:function(){
                var bar_height = 30;
                var spacer = 1;
                var line_opacity = .8;

                var x_padding = 10;
                var y_padding = 95;
                var type_adjustment = 20;

                this.rectangle_1 = this.paper.rect(this.xpos, y_padding/1.5, 1, 450 -y_padding/1.5);
                this.rectangle_1.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':line_opacity

                    }
                )


                this.rectangle_2 = this.paper.rect(Math.round(this.xpos+this.female_leads_length), y_padding/1.5, 1, 450-y_padding/1.5);

                this.rectangle_2.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':line_opacity

                    }
                )


                this.rectangle_3 = this.paper.rect(Math.round(this.xpos+this.male_leads_length), bar_height+y_padding/1.5, 1, 450-y_padding/1.5);

                this.rectangle_3.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':line_opacity

                    }
                )

                this.rectangle_4 = this.paper.rect(Math.round(this.xpos+this.mf_leads_length), bar_height*2+spacer*2+y_padding/1.5, 1, 450-bar_height*2+spacer*2-y_padding/1.5);

                this.rectangle_4.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':line_opacity


                    }
                )







                this.female_leads_length_bar = this.paper.rect(this.xpos, Math.round(y_padding/1.5), this.female_leads_length,bar_height );

                this.female_leads_length_bar.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':1,
                        'fill':"#ac255f"

                    }
                )


                this.male_leads_bar = this.paper.rect(this.xpos,  Math.round(bar_height+spacer+y_padding/1.5), this.male_leads_length, bar_height );

                this.male_leads_bar.attr(
                    { fill:'#2f9798',
                        'stroke-width':0,
                        'opacity':1

                    }
                )


                this.mf_leads_length_bar = this.paper.rect(this.xpos,  Math.round(bar_height*2+spacer*2+y_padding/1.5), this.mf_leads_length, bar_height );

                this.mf_leads_length_bar.attr(
                    { fill:'#ee594d',
                    'stroke-width':0,
                    'opacity':1

                    }
                )



                    var legend_label = this.paper.text(this.xpos,y_padding/1.5-type_adjustment,"Average earnings");


                var female_leads_label = this.paper.text(this.xpos-x_padding,y_padding-type_adjustment,"Female leads");
                var male_leads_label = this.paper.text(this.xpos-x_padding,y_padding-type_adjustment+bar_height,"Male leads");
                var mf_leads_label = this.paper.text(this.xpos-x_padding,y_padding-type_adjustment+bar_height*2,"Male-female co-leads");


                var female_leads_amount_label = this.paper.text(this.xpos+this.female_leads_length+x_padding,y_padding-type_adjustment,'$' + Math.round(this.female_leads_avg_revenue*this.charting_scale/this.mil*100)/100+"M");
                var male_leads_amount_label = this.paper.text(this.xpos+this.male_leads_length+x_padding,y_padding-type_adjustment+bar_height,'$' +Math.round(this.male_leads_avg_revenue*this.charting_scale/this.mil*100)/100+"M");
                var mf_leads_amount_label = this.paper.text(this.xpos+this.mf_leads_length+x_padding,y_padding-type_adjustment+bar_height*2,'$' +Math.round(this.mf_leads_avg_revenue*this.charting_scale/this.mil*100)/100+"M");

                var labels_group = this.paper.set(female_leads_label,male_leads_label,mf_leads_label,legend_label);
                labels_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'end'
                })

                legend_label.attr({
                    'fill':'#9B9B9B',
                    'font-weight':'400'
                })

                legend_label.attr({'font-weight':'400','text-anchor':'start'});


                var amounts_group = this.paper.set(female_leads_amount_label, male_leads_amount_label,mf_leads_amount_label);

                amounts_group.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'start'
                })



                this.root.push(this.rectangle,female_leads_label,male_leads_label,mf_leads_label,female_leads_amount_label, male_leads_amount_label,mf_leads_amount_label,legend_label);

                this.root.push(this.rectangle_1, this.rectangle_2, this.rectangle_3,this.rectangle_4,this.female_leads_length_bar, this.male_leads_bar, this.mf_leads_length_bar,female_leads_amount_label)

            },

            calculate_averages:function(collection){
                var a = 0;
                var total = collection.length;
                for(var i=0;i<collection.length;i++){

                    var m = collection.at(i)
                    var revenue = m.get("gross_revenue");
                    a += revenue;

                }

                var a_r = Math.round(a/total/this.charting_scale);

                //var radius  = Math.sqrt(a_r / Math.PI)
                //return radius;

                return a_r;
            },

            get_radius:function(amount){
                var radius  = Math.sqrt(amount / Math.PI)
                return radius;
            },
            chart_elements:function(){

                var total_revenue = 0;
                this.average_revenue = 0;

                var total = this.collection.models.length;


                for(var i=0;i<this.collection.models.length;i++){
                    var m = this.collection.at(i)


                    var revenue = Math.round(m.get("gross_revenue"));

                    this.average_revenue += revenue;



                }
                this.average_revenue = Math.round(this.average_revenue/total);


                this.draw_average();


            },

            align_elements:function(){

                this.female_leads_avg.move({xpos:this.xpos,ypos:450});
                this.male_leads_avg.move({xpos:this.xpos,ypos:450});
                this.mf_leads_avg.move({xpos:this.xpos,ypos:450});
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

            disable:function(o){


                for(var i=0;i< this.all_chart_elements.length;i++){
                    if(o.name!= "All"){
                    this.all_chart_elements[i].disable(o);
                    }

                    if(o.name== "All"){
                        this.all_chart_elements[i].enable();
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



                    if(o.year == this.year){
                        this.show();
                    } else{
                       this.hide();
                    }
                }
            }





        });

        return Revenue_averages_section_v;


    });

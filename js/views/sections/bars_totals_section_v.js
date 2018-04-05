define(["jquery", "underscore", "backbone","raphael","views/components/bars_total_v","views/components/legend_v","views/components/pie_chart_v","views/components/bars_total_v","views/components/pie_chart_four_v","views/sections/generic_section_v"],
    function($, _, Backbone,Raphael, Bars_total_v, Legend_v, Pie_chart_v, Dots_legend_v, Pie_chart_four_v, Generic_section_v) {






        var Bars_totals_section_v = Generic_section_v.extend({



            initialize: function(o) {
                this.year = o.year;
                this.active_year;
                this.bar_height = 6;
                this.bar_spacing = 1;
                this.spacing_between_sections = 10;
                this.section_id = o.section_id;
                this.section_label = o.section_label;
                this.bar_width = o.bar_width;
                this.color = o.color;
                this.label_offset = o.label_offset;
                this.paper = o.paper;
                this.bar_width = 8;
                this.xpos = o.xpos;
                this.root = this.paper.set();
                this.average_revenue = 0;
                this.reduction_factor = 2000000;
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







                this.create_header_line();

            },
            pie_chart_updates:function (o) {

                this.trigger("update", o);
            },

            create_header_line:function(){







                this.offset = 400;

                var total_bar_width = this.bar_width * this.collection.models.length;
                this.average_bar_position = Math.round(this.average_revenue / this.reduction_factor);
                this.millions = Math.round(this.average_revenue / 1000000*100)/100;




                //this.bar_average = this.paper.rect(this.xpos, this.average_bar_position, total_bar_width, 2);



                this.female_leads_label = this.paper.text(this.xpos,this.offset+30-this.label_offset,this.section_label);

                this.female_leads_label.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'font-weight':'700',
                    'fill':'#4A4A4A',
                    'text-anchor':'start'
                })



                var label_x_pos = this.xpos+total_bar_width/2;
                text_alignment = 'middle';
                if(this.xpos == 0){
                    label_x_pos = 0;
                    text_alignment = 'start';
                }

                this.amount_label = this.paper.text(label_x_pos,-this.average_bar_position+this.offset-18,"$"+this.millions+"M (56%)");





                this.bar_average = this.paper.rect(this.xpos, -this.average_bar_position+this.offset, total_bar_width-1, 2);
                this.bar_average.attr(
                    { fill:'#DCDCDC',
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':'#DCDCDC',
                        'fill':'#ff8244'


                    }
                )

                this.amount_label.attr({
                    'font-size':16,
                    'font-family':'Ubuntu',
                    'font-weight':'400',
                    'fill':'#000000',
                    'text-anchor':text_alignment
                })

                this.root.push(this.bar_average, this.female_leads_label, this.amount_label);



            },
            set_percentage:function(total){


                var perc  = Math.round(this.average_revenue/total*100);
                this.amount_label.attr({text:"$"+this.millions+"M (" + perc +'%)'});
            },
            get_revenue:function(){
                    return this.average_revenue;
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
                    //console.log(revenue);
                    //console.log(this.average_revenue);
                    //console.log(total);


                    this.all_chart_elements[i] = new Bars_total_v({reduction_factor: this.reduction_factor, model:m, paper: this.paper, color:'#D8D8D8',mouseover_color:this.color, xpos:this.xpos,ypos:(total-i)*15+120,thickness:1, initial_opacity:.1, amount: revenue, id: i});
                    this.all_chart_elements[i].listenTo(this, "update", this.all_chart_elements[i].update);
                    this.listenTo(this.all_chart_elements[i],"update",this.handle_dot_updates);
                    this.root.push(this.all_chart_elements[i].get_root());

                }

                //console.log("AVERAGE REVENUE  " + (this.average_revenue/total));


                this.average_revenue = Math.round(this.average_revenue/total);


                //console.log("AVERAGE REVENUE  " + (this.average_revenue/total));
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
                for(var i=0;i<total;i++){
                    //console.log(this.all_heights[i])

                    var m = this.collection.at(i);
                    var revenue = Math.round(m.get("gross_revenue")/15000000);


                    this.all_chart_elements[i].move({xpos:this.xpos,ypos:450});

                    if( this.all_heights[i-1]!= undefined){
                            total_height+=this.all_heights[i-1];



                    }

                    //this.average.move({xpos:this.xpos,ypos:450});



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
                    this.trigger("update",o);
                }
            }





        });

        return Bars_totals_section_v;


    });

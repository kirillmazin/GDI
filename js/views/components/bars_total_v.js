define(["jquery", "underscore", "backbone", "raphael", "views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Generic_component_v) {

        var Bars_total_v = Generic_component_v.extend({



            initialize: function(o) {
                Bars_total_v.__super__.initialize.apply(this);

                this.paper = o.paper;
                this.color = o.color;
                this.reduction_factor = o.reduction_factor;

                this.id = o.id;
                this.mouseover_color = o.mouseover_color;
                this.line;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.thickness = o.thickness;
                this.initial_opacity = o.initial_opacity;
                this.amount = o.amount;
                this.root = this.paper.set();

                this.revenue_millions = this.amount / this.reduction_factor;






                this.radius = Math.sqrt(this.revenue_millions / Math.PI)

                this.lead_type = this.model.get("lead_type");
                this.draw_element();
                this.root.push(this.line);

            },
            get_radius: function() {
                return this.radius;
            },
            draw_element: function() {


                this.line = this.paper.rect(this.id*8+this.xpos, -this.revenue_millions +400,7, this.revenue_millions );


                var r = this;
                this.line.attr({

                    'stroke-width':0,
                    'fill': r.color,
                    'opacity': 1
                });




                this.attach_events();

            },
            move: function(o) {

                /*this.circle.animate({
                    'cy': o.ypos



                }, 1000, 'easeOut')*/

            },
            hide: function() {
                var r = this;
                this.line.animate({
                    'fill': r.color,
                    'opacity': 0



                }, 500);
                this.remove_events();
            },
            remove_events: function() {
                this.line.unmouseover();
                this.line.unmouseout();
            },
            attach_events: function() {

                var m = this.model;
                var r = this;
                this.line.mouseover(function() {


                    r.trigger("update", {
                        type: "show_legend",
                        m: m,
                        element_data: this.attrs,
                        amount: r.amount
                    });
                    var revenue = m.get("gross_revenue") / 10000000;

                    var name = m.get("name");
                    var screen_time = m.get("difference_screen_time");
                    var speak_time = m.get("difference_speaking_time");

                    var n_r = this.attrs.r + 20;

                this.animate({
                        opacity: 1,
                        'fill': r.mouseover_color
                    }, 300);
                });
                this.line.mouseout(function() {

                    r.trigger("update", {
                        type: "hide_legend"
                    });
                    this.transform('');
                    this.animate({
                        opacity: 1,
                        'fill': r.color

                    }, 300);
                });

            },
            show: function() {
                this.line.animate({
                    'fill': this.color,
                    'opacity': this.initial_opacity



                }, 500);
                this.attach_events();

            },
            disable:function(o) {
                if (o.name != this.model.get(o.type)) {
                    this.line.animate({
                        'fill': '#D8D8D8',
                        'opacity': 0
                    }, 500)

                } else {

                    this.show();
                }



            },
            get_root:function() {

                return this.root;
            },

            update: function(o) {
                if (o.type == "show_leads") {

                    if (o.name == "Female" && this.lead_type == "Female Lead") {

                        this.show();
                    } else if (o.name == "Female" && this.lead != "Female Lead") {
                        this.hide();
                    }


                    if (o.name == "Male" && this.lead_type == "Male Lead") {
                        this.show();
                    } else if (o.name == "Male" && this.lead != "Male Lead") {
                        this.hide();
                    }

                    if (o.name == "Male-female" && this.lead_type == "MF Co-Lead") {
                        this.show();
                    } else if (o.name == "Male-female" && this.lead != "MF Co-Lead") {
                        this.hide();
                    }

                    if (o.name == "All") {
                        this.show();
                    }
                }

            }







        });

        return Bars_total_v;


    });

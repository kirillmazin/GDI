define(["jquery", "underscore", "backbone", "raphael", "views/components/generic_component_v"],
    function($, _, Backbone, Raphael, Generic_component_v) {

        var Dot_outline_v = Generic_component_v.extend({



            initialize: function(o) {
                Dot_outline_v.__super__.initialize.apply(this);

                this.paper = o.paper;
                this.color = o.color;

                this.mouseover_color = o.mouseover_color;
                this.circle;
                this.xpos = o.xpos;
                this.ypos = o.ypos;
                this.thickness = o.thickness;
                this.initial_opacity = o.initial_opacity;
                this.amount = o.amount;
                this.root = this.paper.set();
                //this.revenue_millions = Math.round(this.amount /  1500);
                this.revenue_millions = this.amount / 700;

                this.radius = Math.sqrt(this.revenue_millions / Math.PI)

                this.lead_type = this.model.get("lead_type");
                this.draw_element();
                this.root.push(this.circle);

            },
            get_radius: function() {
                return this.radius;
            },
            draw_element: function() {

                this.circle = this.paper.circle(this.xpos, this.ypos, 1);



                var r = this;
                this.circle.attr({

                    'stroke-width': this.thickness,
                    'stroke': this.color,
                    'opacity': this.initial_opacity
                });


                this.circle.animate({
                    r: this.radius
                }, 1000);



                this.attach_events();

            },
            move: function(o) {
                this.circle.animate({
                    'cy': o.ypos



                }, 1000, 'easeOut')

            },
            hide: function() {

                this.circle.animate({
                    'stroke': '#D8D8D8',
                    'opacity': 0



                }, 500);
                this.remove_events();
            },
            remove_events: function() {
                this.circle.unmouseover();
                this.circle.unmouseout();
            },
            attach_events: function() {

                var m = this.model;
                var r = this;
                this.circle.mouseover(function() {


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
                        'stroke-width': 5,
                        'stroke': r.mouseover_color


                    }, 300);
                });
                this.circle.mouseout(function() {

                    r.trigger("update", {
                        type: "hide_legend"
                    });
                    this.transform('');
                    this.animate({
                        opacity: r.initial_opacity,
                        'stroke-width': r.thickness,
                        'stroke': r.color

                    }, 300);
                });

            },
            show: function() {
                this.circle.animate({
                    'stroke': this.color,
                    'opacity': this.initial_opacity



                }, 500);
                this.attach_events();

            },
            disable:function(o) {
                if (o.name != this.model.get(o.type)) {
                    this.circle.animate({
                        'stroke': '#D8D8D8',
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
                    console.log(o.name + ' // ' + this.lead_type)
                    if (o.name == "Female" && this.lead_type == "Female Lead") {
                        console.log(" FEMALE MATCH ");
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

        return Dot_outline_v;


    });

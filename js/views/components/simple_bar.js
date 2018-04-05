define(["jquery", "underscore", "backbone","raphael","views/components/bar_legend_v"],
    function($, _, Backbone, Raphael,  Bar_legend_v) {

        var Simple_bar_v = Backbone.View.extend({
            initialize: function(o) {

                //this.bar = this.paper.rect(speaking_time_x, this.ypos, 1, this.bar_height );




                this.draw_bar("#4E8985","male",this.bar_screen_time);
                this.draw_bar("#D0D3A5","male",this.bar_speaking_time);

                //this.draw_bar("#EF6406","female",this.bar_screen_time_female);
                //this.draw_bar("#FCD0D0","female",this.bar_speaking_time_female);



                var r = this;
                var m = this.model;

                this.bar_group.push(this.bar_screen_time);


                this.bar_group.mouseover(


                    function(){
                        console.log( m)


                        r.bar_screen_time.animate({
                            opacity:.4


                        },300);

                        r.bar_speaking_time.animate({
                            opacity:.4


                        },300);
                    }
                )

                this.bar_group.mouseout(


                    function(){


                        r.bar_screen_time.animate({
                            opacity:1


                        },300);

                        r.bar_speaking_time.animate({
                            opacity:r.opacity_initial


                        },300);
                    }
                )

                //this.bar_legend_v = new Bar_legend_v({paper:this.paper});




            },
            get_root:function () {
                return this.bar_group;
            },

            disable:function(o){


                if(o.name != this.model.get(o.type)){

                    this.bar_speaking_time.animate({
                    'fill':'#D8D8D8',
                    'opacity':.3
                    },500)

                    this.bar_screen_time.animate({
                    'fill':'#D8D8D8',
                    'opacity':.3
                    },500)

                } else {
                    this.restore();
                }
            },

            restore:function(){
                this.bar_screen_time.animate({
                    'fill':this.screen_time_color,
                    'opacity':1
                },500)
                /*
                this.bar_speaking_time.animate({
                    'fill':this.speaking_time_color,
                    'opacity':this.opacity_initial
                },500)


                */
            },

            hide:function(){
                this.bar_group.hide().animate({opacity:0});
            },
            show:function(){
                this.bar_group.show()
                this.restore();

            },
            move_bars:function(o){
                this.ypos = o.ypos;
                this.bar_screen_time.animate({
                    'y':o.ypos
                },500)

               this.bar_speaking_time.animate({
                    'y':o.ypos
                },500);


            },


            draw_bar:function(color, type, container){

                var m = this.model;

                var r = this;
                var speaking_time_x = this.xpos;




                if(type == "female"){

                    speaking_time_x = this.xpos - m.get(type+"_speaking_time")*this.scale_change;

                }





                container = this.paper.rect(speaking_time_x, this.ypos, 1, this.bar_height );


                    container.attr(
                        {fill:color,
                            'stroke-width':0,
                            'opacity':1
                        }

                    );


                    container.animate({
                        'width':m.get(type+"_speaking_time")*this.scale_change


                    },500,'easeOut');



                //    return container;



            },

            // screen time
            draw_screen_time:function(type){
                var m = this.model;


                var screen_time_x = this.xpos;
                if(type == "male"){
                    this.screen_time_color = "#4E8985";
                }

                if(type == "female"){
                    this.screen_time_color = "#EF6406";

                }



                this.bar_screen_time = this.paper.rect(screen_time_x, this.ypos, 1, this.bar_height );

                this.bar_screen_time.attr(
                    { fill:this.screen_time_color,
                        'stroke-width':0,
                        'opacity':1,
                        'stroke':this.color

                    }
                )

                this.bar_screen_time.animate({
                    'width':m.get(type+"_on_screen_time")*this.scale_change


                },500,'easeOut');

                var m = this.model;




            },





            update:function(o){
                if(o.type == "hide_year"){
                    if(o.year != this.year){
                        this.hide();
                    }
                    if(o.year == this.year){
                        this.show();
                    }
                }


                if(o.type == "disable_bars"){
                    if(o.name != "All"){
                        this.disable({type:o.category, name:o.name});
                    } else{
                        this.restore();
                    }
                }
            }
        });
        return Simple_bar_v;


    });

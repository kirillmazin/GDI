define(["jquery", "underscore", "backbone","raphael"],
    function($, _, Backbone,Raphael) {






        var Legend_generic_v = Backbone.View.extend({






            update_text:function(text){
                this.legend_label.attr({text:text});
            },

            move: function(x,y){
                this.legend_group.transform("t "+x+","+y)

            }
        });

        return Legend_generic_v;


    });

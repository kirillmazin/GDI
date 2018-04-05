define(["jquery", "underscore", "backbone","text!templates/filtering_menu_item.html"],
    function($, _, Backbone, Content_tmpl) {


        var Filtering_menu_item_v = Backbone.View.extend({
            template:_.template(Content_tmpl),



            initialize: function(o) {

                this.name = o.name;
                this.num_id = o.num_id;
                this.selected = false;



                this.render();
                this.attach_events();


            },
            attach_events:function(){
                $("#"+this.id).on("click",$.proxy(this.open, this));
            },

            open:function(){
                //    console.log("open" + this.num_id);



                    this.trigger('update',{id: this.num_id, name:this.name});
                    this.select();



            },
            select:function () {
                this.selected = true;
                $("#"+this.id).addClass('selected')

            },
            restore:function () {
                this.selected = false;
                    $("#"+this.id).removeClass('selected')
            },


            render: function() {

                this.$el.append(this.template({name:this.name,id:this.id}));
            }

        });

        return Filtering_menu_item_v;


    });

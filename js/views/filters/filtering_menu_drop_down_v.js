define(["jquery", "underscore", "backbone","text!templates/filtering_menu_drop_down.html","views/filters/filtering_menu_item_v"],
    function($, _, Backbone, Filtering_menu_drop_down_tmpl, Filtering_menu_item_v) {


        var Filtering_menu_drop_down_v = Backbone.View.extend({
            template:_.template(Filtering_menu_drop_down_tmpl),


            initialize: function(o) {

                this.type = o.type;
                this.style = o.style;
                this.filtering_items = [];
                this.all_menu_items = [];
                this.label = o.label;
                this.style = o.style;

                
                this.render();
                this.attach_events();
                //this.is_visible = false;
                this.hide();


            },
            attach_events:function(){
                $("#"+ this.id+"_drop_down").on("mouseenter",$.proxy(this.show, this));
                $("#"+ this.id+"_drop_down").on("mouseleave",$.proxy(this.hide, this));



                $("#"+ this.id).on("mouseleave",$.proxy(this.hide, this));

            //    $("#"+ this.id+"").on("mouseleave",$.proxy(this.hide, this));
                //$(".drop_down_label").on("mouseout",$.proxy(this.open, this));
            },
            open:function(){



                if(!this.is_visible){
                    this.show();
                } else{
                    this.hide();
                }

            },
            add_menu_items:function(array){
                //var array = ["item 1", "item 2", "item 3"]

                this.filtering_items = array;

                //console.log(this.filtering_items);
                for(var i=0;i< this.filtering_items.length;i++){

                    this.all_menu_items[i] = new Filtering_menu_item_v({el:"#"+this.id, name:this.filtering_items[i],id:this.id+"_"+i,num_id:i});
                    this.listenTo(this.all_menu_items[i], "update", this.process_menu_click)
                }



            },
            select: function(id){
                this.all_menu_items[id].select();
            },
            hide: function(){
                var w = Math.round($("#"+ this.id+"_selected_item").width()+30);

                $("#"+ this.id).css('display','none');
                $("#"+ this.id+"_label").width(w);


                this.is_visible = false;
            },
            show:function () {
                    $("#"+ this.id).css('display','block');
                    this.is_visible = true;

            },


            process_menu_click: function(o){
                    //console.log(o);

                    $("#"+ this.id+"_selected_item").text(o.name);
                    this.trigger("update",{id:o.id,type:this.type, name: o.name});



                    //var w = Math.round($("#"+ this.id+"_selected_item").width()+50);



                //    $("#"+ this.id+"_drop_down").width(w);

                    this.restore_all();
                    this.hide();




            },
            restore_all:function(){
                for(var i=0;i<this.all_menu_items.length;i++){

                    if(this.all_menu_items[i].selected== true){
                        this.all_menu_items[i].restore();
                    }
                }
            },
            build_interface: function(o) {


                    //console.log(this.collection);
			        for(var i=0;i<this.collection.length;i++){
                        var m = this.collection.at(i);

                        this.panels.push(new Panel_v({el:this.el,model:m}));

				    }

			},
            render: function() {
                this.$el.append(this.template({id:this.id,label:this.label,style:this.style}));
            }

        });

        return Filtering_menu_drop_down_v;


    });

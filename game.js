(function($){
    var points = 0;
    var little_box_prototype = '<div class="little_box"></div>';
    var little_box_container = '<div class="little_box_container"></div>';
    var rainbow = [
        {"color": "pink", "p": 100},
        {"color": "purple", "p": 200},
        {"color": "blue", "p": 300},
        {"color": "yellow", "p": 350},
        {"color": "red", "p": 400},
        {"color": "green", "p": 450},
        {"color": "brown", "p": 200}
    ];

    function start() {

        for (var x = 0; x < 70; x++) {
            if (x % 10 == 0) {
                $("#little_box_container_container").append(little_box_container);
            }
            $(".little_box_container:last").append(little_box_prototype);
            var color = rainbow[Math.floor(Math.random() * rainbow.length)];
            $(".little_box:last")
                .css("background", color.color)
                .attr("data-color", color.color)
        }

        $(".little_box").click(function (event) {
            $(this).toggle("explode").promise().done(function() {
                $(this).remove();
                points += 10;
                look_for_points();
            });
        });
    }
    /**
     * Go through all of the boxes and find out if any of them have 3
     * in a row. If so we will add up the points.
     **/
    function look_for_points(){
        console.log("look for points");
        $(".little_box").each(function(i, box){
            $(this).attr("data-y", $(this).index());
            $(this).attr("data-x", $(this).parent().index());
        });

        var xl = $(".little_box_container").length;
        var found = false;
        for(var x = 0; x < xl; x++){
            var lbl = $($(".little_box_container")[x]).find(".little_box").length;
            for(var y = 0; y < lbl; y++){
                var lb = $(".little_box[data-x='"+x+"'][data-y='"+y+"']");
                var lbc = lb.attr("data-color");
                if(x > 0 && y > 0){
                    var lbm = [
                        [
                            $("div.little_box[data-x='"+ (x-1) +"'][data-y='"+ (y+1) +"']"),
                            $("div.little_box[data-x='"+ x +"'][data-y='"+ (y+1) +"']"),
                            $("div.little_box[data-x='"+ (x+1) +"'][data-y='"+ (y+1) +"']")
                        ],
                        [
                            $("div.little_box[data-x='"+ (x-1) +"'][data-y='"+ y +"']"),
                            lb,
                            $("div.little_box[data-x='"+ (x+1) +"'][data-y='"+ y +"']")
                        ],
                        [
                            $("div.little_box[data-x='"+ (x-1) +"'][data-y='"+ (y-1) +"']"),
                            $("div.little_box[data-x='"+ x +"'][data-y='"+ (y-1) +"']"),
                            $("div.little_box[data-x='"+ (x+1) +"'][data-y='"+ (y-1) +"']")
                        ]
                    ];
                    var llbc = lbm[1][0].attr("data-color");
                    var rlbc = lbm[1][2].attr("data-color");
                    if(lbc == llbc && lbc == rlbc){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[1][0].toggle("explode").remove();
                        lbm[1][2].toggle("explode").remove();
                    }else if(lbc == lbm[0][1].attr("data-color") && lbc == lbm[2][1].attr("data-color")){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[0][1].toggle("explode").remove();
                        lbm[2][1].toggle("explode").remove();
                    }else if(
                        lbc != "gold" &&
                        lbc == lbm[2][0].attr("data-color") &&
                        lbc == lbm[2][1].attr("data-color") &&
                        lbc == lbm[1][0].attr("data-color")){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p * 4;
                        found = true;
                        lb.animate({
                            "border-radius": "0px",
                            backgroundColor: "#FFD700",
                            boxShadow: "none",
                            "padding": "5px",
                            "margin": "0px"
                        }).attr("data-color", "gold");
                        lbm[2][0].animate({
                            "border-radius": "0px",
                            backgroundColor: "#FFD700",
                            boxShadow: "none",
                            "padding": "5px",
                            "margin": "0px"
                        }).attr("data-color", "gold");
                        lbm[2][1].animate({
                            "border-radius": "0px",
                            backgroundColor: "#FFD700",
                            boxShadow: "none",
                            "padding": "5px",
                            "margin": "0px"
                        }).attr("data-color", "gold");
                        lbm[1][0].animate({
                            "border-radius": "0px",
                            backgroundColor: "#FFD700",
                            boxShadow: "none",
                            "padding": "5px",
                            "margin": "0px"
                        }).attr("data-color", "gold");
                    }

                }else if( x == 0 && y > 0 ){
                    var lbm = [
                        [
                            $("div.little_box[data-x='0'][data-y='"+ (y+1) +"']"),
                            $("div.little_box[data-x='1'][data-y='"+ (y+1) +"']"),
                            $("div.little_box[data-x='2'][data-y='"+ (y+1) +"']")
                        ],
                        [
                            lb,
                            $("div.little_box[data-x='1'][data-y='"+ y +"']"),
                            $("div.little_box[data-x='2'][data-y='"+ y +"']")
                        ],
                        [
                            $("div.little_box[data-x='0'][data-y='"+ (y-1) +"']"),
                            $("div.little_box[data-x='1'][data-y='"+ (y-1) +"']"),
                            $("div.little_box[data-x='2'][data-y='"+ (y-1) +"']")
                        ]
                    ];
                    var rlbc = lbm[1][1].attr("data-color");
                    var nrlbc = lbm[1][2].attr("data-color");
                    if(lbc == nrlbc && lbc == rlbc){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[1][1].toggle("explode").remove();
                        lbm[1][2].toggle("explode").remove();
                    }else if(lbc == lbm[0][0].attr("data-color") && lbc == lbm[2][0].attr("data-color")){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[0][0].toggle("explode").remove();
                        lbm[2][0].toggle("explode").remove();
                    }
                }else if ( x > 0 && y == 0){
                    var lbm = [
                        [
                            $("div.little_box[data-x='"+ (x - 1) +"'][data-y='"+ (y + 2) +"']"),
                            $("div.little_box[data-x='"+ x + "'][data-y='"+ (y + 2) +"']"),
                            $("div.little_box[data-x='" + (x+1) + "'][data-y='"+ (y + 2) +"']")
                        ],
                        [
                            $("div.little_box[data-x='"+ (x - 1) +"'][data-y='"+ (y + 1) +"']"),
                            $("div.little_box[data-x='"+ x + "'][data-y='"+ (y + 1) +"']"),
                            $("div.little_box[data-x='" + (x+1) + "'][data-y='"+ (y + 1) +"']")
                        ],
                        [
                            $("div.little_box[data-x='"+ (x - 1) +"'][data-y='0']"),
                            lb,
                            $("div.little_box[data-x='" + (x+1) + "'][data-y='0']")
                        ]
                    ];
                    var llbc = lbm[2][0].attr("data-color");
                    var rlbc = lbm[2][2].attr("data-color");
                    if(lbc == llbc && lbc == rlbc){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[2][0].toggle("explode").remove();
                        lbm[2][2].toggle("explode").remove();
                    }else if(lbc == lbm[0][1].attr("data-color") && lbc == lbm[1][1].attr("data-color")){
                        var p = $.grep(rainbow, function(bow){
                            return bow.color == lbc;
                        });
                        points += p[0].p;
                        found = true;
                        lb.toggle("explode").remove();
                        lbm[0][1].toggle("explode").remove();
                        lbm[1][1].toggle("explode").remove();
                    }
                }
            }
        }
        $("#points").html("Score: " + points);
        if(found){
            look_for_points();
        }
    }

    $(document).ready(start);
})(jQuery);

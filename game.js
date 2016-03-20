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
    var blml = 0, blmld = 0;

    function start() {

        for (var x = 0; x < 20; x++) {
            if (x % 5 == 0) {
                $("#little_box_container_container").append(little_box_container);
            }
            $(".little_box_container:last").append(little_box_prototype);
            var color = rainbow[Math.floor(Math.random() * rainbow.length)];
            $(".little_box:last")
                .css("background", color.color)
                .attr("data-color", color.color)
        }

        $(".little_box").click(function (event) {
            var color = $(this).attr("data-color");
            var boxes_like_me = $(".little_box[data-color=" + color + "]");
            boxes_like_me.toggle("explode").promise().done(function() {
                boxes_like_me.remove();
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
        //Go through all colors in our rainbow
        $.each(rainbow, function(i, bow){
            var index = -1, pindex = -1, good = 0;
            $(".little_box[data-color='"+bow.color+"']").each(function(i, box){
                var nindex = $(box).index();
                var npindex = $($(box).parents("div")[0]).index();
                if(index == -1 && pindex == -1){
                    index = nindex;
                    pindex = npindex;
                }
                var diff = npindex - pindex;
                if((diff == 1 || diff == 0) && index == nindex){
                    pindex = npindex;
                    index = nindex;
                    good += 1;
                    if(good > 2){
                        points += bow.p;
                        $("#points").html("Score: " + points);
                        var color = bow.color;
                        var boxes_like_me = $(".little_box[data-color="+color+"]");
                        boxes_like_me.toggle("explode").promise().done(function() {
                            boxes_like_me.remove();
                            look_for_points();
                        });
                    }
                }else{
                    index = -1;
                    pindex = -1;
                }
            });
        });
    }

    $(document).ready(start);
})(jQuery);

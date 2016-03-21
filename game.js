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
    var little_boxes = [];
    var metal_clank = false;

    function start() {
        metal_clank = $("#metal_clank")[0];
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

    function kill_boxes(boxes){
        for(var bi = 0; bi < boxes.length; bi++) {
            var x = boxes[bi][0], y = boxes[bi][1];
            $(".little_box[data-x='" + x + "'][data-y='" + y + "']").toggle("explode").remove();
            little_boxes[x][y] = false;
        }
    }

    function look_h_middle(x, y){
        var lbc = little_boxes[x][y];
        var llbc = little_boxes[x - 1][y];
        var rlbc = little_boxes[x + 1][y];
        if (lbc == llbc && lbc == rlbc) {
            var p = $.grep(rainbow, function (bow) {
                return bow.color == lbc;
            });
            points += p[0].p;
            kill_boxes([
                [x, y],
                [x - 1, y],
                [x + 1, y]
            ]);
            return true;
        }else{
            return false;
        }
    }

    function look_v_middle(x, y) {
        var lbc = little_boxes[x][y];
        if (lbc == little_boxes[x][y - 1] && lbc == little_boxes[x][y + 1]) {
            var p = $.grep(rainbow, function (bow) {
                return bow.color == lbc;
            });
            points += p[0].p;
            kill_boxes([
                [x, y],
                [x, y-1],
                [x, y+1]
            ]);
            return true;
        }else{
            return false;
        }
    }

    function look_box_middle(x, y) {
        var lbc = little_boxes[x][y];
        if (lbc != "gold" &&
            lbc == little_boxes[x - 1][y] &&
            lbc == little_boxes[x - 1][y - 1] &&
            lbc == little_boxes[x][y - 1]) {
            little_boxes[x][y] = "gold";
            little_boxes[x-1][y] = "gold";
            little_boxes[x][y-1] = "gold";
            little_boxes[x-1][y-1] = "gold";
            var p = $.grep(rainbow, function (bow) {
                return bow.color == lbc;
            });
            points += p[0].p * 4;
            $(".little_box[data-x='" + x + "'][data-y='" + y + "']").animate({
                "border-radius": "0px",
                backgroundColor: "#FFD700",
                boxShadow: "none",
                "padding": "5px",
                "margin": "0px"
            }).attr("data-color", "gold");
            $(".little_box[data-x='" + (x - 1) + "'][data-y='" + y + "']").animate({
                "border-radius": "0px",
                backgroundColor: "#FFD700",
                boxShadow: "none",
                "padding": "5px",
                "margin": "0px"
            }).attr("data-color", "gold");
            $(".little_box[data-x='" + (x - 1) + "'][data-y='" + (y - 1) + "']").animate({
                "border-radius": "0px",
                backgroundColor: "#FFD700",
                boxShadow: "none",
                "padding": "5px",
                "margin": "0px"
            }).attr("data-color", "gold");
            $(".little_box[data-x='" + x + "'][data-y='" + (y - 1) + "']").animate({
                "border-radius": "0px",
                backgroundColor: "#FFD700",
                boxShadow: "none",
                "padding": "5px",
                "margin": "0px"
            }).attr("data-color", "gold");
            return true;
        }else{
            return false;
        }
    }

    /**
     * Go through all of the boxes and find out if any of them have 3
     * in a row. If so we will add up the points.
     **/
    function look_for_points(){
        console.log("look for points");
        little_boxes = [];
        $(".little_box").each(function (i, box) {
            var i = $(this).index();
            var p = $(this).parent().index();
            if (!little_boxes[p]) {
                little_boxes[p] = [];
            }
            little_boxes[p][i] = $(this).attr("data-color");
            $(this).attr("data-x", p).attr("data-y", i);
        });
        var xl = little_boxes.length;
        var found = false;
        for (var x = 0; x < xl; x++) {
            if(little_boxes[x]) {
                var lbl = little_boxes[x].length;
                for (var y = 0; y < lbl; y++) {
                    if (
                        little_boxes[x] && little_boxes[x][y] && little_boxes[x - 1] && little_boxes[x - 1][y] &&
                        little_boxes[x + 1] && little_boxes[x + 1][y]
                    ) {
                        if (look_h_middle(x, y)) {
                            found = true;
                        }
                    }
                    if (
                        little_boxes[x] && little_boxes[x][y] && little_boxes[x][y + 1] && little_boxes[x][y - 1]
                    ) {
                        if (look_v_middle(x, y)) {
                            found = true;
                        }
                    }
                    if (
                        little_boxes[x] && little_boxes[x][y] && little_boxes[x - 1] && little_boxes[x - 1][y] &&
                        little_boxes[x - 1][y - 1] && little_boxes[x][y - 1]
                    ) {
                        if (look_box_middle(x, y)) {
                            found = true;
                        }
                    }
                }
            }
        }
        $("#points").html("Score: " + points);
        if(found){
            metal_clank.load();
            metal_clank.play();
        }
    }

    $(document).ready(start);
})(jQuery);

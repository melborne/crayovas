var drawable = false;
var px = 0, py = 0;
var pen_color, pen_prev1, pen_prev2;
var pen_weight;
var canvas_color;

$(document).ready(function(){
  default_set();

  var canvas = $("#canvas");
  canvas.toggle(
    function(e){
      drawable = true;
      px = e.pageX - $(this).offset().left;
      py = e.pageY - $(this).offset().top;
    },
    function(e){ drawable = false; }
  );
  canvas.mousemove(draw);

  $(".color").click(set_pen_color);
  $("#eraser").click(set_pen_color);
  $(".pen").click(set_pen_weight);
  $(".series_name").click(set_palette);
})

function default_set () {
  pen_color = "#111111";
  pen_prev1 = "#111111", pen_prev2 = "#111111";
  pen_weight = 5;
  canvas_color = "#FFFFEE";
  $("#eraser").css('background', canvas_color);
  $(".recent").css('background', "#111111");
  $(".pen").css("background", "#888888");
  $("#5").css('background', "#444444");
  $(".series").hide();
  $(".series:first").show();
  $(".series_name:first").css('background', '#444444');
}

function draw (e) {
  if (!drawable) { return };
  var x = e.pageX - $(this).offset().left;
  var y = e.pageY - $(this).offset().top;
  var t = $(this)[0].getContext("2d");

  t.strokeStyle = pen_color;
  t.lineWidth = pen_weight;
  t.lineJoin = "round";
  t.lineCap = "round";
  t.beginPath();
  t.moveTo(px,py);
  t.lineTo(x,y);
  t.stroke();
  t.closePath();
  px = x;
  py = y;
}

function set_pen_color () {
  var c = $(this).attr("id");
  if (c=='eraser') {
    pen_color = canvas_color;
  } else {
    pen_prev2 = pen_prev1;
    pen_prev1 = pen_color;
    pen_color = c;
    $("#recent2").css('background', pen_prev2);
    $("#recent1").css('background', pen_prev1);
    $("#recent0").css('background', c);
  };
}

function set_pen_weight () {
  pen_weight = $(this).attr("id");
  $(".pen").css("background", "#888888");
  $(this).css("background", "#444444");
}

function set_palette () {
  sname = $(this).attr('id');
  $(".series").hide();
  $(sname).show();
  $(".series_name").css('background', 'transparent');
  $(this).css('background', '#444444');
}
var drawable = false;
var px = 0, py = 0;
var pen_color
var pen_weight;
var prev_pens = [];
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
  $("#reset").click(clear);
  $(".recent").click(set_recent_color);
})

function default_set () {
  var def_color = "#111111";
  pen_color = def_color;
  prev_pens[0] = def_color, prev_pens[1] = def_color;
  pen_weight = 5;
  canvas_color = "#FFFFEE";
  $("#eraser, #reset").css('background-color', canvas_color);
  $(".recent").css('background-color', "#111111");
  $(".pen").css("background-color", "#888888");
  $("#5").css('background-color', "#444444");
  $(".series").hide();
  $(".series:first").show();
  $(".series_name:first").css('background-color', '#444444');
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
    prev_pens[1] = prev_pens[0];
    prev_pens[0] = pen_color;
    pen_color = c;
    $("#recent2").css('background-color', prev_pens[1]);
    $("#recent1").css('background-color', prev_pens[0]);
    $("#recent0").css('background-color', c);
  };
}

function set_pen_weight () {
  pen_weight = $(this).attr("id");
  $(".pen").css("background-color", "#888888");
  $(this).css("background-color", "#444444");
}

function set_palette () {
  var sname = $(this).attr('id');
  $(".series").hide();
  $(sname).show();
  $(".series_name").css('background-color', 'transparent');
  $(this).css('background-color', '#444444');
}

function set_recent_color () {
   pen_color = $(this).css("background-color");
}

function clear () {
  var c = $("#canvas");
  var t = c[0].getContext("2d");
  t.fillStyle = canvas_color;
  t.fillRect(0,0,c.attr('width'),c.attr('height'));
}
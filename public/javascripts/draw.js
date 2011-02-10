var drawable = false;
var px = 0, py = 0;
var pen_colors = [];
var pen_weight;
var canvas_color;
var selected_color, unselected_color;

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
  
  $(".color").mouseover(show_color_info);
  $(".color").mouseout(hide_color_info);

})

function default_set () {
  pen_colors[0] = "#111111";
  pen_weight = 5;
  canvas_color = "#FFFFEE";
  selected_color = "#777777";
  unselected_color = "#444444";
  
  $("#eraser").css('background-color', canvas_color);
  $(".recent").css('background-color', unselected_color);
  $("#recent0").css('background-color', pen_colors[0]);
  $(".pen").css("background-color", unselected_color);
  $("#5").css('background-color', selected_color);
  $(".series").hide();
  $(".series:first").show();
  $(".series_name:first").css('background-color', selected_color);
}

function draw (e) {
  if (!drawable) { return };
  var x = e.pageX - $(this).offset().left;
  var y = e.pageY - $(this).offset().top;
  var t = $(this)[0].getContext("2d");

  t.strokeStyle = pen_colors[0];
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
    pen_colors[0] = canvas_color;
  } else {
    pen_colors.unshift(c);
    $(".recent").each(function(i){
      $(this).css('background-color', pen_colors[i]);
    })
  };
}

function set_pen_weight () {
  pen_weight = $(this).attr("id");
  $(".pen").css("background-color", unselected_color);
  $(this).css("background-color", selected_color);
}

function set_palette () {
  var sname = $(this).attr('id');
  $(".series").hide();
  $(sname).show();
  $(".series_name").css('background-color', 'transparent');
  $(this).css('background-color', selected_color);
}

function set_recent_color () {
   pen_colors[0] = $(this).css("background-color");
}

function clear () {
  var c = $("#canvas");
  var t = c[0].getContext("2d");
  t.fillStyle = canvas_color;
  t.fillRect(0,0,c.attr('width'),c.attr('height'));
}

function show_color_info () {
  window.status = $(this).css("background-color");
  return true;
}

function hide_color_info () {
  window.status = "";
  return true;
}
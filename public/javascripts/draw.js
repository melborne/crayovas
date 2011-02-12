var drawable = false;
var px = 0, py = 0;
var pen_colors = [];
var pen_weight;
var canvas_color;
var selected_color, unselected_color;
var canvas, ctx;

$(document).ready(function(){
  canvas = $("#canvas");
  ctx = canvas[0].getContext('2d');
  
  default_set();

  canvas.toggle(
    function(e){
      drawable = true;
      px = e.pageX - $(this).offset().left;
      py = e.pageY - $(this).offset().top;
    },
    function(e){ drawable = false; }
  );
  canvas.mousemove(draw);

  $(".color").click( set_pen_color );
  $("#eraser").click( set_erase );
  $(".pen").click( set_pen_weight );
  $(".series_name").click( set_palette );
  $("#reset").click( clear_canvas );
  $(".recent").click( set_recent_color );
  
  $(".color").mouseover( show_color_info );
  $(".color").mouseout( hide_color_info );

  $("#img_form").submit( load_image );
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

  ctx.strokeStyle = pen_colors[0];
  ctx.lineWidth = pen_weight;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(px,py);
  ctx.lineTo(x,y);
  ctx.stroke();
  ctx.closePath();
  px = x;
  py = y;
}

function set_pen_color () {
  var c = $(this).attr("id");
  pen_colors.unshift(c);
  $(".recent").each(function(i){
    $(this).css('background-color', pen_colors[i]);
  })
}

function set_recent_color () {
   pen_colors[0] = $(this).css("background-color");
}

function set_erase () {
  pen_colors[0] = canvas_color;
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

function clear_canvas () {
  ctx.fillStyle = canvas_color;
  ctx.fillRect(0,0,canvas.attr('width'),canvas.attr('height'));
}

function show_color_info () {
  window.status = $(this).css("background-color");
  return true;
}

function hide_color_info () {
  window.status = "";
  return true;
}

function load_image () {
  var url = $("#img_text").val();
  $("#img_text").val("");
  var img = new Image();
  img.onload = function(){
    ctx.drawImage(img, 0, 0, canvas.attr('width'), canvas.attr('height'));
  }
  img.onerror = function(){
    alert('Fail to load a image from '+ url);
  }
  img.src = url;
  return false;
}

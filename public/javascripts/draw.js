var paint = {
  drawable : false,
  penColors : ["#111111"],
  penWeight : 5,
  canvasColor : "#FFFFEE",
  px : 0,
  py : 0
}
var selectedColor, unselectedColor;

$(document).ready(function(){

  initialize();

  paint.canvas.toggle(
    function(e){
      paint.drawable = true;
      paint.px = e.pageX - $(this).offset().left;
      paint.py = e.pageY - $(this).offset().top;
    },
    function(e){ paint.drawable = false; }
  );
  paint.canvas.mousemove(draw);

  $(".color").click( setPenColor );
  $("#eraser").click( setErase );
  $(".pen").click( setPenWeight );
  $(".seriesName").click( setPalette );
  $("#reset").click( clearCanvas );
  $(".recent").click( setRecentColor );
  
  $(".color").mouseover( showColorInfo );
  $(".color").mouseout( hideColorInfo );

  $("#formToggle").click(function(){
    f = $("#imgurlForm");
    f.css('display')=='none' ? f.show('slow') : f.hide('slow');
  });
  $("#imgurlForm").submit( loadImage );
})

function initialize () {
  paint.canvas = $("#canvas");
  paint.ctx = paint.canvas[0].getContext('2d');
  paint.canvasWidth = paint.canvas.attr("width");
  paint.canvasHeight = paint.canvas.attr("height");
  
  selectedColor = "#777777";
  unselectedColor = "#444444";
  
  $("#eraser").css('background-color', paint.canvasColor);
  $(".recent").css('background-color', unselectedColor);
  $("#recent0").css('background-color', paint.penColors[0]);
  $(".pen").css("background-color", unselectedColor);
  $("#5").css('background-color', selectedColor);
  $(".series").hide();
  $(".series:first").show();
  $(".seriesName:first").css('background-color', selectedColor);
}

function draw (e) {
  if (!paint.drawable) { return };
  var x = e.pageX - $(this).offset().left;
  var y = e.pageY - $(this).offset().top;
  var ctx = paint.ctx;

  ctx.strokeStyle = paint.penColors[0];
  ctx.lineWidth = paint.penWeight;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(paint.px,paint.py);
  ctx.lineTo(x,y);
  ctx.stroke();
  ctx.closePath();
  paint.px = x;
  paint.py = y;
}

function setPenColor () {
  var c = $(this).attr("id");
  paint.penColors.unshift(c);
  $(".recent").each(function(i){
    $(this).css('background-color', paint.penColors[i]);
  })
}

function setRecentColor () {
   paint.penColors[0] = $(this).css("background-color");
}

function setErase () {
  paint.penColors[0] = paint.canvasColor;
}

function setPenWeight () {
  paint.penWeight = $(this).attr("id");
  $(".pen").css("background-color", unselectedColor);
  $(this).css("background-color", selectedColor);
}

function setPalette () {
  var sname = $(this).attr('id');
  $(".series").hide();
  $(sname).show();
  $(".seriesName").css('background-color', 'transparent');
  $(this).css('background-color', selectedColor);
}

function clearCanvas () {
  paint.ctx.clearRect(0,0,paint.canvasWidth,paint.canvasHeight);
}

function showColorInfo () {
  window.status = $(this).css("background-color");
  return true;
}

function hideColorInfo () {
  window.status = "";
  return true;
}

function loadImage () {
  var url = $("#imgurl").val();
  $("#imgurl").val("");
  var img = new Image();
  img.onload = function(){
    paint.ctx.drawImage(img, 0, 0, paint.canvasWidth, paint.canvasHeight);
  }
  img.onerror = function(){
    alert('Image not found: '+ url);
  }
  img.src = url;
  $("#imgurlForm").hide('slow');
  return false;
}


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

$(function() {
  var socket = io.connect();
  socket.on('image', insertImage);

  var video = $('video')[0];
  var canvas = $('canvas')[0];
  var interval = null;

  if (typeof navigator.getUserMedia !== 'function') {
    $('#unsupported').show();
  }
  else {
    navigator.getUserMedia({video: true}, function(localMediaStream) { 
      video.src = window.URL.createObjectURL(localMediaStream);
      start();
    }, function(error) {
      console.log(error);
    });    
  }

  function snapshot () {
    if (video.clientWidth == 300) return;

    var ctx = canvas.getContext('2d');
    var ratio = video.clientHeight / video.clientWidth;
    var cw = 200;
    var ch = Math.floor(200 * ratio);
    canvas.width = cw;
    canvas.height = ch;
    ctx.drawImage(video, 0, 0, cw, ch);
    var data = canvas.toDataURL('image/jpeg');
    insertImage(data);
    socket.emit('image', data);
  }  

  function insertImage(dataUrl) {
    var rotate = Math.random()*45-22;
    var w = $(window).width();
    var h = $(window).height();

    $('<img></img>')
      .attr('src', dataUrl)
      .css('-webkit-transform','rotate(' + rotate + 'deg)')
      .css('left', Math.floor(Math.random()*w*0.7) + Math.floor(w*0.1))
      .css('top', Math.floor(Math.random()*h*0.7) + Math.floor(h*0.1))
      .appendTo('body')
      .fadeOut(10000, function () {
        $(this).remove();
      });     
  }

  function start() {
    snapshot();
    interval = setInterval(snapshot, 2000);
    $('button')
      .show()
      .unbind('click')
      .text('Stop')
      .click(stop);
  }

  function stop() {
    clearInterval(interval);
    $('button')
      .unbind('click')
      .text('Start')
      .click(start);
  }
});

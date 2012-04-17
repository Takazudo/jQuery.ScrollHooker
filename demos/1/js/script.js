(function() {
  var scroller;

  scroller = new $.Tinyscroller({
    speed: 30,
    maxStep: 50
  });

  scroller.live();

  $(function() {});

}).call(this);

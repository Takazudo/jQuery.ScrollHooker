(function() {
  var scroller;

  scroller = new $.Tinyscroller({
    speed: 20,
    maxStep: 70,
    changehash: false
  });

  scroller.live();

  $(function() {
    var hooker;
    hooker = $.ScrollHooker();
    hooker.hook($('#page1 .mod-page-bg'), {
      top: {
        from: {
          st: 0,
          val: '0px'
        },
        to: {
          st: 2070,
          val: '-4000px'
        }
      }
    }).hook($('#page1 .mod-page-bgobjs1'), {
      top: {
        from: {
          st: 0,
          val: '0px'
        },
        to: {
          st: 2070,
          val: '-800px'
        }
      }
    });
    return this;
  });

}).call(this);

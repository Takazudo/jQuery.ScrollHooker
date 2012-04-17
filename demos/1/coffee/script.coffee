scroller = new $.Tinyscroller
  speed: 20
  maxStep: 70
  changehash: false
scroller.live()

$ ->

  hooker = $.ScrollHooker()

  # page1
  
  hooker
  .hook $('#page1 .mod-page-bg'),
    top:
      from: st:0, val:'0px'
      to: st:2070, val: '-4000px'
  .hook $('#page1 .mod-page-bgobjs1'),
    top:
      from: st:0, val:'0px'
      to: st:2070, val: '-800px'

  @


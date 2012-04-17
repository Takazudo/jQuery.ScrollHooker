# ============================================================

scroller = new $.Tinyscroller
  speed: 30
  maxStep: 50
scroller.live()

$ ->

#  hooker = new $.ScrollHooker
#
#  # seq1
#  
#  hooker.hook $('#topseq1'),
#    display: (st) ->
#      if st <= 1000 then 'block' else 'none'
#  #.hook $('#topseq1 .topseq1-text img'),
#  #  opacity:
#  #    from: st:0, val:1
#  #    to:   st:1000, val:0
#  .hook $('#topseq1 .topseq1-text img'),
#    top:
#      from: st:0, val:'0px'
#      to:   st:1000, val:'-100px'
#  
#  # seq2
#
#  hooker.hook $('#topseq2'),
#    display: (st) ->
#      if st < 600 then return 'none'
#      if st <= 2100 then return 'block'
#      'none'
#    top:
#      from: st:800, val:'100%'
#      to: st:1000, val:'0%'
#  #.hook $('#topseq2 .topseq2-text'),
#   # opacity: (st) -> if st < 800 then 0 else 1
#  .hook $('#topseq2 .topseq-bg'),
#    top:
#      from: st:600, val: '0px'
#      to: st:2100, val: '-400px'
#  .hook $('#topseq2 .topseq2-text-inner'),
#    top:
#      from: st:800, val:'800px'
#      to: st:1000, val:'0px'
#  .hook $('#topseq2 .topseq2-text-inner2'),
#    top:
#      from: st:1300, val:'0px'
#      to: st:2100, val:'-800px'
#  .hook $('#topseq2 .topseq2-nav1'),
#    left: (st) -> if st < 1000 then '-500px' else '712px'
#    top: (st) ->  if st < 1000 then '-400px' else '-80px'
#  .hook $('#topseq2 .topseq2-nav2'),
#    left: (st) -> if st < 1000 then '-500px' else '541px'
#    top: (st) ->  if st < 1000 then '-400px' else '287px'
#  .hook $('#topseq2 .topseq2-nav3'),
#    left: (st) -> if st < 1000 then '-500px' else '404px'
#    top: (st) ->  if st < 1000 then '1200px' else '512px'
#
#  # seq3
#
#  hooker.hook $('#topseq3'),
#    display: (st) ->
#      if st < 1300 then return 'none'
#      if st <= 2800 then return 'block'
#      'none'
#    top:
#      from: st:1700, val:'100%'
#      to: st:2100, val:'0%'
#  #.hook $('#topseq3 .topseq3-img-1'),
#  #  className: (st) -> if st < 2100 then 'state-disabled' else 'state-active'
#  .hook $('#topseq3 .topseq3-img-2'),
#    opacity: (st) -> if st < 2100 then 0 else 1
#
#  # seq4 + 300scroll
#  
#  hooker.hook $('#topseq4'),
#    display: (st) ->
#      if st < 2400 then return 'none'
#      if st <= 3500 then return 'block'
#      'none'
#    top:
#      from: st:2400, val:'100%'
#      to: st:2800, val:'0%'
#  .hook $('#topseq4 .topseq4-text'),
#    opacity: (st) -> if st < 2600 then 0 else 1
#  .hook $('#topseq4 .topseq4-img-1'),
#    left: (st) -> if st < 2800 then '-500px' else '204px'
#    top: (st) ->  if st < 2800 then '2000px' else '365px'
#  .hook $('#topseq4 .topseq4-img-2'),
#    left: (st) -> if st < 2800 then '100px' else '139px'
#    top: (st) ->  if st < 2800 then '-1000px' else '199px'
#  .hook $('#topseq4 .topseq4-img-3'),
#    left: (st) -> if st < 2800 then '900px' else '171px'
#    top: (st) ->  if st < 2800 then '-1000px' else '33px'
#
#  # seq5 + 300scroll
#  
#  hooker.hook $('#topseq5'),
#    display: (st) ->
#      if st < 3100 then return 'none'
#      if st <= 4200 then return 'block'
#      'none'
#    top:
#      from: st:3100, val:'100%'
#      to: st:3500, val:'0%'
#  .hook $('#topseq5 .topseq5-img-2 img'),
#    left: (st) -> if st < 3500 then '100px' else '0px'
#    opacity: (st) ->  if st < 3500 then 0 else 1
#
#  # seq6 + 300scroll
#
#  hooker.hook $('#topseq6'),
#    display: (st) ->
#      if st < 3800 then return 'none'
#      if st <= 4900 then return 'block'
#      'none'
#    top:
#      from: st:3800, val:'100%'
#      to: st:4200, val:'0%'
#  .hook $('#topseq6 .topseq6-img-2 img'),
#    top: (st) -> if st < 4200 then '30px' else '0px'
#    opacity: (st) ->  if st < 4200 then 0 else 1
#
#  # seq7 + 300scroll
#
#  hooker.hook $('#topseq7'),
#    display: (st) ->
#      if st < 4500 then return 'none'
#      #if st <= 5600 then return 'block'
#      #'none'
#      'block'
#    top:
#      from: st:4500, val:'100%'
#      to: st:4900, val:'0%'
#  .hook $('#topseq7 .topseq7-img img'),
#    left: (st) -> if st < 4900 then '30px' else '0px'
#    opacity: (st) ->  if st < 4900 then 0 else 1
#

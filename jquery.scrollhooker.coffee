(($, window, document) -> # encapsulate whole start


  $win = $(window)
  log = (args...) -> console?.log.apply console, args
  ns = {}


  # ============================================================
  # utils

  # css value string manipulators

  ns.parseUnit = (val) ->
    if ($.type val) is 'number'
      return null
    val.replace /^[\-|\d|\.]+/, ''
    
  ns.parseNum = (val) ->
    if ($.type val) is 'number'
      return val
    (val.replace /[^\d]*$/, '')*1

  ns.normalizeNum = (num, cutDecimal) ->
    if cutDecimal
      return Math.round num
    else
      return (Math.round (num * 100)) / 100

  # value compatibility test function.
  # ex: '100px', '200px' -> true
  # ex: '100px', '200%' -> false

  ns.testValsCompatibility = (val1, val2) ->
    val1_type = $.type val1
    val2_type = $.type val2
    if (val1_type is 'number') and (val2_type is 'number')
      return true
    if ($.type val1) isnt ($.type val2)
      return false
    val1_unit = ns.parseUnit val1
    val2_unit = ns.parseUnit val2
    if val1_unit isnt val2_unit
      return false
    true
    

  # ============================================================
  # event module

  class ns.Event
    constructor: ->
      @_callbacks = {}

    bind: (ev, callback) ->
      evs = ev.split(' ')
      for name in evs
        @_callbacks[name] or= []
        @_callbacks[name].push(callback)
      @

    trigger: (args...) ->
      ev = args.shift()
      list = @_callbacks?[ev]
      return unless list
      for callback in list
        if callback.apply(@, args) is false
          break
      @

    unbind: (ev, callback) ->
      unless ev
        @_callbacks = {}
        return @

      list = @_callbacks?[ev]
      return this unless list

      unless callback
        delete @_callbacks[ev]
        return this

      for cb, i in list when cb is callback
        list = list.slice()
        list.splice(i, 1)
        @_callbacks[ev] = list
        break
      @


  # ============================================================
  # LineHooker

  class ns.LineHooker
    constructor: (@$el, @options) ->
      o = @options

      unless ns.testValsCompatibility o.val_start, o.val_end
        log "LineHooker detected invalid value combination: #{o.val_start}, #{o.val_end}"
        return @

      # parse unit, trim unit
      @_unit = ns.parseUnit o.val_start
      @_num_start = ns.parseNum o.val_start
      @_num_end = ns.parseNum o.val_end

      # calc speed
      distance = @_num_end - @_num_start
      time = o.st_end - o.st_start
      @_speed = distance / time

    _unitify: (num) ->
      if @_unit
        normalized = ns.normalizeNum num, (@_unit is 'px')
        ret = "#{normalized}#{@_unit}"
      else
        ret = ns.normalizeNum num
      ret

    _isAbove: (st) -> st < @options.st_start
    _isBelow: (st) -> st > @options.st_end

    update: (scrollTop) ->
      
      # it's useless to handle hidden element's style
      if @$el.is(':hidden') then return @

      st = scrollTop
      o = @options
      newVal = null

      # calc new value
      if @_isAbove st
        newVal = @_unitify @_num_start
      else if @_isBelow st
        newVal = @_unitify @_num_end
      else
        # newVal is... minVal + scrolledDistance * speed
        scrolledDistance = st - o.st_start
        newVal = @_unitify (@_num_start + (scrolledDistance * @_speed))

      # if the value was changed, update style
      unless newVal is @_lastVal
        @$el.css o.prop, newVal
        @_lastVal = newVal

      @


  # ============================================================
  # PointHooker

  class ns.PointHooker
    constructor: (@$el, @key, @_handler) ->
    update: (scrollTop) ->
      val = @_handler(scrollTop, @$el)
      if @_lastVal is val then return @
      if @key is 'className'
        if @_lastVal
          @$el.removeClass @_lastVal
        @$el.addClass val
      else
        @$el.css @key, val
      @_lastVal = val
      true


  # ============================================================
  # Manager

  class ns.Manager extends ns.Event
    constructor: ->

      # handle without new call
      if not (@ instanceof arguments.callee)
        return new ns.Manager

      super
      @_items = []
      @_eventify()

    _eventify: ->
      $win.scroll =>
        st = $win.scrollTop()
        @trigger 'scroll', st
      @

    _createItem: ($el, prop, propHandler) ->
      switch ($.type propHandler)
        when 'function'
          item = new ns.PointHooker $el, prop, propHandler
        when 'object'
          options =
            prop: prop
            val_start: propHandler.from.val
            val_end: propHandler.to.val
            st_start: propHandler.from.st
            st_end: propHandler.to.st
          item = new ns.LineHooker $el, options
      item

    hook: ($el, propHandlers) ->

      unless $el.size() then return @
      $.each propHandlers, (prop, propHandler) =>
        item = @_createItem $el, prop, propHandler
        @bind 'scroll', (scrollTop) ->
          item.update scrollTop
        item.update $win.scrollTop()
        @_items.push item
      @


  # ============================================================

  # globalify

  $.ScrollHookerNs = ns
  $.ScrollHooker = ns.Manager


) jQuery, @, @document # encapsulate whole end

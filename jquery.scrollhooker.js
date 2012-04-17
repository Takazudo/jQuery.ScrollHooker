/*! jQuery.ScrollHooker - v0.0.0 -  4/18/2012
 * https://github.com/Takazudo/jQuery.ScrollHooker
 * Copyright (c) 2012 "Takazudo" Takeshi Takatsudo; Licensed MIT */

(function() {
  var __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var $win, log, ns;
    $win = $(window);
    log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return typeof console !== "undefined" && console !== null ? console.log.apply(console, args) : void 0;
    };
    ns = {};
    ns.parseUnit = function(val) {
      if (($.type(val)) === 'number') return null;
      return val.replace(/^[\-|\d|\.]+/, '');
    };
    ns.parseNum = function(val) {
      if (($.type(val)) === 'number') return val;
      return (val.replace(/[^\d]*$/, '')) * 1;
    };
    ns.normalizeNum = function(num, cutDecimal) {
      if (cutDecimal) {
        return Math.round(num);
      } else {
        return (Math.round(num * 100)) / 100;
      }
    };
    ns.testValsCompatibility = function(val1, val2) {
      var val1_type, val1_unit, val2_type, val2_unit;
      val1_type = $.type(val1);
      val2_type = $.type(val2);
      if ((val1_type === 'number') && (val2_type === 'number')) return true;
      if (($.type(val1)) !== ($.type(val2))) return false;
      val1_unit = ns.parseUnit(val1);
      val2_unit = ns.parseUnit(val2);
      if (val1_unit !== val2_unit) return false;
      return true;
    };
    ns.Event = (function() {

      function Event() {
        this._callbacks = {};
      }

      Event.prototype.bind = function(ev, callback) {
        var evs, name, _base, _i, _len;
        evs = ev.split(' ');
        for (_i = 0, _len = evs.length; _i < _len; _i++) {
          name = evs[_i];
          (_base = this._callbacks)[name] || (_base[name] = []);
          this._callbacks[name].push(callback);
        }
        return this;
      };

      Event.prototype.trigger = function() {
        var args, callback, ev, list, _i, _len, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        ev = args.shift();
        list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
        if (!list) return;
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          callback = list[_i];
          if (callback.apply(this, args) === false) break;
        }
        return this;
      };

      Event.prototype.unbind = function(ev, callback) {
        var cb, i, list, _len, _ref;
        if (!ev) {
          this._callbacks = {};
          return this;
        }
        list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
        if (!list) return this;
        if (!callback) {
          delete this._callbacks[ev];
          return this;
        }
        for (i = 0, _len = list.length; i < _len; i++) {
          cb = list[i];
          if (!(cb === callback)) continue;
          list = list.slice();
          list.splice(i, 1);
          this._callbacks[ev] = list;
          break;
        }
        return this;
      };

      return Event;

    })();
    ns.LineHooker = (function() {

      function LineHooker($el, options) {
        var distance, o, time;
        this.$el = $el;
        this.options = options;
        o = this.options;
        if (!ns.testValsCompatibility(o.val_start, o.val_end)) {
          log("LineHooker detected invalid value combination: " + o.val_start + ", " + o.val_end);
          return this;
        }
        this._unit = ns.parseUnit(o.val_start);
        this._num_start = ns.parseNum(o.val_start);
        this._num_end = ns.parseNum(o.val_end);
        distance = this._num_end - this._num_start;
        time = o.st_end - o.st_start;
        this._speed = distance / time;
      }

      LineHooker.prototype._unitify = function(num) {
        var normalized, ret;
        if (this._unit) {
          normalized = ns.normalizeNum(num, this._unit === 'px');
          ret = "" + normalized + this._unit;
        } else {
          ret = ns.normalizeNum(num);
        }
        return ret;
      };

      LineHooker.prototype._isAbove = function(st) {
        return st < this.options.st_start;
      };

      LineHooker.prototype._isBelow = function(st) {
        return st > this.options.st_end;
      };

      LineHooker.prototype.update = function(scrollTop) {
        var newVal, o, scrolledDistance, st;
        if (this.$el.is(':hidden')) return this;
        st = scrollTop;
        o = this.options;
        newVal = null;
        if (this._isAbove(st)) {
          newVal = this._unitify(this._num_start);
        } else if (this._isBelow(st)) {
          newVal = this._unitify(this._num_end);
        } else {
          scrolledDistance = st - o.st_start;
          newVal = this._unitify(this._num_start + (scrolledDistance * this._speed));
        }
        if (newVal !== this._lastVal) {
          this.$el.css(o.prop, newVal);
          this._lastVal = newVal;
        }
        return this;
      };

      return LineHooker;

    })();
    ns.PointHooker = (function() {

      function PointHooker($el, key, _handler) {
        this.$el = $el;
        this.key = key;
        this._handler = _handler;
      }

      PointHooker.prototype.update = function(scrollTop) {
        var val;
        val = this._handler(scrollTop, this.$el);
        if (this._lastVal === val) return this;
        if (this.key === 'className') {
          if (this._lastVal) this.$el.removeClass(this._lastVal);
          this.$el.addClass(val);
        } else {
          this.$el.css(this.key, val);
        }
        this._lastVal = val;
        return true;
      };

      return PointHooker;

    })();
    ns.Manager = (function(_super) {

      __extends(Manager, _super);

      function Manager() {
        if (!(this instanceof arguments.callee)) return new ns.Manager;
        Manager.__super__.constructor.apply(this, arguments);
        this._items = [];
        this._eventify();
      }

      Manager.prototype._eventify = function() {
        var _this = this;
        $win.scroll(function() {
          var st;
          st = $win.scrollTop();
          return _this.trigger('scroll', st);
        });
        return this;
      };

      Manager.prototype._createItem = function($el, prop, propHandler) {
        var item, options;
        switch ($.type(propHandler)) {
          case 'function':
            item = new ns.PointHooker($el, prop, propHandler);
            break;
          case 'object':
            options = {
              prop: prop,
              val_start: propHandler.from.val,
              val_end: propHandler.to.val,
              st_start: propHandler.from.st,
              st_end: propHandler.to.st
            };
            item = new ns.LineHooker($el, options);
        }
        return item;
      };

      Manager.prototype.hook = function($el, propHandlers) {
        var _this = this;
        if (!$el.size()) return this;
        $.each(propHandlers, function(prop, propHandler) {
          var item;
          item = _this._createItem($el, prop, propHandler);
          _this.bind('scroll', function(scrollTop) {
            return item.update(scrollTop);
          });
          item.update($win.scrollTop());
          return _this._items.push(item);
        });
        return this;
      };

      return Manager;

    })(ns.Event);
    $.ScrollHookerNs = ns;
    return $.ScrollHooker = ns.Manager;
  })(jQuery, this, this.document);

}).call(this);

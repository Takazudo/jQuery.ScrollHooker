/*! jQuery.tinyscroller - v0.3.0 -  4/14/2012
 * https://github.com/Takazudo/jQuery.tinyscroller
 * Copyright (c) 2012 "Takazudo" Takeshi Takatsudo; Licensed MIT */

(function() {
  var __slice = Array.prototype.slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var $doc, $win, abs, min, ns, round;
    ns = {};
    $win = $(window);
    $doc = $(document);
    round = Math.round;
    min = Math.min;
    abs = Math.abs;
    ns.yOf = function(el) {
      var y;
      y = 0;
      while (el.offsetParent) {
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return y;
    };
    ns.isHash = function(str) {
      return /^#.+$/.test(str);
    };
    ns.getWhereTo = function(el) {
      var $el;
      $el = $(el);
      return ($el.data('scrollto')) || ($el.attr('href'));
    };
    ns.calcY = function(target) {
      var $target, y;
      if (($.type(target)) === 'number') return target;
      if (($.type(target)) === 'string') {
        if (!ns.isHash(target)) return false;
        $target = $doc.find(target);
      } else {
        $target = $(target);
      }
      if (!$target.size()) return null;
      y = ns.yOf($target[0]);
      return y;
    };
    ns.scrollTop = function() {
      return $doc.scrollTop() || document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0;
    };
    ns.ua = (function() {
      var evalEach, ret, ua;
      ret = {};
      ua = navigator.userAgent;
      evalEach = function(keys) {
        var matchesAny;
        matchesAny = false;
        $.each(keys, function(i, current) {
          var expr;
          expr = new RegExp(current, 'i');
          if (Boolean(ua.match(expr))) {
            ret[current] = true;
            matchesAny = true;
          } else {
            ret[current] = false;
          }
          return true;
        });
        return matchesAny;
      };
      if (evalEach(['iphone', 'ipod', 'ipad'] || evalEach(['android']))) {
        ret.mobile = true;
      }
      return ret;
    })();
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

      Event.prototype.one = function(ev, callback) {
        return this.bind(ev, function() {
          this.unbind(ev, arguments.callee);
          return callback.apply(this, arguments);
        });
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
    ns.Scroller = (function(_super) {
      var eventNames;

      __extends(Scroller, _super);

      eventNames = ['scrollstart', 'scrollend', 'scrollcancel'];

      Scroller.prototype.options = {
        speed: 30,
        maxStep: 2000,
        slowdownRate: 3,
        changehash: true,
        userskip: true,
        selector: 'a[href^=#]:not(.apply-noscroll)'
      };

      function Scroller(options) {
        this._stepToNext = __bind(this._stepToNext, this);        if (!(this instanceof arguments.callee)) return new ns.Scroller(options);
        Scroller.__super__.constructor.apply(this, arguments);
        if (options) this.option(options);
        this._handleMobile();
      }

      Scroller.prototype._handleMobile = function() {
        if (!ns.ua.mobile) return this;
        this.options.userskip = false;
        return this;
      };

      Scroller.prototype._invokeScroll = function() {
        var _this = this;
        this.trigger('scrollstart', this._endY, this._reservedHash);
        this._scrollDefer.then(function() {
          if (_this.options.changehash && _this._reservedHash) {
            location.hash = _this._reservedHash;
          }
          return _this.trigger('scrollend', _this._endY, _this._reservedHash);
        }, function() {
          return _this.trigger('scrollcancel', _this._endY, _this._reservedHash);
        }).always(function() {
          if (_this._reservedHash) _this._reservedHash = null;
          return _this._scrollDefer = null;
        });
        this._stepToNext();
        return this;
      };

      Scroller.prototype._stepToNext = function() {
        var docH, endDistance, nextY, o, offset, planA, planB, top, winH, _ref, _ref2, _ref3;
        top = ns.scrollTop();
        o = this.options;
        if (o.userskip && this._prevY && (top !== this._prevY)) {
          window.scrollTo(0, this._endY);
          if ((_ref = this._scrollDefer) != null) _ref.resolve();
          this._prevY = null;
          return this;
        }
        if (this._endY > top) {
          docH = $doc.height();
          winH = $win.height();
          planA = round((docH - top - winH) / o.slowdownRate);
          planB = round((this._endY - top) / o.slowdownRate);
          endDistance = min(planA, planB);
          offset = min(endDistance, o.maxStep);
          if (offset < 2) offset = 2;
        } else {
          offset = -min(abs(round((this._endY - top) / o.slowdownRate)), o.maxStep);
        }
        nextY = top + offset;
        window.scrollTo(0, nextY);
        this._prevY = nextY;
        if (this._cancelNext) {
          this._cancelNext = false;
          if ((_ref2 = this._scrollDefer) != null) _ref2.reject();
        } else if ((abs(top - self._endY) <= 1) || (ns.scrollTop() === top)) {
          window.scrollTo(0, this._endY);
          this._prevY = null;
          if ((_ref3 = this._scrollDefer) != null) _ref3.resolve();
        } else {
          setTimeout(this._stepToNext, o.speed);
        }
        return this;
      };

      Scroller.prototype.scrollTo = function(target) {
        var endY;
        if (ns.isHash(target)) this._reservedHash = target;
        endY = ns.calcY(target);
        if (endY === false) return this;
        this._endY = endY;
        this._scrollDefer = $.Deferred();
        this._invokeScroll();
        return this._scrollDefer;
      };

      Scroller.prototype.stop = function() {
        if (this._scrollDefer) this._cancelNext = true;
        return this;
      };

      Scroller.prototype.option = function(options) {
        var _this = this;
        if (!options) return this.options;
        this.options = $.extend({}, this.options, options);
        this._handleMobile();
        $.each(eventNames, function(i, eventName) {
          if (_this.options[eventName]) {
            _this.bind(eventName, _this.options[eventName]);
          }
          return true;
        });
        return this;
      };

      Scroller.prototype.live = function(selector) {
        var self;
        selector = selector || this.options.selector;
        self = this;
        $doc.on('click', selector, function(e) {
          e.preventDefault();
          return self.scrollTo(ns.getWhereTo(this));
        });
        return this;
      };

      return Scroller;

    })(ns.Event);
    $.fn.tinyscrollable = function(options) {
      var scroller;
      scroller = ns.Scroller(options);
      return this.each(function() {
        var $el;
        $el = $(this);
        $el.data('tinyscroller', scroller);
        if ($el.data('tinyscrollerattached')) return this;
        $el.on('click', function(e) {
          e.preventDefault();
          return scroller.scrollTo(ns.getWhereTo(this));
        });
        return $el.data('tinyscrollerattached', true);
      });
    };
    $.TinyscrollerNs = ns;
    return $.Tinyscroller = ns.Scroller;
  })(jQuery, this, this.document);

}).call(this);

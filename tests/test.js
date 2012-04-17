(function() {

  (function($, window, document) {
    var ns, wait;
    ns = $.ScrollHookerNs;
    wait = function(time) {
      return $.Deferred(function(defer) {
        return setTimeout(function() {
          return defer.resolve();
        }, time);
      });
    };
    QUnit.testDone(function() {});
    test('ns.normalizeNum', function() {
      var run;
      run = function(str, expected) {
        var res;
        res = ns.normalizeNum(str);
        return equal(res, expected, "" + str + " - " + res);
      };
      run(100.44444, 100.44);
      run(-100.44444, -100.44);
      run(100, 100);
      return run(-1, -1);
    });
    test('ns.normalizeNum cutDecimal', function() {
      var run;
      run = function(str, expected) {
        var res;
        res = ns.normalizeNum(str, true);
        return equal(res, expected, "" + str + " - " + res);
      };
      run(100.44444, 100);
      run(-100.44444, -100);
      run(100, 100);
      return run(-1, -1);
    });
    test('ns.parseUnit', function() {
      var run;
      run = function(str, expected) {
        var res;
        res = ns.parseUnit(str);
        return equal(res, expected, "" + str + " - " + res);
      };
      run('100px', 'px');
      run('-100px', 'px');
      run('100%', '%');
      run('-100%', '%');
      run('0.5s', 's');
      run('-0.5s', 's');
      run(100, null);
      return run(-100, null);
    });
    test('ns.parseNum', function() {
      var run;
      run = function(str, expected) {
        var res;
        res = ns.parseNum(str);
        equal(res, expected, "" + str + " - " + res);
        return equal($.type(res), 'number', 'result was number');
      };
      run('100px', 100);
      run('-100px', -100);
      run('100%', 100);
      run('-100%', -100);
      run('0.5s', 0.5);
      run('-0.5s', -0.5);
      run('100.5%', 100.5);
      run('-100.5%', -100.5);
      run(100, 100);
      return run(-100, -100);
    });
    return test('ns.testValsCompatibility', function() {
      var run;
      run = function(val1, val2, expected) {
        var res;
        res = ns.testValsCompatibility(val1, val2);
        return equal(res, expected, "" + val1 + " and " + val2 + " : " + expected);
      };
      run('100px', '200px', true);
      run('-100px', '200px', true);
      run('100px', '-200px', true);
      run('-100px', '-200px', true);
      run('100%', '200%', true);
      run('-100%', '200%', true);
      run('100%', '-200%', true);
      run('-100%', '-200%', true);
      run(100, 200, true);
      run(-100, 200, true);
      run(100, -200, true);
      run(-100, -200, true);
      run('100%', '200px', false);
      run('-100px', '200%', false);
      run('100%', '-200px', false);
      return run('-100%', '-200px', false);
    });
  })(jQuery, this, this.document);

}).call(this);

/**
 * grunt
 * This compiles coffee to js
 *
 * grunt: https://github.com/cowboy/grunt
 * grunt examples: https://github.com/Takazudo/gruntExamples
 */
module.exports = function(grunt){

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        ' <%= grunt.template.today("m/d/yyyy") %>\n' +
        ' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      lib: {
        src: [ '<banner:meta.banner>', '<config:coffee.lib.dest>' ],
        dest: '<config:coffee.lib.dest>'
      }
    },
    coffee: {
      lib: {
        files: [ 'jquery.scrollhooker.coffee' ],
        dest: 'jquery.scrollhooker.js'
      },
      test: {
        files: [ 'tests/test.coffee' ],
        dest: 'tests/test.js'
      },
      demo: {
        files: [ 'demos/1/coffee/script.coffee' ],
        dest: 'demos/1/js/script.js'
      }
    },
    bourbon: {
      demo: {
        src: 'demos/1/scss/style.scss',
        dest: 'demos/1/css/style.css'
      }
    },
    uglify: {
      lajax: {
        src: '<config:coffee.lib.dest>',
        dest: 'jquery.scrollhooker.min.js'
      }
    },
    watch: {
      lib: {
        files: [ '<config:coffee.lib.files>' ],
        tasks: 'coffee:lib concat ok'
      },
      test: {
        files: [ '<config:coffee.test.files>' ],
        tasks: 'coffee:test ok'
      },
      demo: {
        files: [
          '<config:bourbon.demo.src>',
          '<config:coffee.demo.files>'
        ],
        tasks: 'bourbon:demo coffee:demo ok'
      }
    }
  });

  grunt.loadTasks('gruntTasks');
  grunt.registerTask('default', 'coffee bourbon concat ok');

};

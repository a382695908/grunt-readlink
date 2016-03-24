/*
 * grunt-readlink
 * https://github.com/melot/readlink
 *
 * Copyright (c) 2016 aqiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp/']
    },
    copy:{
      tests: {
        files: [{
          expand: true,
          src: ['test/fixtures/*'],
          dest: 'tmp'
        }]
      }
    },

    // Configuration to be run (and then tested).
    readlink: {
      default_options: {
        options: {
          separator: '',
          punctuation: '',
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s"></script>',
          fileRegexpl: /<script.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim,
          fileReplace: function (scriptsOldArray, scriptsNewArray) {
            console.log("_________");
            console.log(scriptsOldArray);
            console.log("_________");
            console.log(scriptsNewArray);
            console.log("__________");

            return[scriptsOldArray[0],scriptsNewArray[1]];
            //return scriptsOldArray.concat(scriptsNewArray);
          },
          appRoot: 'tmp',
          relative: false
        },
        files: {
          'tmp/test/fixtures/123': ['test/fixtures/testing', 'test/fixtures/123'] //写入文件的地址，可以用正则表达式, 第一个添加到标签内容的前面，第二以及以后添加到标签内容后面
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    }/*,

    // Unit tests.
    nodeunit: {
      tests: ['test/!*_test.js']
    }*/

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['clean',"copy", 'readlink'/*, 'nodeunit'*/]);

  // By default, lint and run all tests.
  //grunt.registerTask('default', ['jshint', 'test']);

};

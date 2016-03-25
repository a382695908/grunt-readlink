/*
 * grunt-readlink
 * https://github.com/melot/readlink
 *
 * Copyright (c) 2016 aqiang
 * Licensed under the MIT license.
 */

'use strict';
var util = require('util');
var getScriptSrc = function(htmlstr, fileRegexpl){
  var reg = fileRegexpl;
  var arr = [];
  var tem;
  while(tem=reg.exec(htmlstr)){
    arr.push(tem[2]);
  }
  return arr;
};

var relativeFun = function(scriptsArray, options){
  return scriptsArray.map(function (filepath) {
    filepath = filepath.replace(options.appRoot, '');
    // If "relative" option is set, remove initial forward slash from file path
    if (options.relative) {
      filepath = filepath.replace(/^\//,'');
    }
    if (options.fileRef) {
      return options.fileRef(filepath);
    } else {
      return util.format(options.fileTmpl, filepath);
    }
  });
};

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('readlink', '读取标签内的文件内容，或者根据正则来匹配', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', ', //分割符
      startTag: '<!--SCRIPTS-->',
      endTag: '<!--SCRIPTS END-->',
      fileTmpl: '<script src="%s"></script>',
      fileRegexpl: /<script.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim,
      appRoot: '.tmp/public',
      relative: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {
      var scripts,
          page = '',
          newPage = '',
          start = -1,
          end = -1;

      // Create string tags
      var scriptsNewArray = f.orig.src;/*f.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else { return true; }
      });*/
      scripts = relativeFun(scriptsNewArray, options);
      grunt.file.expand({}, f.dest).forEach(function(dest){
        page = grunt.file.read(dest);
        start = page.indexOf(options.startTag);
        end = page.indexOf(options.endTag, start);

        if (start === -1 || end === -1 || start >= end) {
          return;
        } else {
          var padding ='';
          var ind = start - 1;
          while(/[^\S\n]/.test(page.charAt(ind))){
            padding += page.charAt(ind);
            ind -= 1;
          }
          var oldStrScript = page.substring(start + options.startTag.length, end);
          if(options.fileReplace){
            var scriptsOldArray = getScriptSrc(oldStrScript, options.fileRegexpl);
            var scriptsMerge = options.fileReplace(scriptsOldArray, scriptsNewArray, dest);
            scripts = relativeFun(scriptsMerge, options);
            oldStrScript = "";
          }
          newPage = page.substr(0, start + options.startTag.length + oldStrScript.length) +grunt.util.linefeed + padding + scripts.join(grunt.util.linefeed + padding) + grunt.util.linefeed + padding + page.substr(end);
          // Insert the scripts
          grunt.file.write(dest, newPage);
          grunt.log.writeln('File "' + dest + '" updated.');
        }
      });
    });








  });

};

"use strict";

var styles = require('ansi-styles');

module.exports.compoundStyle = function compoundStyle(styleList) {
  var open  = '';
  var close = '';
  styleList.forEach(function(style){
    open += styles[style].open;
  });
  styleList.reverse().forEach(function(style) {
    close += styles[style].close;
  });
  
  return {
    open: open, 
    close: close
  };
};
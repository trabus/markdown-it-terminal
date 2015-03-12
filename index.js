// var md            = require('markdown-it');
var terminal      = require('./lib/markdown-it-terminal');
var extend        = require('lodash-node/modern/object/extend');
var styles        = require('ansi-styles');
var compoundStyle = require('./lib/utils').compoundStyle;

module.exports = function terminal_plugin(md,options) {
  var defaultOptions = {
    code: styles.yellow,
    blockquote: compoundStyle(['gray','italic']),
    html: styles.gray,
    heading: compoundStyle(['green','bold']),
    firstHeading: compoundStyle(['magenta','underline','bold']),
    hr: styles.reset,
    listitem: styles.reset,
    table: styles.reset,
    paragraph: styles.reset,
    strong: styles.bold,
    em: styles.italic,
    codespan: styles.yellow,
    del: compoundStyle(['dim','gray','strikethrough']),
    link: styles.blue,
    href: compoundStyle(['blue','underline']),
    unescape: true
  };

  var opts = extend(defaultOptions, options);
  terminal(md,opts);
  // console.log(styles)
};
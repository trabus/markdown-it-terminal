var md       = require('markdown-it');
var terminal = require('./lib/markdown-it-terminal');
var extend   = require('lodash-node/modern/object/extend');
var chalk    = require('chalk');

module.exports = function terminal_plugin(md,options) {
  var defaultOptions = {
    code: chalk.yellow,
    blockquote: chalk.gray.italic,
    html: chalk.gray,
    heading: chalk.green.bold,
    firstHeading: chalk.magenta.underline.bold,
    hr: chalk.reset,
    listitem: chalk.reset,
    table: chalk.reset,
    paragraph: chalk.reset,
    strong: chalk.bold,
    em: chalk.italic,
    codespan: chalk.yellow,
    del: chalk.dim.gray.strikethrough,
    link: chalk.blue,
    href: chalk.blue.underline
  };

  var opts = extend(defaultOptions, options);
  terminal(md,opts);
};
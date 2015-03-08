"use strict";

var cardinal        = require('cardinal');
var assign          = require('../node_modules/markdown-it/lib/common/utils').assign;
var unescapeAll     = require('../node_modules/markdown-it/lib/common/utils').unescapeAll;
var escapeHtml      = require('../node_modules/markdown-it/lib/common/utils').escapeHtml;

module.exports = function(md, options) {
  md.renderer.rules.blockquote_open  = function () { 
    return '\n' + getAnsi(options.blockquote).open;
  };
  md.renderer.rules.blockquote_close = function () {
    return getAnsi(options.blockquote).close + '\n\n'; 
  };


  md.renderer.rules.code_block = function (tokens, idx /*, options, env */) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
  };
  md.renderer.rules.code_inline = function (tokens, idx /*, options, env */) {
    return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
  };


  md.renderer.rules.fence = function (tokens, idx, options /*, env, self*/) {
    var token = tokens[idx];
    var langPrefix = options.langPrefix;
    var langName = '';
    var highlighted;
    var codeAnsi = getAnsi(options.code);
    if (token.params) {
      langName = escapeHtml(unescapeAll(token.params.split(/\s+/g)[0]));
    }

    if (options.highlight && (langName === 'javascript' || langName === 'js')) {
      highlighted = cardinal.highlight(token.content, langName) || escapeHtml(token.content);
    } else {
      highlighted = escapeHtml(token.content);
    }

    return '\n' + codeAnsi.open + highlighted + codeAnsi.close + '\n\n';
  };

  md.renderer.rules.heading_open = function (tokens, idx /*, options, env */) {
    if (tokens[idx].hLevel === 1) {
      return getAnsi(options.firstHeading).close + '\n';
    }
    return getAnsi(options.heading).close + '\n';
  };
  md.renderer.rules.heading_close = function (tokens, idx /*, options, env */) {
    if (tokens[idx].hLevel === 1) {
      return getAnsi(options.firstHeading).close + '\n';
    }
    return getAnsi(options.heading).close + '\n';
  };


  md.renderer.rules.hr = function (tokens, idx, options /*, env */) {
    return (options.xhtmlOut ? '<hr />\n' : '<hr>\n');
  };


  md.renderer.rules.bullet_list_open   = function () { return ''; };
  md.renderer.rules.bullet_list_close  = function () { return '\n'; };
  md.renderer.rules.list_item_open     = function (tokens, idx /*, options, env */) {
    var next = tokens[idx + 1];
    if ((next.type === 'list_item_close') ||
        (next.type === 'paragraph_open' && next.tight)) {
      return tab() + getAnsi(options.listitem).open + '* ';
    }
  };
  md.renderer.rules.list_item_close    = function () { return getAnsi(options.listitem).close + '\n'; };
  md.renderer.rules.ordered_list_open  = function (tokens, idx /*, options, env */) {
    if (tokens[idx].order > 1) {
      return '<ol start="' + tokens[idx].order + '">\n';
    }
    return '';
  };
  md.renderer.rules.ordered_list_close = function () { return '\n'; };


  md.renderer.rules.paragraph_open = function (tokens, idx /*, options, env */) {
    return tokens[idx].tight ? '' : getAnsi(options.paragraph).open;
  };
  md.renderer.rules.paragraph_close = function (tokens, idx /*, options, env */) {
    if (tokens[idx].tight === true) {
      return tokens[idx + 1].type.slice(-5) === 'close' ? '' : '\n';
    }
    return getAnsi(options.paragraph).close + '\n\n';
  };


  md.renderer.rules.link_open = function (tokens, idx /*, options, env */) {
    var title = tokens[idx].title ? (' title="' + escapeHtml(tokens[idx].title) + '"') : '';
    var target = tokens[idx].target ? (' target="' + escapeHtml(tokens[idx].target) + '"') : '';
    return '<a href="' + escapeHtml(tokens[idx].href) + '"' + title + target + '>';
  };
  md.renderer.rules.link_close = function (/* tokens, idx, options, env */) {
    return '</a>';
  };


  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var src = ' src="' + escapeHtml(tokens[idx].src) + '"';
    var title = tokens[idx].title ? (' title="' + escapeHtml(tokens[idx].title) + '"') : '';
    var alt = ' alt="' + self.renderInlineAsText(tokens[idx].tokens, options, env) + '"';
    var suffix = options.xhtmlOut ? ' /' : '';
    return '<img' + src + alt + title + suffix + '>';
  };


  md.renderer.rules.table_open  = function () { return '<table>\n'; };
  md.renderer.rules.table_close = function () { return '</table>\n'; };
  md.renderer.rules.thead_open  = function () { return '<thead>\n'; };
  md.renderer.rules.thead_close = function () { return '</thead>\n'; };
  md.renderer.rules.tbody_open  = function () { return '<tbody>\n'; };
  md.renderer.rules.tbody_close = function () { return '</tbody>\n'; };
  md.renderer.rules.tr_open     = function () { return '<tr>'; };
  md.renderer.rules.tr_close    = function () { return '</tr>\n'; };
  md.renderer.rules.th_open     = function (tokens, idx /*, options, env */) {
    if (tokens[idx].align) {
      return '<th style="text-align:' + tokens[idx].align + '">';
    }
    return '<th>';
  };
  md.renderer.rules.th_close    = function () { return '</th>'; };
  md.renderer.rules.td_open     = function (tokens, idx /*, options, env */) {
    if (tokens[idx].align) {
      return '<td style="text-align:' + tokens[idx].align + '">';
    }
    return '<td>';
  };
  md.renderer.rules.td_close    = function () { return '</td>'; };


  md.renderer.rules.strong_open  = function () { return getAnsi(options.strong).open; };
  md.renderer.rules.strong_close = function () { return getAnsi(options.strong).close; };


  md.renderer.rules.em_open  = function () { return getAnsi(options.em).open; };
  md.renderer.rules.em_close = function () { return getAnsi(options.em).close; };


  md.renderer.rules.s_open  = function () { return '<s>'; };
  md.renderer.rules.s_close = function () { return '</s>'; };


  md.renderer.rules.hardbreak = function (tokens, idx, options /*, env */) {
    return options.xhtmlOut ? '<br />\n' : '<br>\n';
  };
  md.renderer.rules.softbreak = function (tokens, idx, options /*, env */) {
    return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
  };


  md.renderer.rules.text = function (tokens, idx /*, options, env */) {
    return escapeHtml(tokens[idx].content);
  };


  md.renderer.rules.html_block = function (tokens, idx /*, options, env */) {
    return tokens[idx].content;
  };
  md.renderer.rules.html_inline = function (tokens, idx /*, options, env */) {
    return tokens[idx].content;
  };
};

function changeToOrdered(text) {
  var i = 1;
  return text.split('\n').reduce(function (acc, line) {
    if (!line) return acc;
    return acc + tab() + (i++) + '.' + line.substring(tab().length + 1) + '\n';
  }, '');
}
function tab(size) {
  size = size || 4;
  return (new Array(size)).join(' ');
}
function getAnsi(renderer) {
  // render with empty string then isolate open and close values
  var rendered = renderer(' ');
  return {
      whole: rendered,
      open:  rendered.substr(0,rendered.indexOf(' ')),
      close: rendered.substr(rendered.indexOf(' ')+1) 
    };
}
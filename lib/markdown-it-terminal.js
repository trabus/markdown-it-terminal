"use strict";

var md              = require('markdown-it');
var assign          = require('node_modules/markdown-it/lib/common/utils').assign;
var unescapeAll     = require('node_modules/markdown-it/lib/common/utils').unescapeAll;
var escapeHtml      = require('node_modules/markdown-it/lib/common/utils').escapeHtml;

module.exports = MarkdownTerminal;

function MarkdownTerminal(options, highlightOptions) {
  this.md = md();
  this.options = options || {};
  this.highlightOptions = highlightOptions || {};
  this.init();
  return this.md;
}

MarkdownTerminal.prototype.init = function() {
  this.md.renderer.rules.blockquote_open  = function () { return '<blockquote>\n'; };
  this.md.renderer.rules.blockquote_close = function () { return '</blockquote>\n'; };


  this.md.renderer.rules.code_block = function (tokens, idx /*, options, env */) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
  };
  this.md.renderer.rules.code_inline = function (tokens, idx /*, options, env */) {
    return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
  };


  this.md.renderer.rules.fence = function (tokens, idx, options /*, env, self*/) {
    var token = tokens[idx];
    var langClass = '';
    var langPrefix = options.langPrefix;
    var langName = '';
    var highlighted;

    if (token.params) {
      langName = escapeHtml(unescapeAll(token.params.split(/\s+/g)[0]));
      langClass = ' class="' + langPrefix + langName + '"';
    }

    if (options.highlight) {
      highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
    } else {
      highlighted = escapeHtml(token.content);
    }


    return  '<pre><code' + langClass + '>' +
          highlighted +
          '</code></pre>\n';
  };


  this.md.renderer.rules.heading_open = function (tokens, idx /*, options, env */) {
    return '<h' + tokens[idx].hLevel + '>';
  };
  this.md.renderer.rules.heading_close = function (tokens, idx /*, options, env */) {
    return '</h' + tokens[idx].hLevel + '>\n';
  };


  this.md.renderer.rules.hr = function (tokens, idx, options /*, env */) {
    return (options.xhtmlOut ? '<hr />\n' : '<hr>\n');
  };


  this.md.renderer.rules.bullet_list_open   = function () { return '<ul>\n'; };
  this.md.renderer.rules.bullet_list_close  = function () { return '</ul>\n'; };
  this.md.renderer.rules.list_item_open     = function (tokens, idx /*, options, env */) {
    var next = tokens[idx + 1];
    if ((next.type === 'list_item_close') ||
        (next.type === 'paragraph_open' && next.tight)) {
      return '<li>';
    }
    return '<li>\n';
  };
  this.md.renderer.rules.list_item_close    = function () { return '</li>\n'; };
  this.md.renderer.rules.ordered_list_open  = function (tokens, idx /*, options, env */) {
    if (tokens[idx].order > 1) {
      return '<ol start="' + tokens[idx].order + '">\n';
    }
    return '<ol>\n';
  };
  this.md.renderer.rules.ordered_list_close = function () { return '</ol>\n'; };


  this.md.renderer.rules.paragraph_open = function (tokens, idx /*, options, env */) {
    return tokens[idx].tight ? '' : '<p>';
  };
  this.md.renderer.rules.paragraph_close = function (tokens, idx /*, options, env */) {
    if (tokens[idx].tight === true) {
      return tokens[idx + 1].type.slice(-5) === 'close' ? '' : '\n';
    }
    return '</p>\n';
  };


  this.md.renderer.rules.link_open = function (tokens, idx /*, options, env */) {
    var title = tokens[idx].title ? (' title="' + escapeHtml(tokens[idx].title) + '"') : '';
    var target = tokens[idx].target ? (' target="' + escapeHtml(tokens[idx].target) + '"') : '';
    return '<a href="' + escapeHtml(tokens[idx].href) + '"' + title + target + '>';
  };
  this.md.renderer.rules.link_close = function (/* tokens, idx, options, env */) {
    return '</a>';
  };


  this.md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var src = ' src="' + escapeHtml(tokens[idx].src) + '"';
    var title = tokens[idx].title ? (' title="' + escapeHtml(tokens[idx].title) + '"') : '';
    var alt = ' alt="' + self.renderInlineAsText(tokens[idx].tokens, options, env) + '"';
    var suffix = options.xhtmlOut ? ' /' : '';
    return '<img' + src + alt + title + suffix + '>';
  };


  this.md.renderer.rules.table_open  = function () { return '<table>\n'; };
  this.md.renderer.rules.table_close = function () { return '</table>\n'; };
  this.md.renderer.rules.thead_open  = function () { return '<thead>\n'; };
  this.md.renderer.rules.thead_close = function () { return '</thead>\n'; };
  this.md.renderer.rules.tbody_open  = function () { return '<tbody>\n'; };
  this.md.renderer.rules.tbody_close = function () { return '</tbody>\n'; };
  this.md.renderer.rules.tr_open     = function () { return '<tr>'; };
  this.md.renderer.rules.tr_close    = function () { return '</tr>\n'; };
  this.md.renderer.rules.th_open     = function (tokens, idx /*, options, env */) {
    if (tokens[idx].align) {
      return '<th style="text-align:' + tokens[idx].align + '">';
    }
    return '<th>';
  };
  this.md.renderer.rules.th_close    = function () { return '</th>'; };
  this.md.renderer.rules.td_open     = function (tokens, idx /*, options, env */) {
    if (tokens[idx].align) {
      return '<td style="text-align:' + tokens[idx].align + '">';
    }
    return '<td>';
  };
  this.md.renderer.rules.td_close    = function () { return '</td>'; };


  this.md.renderer.rules.strong_open  = function () { return '<strong>'; };
  this.md.renderer.rules.strong_close = function () { return '</strong>'; };


  this.md.renderer.rules.em_open  = function () { return '<em>'; };
  this.md.renderer.rules.em_close = function () { return '</em>'; };


  this.md.renderer.rules.s_open  = function () { return '<s>'; };
  this.md.renderer.rules.s_close = function () { return '</s>'; };


  this.md.renderer.rules.hardbreak = function (tokens, idx, options /*, env */) {
    return options.xhtmlOut ? '<br />\n' : '<br>\n';
  };
  this.md.renderer.rules.softbreak = function (tokens, idx, options /*, env */) {
    return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
  };


  this.md.renderer.rules.text = function (tokens, idx /*, options, env */) {
    return escapeHtml(tokens[idx].content);
  };


  this.md.renderer.rules.html_block = function (tokens, idx /*, options, env */) {
    return tokens[idx].content;
  };
  this.md.renderer.rules.html_inline = function (tokens, idx /*, options, env */) {
    return tokens[idx].content;
  };
};
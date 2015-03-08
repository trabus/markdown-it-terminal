'use strict';


var path     = require('path');
var expect   = require('chai').expect;

/*eslint-env mocha*/

describe('markdown-it-terminal', function () {
  var md;
  beforeEach(function () {
    md = require('markdown-it')().use(require('../'));
  });
  
  it('renders basic markdown', function(){
    expect(md.render('# foo\n__bold__ **words**\n* un\n* ordered\n* list'))
      .to.equal('\u001b[22m\u001b[24m\u001b[39m\nfoo\u001b[22m\u001b[24m\u001b[39m\n\u001b[0m\u001b[1mbold\u001b[22m \u001b[1mwords\u001b[22m\u001b[0m\n\n   \u001b[0m* un\u001b[0m\n   \u001b[0m* ordered\u001b[0m\n   \u001b[0m* list\u001b[0m\n\n');
  });

});
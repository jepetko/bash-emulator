var bash = require('../js/bash.js');
var CmdParser = bash.CmdParser;
var assert = require('assert');
var should = require('should');

var testData = {
    'echo bye' : {
        result : [
            {
                cmd : 'echo',
                args : ['bye']
            }
        ]
    },
    'cat hello.txt | grep hello' : {
        result : [
            {
                cmd : 'cat',
                args : ['hello.txt']
            },
            {
                cmd : 'grep',
                args : ['hello']
            }
        ]
    },
    'cat hello.txt | grep "hello guys"' : {
        result : [
            {
                cmd : 'cat',
                args : ['hello.txt']
            },
            {
                cmd : 'grep',
                args : ['"hello guys"']
            }
        ]
    },
    'cat hello.txt | grep -e [0-9]*' : {
        result : [
            {
                cmd : 'cat',
                args : ['hello.txt']
            },
            {
                cmd : 'grep',
                options : ['-e'],
                args : ['[0-9]*']
            }
        ]
    },
    'cd /home/user' : {
        result : [
            {
                cmd : 'cd',
                args : ['/home/user']
            }
        ]
    },
    'ls -la' : {
        result : [
            {
                cmd : 'ls',
                options : ['-la']
            }
        ]
    }
};

describe('CmdParser', function() {
     describe('#parse()', function() {
         for(var inputString in testData) {
             it('should parse bash input <' + inputString + '>', (function(input) {
                 return function() {
                     var cmdParser = new CmdParser();

                     var shouldResult = testData[input]['result'];
                     console.log('input: ' + input);
                     var totalResult = cmdParser.parse(input);
                     console.log('totalResult: ' + totalResult);

                     //test the shared scope
                     var scopeResult = cmdParser.consumeScopeResult();
                     (scopeResult.length).should.be.greaterThan(0);

                     for (var i = 0; i < shouldResult.length; i++) {
                         var shouldResultPart = shouldResult[i];
                         var scopeResultPart = scopeResult[i];

                         scopeResultPart.cmd.should.be.ok;
                         scopeResultPart.cmd.should.equal(shouldResultPart.cmd);

                         for (var j = 0; j < scopeResultPart.options.length; j++) {
                             scopeResultPart.options[j].should.equal(shouldResultPart.options[j]);
                         }
                         for (var j = 0; j < scopeResultPart.args.length; j++) {
                             scopeResultPart.args[j].should.equal(shouldResultPart.args[j]);
                         }
                     }
                 }
             })(inputString));
         }
    });
});


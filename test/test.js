var bash = require("../js/bash.js");
var CmdParser = bash.CmdParser;
var assert = require("assert");

var testData = {
    "echo bye" : {
        result : [
            {
                cmd : "echo",
                args : ["bye"]
            }
        ]
    },
    'cat hello.txt | grep hello' : {
        result : [
            {
                cmd : "cat",
                args : ["hello.txt"]
            },
            {
                cmd : "grep",
                args : ["hello"]
            }
        ]
    }
};

describe('CmdParser', function() {
     describe('#parse()', function() {
         for(var inputString in testData) {
             var shouldResult = testData[inputString]['result'];

             it('should parse bash input <' + inputString + '>', function() {
                 var cmdParser = new CmdParser();

                 var totalResult = cmdParser.parse(inputString);

                 //test the shared scope
                 var scope = cmdParser.getScope();
                 var scopeResult = scope.result;

                 console.log(scopeResult.length);

                 for(var i=0; i<scopeResult.length; i++) {
                     var shouldResultPart = shouldResult[i];
                     var scopeResultPart = scopeResult[i];

                     assert.equal(shouldResultPart.cmd, scopeResultPart.cmd);

                     for(var j=0;j<scopeResultPart.options.length; j++) {
                         assert.equal(shouldResultPart.options[j], scopeResultPart.options[j]);
                     }
                     for(var j=0;j<scopeResultPart.args.length; j++) {
                         assert.equal(shouldResultPart.args[j], scopeResultPart.args[j]);
                     }
                 }

                 cmdParser.consumeScopeResult();
             });
         }
     })
});


var jisonParser = require("./jison-parser").parser;
var scope = jisonParser.yy;

exports.CmdParser = (function(jisonParser, scope) {
    return function() {
        this.parse = function(input) {
            return jisonParser.parse(input);
        };
        this.getScope = function() {
            return scope;
        };

        this.consumeScopeResult = function() {
            scope.result = [];
        };
    };
})(jisonParser, scope);



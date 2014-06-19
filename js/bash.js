var jisonParser = require("./jison-parser").parser;
var scope = jisonParser.yy;

exports.CmdParser = (function(jisonParser, scope) {
    return function() {
        this.scope = scope;
        this.parse = function(input) {
            var parseResult = jisonParser.parse(input);
            return parseResult;
        };
        this.consumeScopeResult = function() {
            var scopeResult = scope.result.slice(0);
            this.scope.result = [];
            return scopeResult;
        };
    };
})(jisonParser, scope);



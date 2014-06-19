/* lexical grammar */
%lex

%%
\s+                                                                         /* skip whitespace */
\|                                                                          return '|';
/*[a-zA-Z\._]+                                                              return 'COMMAND';*/
(ls|cd|cat|echo|grep|su)                                                    return 'COMMAND';
^\-(\-)?[a-z\-0-9]+                                                         return 'OPTION';
([a-zA-Z0-9\._\-\\\/\[\]\+\(\)\*]+|(\")?[a-zA-Z0-9\._\-\s]+(\")?)           return 'ARG';
\n                                                                          return 'BREAK';
<<EOF>>                                                                     return 'EOF';

/lex

/* operator associations and precedence */

%start program

/* language grammar */
%%

program
    : expression EOF
        {   typeof console !== 'undefined' ? console.log($1) : print($1);
            return $1; };

expression
    : COMMAND
               {p("Command",$1); $$ = $1; addResult(yy); lastResult(yy).cmd = $$; }
    | expression option
        {$$ = $1 + ' <opt> ' + $2;}
        | expression option arg
        {$$ = $1 + ' <opt> ' + $2 + ' <arg> ' + $3;}
    | expression arg
        {$$ = $1 + ' <arg> ' + $2;}
    | expression '|' expression
        {$$ = $1 + ' <|> ' + $3;};
option
    : OPTION
        {p("Option",$1); $$ = $1; lastResult(yy).options.push($$); }
    | option option
        {$$ = $1 + ' ... ' + $2;};

arg
    : ARG
        {p("Argument",$1); $$ = $1; lastResult(yy).args.push(trim($$)); }
    | arg arg
        {$$ = $1 + ' ... ' + $2;};
%%

function initYy(yy) {
    if(typeof yy === 'undefined') {
        yy = {};
    }
    if(typeof yy.result === 'undefined') {
        yy.result = [];
    }
}

function clearYy(yy) {
    if(yy.result) {
        yy.result = [];
    }
}

function addResult(yy) {
    initYy(yy);
    yy.result.push({
        cmd: null,
        options : [],
        args : []
    });
}

function lastResult(yy) {
    initYy(yy);
    if(yy.result.length == 0) {
        addResult(yy);
    }
    return yy.result[yy.result.length-1];
}

function trim(str) {
    return str.replace(/^\s+/g,'').replace(/\s$/g,'');
}

function p(prefix, val) {
   var text = prefix + ": " + val;
   if(typeof console !== 'undefined') console.log(text);
}
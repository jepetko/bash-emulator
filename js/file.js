var jsdom = require('jsdom');
var formatter = require('./utils/formatter.js');
$ = require('jquery')(jsdom.jsdom().createWindow());
Formatter = formatter.Formatter;

exports.File = _File = function(obj) {

    _File.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.name = '';
    this.type = 'd';
    this.p = '775';
    this.created = this.lastModified = new Date(1979,0,1);
    this.parent = null;
    this.children = [];
    this.owner = 'root';
    this.group = 'root';
    this.size = 0;

    $.extend(this, obj);

    this.isRoot = function() {
        return (this.parent === null);
    };

    this.hasChildren = function() {
        return (this.children && this.children.length > 0);
    };

    this.isDir = function() {
        return this.type == 'd';
    };

    this.isFile = function() {
        return this.type == '-';
    };

    this.isLink = function() {
        return this.type == 'l';
    };

    this.isExecutable = function() {
        var p = parseInt(this.p.charAt(arguments[0] || 0));
        return (p & 1) === 1;
    };

    this.isReadable = function() {
        var p = parseInt(this.p.charAt(arguments[0] || 0));
        return (p & 4) === 4;
    };

    this.isWritable = function() {
        var p = parseInt(this.p.charAt(arguments[0] || 0));
        return (p & 2) === 2;
    };

    this.getPermissionsStr = function() {
        var str = '';
        for(var i=0;i<3;i++) {
            str += this.isReadable(i) ? 'r' : '-';
            str += this.isWritable(i) ? 'w' : '-';
            str += this.isExecutable(i) ? 'x' : '-';
        }
        return str;
    };

    this.addFile = function(obj) {
        if($.isArray(obj)) {
            for(var i=0;i<obj.length;i++) {
                this.children.push(new _File(obj[i]));
            }
        } else {
            this.children[this.children.length] = new _File(obj);
        }
    };

    this.removeFile = function(name) {
        for(var i=0;i<this.children.length; i++) {
            if(this.children[i].name === name) {
                this.children.splice(i,1);
                break;
            }
        }
    };

    this.getChild = function(name) {
        for(var i=0;i<this.children.length; i++) {
            if(this.children[i].name === name) {
                return this.children[i];
            }
        }
        return null;
    };

    this.ls = function(options) {
        var all = (options && options.indexOf('a') !== -1);
        var long = (options && options.indexOf('l') !== -1);

        var ch = (all ? [ new _File({name: '.', type: 'd'}),
                          new _File({name: '..', type: 'd'}) ] : []).concat(this.children);
        ch.sort(function(a,b) {
            var _a = a.name, _b = b.name;
            if(_a.indexOf('.') === 0)
            _a = _a.replace(/^\./, '');
            if(_b.indexOf('.') === 0)
            _b = _b.replace(/^\./, '');
            if(_a > _b)
                return 1;
            if(_a < _b)
                return -1;
            return 0;
        });
        var arr = [];
        $.each(ch, (function(self, arr) {
            var formatter = new Formatter();
            return function(idx,f) {
                if (!all && f.name.indexOf('.') === 0) return;

                var el = [];
                if (long) {
                    el.push(  f.type + f.getPermissionsStr(),
                              f.owner,
                              (f.group || f.owner),
                              ((f.type === 'd') ? 4096 : f.size),
                             _File.MONTHS[f.lastModified.getMonth()] + ' ' + formatter.pad(''+f.lastModified.getDate(),2,'l','0') + ' ' + f.lastModified.getFullYear() );
                }
                el.push(f.name);
                arr.push(el);
            };
        })(this, arr));

        var str = '';
        if(long) {
            str = new Formatter().formatAsTable(arr, '\n');
        } else {
            str = new Formatter().formatAsLine(arr, ' ');
        }
        return str;
    };

    this.mkdir = function(obj) {
        obj.type = 'd';
        this.addFile(new _File(obj));
        return this;
    };

    this.touch = function(name) {
        var ch = this.getChild(name);
        if(ch === null) {
            this.addFile(new _File({name : name}));
        } else {
            ch.lastModified = new Date();
        }
        return this;
    };

    this.rm = function(name) {

    };
};
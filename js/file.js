var jsdom = require('jsdom');
$ = require('jquery')(jsdom.jsdom().createWindow());

exports.File = _File = function(obj) {

    this.name = '';
    this.type = 'd';
    this.p = '';
    this.created = this.lastModified = new Date(1070,0,1);
    this.parent = null;
    this.children = [];
    this.owner = 'root';
    this.group = 'root';

    $.extend(this, obj);

    this.isRoot = function() {
        return (this.parent == null);
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

    this.addFile = function(obj) {
        if($.isArray(obj)) {
            this.children = this.children.concat(obj);
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

    this.ls = function() {
        var ch = [].concat(this.children);
        ch.sort(function(a,b) {
            if(a.name > b.name)
                return 1;
            if(a.name < b.name)
                return -1;
            return 0;
        });
        var str = '';
        $.each(ch, function(idx,f) {
            str += f.name + ((idx < ch.length-1) ? ' ' : '');
        });
        return str;
    };

    this.mkdir = function(obj) {
        obj['type'] = 'd';
        this.addFile(new _File(obj));
        return this;
    };

    this.touch = function() {
        obj['type'] = '-';
        this.addFile(new _File(obj));
        return this;
    };

    this.rm = function(name) {

    }
};
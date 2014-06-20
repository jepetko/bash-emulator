var file = require('../js/file.js');

var File = file.File;
var should = require('should');

var supportedMethods = ['isRoot', 'hasChildren', 'isDir',
                        'isFile', 'isLink', 'isExecutable', 'isReadable', 'isWritable'];

describe('File', function () {
    describe('methods', function () {
        var file = new File();
        for(var i=0; i<supportedMethods.length; i++) {
            var method = supportedMethods[i];
            it('responds to method <' + method + '>', (function(file,method) {
                return function() {
                    (typeof file[method]).should.be.equal('function');
                };
            })(file, method));
        }
    });

    describe('#addFile', function() {
        var file = new File();
        it('adds a new file', function() {
            file.addFile( {name : 'file.txt', type : '-', p : '664'} );
            (file.hasChildren()).should.be.true;
            var child = file.children[0];
            (child.name).should.equal('file.txt');
            (child.type).should.equal('-');
            (child.p).should.equal('664');
            (child.isExecutable()).should.be.false;
            (child.isReadable()).should.be.true;
            (child.isWritable()).should.be.true;
        });
    });

    describe('#removeFile', function() {
        var file = new File();
        it('removes a file', function() {
            file.addFile( {name : 'file.txt', type : '-', p : '664'} );
            $.each([{name: 'file2.txt', type : '-'}, {name: 'subdir', type: 'd'}], function(f) {
                file.addFile(f);
            });
            (file.hasChildren()).should.be.true;
            (file.children.length).should.equal(3);
            file.removeFile('file.txt');
            (file.children.length).should.equal(2);
        });
    });

    describe('#ls', function() {

        var file = new File();
        file.addFile([  {name: 'home', type: 'd'}, {name: 'etc', type:'d'}, {name: 'boot', type: 'd'},
            {name: 'temp', type: 'd'}, {name: 'var', type: 'd'}, {name: '.profile', type: '-'},
            {name: 'bin', type:'d'}, {name: 'test.txt', type: '-'}, {name: 'my_file', type: '-'}]);

        it('lists files with ls', function() {
            (file.ls()).should.equal('bin boot etc home my_file temp test.txt var');
        });
        it('lists files with ls -a', function() {
            (file.ls('-a')).should.equal('. .. bin boot etc home my_file .profile temp test.txt var');
        });
    });
});
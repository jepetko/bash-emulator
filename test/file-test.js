var file = require('../js/file.js');

var File = file.File;
var should = require('should');

var supportedMethods = ['isRoot', 'hasChildren', 'isDir',
                        'isFile', 'isSymLink', 'isExecutable', 'isReadable', 'isWritable'];

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
        describe('#addFile (file)', function() {
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
        describe('#addFile (link)', function() {
            var file = new File();
            file.addFile({name : 'target.txt', type : '-'});
            it('adds a new link', function() {
                file.addFile( {name : 'link.txt', type : 'l', target: 'target.txt'} );
                (file.children[1].name).should.equal('link.txt');
                (file.children[1].type).should.equal('l');
                (file.children[1].target).should.equal('target.txt');
            });
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
        var now = new Date();
        file.addFile([  {name: 'home',      type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: new Date(2011,0,3)},
                        {name: 'etc',       type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: now},
                        {name: 'boot',      type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: now},
                        {name: 'temp',      type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: now},
                        {name: 'var',       type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: now},
                        {name: '.profile',  type: '-', p: '644', owner: 'katarina', group: 'katarina', lastModified: now, size: 100},
                        {name: 'bin',       type: 'd', p: '775', owner: 'katarina', group: 'katarina', lastModified: now},
                        {name: 'test.txt',  type: '-', p: '664', owner: 'katarina', group: 'admins', lastModified: now, size: 25},
                        {name: 'my_file',   type: '-', p: '777', owner: 'root',     lastModified: now, size: 19},
                        {name: 'link.txt',  type: 'l', target: 'target.txt', size: 20}]);

        it('lists files with ls', function() {
            (file.ls()).should.equal('bin boot etc home link.txt my_file temp test.txt var');
        });
        it('lists files with ls -a', function() {
            (file.ls('-a')).should.equal('. .. bin boot etc home link.txt my_file .profile temp test.txt var');
        });

        var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()];
        var dayStr = now.getDate();
        if(dayStr < 10) dayStr = '0' + dayStr;
        var nowStr = monthName + ' ' + dayStr + ' ' + now.getFullYear();
        var defaultDateStr = 'Jan 01 1979';

        var shouldLongList =    'drwxrwxr-x root     root     4096 ' + defaultDateStr + ' .\n' +
                                'drwxrwxr-x root     root     4096 ' + defaultDateStr + ' ..\n' +
                                'drwxrwxr-x katarina katarina 4096 ' + nowStr + ' bin\n' +
                                'drwxrwxr-x katarina katarina 4096 ' + nowStr + ' boot\n' +
                                'drwxrwxr-x katarina katarina 4096 ' + nowStr + ' etc\n' +
                                'drwxrwxr-x katarina katarina 4096 Jan 03 2011 home\n' +
                                'lrwxrwxrwx root     root     20   ' + defaultDateStr + ' link.txt -> target.txt\n' +
                                '-rwxrwxrwx root     root     19   ' + nowStr + ' my_file\n' +
                                '-rw-r--r-- katarina katarina 100  ' + nowStr + ' .profile\n' +
                                'drwxrwxr-x katarina katarina 4096 ' + nowStr + ' temp\n' +
                                '-rw-rw-r-- katarina admins   25   ' + nowStr + ' test.txt\n' +
                                'drwxrwxr-x katarina katarina 4096 ' + nowStr + ' var';

        it('lists files with ls -la', function() {
            (file.ls('-la')).should.equal(shouldLongList);
        });
    });

    describe('#mkdir', function() {
        var file = new File();
        it('makes a new directory', function() {
            file.mkdir( {name : 'subdir', type : 'd'} );
            (file.hasChildren()).should.be.true;
            var child = file.children[0];
            (child.name).should.equal('subdir');
            (child.type).should.equal('d');
            (child.p).should.equal('775');  //todo: consider umask!
        });
    });

    describe('#touch', function() {
        describe('#touch existing directory', function() {
            var file = new File({type : 'd'});
            file.addFile({name : 'subdir', type : 'd', created: new Date(), lastModified: new Date()});
            var lastModified = file.children[0].lastModified;

            it('should touch the existing directory', function(done) {
                setTimeout(function() {
                    file.touch('subdir');
                    (file.children[0].lastModified - lastModified).should.be.approximately(500,50);
                    done();
                }, 500);
            });
        });
    });
});




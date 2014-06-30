module.exports = function (grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('bash.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['css/bash.min.css', 'js/bash.min.js']
        },
        concat: {
            css: {
                src: ['css/dummy.min.css'],
                dest: 'css/bash.min.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['jQuery']
                }
            },
            js: {
                files: {
                    'js/bash.min.js': ['js/dummy.js']
                }
            }
        },
        cssmin: {
            mainstyles: {
                expand: true,
                cwd: 'css/',
                src: ['dummy.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            all: [
                'Gruntfile.js',
                'js/**/*.js',
                '!js/jison-parser.js',
                //'test/**/*.js'
            ]
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src']
            }
        },
        jison: {
            target : {
                files: { 'js/jison-parser.js': 'cfg/jison/grammar.jison' }
            }
        },
        simplemocha: {
            options: {
                reporter: 'spec'
            },
            all: { src: 'test/**/*.js' }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jison');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task.
    grunt.registerTask('default', ['jshint', 'uglify:js', 'cssmin:mainstyles', 'concat:css', 'clean', "jison", "simplemocha"]);
};

'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var config = {
        base: '.',
        libs: {
            readers: 'src/libs/readers/',
            writers: 'src/libs/writers/',
        }

    };

    var libs = {
        jsqrcode: config.libs.readers + 'jsqrcode/src/',
    };

    var mainFiles = [
        'src/intro.js',
        'src/libs/writers/qrcodejs/qrcode.js',
        'src/libs/writers/text/text.js',
        libs.jsqrcode + 'grid.js',
        libs.jsqrcode + 'version.js',
        libs.jsqrcode + 'detector.js',
        libs.jsqrcode + 'formatinf.js',
        libs.jsqrcode + 'errorlevel.js',
        libs.jsqrcode + 'bitmat.js',
        libs.jsqrcode + 'datablock.js',
        libs.jsqrcode + 'bmparser.js',
        libs.jsqrcode + 'datamask.js',
        libs.jsqrcode + 'rsdecoder.js',
        libs.jsqrcode + 'gf256poly.js',
        libs.jsqrcode + 'gf256.js',
        libs.jsqrcode + 'decoder.js',
        libs.jsqrcode + 'qrcode.js',
        libs.jsqrcode + 'findpat.js',
        libs.jsqrcode + 'alignpat.js',
        libs.jsqrcode + 'databr.js',
        'src/defaults.js',
        'src/slicer.js',
        'src/writer.js',
        'src/reader.js',
        'src/merger.js',
        'src/video.js',
        'src/main.js',
        'src/outro.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: mainFiles,
                dest: 'dist/displaysocket.js'
            }

        },

        uglify: {
            dist: {
                files: {
                    'dist/displaysocket.min.js': ['dist/displaysocket.js']
                }
            }
        },

        watch: {
            js: {
                files: [
                    'Gruntfile.js',
                    'index.html',
                    'src/**/*',
                    'demos/**/*'
                ],
                tasks: ['concat', 'jshint'],
                options: {
                    livereload: {
                        port: 35729,
                        key: grunt.file.read('ds.key'),
                        cert: grunt.file.read('ds.crt'),
                    },
                }
            }
        },

        connect: {
            options: {
                protocol: 'https',
                key: grunt.file.read('ds.key').toString(),
                cert: grunt.file.read('ds.crt').toString(),
                ca: grunt.file.read('ds.crt').toString(),
                port: 9000,
                //open: true,
                livereload: 35729,
                // you can also use your IP as hostname
                hostname: 'localhost',
                //keepalive: true
            },

            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static(config.base)
                        ];
                    }
                }
            },

        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: [
                'Gruntfile.js',
                'src/*.js'
            ]
        }
    });

    grunt.registerTask('default', [ /*'watch',*/ 'connect' ]);
    grunt.registerTask('dist', [ 'concat', 'uglify' ]);
    grunt.registerTask('serve', function() {
        grunt.task.run([
            'concat',
            'connect:livereload',
            'watch'
        ]);
    });
};

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
          trace: false
        },
        files: {
          'src/css/style.css': 'src/scss/style.scss'
        }
      },
      dev: {
        options: {
          sourcemap: 'none',
          style: 'expanded',
          trace: true
        },
        files: {
          'src/css/style.css': 'src/scss/style.scss'
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: 3,
        sourceMap: false,
        compatibility: false,
        processImport: true
      },
      dist: {
        files: {
          'dist/css/style.css': 'src/css/style.pure.css'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          compress: {
            /*unsafe: true,*/
            drop_console: true,
            keep_fargs: true
          },
          screwIE8: true,
          wrap: false,
          mangle: false,
          sourceMap: false
        },
        files: {
          'src/js/script.js': [
            'src/js/lodash.custom.js',
            'src/lib/randomColor/randomColor.js',
            'src/js/util.js',
            'src/js/main2.js',
            'src/js/default.js',
            'src/js/events.js'
          ],
          'dist/js/script.js': ['src/js/script.js']
        }
      },
      dev: {
        options: {
          compress: false,
          beautify: {
            beautify: true,
            indent_level: 2
          },
          mangle: false,
          wrap: false,
          sourceMap: false
        },
        files: {
          'src/js/script.js': [
            'src/js/lodash.custom.js',
            'src/lib/randomColor/randomColor.js',
            'src/js/util.js',
            'src/js/main2.js',
            'src/js/default.js',
            'src/js/events.js'
          ],
          'dist/js/script.js': ['src/js/script.js']
        }
      }
    },
    inline: {
      dist: {
        options: {
          /*inlineTagAttributes: {
            js: 'data-inlined="true"',
            css: 'data-inlined="true"'
          }*/
          tag: ''
        },
        src: 'src/index.html',
        dest: 'src/index.full.html'
      },
      dev: {
        options: {
          tag: ''
        },
        src: 'src/index.html',
        dest: 'src/index.full.html'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeRedundantAttributes: true,
          removeEmptyElements: true
        },
        files: {
          'dist/index.html': 'src/index.full.html'
        }
      }
    },
    purifycss: {
      options: {},
      target: {
        src: ['src/index.html', 'src/js/script.js'],
        css: ['src/css/style.css'],
        dest: 'src/css/style.pure.css'
      }
    },
    imagemin: {
      dynamic: {
        options: {
          svgoPlugins: [{ removeViewBox: false }]
        },
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{gif,svg}'],
          dest: 'dist/img'
        }]
      },
      dev: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }]
        },
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'dist/img'
        }]
      }
    },
    tinypng: {
      options: {
        apiKey: 'yDv-_0JPQBPvgC7ZdBVgkg4MeuyxylVM',
        checkSigs: true,
        sigFile: 'src/img/image_sigs.json',
        summarize: true,
        showProgress: false,
        stopOnImageError: false
      },
      dynamic: {
        expand: true,
        cwd: 'src/img',
        src: ['**/*.{png,jpg}'],
        dest: 'dist/img'
      }
    },
    watch: {
      configFiles: {
        options: {
          debounceDelay: 25,
          reload: true
        },
        files: ['Gruntfile.js']
      },
      sass: {
        options: {
          debounceDelay: 25,
          spawn: false,
          atBegin: true
        },
        files: ['src/scss/**/*'],
        tasks: ['sass:dev', 'purifycss', 'inline:dev', 'htmlmin:dist']
      },
      gifsvg: {
        options: {
          debounceDelay: 25,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/img/*.{gif,svg}'
        ],
        tasks: ['newer:imagemin']
      },
      pngjpg: {
        options: {
          debounceDelay: 25,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/img/!*.{png,jpg}'
        ],
        tasks: ['tinypng']
      },
      scripts: {
        options: {
          debounceDelay: 25,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/js/util.js',
          'src/js/main2.js',
          'src/js/default.js',
          'src/js/events.js',
          'src/lib/**/*.js'
        ],
        tasks: ['uglify:dev', 'inline:dev', 'htmlmin:dist']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-tinypng');

  grunt.registerTask('default', ['sass:dist', 'uglify:dist', 'purifycss', 'cssmin:dist', 'inline:dist', 'htmlmin:dist', 'newer:imagemin', 'tinypng']);
  grunt.registerTask('build', ['sass:dist', 'uglify:dist', 'purifycss', 'cssmin:dist', 'inline:dist', 'htmlmin:dist', 'imagemin', 'tinypng']);
  grunt.registerTask('dev', ['sass:dev', 'uglify:dev', 'purifycss', 'inline:dev', 'htmlmin:dist']);
};

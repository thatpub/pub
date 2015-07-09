module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
          precision: 3,
          trace: false
        },
        files: {
          'src/css/style.pre.css': 'src/scss/style.scss'
        }
      },
      dev: {
        options: {
          sourcemap: 'none',
          style: 'expanded',
          trace: true,
          debugInfo: true,
          lineNumbers: true
        },
        files: {
          'src/css/style.pre.css': 'src/scss/style.scss'
        }
      }
    },
    cssmin: {
      options: {
        roundingPrecision: -1,
        compatibility: false,
        processImport: true,
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'dist/css/style.css': 'src/css/style.pure.css',
          'src/css/style.css': 'src/css/style.pure.css'
          /*'dist/css/style.css': 'src/css/style.css'*/
        }
      }
    },
    uglify: {
      dist: {
        options: {
          compress: {
            unsafe: true,
            drop_console: true,
            keep_fargs: false
          },
          screwIE8: true,
          wrap: false,
          mangle: true,
          sourceMap: false
        },
        files: {
          'src/js/build/script.js': [
            'src/lib/fastclick/lib/fastclick.js',
            'src/js/lodash.custom.min.js',
            'src/lib/fastdom/index.js',
            'src/js/helpers.js',
            'src/js/app.js',
            'src/js/handlers.js',
            'src/js/init.js',
            'src/js/events.js'
          ]
        }
      },
      dev: {
        options: {
          compress: false,
          screwIE8: true,
          beautify: true,
          mangle: false,
          wrap: false,
          sourceMap: true
        },
        files: {
          'src/js/build/script.js': [
            'src/lib/fastclick/lib/fastclick.js',
            'src/js/lodash.custom.min.js',
            'src/lib/fastdom/index.js',
            'src/js/helpers.js',
            'src/js/app.js',
            'src/js/handlers.js',
            'src/js/init.js',
            'src/js/events.js'
          ]
        }
      }
    },
    inline: {
      dist: {
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
          removeEmptyElements: false
        },
        files: {
          'dist/index.html': 'src/index.full.html'
        }
      }
    },
    purifycss: {
      options: {},
      target: {
        src: ['src/index.html', 'src/js/build/script.js'],
        css: ['src/css/style.pre.css'],
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
        tasks: ['sass:dev', 'purifycss', 'cssmin', 'inline', 'htmlmin']
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
          'src/js/lodash.custom.min.js',
          'src/js/helpers.js',
          'src/js/app.js',
          'src/js/handlers.js',
          'src/js/init.js',
          'src/js/events.js',
          'src/lib/**/*.js'
        ],
        tasks: ['uglify:dev', 'purifycss', 'cssmin', 'inline', 'htmlmin']
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

  grunt.registerTask('default', ['sass:dist', 'uglify:dist', 'purifycss', 'cssmin', 'inline', 'htmlmin', 'newer:imagemin', 'tinypng']);
  grunt.registerTask('dev', ['sass:dev', 'uglify:dev', 'purifycss', 'cssmin', 'inline', 'htmlmin']);
};

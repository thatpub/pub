module.exports = function(grunt) {
  grunt.initConfig({
    /*sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
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
        processImport: false,
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'src/css/style.css': 'src/css/style.pure.css'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          beautify: {
            indent_level: 2,
            width: 80,
            quote_style: 0,
            max_line_len: 1000,
            bracketize: true,
            semicolons: true
          },
          compress: {
            unsafe: true,
            drop_console: true,
            keep_fargs: false,
            join_vars: true,
            if_return: true,
            hoist_funs: true,
            unused: true,
            negate_iife: true,
            comparisons: true,
            conditionals: true,
            dead_code: true,
            sequences: true,
            cascade: true
          },
          screwIE8: true,
          wrap: false,
          mangle: true,
          sourceMap: false
        },
        files: {
          'src/js/build/script.js': [
            'src/lib/event/build/event.min.js',
            'src/lib/fastdom/fastdom.min.js',
            'src/lib/fastclick/lib/fastclick.js',
            'src/js/lodash.custom.min.js',
            'src/js/helpers.js',
            'src/js/app.js',
            'src/js/templates.js',
            'src/js/handlers.js',
            'src/js/init.js'
          ]
        }
      },
      dev: {
        options: {
          compress: false,
          screwIE8: true,
          beautify: {
            indent_level: 2,
            width: 80,
            quote_style: 0,
            max_line_len: 1000,
            bracketize: true,
            semicolons: true
          },
          mangle: false,
          wrap: false,
          sourceMap: true
        },
        files: {
          'src/js/build/script.js': [
            'src/lib/event/build/event.min.js',
            'src/lib/fastdom/fastdom.min.js',
            'src/lib/fastclick/lib/fastclick.js',
            'src/js/lodash.custom.min.js',
            'src/js/helpers.js',
            'src/js/app.js',
            'src/js/templates.js',
            'src/js/handlers.js',
            'src/js/init.js'
          ]
        }
      }
    },
    purifycss: {
      options: {},
      dist: {
        src: ['src/index.html', 'src/js/build/script.js'],
        css: ['src/css/style.pre.css'],
        dest: 'src/css/style.pure.css'
      }
    },*/
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
          debounceDelay: 250,
          reload: true
        },
        files: ['Gruntfile.js']
      },
      /*scripts: {
        options: {
          debounceDelay: 250,
          spawn: false,
          atBegin: true
        },
        files: ['src/js/!*.js'],
        tasks: ['uglify:dist', 'purifycss', 'cssmin', 'inline', 'htmlmin']
      },
      sass: {
        options: {
          debounceDelay: 250,
          spawn: false,
          atBegin: true
        },
        files: ['src/scss/!*.scss'],
        tasks: ['sass:dist', 'purifycss', 'cssmin', 'inline', 'htmlmin']
      },*/
      html: {
        options: {
          debounceDelay: 250,
          spawn: false,
          atBegin: true
        },
        files: ['src/index.html'],
        tasks: ['inline', 'htmlmin']
      }
    }
  });

  // grunt.loadNpmTasks('grunt-purifycss');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-tinypng');

  grunt.registerTask('default', [
    // 'sass:dist',
    // 'uglify:dist',
    // 'purifycss',
    // 'cssmin',
    'inline',
    'htmlmin',
    'newer:imagemin',
    'tinypng'
  ]);
  grunt.registerTask('dev', [
    // 'sass:dev',
    // 'uglify:dev',
    // 'purifycss',
    // 'cssmin',
    'inline',
    'htmlmin'
  ]);
};

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'expanded',
          trace: false
        },
        files: {
          'src/css/style.css': 'src/scss/style.scss',
          'src/css/ie.css': 'src/scss/ie.scss'
        }
      },
      dev: {
        options: {
          sourcemap: 'inline',
          style: 'expanded',
          trace: true
        },
        files: {
          'src/css/style.css': 'src/scss/style.scss',
          'src/css/ie.css': 'src/scss/ie.scss'
        }
      }
    },
    autoprefixer: {
      dist: {
        options: {
          browsers: [
            'last 3 versions',
            'ie 8',
            'ie 9',
            'ie 10',
            'ie 11'
          ],
          remove: true
        },
        files: {
          'src/css/style.css': 'src/css/style.css',
          'src/css/ie.css': 'src/css/ie.css'
        }
      },
      dev: {
        options: {
          browsers: [
            'last 3 versions',
            'ie 8',
            'ie 9',
            'ie 10',
            'ie 11'
          ],
          remove: true
        },
        files: {
          'dist/css/style.min.css': 'src/css/style.css',
          'dist/css/ie.min.css': 'src/css/ie.css'
        }
      }
    },
    cssmin: {
      target: {
        options: {
          report: 'gzip'
        },
        files: {
          'dist/css/style.min.css': 'src/css/style.css',
          'dist/css/ie.min.css': 'src/css/ie.css'
        }
      }
    },
    react: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: 'src/js',
            src: ['**/*.jsx'],
            dest: 'src/js',
            ext: '.js'
          }
        ]
      }
    },
    uglify: {
      dist: {
        options: {
          compress: true,
          wrap: false
        },
        files: [
          {
            src: [
              'src/lib/lodash/**lodash.min.js',
              'src/lib/modernizr/modernizr.js',
              'src/lib/randomColor/randomColor.js',
              'src/js/util.js',
              'src/js/main2.js',
              'src/js/default.js'
            ],
            dest: 'dist/js/script.min.js'
          }
        ]
      },
      dev: {
        options: {
          compress: false,
          beautify: true,
          mangle: false,
          wrap: false
        },
        files: [
          {
            src: [
              'src/lib/lodash/**lodash.js',
              'src/lib/modernizr/modernizr.js',
              'src/lib/randomColor/randomColor.js',
              'src/js/util.js',
              'src/js/main2.js',
              'src/js/default.js'
            ],
            dest: 'dist/js/script.min.js'
          }
        ]
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
          debounceDelay: 50,
          reload: true
        },
        files: ['Gruntfile.js']
      },
      sass: {
        options: {
          debounceDelay: 50,
          spawn: false,
          atBegin: true
        },
        files: ['src/scss/**/*'],
        tasks: ['sass:dev', 'autoprefixer:dev']
      },
      jsx: {
        options: {
          debounceDelay: 50,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/js/*.jsx'
        ],
        tasks: ['newer:react', 'uglify:dev']
      },
      gifsvg: {
        options: {
          debounceDelay: 50,
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
          debounceDelay: 50,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/img/*.{png,jpg}'
        ],
        tasks: ['tinypng']
      },
      scripts: {
        options: {
          debounceDelay: 50,
          spawn: false,
          atBegin: true
        },
        files: [
          'src/js/util.js',
          'src/js/main2x.js',
          'src/js/main2.js',
          'src/js/default.js',
          'src/lib/**/*.js'
        ],
        tasks: ['uglify:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-tinypng');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['sass:dist', 'autoprefixer:dist', 'cssmin', /*'uncss:dist',*/ 'newer:react', 'uglify:dist', 'newer:imagemin', 'tinypng']);
  grunt.registerTask('build', ['sass:dist', 'autoprefixer:dist', 'cssmin', /*'uncss:dist',*/ 'react', 'uglify:dist', 'imagemin', 'tinypng']);
};

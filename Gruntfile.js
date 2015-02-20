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
          'dist/css/style.min.css': 'src/scss/style.scss'
        }
      },
      dev: {
        options: {
          sourcemap: 'inline',
          style: 'expanded',
          trace: true
        },
        files: {
          'dist/css/style.min.css': 'src/scss/style.scss'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          compress: {
            unsafe: true,
            drop_console: true,
            keep_fargs: true
          },
          screwIE8: true,
          wrap: false,
          mangle: false
        },
        files: {
          'dist/js/script.min.js': [
            'src/lib/snabbt.js/snabbt.js',
            'src/js/lodash.custom.js',
            'src/lib/randomColor/randomColor.js',
            'src/js/util.js',
            'src/js/main2.js',
            'src/js/default.js',
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
          'dist/js/script.min.js': [
            'src/lib/snabbt.js/snabbt.js',
            'src/js/lodash.custom.js',
            'src/lib/randomColor/randomColor.js',
            'src/js/util.js',
            'src/js/main2.js',
            'src/js/default.js',
            'src/js/events.js'
          ]
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
        tasks: ['sass:dev']
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
          'src/img/*.{png,jpg}'
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
        tasks: ['uglify:dev']
      }
    }
  });

  /*grunt.loadNpmTasks('grunt-contrib-cssmin');*/
  /*grunt.loadNpmTasks('grunt-autoprefixer');*/
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-tinypng');
  /*grunt.loadNpmTasks('grunt-react');*/

  grunt.registerTask('default', ['sass:dist', /*'autoprefixer:dist', 'cssmin', 'uncss:dist',*/ 'uglify:dist', 'newer:imagemin', 'tinypng']);
  grunt.registerTask('build', ['sass:dist', /*'autoprefixer:dist', 'cssmin', 'uncss:dist',*/ 'uglify:dist', 'imagemin', 'tinypng']);
  grunt.registerTask('dev', ['sass:dev', /*'autoprefixer:dev', 'uncss:dist',*/ 'uglify:dev', 'newer:imagemin', 'tinypng']);
};

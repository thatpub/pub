module.exports = function(grunt) {
  grunt.initConfig({
    inline: {
      dist: {
        options: {
          tag: ''
        },
        src: 'src/index.html',
        dest: '.tmp/index.full.html'
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
          'dist/index.html': '.tmp/index.full.html'
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
    }
  });

  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-tinypng');

  grunt.registerTask('default', [
    'inline',
    'htmlmin',
    'newer:imagemin',
    'tinypng'
  ]);
  grunt.registerTask('dev', [
    'inline',
    'htmlmin'
  ]);
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'assets/js/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    // Compile sass
    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'dist/styles/flickrgal.css' : '_sass/flickrgal.scss'
        }
      }
    },
    // Copy raw assets
    copy: {
        main: {
            files: [
                {expand: true, flatten: true, src: ['assets/js/*'], dest: 'dist/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['_sass/*'], dest: 'dist/styles', filter: 'isFile'},
            ]
        }
    },
    // make a zip with all the stuff
    compress: {
      main: {
        options: {
          archive: 'dist/flickrgal.zip'
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['**', '!*.zip'], dest: '/asd'}
        ]
      }
    }
  });

  // Uglify plugin tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Copy plugin tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Compression plugin tasks
  grunt.loadNpmTasks('grunt-contrib-compress');
  // Sass Compilation plugin tasks
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'sass', 'copy', 'compress']);

};

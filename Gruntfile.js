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
        dest: 'flickrgal/<%= pkg.name %>.min.js'
      }
    },
    // Compile sass
    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'flickrgal/styles/flickrgalworking.css' : '_sass/flickrgal.scss'
        }
      }
    },
    // Copy raw assets
    copy: {
        main: {
            files: [
                {expand: true, flatten: true, src: ['assets/js/*'], dest: 'flickrgal/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['_sass/*'], dest: 'flickrgal/styles', filter: 'isFile'},
                {expand: true, flatten: true, cwd: 'assets/images/', src: ['arrow.png'], dest: 'flickrgal/images', filter: 'isFile'},
                {expand: true, flatten: true, cwd: 'assets/images/', src: ['esc.png'], dest: 'flickrgal/images', filter: 'isFile'}
            ]
        }
    },
    // make a zip with all the stuff
    compress: {
      main: {
        options: {
          archive: 'flickrgal.zip'
        },
        files: [
          {expand: true, src: ['flickrgal/**'], dest: '/', filter: 'isFile'}
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
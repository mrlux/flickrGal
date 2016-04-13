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
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    // Copy raw assets
    copy: {
        main: {
            files: [
                {expand: true, flatten: true, src: ['assets/js/*'], dest: 'build/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['css/*'], dest: 'build/styles', filter: 'isFile'},
                {expand: true, flatten: true, src: ['_site/css/*'], dest: 'build/styles', filter: 'isFile'}
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
          {expand: true, flatten: true, src: ['build/**'], dest: '/', filter: 'isFile'}
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

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'copy', 'compress']);

};
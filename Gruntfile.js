// Generated on 2014-09-29 using
// generator-webapp 0.5.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      coffee: {
        files: ['<%= config.app %>/scripts/{,*/}*.{coffee,litcoffee,coffee.md}'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.{coffee,litcoffee,coffee.md}'],
        tasks: ['coffee:test', 'test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      views: {
      	files: ['<%= config.app %>/views/{,*/}*.{hbs}'],
      },
      fonts: {
      	files: ['<%= config.app %>/fonts/{,*/}*'],
      },
      libraries: {
      	files: ['<%= config.app %>/scripts/libraries/{,*/}*'],
      	tasks: ['newer:copy:libraries']
      },
      lang: {
      	files: ['<%= config.app %>/lang/{,*/}*'],
      	tasks: ['newer:copy:lang']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '.tmp/fonts/{,*/}*',
          '.tmp/scripts/{,*/}*.js',
          '<%= config.app %>/images/{,*/}*',
          '<%= config.app %>/fonts/{,*/}*',
          '<%= config.app %>/views/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        '!<%= config.app %>/scripts/libraries/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Compiles CoffeeScript to JavaScript
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '.tmp/scripts',
          ext: '.js'
        },
        {
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '<%= config.dist %>/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.{coffee,litcoffee,coffee.md}',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourcemap: true,
        loadPath: 'bower_components'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        },
        {
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/styles',
          ext: '.css'
        }]
      },
      data: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/data',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles/data',
          ext: '.css'
        },
        {
          expand: true,
          cwd: '<%= config.app %>/styles/data',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/styles/data',
          ext: '.css'
        }]
      },
      dataServer: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/data',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles/data',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html']
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
         //   '<%= config.dist %>/scripts/{,*/}*.js',
         //   '<%= config.dist %>/styles/{,*/}*.css',
         //   '<%= config.dist %>/images/{,*/}*.*',
         //   '<%= config.dist %>/styles/fonts/{,*/}*.*',
         //   '<%= config.dist %>/*.{ico,png}' 
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: ['<%= config.app %>/{,*/}*.{html, hbs}', '<%= config.app %>/views/*.hbs', '<%= config.app %>/views/partials/*.hbs'],
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
      },
      html: ['<%= config.dist %>/{,*/}*.{html, hbs}', '<%= config.dist %>/views/*.hbs', '<%= config.dist %>/views/partials/*.hbs'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['{,*/}*.{html}'],
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            'styles/fonts/{,*/}*.*',
          ]
        }]
      },
      styles: {
      	files: [{
       		expand: true,
        	dot: true,
        	cwd: '<%= config.app %>/styles',
        	dest: '.tmp/styles/',
        	src: '{,*/}*.css'
      	},
      	{
       		expand: true,
        	dot: true,
        	cwd: '<%= config.app %>/styles',
        	dest: '<%= config.dist %>/styles/',
        	src: '{,*/}*.css'
      	}]
      },
      views: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/views',
        dest: '<%= config.dist %>/views/',
        src: '{,*/}*.hbs'
      },
      libraries: {
      	files: [{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>/scripts/libraries',
			dest: '.tmp/scripts/libraries/',
			src: '{,*/}*'
		},
		{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>/scripts/libraries',
			dest: '<%= config.dist %>/scripts/libraries/',
			src: '{,*/}*'
        }]
	  },
      fonts: {
      	files: [{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>/fonts',
			dest: '.tmp/fonts/',
			src: '{,*/}*'
		},
		{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>/fonts',
			dest: '<%= config.dist %>/fonts/',
			src: '{,*/}*'
        }]
	  },
	  lang: {
      	files: [{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>/lang',
			dest: '<%= config.dist %>/lang/',
			src: '{,*/}*'
        }]
	  }
    },
	
    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    //modernizr: {
    //  dist: {
    //    devFile: 'bower_components/modernizr/modernizr.js',
    //    outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
    //    files: {
    //      src: [
    //        '<%= config.dist %>/scripts/{,*/}*.js',
    //        '<%= config.dist %>/styles/{,*/}*.css',
    //        '!<%= config.dist %>/scripts/vendor/*'
    //      ]
    //    },
    //    uglify: true
    //  }
    //},
    

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server',
        'sass:dataServer',
        'coffee:dist',
        'copy:styles',
        'copy:views',
        'copy:fonts',
        'copy:libraries',
        'copy:lang',
      ],
      test: [
        'coffee',
        'copy:styles',
        'copy:views',
        'copy:fonts',
        'copy:libraries',
        'copy:lang',
      ],
      dist: [
        'coffee',
        'sass',
        'sass:data',
        'copy:styles',
        'copy:views',
        'copy:fonts',
        'copy:libraries',
        'copy:lang',
        'imagemin',
        //'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    //'modernizr',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    //'test',
    'build'
  ]);
};

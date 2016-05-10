module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify"]
               ]
            },
            files: {
               "./compiled/adventure.js": ["./js/adventure.js"]
            }
         }
      },
      watch: {
         scripts: {
            files: ["./js/**/*.js"],
            tasks: ["browserify"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");

   grunt.registerTask("default", ["browserify", "watch"]);
   grunt.registerTask("build", ["browserify"]);
};

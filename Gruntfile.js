/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jshint camelcase: false, globalstrict: true*/
/*global require, module */

// # Globbing
// for performance reasons we"re only matching one level down:
// "test/spec/{,*/}*.js"
// use this if you want to recursively match all subfolders:
// "test/spec/**/*.js"

module.exports = function (grunt) {
    "use strict";

    // show elapsed time at the end
    require("time-grunt")(grunt);
    // load all grunt tasks
    require("load-grunt-tasks")(grunt);
    grunt.loadNpmTasks("grunt-zip");

    // configurable paths
    var extensionConfig = {
        app: "app",
        dist: "dist"
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        extensionConfig: extensionConfig,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        ".tmp",
                        "<%= extensionConfig.dist %>/*",
                        "!<%= extensionConfig.dist %>/.git*"
                    ]
                }]
            },
            server: ".tmp"
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                "Gruntfile.js",
                "<%= extensionConfig.app %>/main.js",
                "test/spec/{,*/}*.js",
                "unittests.js",
                "strings.js",
                "nls/**/*.js"
            ]
        },
        eslint: {
            options: {
                config: ".eslintrc"
            },
            target: [
                "Gruntfile.js",
                "main.js",
                "test/spec/{,*/}*.js",
                "unittests.js",
                "strings.js",
                "nls/**/*.js"
            ]
        },
        compress: {
            dist: {
                options: {
                    archive: "<%= extensionConfig.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip"
                },
                files: [{
                    expand: true,
                    cwd: "",
                    src: ["main.js", "package.json", "README.md", "strings.js", "nls/**", "third_party/**"],
                    dest: ""
                }]
            }
        },
        zip: {
            multi: {
                src: ["main.js", "package.json", "README.md", "strings.js", "nls/**", "third_party/**"],
                dest: "<%= extensionConfig.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip"
            }
        }
    });

    grunt.registerTask("test", [
        "mocha"
    ]);

    grunt.registerTask("build", [
        "clean:dist",
        "zip"
    ]);

    grunt.registerTask("default", [
        "eslint",
//        "test",
        "build"
    ]);
};

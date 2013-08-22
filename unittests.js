/*
 * Copyright (c) 2013 Ingo Richter.
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
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe, it, xit, expect, beforeEach, afterEach, waitsFor, runs, $, brackets, spyOn, waitsForDone */

define(function (require, exports, module) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        CommandManager  = brackets.getModule("command/CommandManager"),
        LineSorter      = require("main");

    describe("Line Sorter", function () {
        var testEditor,
            testDocument;
        
        var defaultContent = "Wisconsin\n" +
                             "\n" +
                             "Madison\n" +
                             "New York\n" +
                             "Ann Arbor\n" +
                             "San Francisco\n" +
                             "\n" +
                             "Denver\n" +
                             "Boston";
        
        beforeEach(function () {
            // create Editor instance (containing a CodeMirror instance)
            var mock = SpecRunnerUtils.createMockEditor(defaultContent, "text");
            testEditor = mock.editor;
            testDocument = mock.doc;
            
            // inject the editor
            spyOn(LineSorter, '_getEditor').andCallFake(function () {
                return testEditor;
            });
        });

        afterEach(function () {
            SpecRunnerUtils.destroyMockEditor(testDocument);
            testEditor = null;
            testDocument = null;
        });

        // Helper function
        function getCodeMirror() {
            return testEditor._codeMirror;
        }
        
        describe("Sort lines", function () {
            it("should sort lexicographically all lines in the document", function () {
                LineSorter.sortLines();
                
                var codeMirror = getCodeMirror();
                var start = {line: 0, ch: 0},
                    end   = {line: codeMirror.lineCount(), ch: 0};
                
                var lines = codeMirror.getRange(start, end);

                expect(lines.split("\n").toString()).toBe(",,Ann Arbor,Boston,Denver,Madison,New York,San Francisco,Wisconsin");
            });

            it("should sort lexicographically the selection in the document", function () {
                var codeMirror = getCodeMirror();
                var start = {line: 0, ch: 0},
                    end   = {line: codeMirror.lineCount(), ch: 0};
                
                // select some lines
                codeMirror.doc.setSelection({line: 3, ch: 0}, {line: 5, ch: 0});
                
                LineSorter.sortLines();
                var lines = codeMirror.getRange(start, end);

                expect(lines.split("\n").toString()).toBe("Wisconsin,,Madison,Ann Arbor,New York,San Francisco,,Denver,Boston");
            });
        });
        
        describe("Reverse all lines in document", function () {
            it("should return all lines in reverse order", function () {
                var codeMirror = getCodeMirror();
                var start = {line: 0, ch: 0},
                    end   = {line: codeMirror.lineCount(), ch: 0};

                LineSorter.reverseLines();
                
                var lines = codeMirror.getRange(start, end);

                expect(lines.split("\n").toString()).toBe("Boston,Denver,,San Francisco,Ann Arbor,New York,Madison,,Wisconsin");
                
                LineSorter.reverseLines();
                lines = codeMirror.getRange(start, end);

                expect(lines.split("\n").toString()).toBe("Wisconsin,,Madison,New York,Ann Arbor,San Francisco,,Denver,Boston");
            });
        });
    });
});

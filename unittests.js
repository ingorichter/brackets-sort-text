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

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe, it, expect, beforeEach, afterEach, brackets, spyOn */

//define(function (require, exports, module) {
define(function (require) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        LineSorter = require("main");

    describe("Sort Text", function () {
        var testEditor,
            testDocument,
            codeMirror;

        var defaultContent = "Wisconsin\n" +
                             "\n" +
                             "Madison\n" +
                             "New York\n" +
                             "Ann Arbor\n" +
                             "San Francisco\n" +
                             "\n" +
                             "Denver\n" +
                             "Boston";

        var duplicateLines = defaultContent + "\n" + defaultContent;

        // Helper function
        function getCodeMirror() {
            return testEditor._codeMirror;
        }

        beforeEach(function () {
            // create Editor instance (containing a CodeMirror instance)
            var mock = SpecRunnerUtils.createMockEditor(defaultContent, "text");
            testEditor = mock.editor;
            testDocument = mock.doc;

            // inject the editor
            spyOn(LineSorter, "_getEditor").andCallFake(function () {
                return testEditor;
            });

            codeMirror = getCodeMirror();
        });

        afterEach(function () {
            SpecRunnerUtils.destroyMockEditor(testDocument);
            testEditor = null;
            testDocument = null;
        });

        describe("Sort lines", function () {
            it("should sort lexicographically all lines in the document", function () {
                LineSorter.sortLines();

                var lines = codeMirror.getValue();

                expect(lines.split("\n").toString()).toBe(",,Ann Arbor,Boston,Denver,Madison,New York,San Francisco,Wisconsin");
            });

            it("should sort lexicographically the selection in the document", function () {
                // select some lines
                codeMirror.doc.setSelection({line: 3, ch: 0}, {line: 5, ch: 0});

                LineSorter.sortLines();
                var lines = codeMirror.getValue();

                expect(lines.split("\n").toString()).toBe("Wisconsin,,Madison,Ann Arbor,New York,San Francisco,,Denver,Boston");
            });

            describe("Language Agnostic", function () {
                beforeEach(function () {
                    testDocument.setText("Telefon\nZebra\nBus\nAutobahn");
                });

                it("should sort lines in german", function () {
                    LineSorter.sortLines();
                    var lines = codeMirror.getValue();

                    expect(lines.split("\n").toString()).toBe("Autobahn,Bus,Telefon,Zebra");
                });

                it("should sort lines properly with comma and quotes (https://github.com/ingorichter/brackets-sort-text/issues/4)", function () {
                    testDocument.setText("'angular',\n'angular-resource',\n'jquery',\n'jquery-ui',");
                    LineSorter.sortLines();
                    var lines = codeMirror.getValue();

                    expect(lines.split("\n").toString()).toBe("'angular',,'angular-resource',,'jquery',,'jquery-ui',");
                });
            });
        });

        describe("Reverse all lines in document", function () {
            it("should return all lines in reverse order", function () {
                LineSorter.reverseLines();

                var lines = codeMirror.getValue();

                expect(lines.split("\n").toString()).toBe("Boston,Denver,,San Francisco,Ann Arbor,New York,Madison,,Wisconsin");

                LineSorter.reverseLines();
                lines = codeMirror.getValue();

                expect(lines.split("\n").toString()).toBe("Wisconsin,,Madison,New York,Ann Arbor,San Francisco,,Denver,Boston");
            });

            it("should do nothing if document is empty", function () {
                testDocument.setText("");

                LineSorter.reverseLines();

                var lines = codeMirror.getValue();

                expect(lines).toBe("");
            });
        });

        describe("Sort all lines by length", function () {
            it("should sort all lines by length", function () {
                LineSorter.sortLinesByLength();

                var lines = codeMirror.getValue();
                expect(lines.split("\n").toString()).toBe(",,Denver,Boston,Madison,New York,Wisconsin,Ann Arbor,San Francisco");
            });
        });

        describe("Shuffle lines", function () {
            it("should return lines in different order than the original line order", function () {
                var textBeforeShuffle = codeMirror.getValue();

                LineSorter.shuffleLines();

                var textAfterShuffle = codeMirror.getValue();

                expect(textBeforeShuffle).not.toBe(textAfterShuffle);
                expect(textBeforeShuffle.length).toBe(textAfterShuffle.length);
            });
        });

        describe("Unique lines", function () {
            beforeEach(function () {
                testDocument.setText(duplicateLines);
            });

            it("should return all unique lines in sorted order", function () {
                var textBeforeUnique = codeMirror.getValue();

                LineSorter.removeDuplicateLines();

                var textAfterUnique = codeMirror.getValue();

                expect(textBeforeUnique).not.toBe(textAfterUnique);
                expect(textAfterUnique.split("\n").toString()).toBe(",Ann Arbor,Boston,Denver,Madison,New York,San Francisco,Wisconsin");
            });
        });
    });
});

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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets */

/** Simple extension that adds a "File > Hello World" menu item. Inserts "Hello, world!" at cursor pos. */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus");

    function _getEditor() {
        return EditorManager.getFocusedEditor();
    }

    function _getCodeMirror() {
        var editor = exports._getEditor();
        return editor._codeMirror;
    }

    // Function to run when the menu item is clicked
    function handleSortLines() {
        var editor = exports._getEditor();
        var codemirror = _getCodeMirror();

        // TODO:
        // * sort all lines (+)
        // * sort only selected lines (+)
        // * sort lines language agnostic (all/selection)
        // * randomize lines (+)
        // * reverse lines (+)
        // * Unique lines
        // * sort lines by length (+)
        if (editor) {
            if (editor.lineCount() > 0) {
                console.log("Let's get it sorted");

                if (codemirror.somethingSelected()) {
                    var selection = codemirror.getSelection();
                    var removedLastLineBreak = false;

                    // preserve the last line break, because the last fully selected line has
                    // a line break at the end. We add this after the sort
                    if (selection.lastIndexOf("\n") === (selection.length - 1)) {
                        selection = selection.substr(0, selection.length - 1);
                        removedLastLineBreak = true;
                    }

                    var allLines = selection.split('\n');

                    allLines.sort(function (a, b) {
                        return a.localeCompare(b);
                    });

                    codemirror.replaceSelection(allLines.join('\n') + (removedLastLineBreak ? "\n" : ""));
                } else {
                    var lines = codemirror.getValue(),
                        allLines2 = lines.split('\n');

                    allLines2.sort(function (a, b) {
                        return a.localeCompare(b);
                    });

                    codemirror.setValue(allLines2.join("\n"));
                }
            }
        }
    }

    function handleReverseLines() {
        var codemirror = _getCodeMirror();

        var lines = codemirror.getValue(),
            allLines = lines.split('\n');

        var i;
        for (i = 0; i < allLines.length / 2; i++) {
            var index = allLines.length - 1 - i;

            var tmp         = allLines[i];
            allLines[i]     = allLines[index];
            allLines[index] = tmp;
        }

        codemirror.setValue(allLines.join("\n"));
    }

    function handleSortByLength() {
        var codemirror = _getCodeMirror();

        var lines = codemirror.getValue(),
            allLines = lines.split('\n');

        allLines.sort(function (a, b) {
            return a.length - b.length;
        });

        codemirror.setValue(allLines.join("\n"));
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function handleShuffleLines() {
        var codemirror = _getCodeMirror();

        var lines = codemirror.getValue(),
            allLines = lines.split('\n');

        // probably not the most efficient way of doing it...
        var i,
            lineCount = allLines.length,
            maxArrayIndex = lineCount - 1;

        for (i = 0; i < lineCount; i++) {
            var newIndex = getRandomInt(0, maxArrayIndex);

            var tmp         = allLines[i];
            allLines[i]     = allLines[newIndex];
            allLines[newIndex] = tmp;
        }

        codemirror.setValue(allLines.join("\n"));
    }

    /**
     * Sort all lines in the current Editor and remove duplicates.
     */
    function handleRemoveDuplicateLines() {
        var codemirror = _getCodeMirror(),
            result = [],
            seen = [];

        var lines = codemirror.getValue(),
            allLines = lines.split('\n');

        allLines.sort(function (a, b) {
            return a.localeCompare(b);
        });

        allLines.forEach(function (line, number) {
            if (seen[seen.length - 1] !== line) {
                seen.push(line);
                result.push(line);
            }
        });

        codemirror.setValue(result.join("\n"));
    }

    // First, register a command - a UI-less object associating an id to a handler
    var COMMAND_SORTLINES = "de.richter.brackets.extension.brackets-sort-text.sortLines";   // package-style naming to avoid collisions
    var COMMAND_REVERSELINES = "de.richter.brackets.extension.brackets-sort-text.reverseLines";   // package-style naming to avoid collisions
    var COMMAND_SORTLINESBYLENGTH = "de.richter.brackets.extension.brackets-sort-text.sortLinesByLength";   // package-style naming to avoid collisions
    var COMMAND_SHUFFLELINES = "de.richter.brackets.extension.brackets-sort-text.shuffleLines";   // package-style naming to avoid collisions
    var COMMAND_UNIQUELINES = "de.richter.brackets.extension.brackets-sort-text.uniqueLines";   // package-style naming to avoid collisions

    CommandManager.register("Sort Lines",             COMMAND_SORTLINES,         handleSortLines);
    CommandManager.register("Reverse Lines",          COMMAND_REVERSELINES,      handleReverseLines);
    CommandManager.register("Sort Lines by length",   COMMAND_SORTLINESBYLENGTH, handleSortByLength);
    CommandManager.register("Shuffle Lines",          COMMAND_SHUFFLELINES,      handleShuffleLines);
    CommandManager.register("Remove Duplicate Lines", COMMAND_UNIQUELINES,       handleRemoveDuplicateLines);

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    // this check is there to prevent the testrunnner from failing to load the test
    if (menu) {
        menu.addMenuItem(COMMAND_SORTLINES,         [{key: "F6"}]);
        menu.addMenuItem(COMMAND_REVERSELINES,      [{key: "Shift-F6"}]);
        menu.addMenuItem(COMMAND_SORTLINESBYLENGTH, [{key: "Ctrl-F6"}]);
        menu.addMenuItem(COMMAND_SHUFFLELINES,      [{key: "Alt-F6"}]);
        menu.addMenuItem(COMMAND_UNIQUELINES,       [{key: "Ctrl-Alt-F6"}]);
    }

    // Public API
    exports.sortLines            = handleSortLines;
    exports.reverseLines         = handleReverseLines;
    exports.sortLinesByLength    = handleSortByLength;
    exports.shuffleLines         = handleShuffleLines;
    exports.removeDuplicateLines = handleRemoveDuplicateLines;

    // for testing
    exports._getEditor           = _getEditor;
});

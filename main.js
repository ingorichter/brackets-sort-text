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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** Simple extension that adds a "File > Hello World" menu item. Inserts "Hello, world!" at cursor pos. */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
        VerEx          = require("thirdparty/JSVerbalExpressions/VerbalExpressions");

    function _getEditor() {
        return EditorManager.getFocusedEditor();
    }
    
    // Function to run when the menu item is clicked
    function handleSortLines() {
        var editor = exports._getEditor();
        var codemirror = editor._codeMirror;
        
        // TODO:
        // * sort all lines (+)
        // * sort only selected lines (+)
        // * sort lines language agnostic (all/selection)
        // * randomize lines
        // * reverse lines (+)
        // * Unique lines
        // * sort lines by length
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
                    var start = {line: 0, ch: 0},
                        end   = {line: codemirror.lineCount(), ch: 0};

                    var lines = codemirror.getRange(start, end);
                    var allLines = lines.split('\n');
    
                    allLines.sort(function (a, b) {
                        return a.localeCompare(b);
                    });
                    
                    console.log(allLines);
                    codemirror.replaceRange(allLines, start, end);
                }
            }
        }
    }

    function handleReverseLines() {
        var editor = exports._getEditor();
        var codemirror = editor._codeMirror;

        var start = {line: 0, ch: 0},
            end   = {line: codemirror.lineCount(), ch: 0};

        var lines = codemirror.getRange(start, end),
            allLines = lines.split('\n');

        var i;
        for (i = 0; i < allLines.length / 2; i++) {
            var tmp = allLines[i];
            allLines[i] = allLines[allLines.length - 1 - i];
            allLines[allLines.length - 1 - i] = tmp;
        }
        
        codemirror.replaceRange(allLines, start, end);
    }
    
    // First, register a command - a UI-less object associating an id to a handler
    var COMMAND_SORTLINES = "de.richter.brackets.extension.LineSorter.sortLines";   // package-style naming to avoid collisions
    var COMMAND_REVERSELINES = "de.richter.brackets.extension.LineSorter.reverseLines";   // package-style naming to avoid collisions
    CommandManager.register("Sort Lines", COMMAND_SORTLINES, handleSortLines);
    CommandManager.register("Reverse Lines", COMMAND_REVERSELINES, handleReverseLines);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    // this check is there to prevent the testrunnner from failing to load the test
    if (menu) {
        menu.addMenuItem(COMMAND_SORTLINES, [{key: "F5"}]);
        menu.addMenuItem(COMMAND_REVERSELINES, [{key: "Shift-F5"}]);
    }

    exports.sortLines    = handleSortLines;
    exports.reverseLines = handleReverseLines;
    // for testing
    exports._getEditor     = _getEditor;
});

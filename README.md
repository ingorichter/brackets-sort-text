## Brackets Sort Text Extension

[![Build Status](https://travis-ci.org/ingorichter/brackets-sort-text.svg?branch=master)](https://travis-ci.org/ingorichter/brackets-sort-text)

A [Brackets](https://github.com/adobe/brackets) extension that provides a couple of utility functions for sorting lines in the current document.

### Installation

* Select **File > Extension Manager...** (or click the "brick" icon in the toolbar)
* Click **Available** Icon at the top
* Enter **Brackets Sort Text** in the search field
* Click **Install**

### How To Use
The Extension provides a couple of new commands that work on the text lines in your editor. These new commands are available as menu entries added to the **Edit** menu. In the **Edit** menu you'll find

* Sort Lines - F7
* Reverse Lines - Shift-F7
* Sort Lines by length - Command-F7
* Shuffle Lines - Alt-F7
* Remove Duplicate Lines - Alt-Command-F7

#### Mode of operation
All operations work on all lines in the current editor. If there is a selection, then the operation is applied to this selection only (there are exceptions, see below).
The Extension provides only operations that work on whole lines. There is no way to select a word and sort the letters. A line is the unit for each operation.

#### Sort Lines
All lines in the current text editor will be alphabetically sorted. If you specify a selection, then only this selection is sorted for you.

#### Reverse Lines
All lines in the current text editor are reversed. This means that the previously last line is the first line after the operation has finished. You can use this operation to toggle the sort order.

#### Sort Lines by length
I don't have a practical example for this operation. But all lines are sorted by length and the shortest line will be the first line. The functionality was added to test the sort operation.

#### Shuffle Lines
Un-order all lines in the text editor. The functionality was added to test the sort operation.

#### Remove Duplicate Lines
This is helpful to "reduce" a text to omit redundant lines. This operation will sort all lines upfront and then remove the duplicate lines.

## License

MIT-licensed -- see _main.js_ for details.

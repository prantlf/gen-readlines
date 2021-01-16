# Changes

This is a fork of the [original project] with additional features and fixes.

## 1.0.0

This is the first release a fork of the [original project] with the following changes:

* Support CR alone as a line break.
* Allow limiting the maximum line length.
* No warnings about usage of a deprecated API.
* Require Node.js 6 or newer.

**BREAKING CHANGE**: Earlier versions than Node.js 6 will not work any more.

## 0.2.0

* Added new `fromFile` function by [Igor Kamyshev](https://github.com/igorkamyshev) [13](https://github.com/neurosnap/gen-readlines/pull/13)

## 0.1.3

* Added `eslint` to the project
* Updated documentation to use `let` instead of `var`
* Added multiple versions of `node` to travis

## 0.1.2

* More optimizations

## 0.1.1

* [BUG] Windows newlines caused extra empty lines
* [BUG] Contents of file read multiple times because of miscalculated char position
* Improved optimization of line reader
* Added a microbenchmark

## 0.1.0

* [BUG] Empty lines should be returned in the list of lines

## 0.0.1

* Initial release

[original project]: https://github.com/neurosnap/gen-readlines

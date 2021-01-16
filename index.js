'use strict';

const fs = require('fs');

const LF = 10;
const CR = 13;

/**
 * Generator based line reader
 *
 * @param {Number} [fd] The file descriptor
 * @param {Number} [filesize] The size of the file in bytes
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [position] The position where to start reading the file in bytes
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
function* readlines(fd, filesize, bufferSize, position, maxLineLength) {
  if (typeof bufferSize === 'undefined') bufferSize = 64 * 1024;
  if (typeof position === 'undefined') position = 0;
  if (!(maxLineLength > 0)) maxLineLength = Infinity;

  const originalMaxLineLength = maxLineLength;
  let lineBuffer;

  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let readChunk = new Buffer(bufferSize);
    let bytesRead = fs.readSync(fd, readChunk, 0, bufferSize, position);

    let curpos = 0;
    let startpos = 0;
    let lastbyte = null;
    let curbyte;
    while (curpos < bytesRead) {
      curbyte = readChunk[curpos];
      // skip LF if last chunk ended in CR
      if (curbyte === LF && lastbyte !== CR ||
          curbyte === CR && curpos < bytesRead - 1 ||
          curpos - startpos >= maxLineLength) {
        const wantedLength = yield _concat(lineBuffer, readChunk.slice(startpos, curpos));
        // change the maximum length to the parameter of next()
        maxLineLength = wantedLength > 0 ? wantedLength : originalMaxLineLength;

        lineBuffer = undefined;
        startpos = curpos + 1;

        if (curbyte === CR && readChunk[curpos + 1] === LF) {
          startpos++;
          curpos++;
        }
      } else if (curbyte === CR && curpos >= bytesRead - 1) {
        lastbyte = curbyte;
      }

      curpos++;
    }

    position += bytesRead;

    if (startpos < bytesRead) {
      lineBuffer = _concat(lineBuffer, readChunk.slice(startpos, bytesRead));
    }
  }
  // dump what ever is left in the buffer
  if (Buffer.isBuffer(lineBuffer)) yield lineBuffer;
};

/**
 * Combines two buffers
 *
 * @param {Object} [buffOne] First buffer object
 * @param {Object} [buffTwo] Second buffer object
 * @return {Object} Combined buffer object
 */
function _concat(buffOne, buffTwo) {
  if (!buffOne) return buffTwo;
  if (!buffTwo) return buffOne;

  let newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

/**
 * Generator based line reader with simplified API
 *
 * @param {string} [filename] Name of input file
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
function* fromFile(filename, bufferSize, maxLineLength) {
  const fd = fs.openSync(filename, 'r');
  const fileSize = fs.statSync(filename).size;

  yield* readlines(fd, fileSize, bufferSize, undefined, maxLineLength);

  fs.closeSync(fd);
}

module.exports = readlines;

module.exports.fromFile = fromFile;

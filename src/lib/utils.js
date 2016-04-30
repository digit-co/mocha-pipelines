'use strict'

const {utils} = require('mocha')

exports.lookupFiles = (testPath) => {
  let extensions = ['js']
  let recursive = true
  let files = utils.lookupFiles(testPath, extensions, recursive)
  if (!Array.isArray(files)) {
    files = [files]
  }

  // sort files so they are always in defined order across pipelines
  files.sort()

  return files
}

exports.splitFiles = (files, pieces, piece) => {
  // calculate equal number of files per piece
  let filesPerPiece = Math.floor(files.length / pieces)
  let offset = piece - 1
  let begin = offset * filesPerPiece
  let end = (offset + 1) * filesPerPiece

  // adjust bounds of slice based on remainder of files
  let remainder = files.length % pieces
  begin += Math.min(remainder, offset)
  end += Math.min(remainder, offset + 1)
  return files.slice(begin, end)
}

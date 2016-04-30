/* eslint-env mocha */
'use strict'

const assert = require('assert')
const path = require('path')
const {lookupFiles} = require('../../../src/lib/utils')

const getTestPath = (fixture, ...files) => {
  let pathStr = path.join(__dirname, '../../fixtures', fixture)
  let testPaths = []
  for (let file of files) {
    testPaths.push(path.join(pathStr, file))
  }
  return testPaths.join(' ')
}

describe('lookupFiles()', () => {
  it('should be able to find files with a simple glob', () => {
    let testPath = getTestPath('glob', 'test/*.js')
    let files = lookupFiles(testPath)
    assert.equal(files.length, 1)
    assert(/test\/1.js$/.test(files[0]))
  })

  it('should be able to find files recursively using default testPath', () => {
    let testPath = getTestPath('recursive', 'test/')
    let files = lookupFiles(testPath)
    assert.equal(files.length, 8)
  })

  it('should be able to specify multiple paths individually', () => {
    let cliArgs = ['test/1/1-file1.js', 'test/1/1-1/1-1-file1.js', 'test/2/2-file2.js']
    let files = []
    for (let file of cliArgs) {
      let testPath = getTestPath('recursive', file)
      files = files.concat(lookupFiles(testPath))
    }
    assert.equal(files.length, 3)
  })
})

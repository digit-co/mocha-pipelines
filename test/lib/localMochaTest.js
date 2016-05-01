/* eslint-env mocha */

const assert = require('assert')
const localMocha = require('../../src/lib/localMocha')

describe('localMocha', () => {
  it('should be able to find project root from path with test/ dir', () => {
    let testFile = 'myproject/test/file1.js'
    let mocha = localMocha(testFile)
    assert.equal(mocha, 'myproject/node_modules/.bin')
  })

  it('should assume current directory is project root if no test/ dir', () => {
    let testFile = 'myproject/cool/what/dir/1.js'
    let mocha = localMocha(testFile)
    assert.equal(mocha, 'node_modules/.bin')
  })
})

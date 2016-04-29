'use strict'

const assert = require('assert')
const {splitFiles} = require('../../../src/lib/utils')

const genFiles = (fileCount) => {
  let files = []
  for (let i = 0; i < fileCount; i++) {
    files.push(`file-${i}.js`)
  }
  return files
}

describe('splitFiles()', () => {
  describe('split files properly', () => {
    before(function() {
      this.files = genFiles(3)
      this.piece1 = splitFiles(this.files, 3, 1)
      this.piece2 = splitFiles(this.files, 3, 2)
      this.piece3 = splitFiles(this.files, 3, 3)
    })
    it('should split files evenly', function() {
      assert.equal(this.piece1.length, 1)
      assert.equal(this.piece2.length, 1)
      assert.equal(this.piece3.length, 1)
    })
    it('pieces should contain different files', function() {
      assert.equal(this.piece1[0], this.files[0])
      assert.equal(this.piece2[0], this.files[1])
      assert.equal(this.piece3[0], this.files[2])
    })
  })

  describe('files cannot be split evenly among pieces when files > pieces', () => {
    before(function() {
      // split 6 files into 4 pieces
      this.files = genFiles(6)
      this.pieces = []
      for (let i = 1; i <= 4; i++) {
        this.pieces.push(splitFiles(this.files, 4, i))
      }
    })
    it('first 2 pieces should have 2 files each', function() {
      assert.equal(this.pieces[0].length, 2)
      assert.equal(this.pieces[1].length, 2)
    })
    it('last 2 pieces should have 1 file each', function() {
      assert.equal(this.pieces[2].length, 1)
      assert.equal(this.pieces[3].length, 1)
    })
  })

  describe('files cannot be split evenly among pieces when files > 2*pieces', () => {
    before(function() {
      // split 9 files into 4 files
      this.files = genFiles(9)
      this.pieces = []
      for (let i = 1; i <=4; i++) {
        this.pieces.push(splitFiles(this.files, 4, i))
      }
    })
    it('first piece should have 3 files', function() {
      assert.equal(this.pieces[0].length, 3)
    })
    it('last 3 pieces should have 2 files each', function() {
      assert.equal(this.pieces[1].length, 2)
      assert.equal(this.pieces[2].length, 2)
      assert.equal(this.pieces[3].length, 2)
    })
  })

  describe('files cannot be split evenly among pieces when pieces > files', () => {
    before(function() {
      // split 3 files into 4 pieces
      this.files = genFiles(3)
      this.pieces = []
      for (let i = 1; i <= 4; i++) {
        this.pieces.push(splitFiles(this.files, 4, i))
      }
    })
    it('first 3 pieces should have 1 file each', function() {
      assert.equal(this.pieces[0].length, 1)
      assert.equal(this.pieces[1].length, 1)
      assert.equal(this.pieces[2].length, 1)
    })
    it('4th piece should have 0 files', function() {
      assert.equal(this.pieces[3].length, 0)
    })
  })

  describe('files cannot be split evenly among pieces when pieces > files 2', () => {
    before(function() {
      // split 18 files into 25 pieces
      this.files = genFiles(18)
      this.pieces = []
      for (let i = 1; i <= 25; i++) {
        this.pieces.push(splitFiles(this.files, 25, i))
      }
    })
    it('first 18 pieces should have 1 file each', function() {
      for (let i = 0; i < 18; i++) {
        assert.equal(this.pieces[i].length, 1)
      }
    })
    it('last 7 pieces should have 0 files each', function() {
      for (let i = 0 + 18; i < 7 + 18; i++) {
        assert.equal(this.pieces[i].length, 0)
      }
    })
  })
})

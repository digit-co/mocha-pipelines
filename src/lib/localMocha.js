'use strict'

const path = require('path')

/**
 * Find the path to the locally installed mocha executable, based on the path
 * to the `testFile`.
 *
 * @param {String} testFile
 * @return {String}
 */
module.exports = (testFile) => {
  // get all directories in the path to test file
  let dirs = testFile.split(path.sep)

  // find the first test/ dir and assume project root is the parent of it
  let projectRoot = '.'
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] === 'test') {
      let projectRootDirs = dirs.slice(0, i + 1)
      projectRootDirs.push('..')
      projectRoot = path.join.apply(null, projectRootDirs)
      break
    }
  }

  // path to locally installed mocha from project root
  return path.join(projectRoot, 'node_modules/.bin')
}

#!/usr/bin/env node
'use strict'

const debug = require('debug')('mocha-pipelines')
const program = require('commander')
const runPipeline = require('../lib/runPipeline')

program
  .arguments('<pipelines> <pipeline> [files...]')
  .action((pipelines, pipeline, files) => {
    debug(`Running action, pipelines: ${pipelines}, pipeline: ${pipeline}, files: ${files}`)

    // default test files to `test/` dir
    if (!files.length) {
      files = ['test/']
    }

    runPipeline(files, pipelines, pipeline, (err, exitCodes) => {
      debug(`Mocha processes closed, err: ${err}, exitCodes: ${exitCodes}`)
      if (err) {
        console.error(`Unexpected error running mocha-pipelines: ${err.toString()}`)
        return process.exit(1)
      }

      // mocha usually exits with an exit code equal to number of failed tests.
      // so let's exit with the sum of those across all processes.
      let exitCode = exitCodes.reduce((a, b) => a + b)
      process.exit(exitCode)
    })
  })
  .parse(process.argv)

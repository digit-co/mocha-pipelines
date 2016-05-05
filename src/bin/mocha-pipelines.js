#!/usr/bin/env node
'use strict'

const os = require('os')
const debug = require('debug')('mocha-pipelines')
const program = require('commander')
const runPipeline = require('../lib/runPipeline')
const pkg = require('../../package.json')

program
  .version(pkg.version)
  .option('-p, --processes [n]', 'specify number of processes to use', os.cpus().length)
  .arguments('<pipelines> <pipeline> [files...]')
  .action((pipelines, pipeline, files) => {
    let cpus = program.processes
    debug(`Running action, pipelines: ${pipelines}, pipeline: ${pipeline}, files: ${files}, cpus: ${cpus}`)

    // default test files to `test/` dir
    if (!files.length) {
      files = ['test/']
    }

    runPipeline(files, pipelines, pipeline, cpus, (err, exitCodes) => {
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

// output help if no arguments are given
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

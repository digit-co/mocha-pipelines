#!/usr/bin/env node
'use strict'

const os = require('os')
const path = require('path')
const {spawn} = require('child_process')
const async = require('async')
const debug = require('debug')('mocha-pipelines')
const program = require('commander')
const prettyHrtime = require('pretty-hrtime')
const once = require('once')
const utils = require('../lib/utils')

const MOCHA_PATH = 'mocha'

const spawnProcess = (pipelineFiles, cpus, cpu, done) => {
  // split pipelineFiles into processes (to be run in parallel on same machine)
  let processFiles = utils.splitFiles(pipelineFiles, cpus, cpu)
  debug(`cpu ${cpu} of ${cpus}, processFiles: ${processFiles}`)

  // don't run mocha unless there are test files for this cpu to run
  if (!processFiles.length) {
    console.error(`Skipping process ${cpu} of ${cpus} (no test files)...`)
    return done(null, 0)
  }

  console.error(`Running process ${cpu} of ${cpus} with ${processFiles.length} test files...`)

  let spawnOpts = {
    stdio: 'inherit',
    env: process.env
  }
  let startAt = process.hrtime()
  let mocha = spawn(MOCHA_PATH, processFiles, spawnOpts)
  done = once(done)
  mocha.on('close', (code) => {
    let runTime = prettyHrtime(process.hrtime(startAt))
    console.error(`Process ${cpu} completed in ${runTime} with code ${code}`)
    done(null, code)
  })
  mocha.on('error', done)
}

const run = (testPath, pipelines, pipeline, done) => {
  let suiteFiles = utils.lookupFiles(testPath)
  debug(`suiteFiles: ${suiteFiles}`)

  // split files into pipelines (to be run in parallel on separate machines)
  let pipelineFiles = utils.splitFiles(suiteFiles, pipelines, pipeline)
  debug(`pipelineFiles: ${pipelineFiles}`)

  console.error(`Running pipeline ${pipeline} of ${pipelines} with ${pipelineFiles.length} test files...`)

  // parallelize files for this pipeline across available CPUs
  // pass array of exit codes back to `done`
  let cpus = os.cpus().length
  async.times(cpus, (i, next) => {
    let cpu = i + 1
    spawnProcess(pipelineFiles, cpus, cpu, next)
  }, done)
}

(function() {
  program
  .arguments('<pipelines> <pipeline> [testPath]')
  .action((pipelines, pipeline, testPath) => {
    debug(`Running action, pipelines: ${pipelines}, pipeline: ${pipeline}, testPath: ${testPath}`)

    // default testPath to `test/` dir of current directory
    if (!testPath) {
      testPath = 'test/'
    }

    run(testPath, pipelines, pipeline, (err, codes) => {
      debug(`Mocha processes closed, err: ${err}, codes: ${codes}`)
      if (err) {
        console.error(`Unexpected error running mocha-pipelines: ${err.toString()}`)
        return process.exit(1)
      }

      // mocha usually exits with an exit code equal to number of failed tests.
      // so let's exit with the sum of those across all processes.
      let exitCode = codes.reduce((a, b) => a + b)
      process.exit(exitCode)
    })
  })
  .parse(process.argv)
})()

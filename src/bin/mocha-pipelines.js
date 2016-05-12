#!/usr/bin/env node
'use strict'

const os = require('os')
const debug = require('debug')('mocha-pipelines')
const program = require('commander')
const runPipeline = require('../lib/runPipeline')
const pkg = require('../../package.json')

let pipelines // total # of pipelines (VMs)
let pipeline  // n of pipelines (VMs)
let files     // test files to distribute across pipelines

program
  .version(pkg.version)
  .option('-p, --processes [n]', 'specify number of processes to use', parseInt, os.cpus().length)
  .arguments('<pipelines> <pipeline> [files...]')
  .action((pipelinesArg, pipelineArg, filesArg) => {
    pipelines = parseInt(pipelinesArg)
    pipeline = parseInt(pipelineArg)
    files = filesArg
  })
  .parse(process.argv)

let cpus = program.processes

// default test files to `test/` dir
if (!files || !files.length) {
  files = ['test/']
}

// default behavior without any arguments: just parallelize test files across
// available cpus
pipelines = pipelines || 1
pipeline = pipeline || 1

debug(`pipelines: ${pipelines}, pipeline: ${pipeline}, files: ${files}, cpus: ${cpus}`)

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

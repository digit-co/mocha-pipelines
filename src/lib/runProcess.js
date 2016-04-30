'use strict'

const { spawn } = require('child_process')
const prettyHrtime = require('pretty-hrtime')
const once = require('once')
const debug = require('debug')('mocha-pipelines:runProcess')
const { splitFiles } = require('./utils')

const MOCHA_PATH = 'mocha'

module.exports = (pipelineFiles, cpus, cpu, done) => {
  // split pipelineFiles into processes (to be run in parallel on same machine)
  let processFiles = splitFiles(pipelineFiles, cpus, cpu)
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

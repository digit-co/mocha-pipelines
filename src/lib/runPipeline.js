'use strict'

const os = require('os')
const async = require('async')
const debug = require('debug')('mocha-pipelines:runPipeline')
const { splitFiles, lookupFiles } = require('./utils')
const runProcess = require('./runProcess')

module.exports = (testFiles, pipelines, pipeline, done) => {
  let suiteFiles = []
  for (let file of testFiles) {
    suiteFiles = suiteFiles.concat(lookupFiles(file))
  }
  debug(`suiteFiles: ${suiteFiles}`)

  // split files into pipelines (to be run in parallel on separate machines)
  let pipelineFiles = splitFiles(suiteFiles, pipelines, pipeline)
  debug(`pipelineFiles: ${pipelineFiles}`)

  console.error(`Running pipeline ${pipeline} of ${pipelines} with ${pipelineFiles.length} test files...`)

  // parallelize files for this pipeline across available CPUs
  // pass array of exit codes back to `done`
  let cpus = os.cpus().length
  async.times(cpus, (i, next) => {
    let cpu = i + 1
    runProcess(pipelineFiles, cpus, cpu, next)
  }, done)
}

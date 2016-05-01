'use strict'

const os = require('os')
const async = require('async')
const debug = require('debug')('mocha-pipelines:runPipeline')
const { splitFiles, lookupFiles } = require('./utils')
const runProcess = require('./runProcess')
const localMocha = require('./localMocha')

module.exports = (testFiles, pipelines, pipeline, done) => {
  let suiteFiles = []
  for (let file of testFiles) {
    suiteFiles = suiteFiles.concat(lookupFiles(file))
  }
  debug(`suiteFiles: ${suiteFiles}`)

  // split files into pipelines (to be run in parallel on separate machines)
  let pipelineFiles = splitFiles(suiteFiles, pipelines, pipeline)
  debug(`pipelineFiles: ${pipelineFiles}`)

  if (!pipelineFiles.length) {
    console.error(`Skipping pipeline ${pipeline} of ${pipelines} (no test files)...`)
    return done(null, [0])
  }

  console.error(`Running pipeline ${pipeline} of ${pipelines} with ${pipelineFiles.length} test files...`)

  // find locally installed mocha based on path of first test file
  let mochaPath = localMocha(pipelineFiles[0])

  // parallelize files for this pipeline across available CPUs
  // pass array of exit codes back to `done`
  let cpus = os.cpus().length
  async.times(cpus, (i, next) => {
    let cpu = i + 1
    runProcess(mochaPath, pipelineFiles, cpus, cpu, next)
  }, done)
}

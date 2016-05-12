# mocha-pipelines
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]

[travis-image]: https://travis-ci.org/hellodigit/mocha-pipelines.svg?branch=master
[travis-url]: https://travis-ci.org/hellodigit/mocha-pipelines

[npm-image]: https://img.shields.io/npm/v/mocha-pipelines.svg?style=flat
[npm-url]: https://npmjs.org/package/mocha-pipelines

*(mocha logo here with pipelines running through it)*

Parallelize your [mocha](https://github.com/mochajs/mocha) tests across
multiple virtual machines (pipelines) and/or processes to decrease the runtime
of your tests.

## Install
```
$ npm install mocha-pipelines --save-dev
```

## Goal
The goal of this module is to provide an easy solution for a project where
running all the mocha tests has become painfully slow.

This project assumes that each test file takes about the same amount of time to
run and evenly distributes the test files across separate machines and processes.
If this is not the case for you, then you may want to split your tests into
smaller test files or run your tests separately in multiple "suites".

For example, you could run 2 pipelines of your unit tests and 5 pipelines of
your integration tests across 7 different machines, all simultaneously:
```
mocha-pipelines 2 1 test/unit/**/*.js
mocha-pipelines 2 2 test/unit/**/*.js

mocha-pipelines 5 1 test/integration/**/*.js
mocha-pipelines 5 2 test/integration/**/*.js
mocha-pipelines 5 3 test/integration/**/*.js
mocha-pipelines 5 4 test/integration/**/*.js
mocha-pipelines 5 5 test/integration/**/*.js
```

## Usage
```
Usage: mocha-pipelines [options] <pipelines> <pipeline> [files...]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -p, --processes [n]  specify number of processes to use

  Example:

    Run 3 pipelines of integration tests
    (run these simultaneously on separate machines)

    mocha-pipelines 3 1 test/integration/**/*.js
    mocha-pipelines 3 2 test/integration/**/*.js
    mocha-pipelines 3 3 test/integration/**/*.js
```

`mocha-pipelines` only requires 2 arguments to get started - the total number
of pipelines you are parallelizing tests across, and the pipeline number of the
machine where the command is being executed.

```
mocha-pipelines <pipelines> <pipeline>
```

For example, to parallelize your tests across across 3 pipelines, you
would run the following commands on 3 separate machines, simultaneously:

* machine 1: `mocha-pipelines 3 1`
* machine 2: `mocha-pipelines 3 2`
* machine 3: `mocha-pipelines 3 3`

## Using with mocha options
If you're currently running mocha with options specified on the command line,
such as: `$ mocha -t 5000 -R tap` then move these to
[`test/mocha.opts`](https://mochajs.org/#mochaopts) and mocha will automatically
parse those when running `mocha-pipelines` with your project.

&copy; 2015-2016 Hello Digit, Inc.

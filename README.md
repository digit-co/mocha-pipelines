# mocha-pipelines

*(mocha logo here with pipelines running through it)*

Parallelize your [mocha](https://github.com/mochajs/mocha) tests across
multiple virtual machines (pipelines) and/or processes to decrease the runtime
of your tests.

## How to parallelize
`mocha-pipelines` only requires 2 arguments to get started - the total number
of pipelines you are parallelizing tests across, and the pipeline number of the
virtual machine that is running the tests.

```
$ mocha-pipelines <pipelines> <pipeline>
```

For example, to parallelize your tests across across 3 pipelines (VMs), you
would run the following commands on 3 separate VMs, simultaneously:

* Pipeline 1 (VM 1): `$ mocha-pipelines 3 1`
* Pipeline 2 (VM 2): `$ mocha-pipelines 3 2`
* Pipeline 3 (VM 3): `$ mocha-pipelines 3 3`

## Using with mocha options
If you're currently running mocha with options specified on the command line,
such as: `$ mocha -t 5000 -R tap` then move these to
[`test/mocha.opts`](https://mochajs.org/#mochaopts) and mocha will automatically
parse those when running `mocha-pipelines` with your project.

&copy; 2015-2016 Hello Digit, Inc.

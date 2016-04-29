# mocha-pipelines

Parallelize your mocha tests across multiple virtual machines (pipelines) to
decrease the runtime of your tests.

**This project is currently unusable in it's current form. It's currently being
moved out into it's own module from another project.**

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

&copy; 2015-2016 Hello Digit, Inc.

\# Week 12 – GitHub Actions CI



\## Exercise 1 – Create your first CI workflow



1\. \*\*What does `on` do?\*\*



&#x20;  Defines the events that trigger the workflow, such as pushes and pull requests targeting `week12/ci`.



2\. \*\*What does `runs-on` do?\*\*



&#x20;  Specifies the operating system environment used to run the job. We use `ubuntu-latest`.



3\. \*\*What does `strategy.matrix` do?\*\*



&#x20;  Runs the same job with different configurations. Our workflow tests Node.js 20 and 22.



4\. \*\*What are `steps`?\*\*



&#x20;  Individual actions and commands executed in sequence. Our steps check out the repository, set up Node.js, install dependencies and run tests.



5\. \*\*Why might nothing happen when you push?\*\*



&#x20;  The workflow only triggers for branches matching its configured branch filters.



\*\*Results:\*\* Both Node.js jobs passed. Each completed 4 test files and 26 tests successfully.


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



\## Exercise 2 – Read the CI test report



\*\*1. How many jobs ran in GitHub Actions? Why?\*\*



Two jobs ran because the matrix configuration tests the project using Node.js 20 and Node.js 22.



\*\*2. What are the pizza test names?\*\*



\- should successfully complete a full pizza order

\- createPizza returns correct type and price

\- createPizza throws for unknown type

\- sendOrder returns a numeric order id

\- orderPizza returns true for a valid pizza

\- createPizza accepts vegetarian

\- chargeCustomer returns true for a valid order

\- chargeCustomer throws when order ID is undefined

\- chargeCustomer throws when order ID is negative

\- chargeCustomer throws when order ID is not a whole number

\- chargeCustomer throws when amount is zero



\*\*3. What are the library test names?\*\*



\- findBook returns dune

\- findBook returns foundation even with zero copies

\- findBook throws for an unknown book

\- findBook throws for a number

\- checkOutBook returns a number

\- checkOutBook returns a whole number

\- checkOutBook returns a number between 1000 and 9999

\- checkOutBook throws when no copies are available

\- checkOutBook throws when copiesAvailable is missing



\*\*4. Why can a test pass on your laptop but fail in CI?\*\*



Different environments can have different operating systems, Node.js versions, dependencies, environment variables, or configurations. CI helps detect problems that may not appear on a developer's computer.



\*\*Results:\*\* All 26 tests passed across 4 test files.



# Week 12 – GitHub Actions CI

## Exercise 1 – Create your first CI workflow

1. **What does `on` do?**

   Defines the events that trigger the workflow, such as pushes and pull requests targeting `week12/ci`.

2. **What does `runs-on` do?**

   Specifies the operating system environment used to run the job. We use `ubuntu-latest`.

3. **What does `strategy.matrix` do?**

   Runs the same job with different configurations. Our original workflow tested Node.js 20 and 22.

4. **What are `steps`?**

   Individual actions and commands executed in sequence. Our steps check out the repository, set up Node.js, install dependencies and run tests.

5. **Why might nothing happen when you push?**

   The workflow only triggers for branches matching its configured branch filters.

**Results:** Both Node.js jobs passed. Each completed 4 test files and 26 tests successfully.

## Exercise 2 – Read the CI test report

**1. How many jobs ran in GitHub Actions? Why?**

Two jobs ran because the matrix configuration tested the project using Node.js 20 and Node.js 22.

**2. What are the pizza test names?**

- should successfully complete a full pizza order
- createPizza returns correct type and price
- createPizza throws for unknown type
- sendOrder returns a numeric order id
- orderPizza returns true for a valid pizza
- createPizza accepts vegetarian
- chargeCustomer returns true for a valid order
- chargeCustomer throws when order ID is undefined
- chargeCustomer throws when order ID is negative
- chargeCustomer throws when order ID is not a whole number
- chargeCustomer throws when amount is zero

**3. What are the library test names?**

- findBook returns dune
- findBook returns foundation even with zero copies
- findBook throws for an unknown book
- findBook throws for a number
- checkOutBook returns a number
- checkOutBook returns a whole number
- checkOutBook returns a number between 1000 and 9999
- checkOutBook throws when no copies are available
- checkOutBook throws when copiesAvailable is missing

**4. Why can a test pass on your laptop but fail in CI?**

Different environments can have different operating systems, Node.js versions, dependencies, environment variables, or configurations. CI helps detect problems that may not appear on a developer's computer.

**Results:** All 26 tests passed across 4 test files.

## Exercise 3 – Intentionally failing test

**1. What happened when the failing test was pushed?**

GitHub Actions detected the failing test and marked the CI jobs as failed. The test expected 1 to equal 2, which caused the workflow to turn red.

**2. What happened after fixing the test?**

After changing the expectation to 1 to equal 1 and pushing the fix, GitHub Actions ran again and both jobs passed.

**3. Which event started the new CI run?**

The push event started a new workflow run after the fix was pushed to the pull request branch.

**4. Why is it better to catch a failing test in a pull request rather than after merging?**

A pull request allows CI to detect problems before code enters the main development branch. This prevents broken code from being merged and gives the developer a chance to fix it first.

## Exercise 4 – TypeScript Typechecking

1. `tsc --noEmit` runs the TypeScript compiler and checks for type errors without generating JavaScript files.

2. Typechecking before tests catches TypeScript errors early, preventing invalid code from continuing through the CI pipeline.

3. TypeScript can catch possible null errors when strict null checks are enabled and the types indicate a value might be null.

4. CI detected the intentional type error when a string was assigned to a number variable. After removing the error, both Node.js jobs passed.

## Exercise 5 – Node.js Versions and Dependencies

1. The CI matrix tests the project with Node.js 22, 24, and 26 to check compatibility across supported LTS versions.

2. The `engines` field in `package.json` specifies that the project requires Node.js 22 or newer.

3. `npm install` installs dependencies and can update `package-lock.json`. `npm ci` installs the exact dependency versions from `package-lock.json` and does not modify the lockfile.

4. CI uses `npm ci` because it provides consistent, reproducible installations and helps detect problems with the lockfile.

**Results:** Local typechecking passed, all 27 tests passed across 5 test files, and GitHub Actions passed on Node.js 22, 24, and 26.

## Exercise 7 – Fix the Broken Workflow

The four bugs were:

1. The workflow targeted `master` instead of `week12/ci`.
2. The Node.js matrix variable used `matrix.node` instead of `matrix.node-version`.
3. The workflow was missing the checkout step.
4. Dependencies were not installed before running the tests.

**Which bug was the most dangerous, and why?**

The incorrect branch filter was the most dangerous because the workflow did not run for pull requests targeting `week12/ci`. This could give a false impression that the code had passed CI when the broken workflow had not actually run.

## Exercise 8 - Code Coverage

### What does code coverage tell you?

Code coverage tells me how much of my code is executed when my tests run. It helps identify parts of the application that are not tested and shows where additional tests may be needed.

### What is the difference between line, function, branch and statement coverage?

- **Line coverage:** Measures how many lines of code are executed.
- **Function coverage:** Measures how many functions are called during tests.
- **Branch coverage:** Measures whether different decision paths, such as if/else conditions, are tested.
- **Statement coverage:** Measures how many individual statements are executed.

### What happened when you removed a test?

When I removed the test for `checkOutBook` throwing an error when no copies were available, the coverage thresholds failed. This showed that the missing test reduced coverage below the required threshold.

After restoring the test, all 27 tests passed and coverage returned to 100%.

### Why are coverage thresholds useful?

Coverage thresholds prevent code coverage from dropping below an agreed minimum. They encourage developers to write tests for important functionality and help detect missing tests before changes are merged.

## Exercise 9 - CI for your Sentry API

### What does Sentry do without a DSN? If CI did need the DSN, where would it go?

Without a DSN, Sentry cannot send error events to my Sentry project. The application and unit tests can still run because I mock the Sentry functions in Vitest.

If CI needed the DSN, I would store it as an encrypted GitHub Actions repository secret named `SENTRY_DSN` and reference it in the workflow using `${{ secrets.SENTRY_DSN }}`. I would never commit the DSN to the repository.

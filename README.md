
# Week 10 – Test-Driven Development (TDD)

[![CI](https://github.com/bindhada/mongodb/actions/workflows/ci.yml/badge.svg?branch=week12/ci)](https://github.com/bindhada/mongodb/actions/workflows/ci.yml)

## Introduction

This project focuses on Test-Driven Development (TDD), unit testing, integration testing, and data validation using TypeScript, Vitest, and Zod.

The goal was to practise writing tests, implementing functions, and checking that the code behaves as expected.

## Exercise 1 – Pizza Shop

In this exercise, I worked with a pizza shop application.

I implemented and tested the following functions:

- `createPizza()` – Creates a pizza with the correct type and price.
- `sendOrder()` – Sends a pizza order to the kitchen and generates an order ID.
- `chargeCustomer()` – Validates the order ID and payment amount.
- `orderPizza()` – Completes the full ordering process.

### Schema validation

I used Zod to validate data:

- `PizzaTypeSchema` validates pizza types.
- `PizzaSchema` validates pizza objects.
- `OrderIdSchema` validates order IDs.
- `AmountSchema` validates payment amounts.

I also wrote unit tests and an integration test to check that the pizza ordering process works correctly.

## Exercise 2 – Library

In this exercise, I worked with a library application.

I implemented and tested:

- `findBook()` – Finds a book by its title.
- `checkOutBook()` – Generates a loan ID when a book can be checked out.

I tested different situations, including:

- Finding existing books.
- Handling unknown books.
- Handling invalid input.
- Generating numeric loan IDs.
- Ensuring loan IDs are whole numbers between 1000 and 9999.
- Preventing checkout when no copies are available.
- Handling missing book information.

## Testing

I used Vitest to run the automated tests.

Command used:

```bash
npm test
```

### Final test results

| Test file | Tests passed |
|---|---:|
| pizzashop.test.ts | 10 |
| pizzashop.integration.test.ts | 1 |
| schemas.test.ts | 6 |
| library.test.ts | 9 |
| **Total** | **26** |

All 26 tests passed successfully.

## What I learned

Through these exercises, I learned:

- How to write unit tests using Vitest.
- How to write integration tests.
- How to use the Arrange, Act, Assert testing pattern.
- How to validate data using Zod.
- How to test valid and invalid inputs.
- How to use test results to identify and fix errors.
- How to practise Test-Driven Development.

## Conclusion

These exercises helped me understand how testing improves code quality and reliability. I also gained practical experience writing tests, debugging errors, and validating data in TypeScript.

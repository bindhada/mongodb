Week 11 – Code Quality with SonarQube
Exercise 1 – SonarQube in Docker

Question: What does docker ps show you? Which columns tell you that SonarQube is running, and on which port?

The docker ps command shows the containers that are currently running. The STATUS column tells me whether the SonarQube container is running. The PORTS column shows that port 9000 on my computer is mapped to port 9000 inside the container.

Question: Why run SonarQube in Docker instead of installing it directly on your computer?

Running SonarQube in Docker makes installation and configuration easier because everything runs inside a container. It avoids installing and managing all of SonarQube's dependencies directly on my computer. Docker Compose also makes it easy to start and stop SonarQube, and the volume preserves its data when the container is removed.

Exercise 2 – Your first scan

Question: Did your project pass or fail the quality gate? How many issues did SonarQube find?

My first scan results should be recorded here using the original analysis in SonarQube. My latest scan passes the quality gate and reports zero issues.

Exercise 3 – Read before you fix
Three issues

I need to document three actual issues from my original scan. For each issue:

Rule name: [INSERT ACTUAL RULE NAME]
File and line: [INSERT FILE AND LINE]
What is wrong: [EXPLAIN THE ISSUE IN YOUR OWN WORDS]
Compliant code: [SHOW THE CORRECTED CODE]
My opinion: [EXPLAIN WHETHER I AGREE WITH THE ISSUE AND WHY]

Repeat this for all three issues.

Question: Explain each of the three groups your SonarQube uses, with an example.

Security: These issues could expose the application or its data to attackers. An example is a hard-coded password or an exposed secret.
Reliability: These issues could cause the application to behave incorrectly or fail. An example is code that could cause a null reference error.
Maintainability: These issues make code harder to understand, change or maintain. An example is duplicated code or a function that is unnecessarily complicated.

Question: What does each of tests, Zod, Sentry and SonarQube find that the others cannot?

Tests check whether the application behaves as expected and whether existing functionality continues to work after changes. Zod validates incoming data at runtime and prevents invalid values from entering the application. Sentry monitors the running application and reports errors that actually happen in production. SonarQube analyses source code without running the application and identifies problems such as code smells, security weaknesses and possible bugs.

They complement each other because they detect different types of problems.

Exercise 4 – Get the token out of your code

Question: Your package.json goes to GitHub. What could someone do with your SonarQube token if they found it there? What about a database password or a Sentry DSN?

Someone with access to my SonarQube token could potentially use the permissions associated with that token to access or modify SonarQube project information. A database password could allow someone to access, steal or modify sensitive database information. A Sentry DSN is different because it is generally a client-side project identifier used to send error reports. Exposing it could allow someone to send unwanted or fake error events. It should still be configured carefully, and private authentication tokens must never be exposed.

Question: Why is it better to put settings like the project key in sonar-project.properties than in a long command?

It is better because the configuration stays in one central file instead of having to repeat a long command every time I run the scanner. It makes the project easier to configure, understand and maintain. It also keeps sensitive information separate from ordinary project settings.

Exercise 5 – Scan only your own code

Question: What changed in the numbers, and why? Why is it a problem when a tool reports issues in code you didn't write?

Excluding unnecessary folders such as node_modules, coverage and generated files reduces the amount of code SonarQube analyses. The number of lines and issues can therefore change. This is important because downloaded and generated code is not code that I maintain myself. Reporting issues in those files creates unnecessary noise and makes it harder to identify problems in my own application.

Exercise 6 – Fix, test, repeat
Fix table
Rule	File	What I changed	Tests still green?
[Actual rule]	[Actual file]	[Actual change]	Yes
[Actual rule]	[Actual file]	[Actual change]	Yes
[Actual rule]	[Actual file]	[Actual change]	Yes
[Actual rule]	[Actual file]	[Actual change]	Yes

Question: Why run your tests after every fix, even when the change looks small?

I run my tests after every fix to make sure that the change has not broken existing functionality. Even a small code change can have unexpected consequences. Running the tests after each change makes it easier to find and correct regressions before they become bigger problems.

Question: Choose one of your fixes. Is the code easier to read now? Explain why or why not.

[Describe one of your actual fixes.] The code is easier to read because [explain what improved, such as clearer separation of responsibilities, more descriptive names or simpler asynchronous control flow].

Exercise 7 – Test coverage in SonarQube

Question: Compare the coverage percentage in SonarQube with the table Vitest prints. Are they the same? If not, why might they differ?

The coverage percentages are not exactly the same. Vitest reports approximately 30.28% statement and line coverage, while my latest SonarQube dashboard reports 29.1% coverage.

The difference can happen because the tools may calculate and display coverage using different sets of executable lines and source files. Exclusions, test-file configuration and how the LCOV report maps to the analysed source files can also affect the result.

Question: Why does the script use && between the two commands? What happens if a test fails?

The && operator makes sure that the SonarQube scan only starts if the coverage tests finish successfully. If a test fails, the first command returns a non-zero exit code and the scanner command will not run. This prevents an analysis from being submitted when the tests have failed.

Exercise 8 – Make the quality gate fail, then pass

Question: Why does the quality gate focus on new code, and not on all the code in the project?

The quality gate focuses on new code because large projects can contain many old issues that would take a long time to fix. Requiring every existing issue to be fixed immediately could prevent development from continuing. Focusing on new code allows a team to improve the project gradually while preventing new problems from being introduced.

Question: In a team, what could you use a failing quality gate for?

A failing quality gate can be used to prevent code from being merged into the main branch until important quality requirements have been met. It can be integrated into a CI/CD pipeline so that new code must pass the quality checks before a pull request can be approved or merged.

Exercise 9 – Security review and final report
Quality report
Metric	First scan	Final scan
Quality gate	[Original result]	Passed
Lines of code	[Original number]	[Final number from dashboard]
Issues	[Original number]	0
Security hotspots to review	[Original number]	0
Coverage	[Original percentage]	29.1%

What changed the most, and what caused it?

The final scan reports zero issues and zero duplications, and the quality gate passes. The coverage report is also integrated into SonarQube. The changes resulted from configuring the scanner, excluding unnecessary files, fixing code quality issues and connecting the Vitest coverage report.

Which fix are you proudest of, and why?

[Describe your actual favourite fix.] I am proud of this fix because it improved the readability and maintainability of the application while keeping the tests passing.

What's left, and would you fix it next, or leave it? Why?

The current coverage is 29.1%, which means that a significant part of the application is not covered by automated tests. I would improve this by writing additional tests for the parts of the application that currently have the least coverage. This would make future changes safer.

Question: You marked an issue as Accept or False positive. What could go wrong if a team does that too often?

If a team marks too many issues as accepted or false positives without properly investigating them, genuine problems could be ignored. Security vulnerabilities and reliability problems could remain in the application. It could also make the quality report less useful because important issues would be hidden among accepted findings.

Question: Over the last weeks you used tests, Zod, Sentry and SonarQube. If you could only keep two of them on a real project, which would you choose, and why?

I would choose automated tests and Sentry. Automated tests help prevent regressions and verify that the application behaves correctly before deployment. Sentry helps detect and investigate errors that occur when the application is actually running. They provide two different but important types of protection. I would still consider input validation and static analysis important, but if I could only keep two tools, these would be my choices.

Note: Historical scan numbers, actual issue examples, fixes and security review decisions must reflect my real project results. I should not invent these values.
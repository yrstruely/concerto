# Concerto

API/Network functional and performance testing living together in perfect hamony

Mainly utilizing the: mocha, Axios and k6 libraries, reporting handled by: mochawesome and k6 Cloud

This project is also designed to be built and run in a docker container so that it can easily be integrated into an existing CI/CD build pipeline

# Setup

 - Clone this repository to your local development environment
 - Install and run Docker: https://www.docker.com/products
 - Install and run Fiddler 4: https://www.telerik.com/download/fiddler
 - With Fiddler capturing, in your terminal (from your project directory): run >docker-compose -f docker-compose.dev.yml up --build
 - you will see some example tests run with test results output to the terminal

# Creating your own tests

The tests are written in Node.js with the functional tests using the Axios library and the performance tests using the k6 library

All tests should be placed in the ./test folder and if you require them to run in a particular order then name them as:

 - 1.test1.spec.js
 - 2.test2.spec.js
 - etc.

you can have any sub-folders you like under ./test so that you can organise your tests into logical groupingsm

# Running your tests

There are various methods available for running your tests:

 - Docker
 - Node/npm
 - Debugging in VS Code
 - Functional and Performance tests together
 - Functional and Performance tests separtely
 - Functional tests via the Fiddler proxy


# Test reports

 - Integration test results are generated by mochawesome and stored in the ./mochawesome-report/ directory
 - Performance test results are added to k6 Cloud and can be viewed from https://app.k6.io/runs/<testRunId> (you will need a k6 cloud login for this)


# New User Installation notes:
 - Need to install node/npm
 - Need notes on installing through proxy
  - npm config set proxy http://<username>:<password>@nzakleproxyvip.zeus.ghsewn.com:8080
  - npm config set proxy https://<username>:<password>@nzakleproxyvip.zeus.ghsewn.com:8080
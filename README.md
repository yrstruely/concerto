# Concerto

API/Network functional and performance testing living together in perfect hamony

Mainly utilizing the Axios and R6 libraries

# Setup

 - Clone this repository to your local development environment
 - Install and run Docker: https://www.docker.com/products
 - Install and run Fiddler 4: https://www.telerik.com/download/fiddler
 - With Fiddler capturing, in your terminal (from your project directory): run >docker-compose -f docker-compose.dev.yml up --build
 - you will see some example tests run with test results output to the terminal

# Creating your own tests

The tests are written in Node.js with the functional tests using the Axios library and the performance tests using the K6 library

All tests should be placed in the ./requests folder and if you require them to run in a particular order then name them as:

 - 1.test1.js
 - 2.test2.js
 - etc.

you can have any sub-folders you like under ./requests so that you can organise your tests into logical groupings. Having grouped your tests into folders you can run subsets of your test suite by specifying which folder you want concerto to run the tests from

# Concerto
API functional and performance testing living together in perfect hamony!
Mainly utilizing: mocha, Axios and k6 libraries, reporting handled by: mochawesome and k6 Cloud
This project is also designed to be built and run in a docker container so that it can easily be integrated into an existing CI/CD build pipeline
# Dependencies
 - Install [Node and Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) --- *presumably you have these already!*
 - Install [Docker](https://www.docker.com/products) --- *building and running tests in docker containers*
 - Install [k6.io](https://k6.io/docs/get-started/installation/) --- *required for running performance tests*
 - Install [xk6-dotenv](https://github.com/szkiba/xk6-dotenv) --- *allows tests to be run in multiple environments i.e. dev, test, production*
 - **Note:** xk6-dotenv has additional dependencies (as documented in its github). Namely: Go toolchain, Git and xk6. Alternatively, it is possible to build `xk6-dotenv` using the docker image for `xk6`. This means that you do not need to install the `xk6` dependencies locally. This will build a new `k6` locally, which you will need to move to the `k6` path location i.e. `which k6`. To do this use this command: `sudo docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@latest`
 - **Also note:** these dependencies are already available in the docker image supplied with concerto. Therefore, another option is to run the tests in a local docker container
# Installation
- Install the concerto npm package globally
-  `npm install -g concerto`
- Create a directory for your API testing project `<project-dir>` and `cd` into it
- `mkdir <project-dir>`
- From this directory, run the following commands:
- `concerto init`
- `npm install`
- `xk6 build --with github.com/szkiba/xk6-dotenv@latest` (local install) or `sudo docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@latest` (k6 + xk6-dotenv built via docker) --- *see dependency notes for xk6-dotenv*
- `concerto test`
- `concerto results`
- Congratulations! You have just run concerto's pre-installed sample tests and been shown the test results
# Building and Running with docker-compose
 - From your project directory run `docker-compose -f docker-compose.yml up --build`
# Building directly from docker (i.e. no docker-compose)
## PowerShell
- `PowerShell > docker build -t concerto .`
- `PowerShell > docker run -v ${PWD}\results:/concerto/results -p 80:80 -p 443:443 concerto`
## Linux
- `Linux > sudo docker build -t concerto .`
- `Linux > sudo docker run -v $(pwd)/results:/concerto/results -p 80:80 -p 443:443 concerto`
## cmd
- `cmd > docker build -t concerto .`
- `cmd > docker run -v %cd%\results:/concerto/results -p 80:80 -p 443:443 concerto`
# Creating your own tests
## Functional Tests
The tests are written in Node.js with the functional tests using the Axios library and the performance tests using the k6 library
To utilize Axios via concerto, you should create a client configuration file which holds the methods for interaction with your API under test, see `./client-configs/sample-client-config.js` for an example of how this is done
All tests should be placed in the ./test folder and if you require them to run in a particular order then name them as:
- 1.test1.spec.js
- 2.test2.spec.js
- etc.
you can have any sub-folders you like under ./test so that you can organise your tests into logical groups
## Performance Tests
There are two files in the `./client-configs` folder for writing your performance tests: `k6-imports-template.js` and `k6-exports-template.js`. The reason the k6 tests are seperated into two files like this is so that the API configuration code can be auto-generated from your existing functional tests (therefore keeping your functional and performance tests automatically in sync). 
Most of the time, you will not need to change the `k6-imports-template.js` file (unless you want to add extra libraries to k6)
As concerto autogenerates performance test configuration methods, all you need to do is link those methods to your k6 performance test configuration and run them. An example of how this is done can be seen in the `k6-exports-template.js` file.
### Steps:
1. In the `k6-exports-template.js` file create API method config variables from your existing API methods in your `./client-configs/sample-client-config.js` file *just assume they already exist!*
2. e.g. `const getPostsConfig = getPosts()` --- *where getPosts() is an existing method from `./client-configs/sample-client-config.js`*
3. Set up your k6 requests using the the method config variables you just created
4. e.g. ```const requests = {
    'GET posts': {
      method: getPostsConfig.method,
      url: getPostsConfig.url,
      params: {
        headers: getPostsConfig.headers
      }
    },
  }```
5. Add k6 checks for the pass/fail criteria of your requests
6. e.g. ```check(
    responses['GET posts'], {
    'status is 200': (res) => res.status === 200
  })```
7. Set up k6 options to configure how k6 will conduct the performance testing
8. e.g. ```export const options = {
  stages: [
    { target: 5, duration: '10s' },
    { target: 45, duration: '10s' },
    { target: 0, duration: '10s' }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(90)<30000'],
    checks: ['rate>0.99']
  },
};```
9. And you are done! concerto will handle adding the missing API methods based your your function tests and you can now run the performance tests and view the results
**Note:** Further documentation on how to create k6 performance tests can be found at [k6 Docs](https://k6.io/docs/)
# Running your tests
There are various methods available for running your tests:
- Docker: `docker-compose -f docker-compose.yml up --build`
- Node/npm: `concerto test`
- Debugging in VS Code
- Functional and Performance tests together: `concerto test`
- Functional and Performance tests separtely: `concerto test functional` or `concerto test performance`
# Test reports
- Functional test results are generated and stored in: `./results/integration/index.html` and can be viewed by: `concerto results functional`
- Performance test results are generated and stored in: `./results/performance/k6-html-report/report.html` and can be viewed by: `concerto results performance`
- Performance test results are also added to k6 Cloud and can be viewed from https://app.k6.io/runs/<testRunId> (you will need a k6 cloud login for this)

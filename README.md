# Concerto
API functional and performance testing living together in perfect hamony!
Mainly utilizing: mocha, Axios and k6 libraries, reporting handled by: mochawesome and k6 Cloud
This project is also designed to be built and run in a docker container so that it can easily be integrated into an existing CI/CD build pipeline
# Dependencies
 - Install [Node and Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) --- *presumably you have these already!*
 - Install [Docker](https://www.docker.com/products) --- *building and running tests in docker containers*
 - Install [k6.io](https://k6.io/docs/get-started/installation/) --- *required for running performance tests*
 - Install [xk6-dotenv](https://github.com/szkiba/xk6-dotenv) --- *allows tests to be run in multiple environments i.e. dev, test, production*
 - **Note:** xk6-dotenv has additional dependencies (as documented in its github). Namely: Go toolchain, Git and xk6.
   - Alternatively, it is possible to build `xk6-dotenv` using the docker image for `xk6`. This means that you do not need to install the `xk6` dependencies locally. This will build a new `k6` locally, which you will need to move to the `k6` path location i.e. `which k6`. To do this use this command: 
        ```sh
        sudo docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@latest
        ```
 - **Also note:** these dependencies are already available in the docker image supplied with concerto. Therefore, another option is to run the tests in a local docker container, see: [Building and Running with docker-compose](#BuildingandRunningwithdocker-compose)
# Installation
- Install the concerto npm package globally
  ```sh
  npm install -g concerto
  ```
- Create a directory for your API testing project `<project-dir>` and `cd` into it
  ```sh
  mkdir <project-dir>
  cd <project-dir>
  ```
- From this directory, run the following commands:
  ```sh
  concerto init
  npm install
  ```
  - Then either:
    ```sh 
    xk6 build --with github.com/szkiba/xk6-dotenv@latest
    ```  
  - For a local installation, or:
    ```sh
    sudo docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@latest
    ``` 
  - For installing `k6` + `xk6-dotenv` via docker
- Finally:
  ```sh
  concerto test
  concerto results
  ```
- Congratulations! You have just run concerto's pre-installed sample tests and been shown the test results
# Building and Running with docker-compose
 - From your project directory run: 
    ```sh
    docker-compose -f docker-compose.yml up --build
    ```
# Building directly from docker (i.e. no docker-compose)
## Windows
### PowerShell
```sh
docker build -t concerto .
docker run -v ${PWD}\results:/concerto/results -p 80:80 -p 443:443 concerto
```
### cmd
```sh
docker build -t concerto .
docker run -v %cd%\results:/concerto/results -p 80:80 -p 443:443 concerto
```
## Linux
```sh
sudo docker build -t concerto .
sudo docker run -v $(pwd)/results:/concerto/results -p 80:80 -p 443:443 concerto
```
# Creating your own tests
## Functional Tests
The tests are written in Node.js with the functional tests using the Axios library and the performance tests using the k6 library
To utilize Axios via concerto, you should create a client configuration file which holds the methods for interaction with your API under test, see `<project-dir>/client-configs/sample-client-config.js` for an example of how this is done
All tests should be placed in the `<project-dir>/test` folder and if you require them to run in a particular order then name them as:
- `1.test1.spec.js`
- `2.test2.spec.js`
- etc.
  
You can have any sub-folders you like under `<project-dir>/test` so that you can organise your tests into logical groups
## Performance Tests
There are two files in the `<project-dir>/client-configs` folder for writing your performance tests: `k6-imports-template.js` and `k6-exports-template.js`. The reason the k6 tests are seperated into two files like this is so that the API configuration code can be auto-generated from your existing functional tests (therefore keeping your functional and performance tests automatically in sync). 
Most of the time, you will not need to change the `k6-imports-template.js` file (unless you want to add extra libraries to k6)
As concerto autogenerates performance test configuration methods, all you need to do is link those methods to your k6 performance test configuration and run them. An example of how this is done can be seen in the `k6-exports-template.js` file.
### Steps:
1. In the `k6-exports-template.js` file create API method config variables from your existing API methods in your `./client-configs/sample-client-config.js` file --- *just assume they already exist!*
2. For example: `const getPostsConfig = getPosts()` --- *where `getPosts()` is an existing method from `./client-configs/sample-client-config.js`*
3. Set up your k6 requests using the the method config variables you just created
    ```js
      const requests = {
        'GET posts': {
          method: getPostsConfig.method,
          url: getPostsConfig.url,
          params: {
            headers: getPostsConfig.headers
          }
        },
      }
      ```
4. Add k6 checks for the pass/fail criteria of your requests
    ```js
      check(
        responses['GET posts'], {
        'status is 200': (res) => res.status === 200
      })
      ```
5. Set up k6 options to configure how k6 will conduct the performance testing
    ```js
      export const options = {
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
    };
    ```
6. And you are done! concerto will handle adding the missing API methods based your your function tests and you can now run the performance tests and view the results
**Note:** Further documentation on how to create k6 performance tests can be found at [k6 Docs](https://k6.io/docs/)
# Running your tests
There are various methods available for running your tests:
- Docker: `docker-compose -f docker-compose.yml up --build`
- Node/npm: `concerto test`
- Running and/or debugging in VS Code
- Functional and Performance tests together: `concerto test`
- Functional and Performance tests separtely: `concerto test functional` or `concerto test performance`
# Test reports
- Functional test results are generated and stored in: `<project-dir>/results/integration/index.html` and can be viewed by: `concerto results functional`
- Performance test results are generated and stored in: `<project-dir>/results/performance/k6-html-report/report.html` and can be viewed by: `concerto results performance`
- Performance test results are also added to k6 Cloud and can be viewed from https://app.k6.io/runs/<testRunId> (you will need a k6 cloud login for this)

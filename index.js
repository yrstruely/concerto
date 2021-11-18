
require('dotenv').config({ path: 'develop.env' })
const oauth2_login = require('./requests/iapprove-exp-v3/oauth2/1.oauth2-login.js')
const oauth2_login_submit = require('./requests/iapprove-exp-v3/oauth2/2.oauth2-login-submit.js')

var tests = []
var currentTest
var glob = require('glob')
    , path = require('path')

glob.sync('./requests/iapprove-exp-v3/oauth2/**/*.js').forEach(function (file) {

    const { run } = require(path.resolve(file))

    currentTest = run
    tests.push(path.basename(file))
})

async function runTest(runner, testName) {
    var result
    try {
        result = await runner(testName, result)
        console.log('result is: ' + result)
    } catch (error) {
        console.log(error)
    }
}

async function runTests() {
    // Yay! asyncIterator you saved me :)
    for await (const test of tests) {
        await runTest(currentTest, test)
    }
}
runTests()

console.log(tests)

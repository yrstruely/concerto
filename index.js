
require('dotenv').config({ path: 'develop.env' })

var tests = []
var result
var glob = require('glob')
    , path = require('path')

glob.sync('./requests/iapprove-exp-v3/oauth2/**/*.js').forEach(function (file) {

    const { run } = require(path.resolve(file))

    tests.push({ instance: run, name: path.basename(file)})
})

async function runTest(test) {
    try {
        result = await test.instance(test.name, result)
        console.log('result is: ' + result)
    } catch (error) {
        console.log(error)
    }
}

async function runTests() {
    // Yay! asyncIterator you saved me :)
    for await (const test of tests) {
        await runTest(test)
    }
}
runTests()

console.log(tests)

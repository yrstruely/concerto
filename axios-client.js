const axios = require('axios');

async function makeRequest(config) {
    let result
    await axios(config)
        .then(response => {
            result = response
        })
        .catch(error => {
            result = error
        })
    return result
}

function logResult(result, test_name) {
    console.log('')
    console.log('----------------RUNNING-TEST----------------')
    console.log('')
    console.log(test_name)
    console.log('')
    if (result.isAxiosError === true) {
        console.log('----------------REQUEST----------------')
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}`)
        console.log(result.config.headers)
        console.log(result.config.data)
        console.log('----------------RESPONSE----------------')
        console.log(result.response.headers)
        console.log(result.response.data)
        console.log(`${result.response.status} ${result.response.statusText}`)
        console.log('----------------END----------------')
    }
    else {
        console.log('----------------REQUEST----------------')
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}`)
        console.log(result.config.headers)
        console.log(result.config.data)
        console.log('----------------RESPONSE----------------')
        console.log(result.headers)
        //console.log(result.data)
        console.log(`${result.status} ${result.statusText}`)
        console.log('----------------END----------------')
    }
}

module.exports = {
    makeRequest,
    logResult
}
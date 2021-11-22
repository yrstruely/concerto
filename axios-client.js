const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function makeRequest(config, data) {

    if (config.hasOwnProperty('headers')) {
        config.headers['cookie'] = data['set_cookies'].join('; ')  
    }
    await client(config)
        .then(response => {
            result = response

            for (let i = 0; i < result.headers['set-cookie'].length; i++) {
                const cookie = result.headers['set-cookie'][i];
                jar.setCookie(result.headers['set-cookie'][i], result.url, function(err, cookie) {
                    console.log('added cookie: ' + cookie)
                })
            }
        })
        .catch(error => {
            result = error
        })
    return result
}

function getSetCookie(result, data) {
    for (let i = 0; i < result.headers['set-cookie'].length; i++) {
        const result_header = result.headers['set-cookie'][i];
        for (let j = 0; j < data['set_cookies'].length; j++) {
            const data_header = data['set_cookies'][j];
            
            if (result_header.split('=')[0] === data_header.split('=')[0]) {
                data['set_cookies'][j] = result.headers['set-cookie'][i]
            }
        }
    }
    return data
}

function logResult(result, test_name) {
    console.log('')
    console.log('----------------RUNNING-TEST----------------')
    console.log('')
    console.log(test_name)
    console.log('')
    if (result.isAxiosError === true) {
        console.log('----------------REQUEST----------------')
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}?${result.config.params}`)
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
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}?${result.config.params}`)
        console.log(result.config.headers)
        console.log(result.config.data)
        console.log('----------------RESPONSE----------------')
        console.log(result.headers)
        console.log(result.data)
        console.log(`${result.status} ${result.statusText}`)
        console.log('----------------END----------------')
    }
}

module.exports = {
    makeRequest,
    getSetCookie,
    logResult
}
const PROJECT_DIR = '../../../'
const axios = require(PROJECT_DIR + "axios-client.js")
const url = require('url')
const fs_promises = require('fs').promises
const { error } = require('console')

const baseUrl = process.env.OAUTH_BASE_URL
const path = process.env.OAUTH_URL_PATH
const query_params = new url.URLSearchParams(process.env.OAUTH_QUERY_PARAMS)
const uri = `${baseUrl}${path}?${query_params}`

const customized_headers = {}

const config = {
    method: 'get',
    url: uri,
    headers: customized_headers
}

async function run(test_name, data) {
    let result
    try {
        result = await axios.makeRequest(config)
        axios.logResult(result, test_name)
        var regex = new RegExp(`name="sap-login-XSRF" value="(.*)"`)
        sap_login_xsrf = result.data.match(regex)[1]
        console.log(sap_login_xsrf)
        console.log('data contains: ' + data)
    } catch (error) {
        result = error
        console.log(error)
    }
    return result
}

module.exports = { run }
const axios = require("../../../axios-client.js")
const url = require('url')
const fs_promises = require('fs').promises

const baseUrl = process.env.OAUTH_BASE_URL
const path = process.env.OAUTH_URL_PATH + '/index.html'
const query_params = new url.URLSearchParams(process.env.OAUTH_QUERY_PARAMS)
const uri = `${baseUrl}${path}?${query_params}`

const customized_headers = {}

const config = {
    method: 'get',
    url: uri,
    headers: customized_headers
}

async function run(test_name, data) {
    var result
    try {
        const result = await axios.makeRequest(config)
        axios.logResult(result, test_name) 
        console.log('data contains: ' + data)
    } catch (error) {
        console.log(error)
    }
    return result
}

module.exports = { run }
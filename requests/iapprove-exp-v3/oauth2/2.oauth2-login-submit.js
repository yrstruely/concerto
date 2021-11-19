const axios = require("../../../axios-client.js")
const url = require('url')
const fs_promises = require('fs').promises

const baseUrl = process.env.OAUTH_BASE_URL
const path = process.env.OAUTH_URL_PATH + '/index.html'
const query_params = new url.URLSearchParams(process.env.OAUTH_QUERY_PARAMS)
const uri = `${baseUrl}${path}?${query_params}`

const form_params = new url.URLSearchParams()
form_params.append('sap-system-login-oninputprocessing', 'onLogin')
form_params.append('sap-urlscheme', '')
form_params.append('sap-system-login', 'onLogin')
form_params.append('sap-system-login-basic_auth', '')
form_params.append('sap-accessibility', '')
form_params.append('sap-login-XSRF', '{{ sapLoginXSRF }}')
form_params.append('sap-system-login-cookie_disabled', '')
form_params.append('sap-hash', '')
form_params.append('sap-language', 'EN')
form_params.append('sap-user', process.env.LOGIN_USERNAME)
form_params.append('sap-password', process.env.LOGIN_PASSWORD)
form_params.append('sap-client', 100)

const customized_headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

const config = {
    method: 'POST',
    url: uri,
    headers: customized_headers,
    data: form_params,
    proxy: {
        host: '127.0.0.1',
        port: 8866
    }
}

async function run(test_name, data) {
    var result
    try {
        const result = await axios.makeRequest(config)
        axios.logResult(result, test_name)
        var regex = new RegExp(`name="sap-login-XSRF" value="(.*)"`)
        sap_login_xsrf = result.data.match(regex)[1]
        console.log('data contains: ' + data)
    } catch (error) {
        console.log(error)
    }
    return sap_login_xsrf
}

module.exports = { run }
const PROJECT_DIR = '../../../'
const axios = require(PROJECT_DIR + "axios-client.js")
const url = require('url')
const https = require('https')
const expect = require('chai').expect


async function run(test_name, data) {
    try {
        const baseUrl = process.env.OAUTH_BASE_URL
        const path = process.env.OAUTH_URL_PATH
        const query_params = new url.URLSearchParams(JSON.parse(process.env.OAUTH_QUERY_PARAMS))
        query_params.append("sap-client", 100)
        const uri = `${baseUrl}${path}`

        const customized_headers = {
            'Cookie': 'AzureAppProxyAnalyticCookie_ddd7ed7a-bba4-475d-a48e-f21bf639f1b9_1.3=3|VAoh/rnaG8yZqCKbW2lLsUjh6hI5m162cuGQOVRI/z0lv+2nQaGAPBFySuueYlytHE944DTh8PGmoZ9eZBZaMkctG5fGQaDToXOUWyYPDdVr9ZKM8gs+Xuxy8t4BqSb2LX/5as5vnCzRmLHqaqXLiw==; BIGipServerEP_FIORY_DEV_POOL=!JoIREHnalfRGxxzoxdJ9YJJeVN0dK/5aYz6VFwOr7baBIbucHCc5/NoRu07o/Fl4Ll1GmzZD6Ki85Lg=; sap-login-XSRF_FD0=20211122035851-M0lKzV-Fy7-JsQD_rxYh7w%3d%3d; sap-usercontext=sap-client=100',
            'Cache-Control': 'no-cache',
            'Host': 'go-dev.test.fonterra.com',
            'User-Agent': 'PostmanRuntime/7.28.4',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }

        const config = {
            method: 'get',
            url: uri,
            params: query_params,
            headers: customized_headers,
            xsrfCookieName: 'sap-login-XSRF_FD0',
            xsrfHeaderName: 'x-csrf-token'
        }

        data = { sap_login_xsrf: '', cookie: '', set_cookies: [] }
        result = await axios.makeRequest(config, data)
        axios.logResult(result, test_name, data, test)

        var regex = new RegExp(`name="sap-login-XSRF" value="(.*)"`)
        sap_login_xsrf = result.data.match(regex)[1]
        console.log(sap_login_xsrf)

        let cookie = 'NaN'
        regex = new RegExp(`(sap-login-XSRF_${process.env.SAP_INSTANCE}=.*;) .ath.*`);
        for (const header in result.headers['set-cookie']) {
            if (result.headers['set-cookie'][parseInt(header)].match(regex)) {
                console.log(result.headers['set-cookie'][parseInt(header)])
                cookie = result.headers['set-cookie'][parseInt(header)].match(regex)[1]
            }
        }
        data = { sap_login_xsrf: sap_login_xsrf, cookie: cookie, set_cookies: result.headers['set-cookie'] }
        console.log('data contains: ' + data)
    } catch (error) {
        result = error
        console.log(error)
    }
    return data
}
function test(result, data) {
    expect(result.status).to.equal(200)
}

module.exports = { run }
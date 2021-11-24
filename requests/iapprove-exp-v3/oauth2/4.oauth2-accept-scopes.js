const axios = require("../../../axios-client.js")
const url = require('url')
const https = require('https')
const expect = require('chai').expect


async function run(test_name, data) {
    try {
        const baseUrl = process.env.OAUTH_BASE_URL
        const path = process.env.OAUTH_URL_PATH + '/index.html'
        const query_params = new url.URLSearchParams(JSON.parse(process.env.OAUTH_QUERY_PARAMS))
        query_params.append('sap-client', 100)
        query_params.append('sap-language', 'EN')
        const uri = `${baseUrl}${path}`

        const customized_headers = {
            'Cookie': 'MYSAPSSO2=AjQxMDMBABhTAEUAQgBBAFMAVABJADQAIAAgACAAIAACAAYxADAAMAADABBGAEQAMAAgACAAIAAgACAABAAYMgAwADIAMQAxADEAMgAyADAAMwA1ADkABQAEAAAACAYAAlgACQACRQD%2fAPswgfgGCSqGSIb3DQEHAqCB6jCB5wIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYHHMIHEAgEBMBowDjEMMAoGA1UEAxMDRkQwAggKIBUQICNWATAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjExMTIyMDM1OTA3WjAjBgkqhkiG9w0BCQQxFgQUN%21B8Cp%2fOvlERsOH4Mkr5BAIl0zMwCQYHKoZIzjgEAwQuMCwCFAL6i0KhUaERSncHbjVTd9Lg098cAhQtibMf0DTaMN%21doR5tvd%21fmXaVUQ%3d%3d; AzureAppProxyAnalyticCookie_ddd7ed7a-bba4-475d-a48e-f21bf639f1b9_1.3=3|VAoh/rnaG8yZqCKbW2lLsUjh6hI5m162cuGQOVRI/z0lv+2nQaGAPBFySuueYlytHE944DTh8PGmoZ9eZBZaMkctG5fGQaDToXOUWyYPDdVr9ZKM8gs+Xuxy8t4BqSb2LX/5as5vnCzRmLHqaqXLiw==; BIGipServerEP_FIORY_DEV_POOL=!JoIREHnalfRGxxzoxdJ9YJJeVN0dK/5aYz6VFwOr7baBIbucHCc5/NoRu07o/Fl4Ll1GmzZD6Ki85Lg=; SAP_SESSIONID_FD0_100=b2gNZwtQ48ACYB5bBK--AIo9tgFLSBHsteAAUFazLpo%3d; sap-usercontext=sap-language=EN&sap-client=100',
            'Host': 'go-dev.test.fonterra.com',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'Upgrade-Insecure-Requests': 1,
            'Origin': 'https://go-dev.test.fonterra.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': `https://go-dev.test.fonterra.com/sap/bc/sec/oauth2/authorize?sap-client=100&response_type=code&client_id=MULEINT&redirect_uri=https%3A%2F%2Fanypoint.mulesoft.com%2Fexchange%2FoauthCallback.html&scope=${process.env.OAUTH_SCOPE}&state=anystate`,
            'Accept-Language': 'en-US,en;q=0.9'
        }

        const config = {
            method: 'get',
            url: uri,
            params: query_params,
            headers: customized_headers,
            xsrfCookieName: 'sap-login-XSRF_FD0',
            xsrfHeaderName: 'x-csrf-token'
        }

        const result = await axios.makeRequest(config, data)
        data = axios.getSetCookie(result, data)
        axios.logResult(result, test_name, data, test)
        console.log('data contains: ' + data)
    } catch (error) {
        console.log(error)
    }
    return data
}

function test(result, data) {
    expect(result.status).to.equal(200)
}
module.exports = { run }

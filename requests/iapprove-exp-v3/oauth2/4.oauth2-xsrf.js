const axios = require("../../../axios-client.js")
const url = require('url')
const https = require('https')


async function run(test_name, data) {
    try {
        const baseUrl = process.env.OAUTH_BASE_URL
        const path = process.env.OAUTH_URL_PATH + '/index.html'
        const uri = `${baseUrl}${path}`

        const customized_headers = {
            'Cookie': 'MYSAPSSO2=AjQxMDMBABhTAEUAQgBBAFMAVABJADQAIAAgACAAIAACAAYxADAAMAADABBGAEQAMAAgACAAIAAgACAABAAYMgAwADIAMQAxADEAMgAyADAAMwA1ADkABQAEAAAACAYAAlgACQACRQD%2fAPswgfgGCSqGSIb3DQEHAqCB6jCB5wIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYHHMIHEAgEBMBowDjEMMAoGA1UEAxMDRkQwAggKIBUQICNWATAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjExMTIyMDM1OTA3WjAjBgkqhkiG9w0BCQQxFgQUN%21B8Cp%2fOvlERsOH4Mkr5BAIl0zMwCQYHKoZIzjgEAwQuMCwCFAL6i0KhUaERSncHbjVTd9Lg098cAhQtibMf0DTaMN%21doR5tvd%21fmXaVUQ%3d%3d; AzureAppProxyAnalyticCookie_ddd7ed7a-bba4-475d-a48e-f21bf639f1b9_1.3=3|VAoh/rnaG8yZqCKbW2lLsUjh6hI5m162cuGQOVRI/z0lv+2nQaGAPBFySuueYlytHE944DTh8PGmoZ9eZBZaMkctG5fGQaDToXOUWyYPDdVr9ZKM8gs+Xuxy8t4BqSb2LX/5as5vnCzRmLHqaqXLiw==; BIGipServerEP_FIORY_DEV_POOL=!JoIREHnalfRGxxzoxdJ9YJJeVN0dK/5aYz6VFwOr7baBIbucHCc5/NoRu07o/Fl4Ll1GmzZD6Ki85Lg=; SAP_SESSIONID_FD0_100=b2gNZwtQ48ACYB5bBK--AIo9tgFLSBHsteAAUFazLpo%3d; sap-usercontext=sap-language=EN&sap-client=100',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'go-dev.test.fonterra.com',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
            'Accept': '*/*',
            'X-CSRF-Token': 'Fetch',
            'X-Requested-With': 'XMLHttpRequest',
            'SAP-PASSPORT': '2A54482A0300E60000756E64657465726D696E6564202020202020202020202020202020202020202000005341505F4532455F54415F557365722020202020202020202020202020202020756E64657465726D696E65645F737461727475705F302020202020202020202020202020202020200005756E64657465726D696E65642020202020202020202020202020202020202020433542423431333632413143343739354236314339323031383143313539323720202000078BA9DB79989B4B55B2807AC7E45883030000000000000000000000000000000000000000000000E22A54482A',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': `https://go-dev.test.fonterra.com/sap/bc/sec/oauth2/authorize/index.html?response_type=code&client_id=MULEINT&redirect_uri=https%3a%2f%2fanypoint.mulesoft.com%2fexchange%2foauthCallback.html&scope=${process.env.OAUTH_SCOPE}&sap-language=EN`,
            'Accept-Language': 'en-US,en;q=0.9'
        }

        const config = {
            method: 'get',
            url: uri,
            headers: customized_headers,
            xsrfCookieName: 'sap-login-XSRF_FD0',
            xsrfHeaderName: 'x-csrf-token'
        }

        const result = await axios.makeRequest(config, data)
        data = axios.getSetCookie(result, data)
        axios.logResult(result, test_name)

        const x_csrf_token = null
        for (const header in result.headers) {
            if (header === 'x-csrf-token') {
                console.log(result.headers[header])
                x_csrf_token = result.headers[header]
            }
        }
        if (x_csrf_token == null) {
            throw 'Login failed, x-csrf-token not found!'
        }
        data = { sap_login_xsrf: sap_login_xsrf, cookie: cookie, x_csrf_token: x_csrf_token }
        console.log('data contains: ' + data)
    } catch (error) {
        console.log(error)
    }
    return data
}
module.exports = { run }

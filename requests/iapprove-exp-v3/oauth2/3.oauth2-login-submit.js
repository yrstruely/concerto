const axios = require("../../../axios-client.js")
const url = require('url')
const expect = require('chai').expect


async function run(test_name, data) {
    try {
        const baseUrl = process.env.OAUTH_BASE_URL
        const path = process.env.OAUTH_URL_PATH + '/index.html'
        const query_params = new url.URLSearchParams(JSON.parse(process.env.OAUTH_QUERY_PARAMS))
        const uri = `${baseUrl}${path}`

        const form_params = new url.URLSearchParams()
        form_params.append('sap-system-login-oninputprocessing', 'onLogin')
        form_params.append('sap-urlscheme', '')
        form_params.append('sap-system-login', 'onLogin')
        form_params.append('sap-system-login-basic_auth', '')
        form_params.append('sap-accessibility', '')
        form_params.append('sap-login-XSRF', data['sap_login_xsrf'])
        form_params.append('sap-system-login-cookie_disabled', '')
        form_params.append('sap-hash', '')
        form_params.append('sap-language', 'EN')
        form_params.append('sap-user', process.env.LOGIN_USERNAME)
        form_params.append('sap-password', process.env.LOGIN_PASSWORD)
        form_params.append('sap-client', 100)

        const customized_headers = {
            'Cookie': 'AzureAppProxyAnalyticCookie_ddd7ed7a-bba4-475d-a48e-f21bf639f1b9_1.3=3|ViPNAtXnZc3l+Equgc4uh5AkR6cTCRVIJVg2n5DXDVKn78waNI3tML6VDXokxuK6P13nIDxCzcluTOSW/NbRtkjc+nH9aoKL3RDOcXWIehlUhjEc0vjMbI8hCxDvgAYObOBasYgCYdP/HIS7dOPeiA==; BIGipServerEP_FIORY_DEV_POOL=!7amWmFpzgQf382voxdJ9YJJeVN0dK/PTbTEdIEhKSye5neE/FAfX1Nzaw9TDd9/6wXLaRlW/RDia4mw=; sap-login-XSRF_FD0=20211122065449-v3-iT61OU1TQVD7LoSp1dw%3d%3d; sap-usercontext=sap-client=100',
            'Host': 'go-dev.test.fonterra.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': '0',
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
            'Referer': `https://go-dev.test.fonterra.com/sap/bc/sec/oauth2/authorize/index.html?response_type=code&client_id=MULEINT&redirect_uri=https%3a%2f%2fanypoint.mulesoft.com%2fexchange%2foauthCallback.html&scope=${process.env.OAUTH_SCOPE}&sap-language=EN`,
            'Accept-Language': 'en-US,en;q=0.9'
        }

        const config = {
            method: 'POST',
            url: uri,
            params: query_params,
            headers: customized_headers,
            data: form_params,
            xsrfCookieName: 'sap-login-XSRF_FD0',
            xsrfHeaderName: 'x-csrf-token'
        }

        const result = await axios.makeRequest(config, data)
        data = axios.getSetCookie(result, data)
        axios.logResult(result, test_name, data, test)

    } catch (error) {
        console.log(error)
    }
    return data
}

function test(result, data) {
    expect(result.status).to.equal(200)
}

module.exports = { run }

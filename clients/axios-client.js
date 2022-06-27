const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const { CookieJar } = require('tough-cookie')
const jar = new CookieJar()
const client = wrapper(axios.create({ jar }))
const util = require('util')


class AxiosClient {
    state
    constructor() {
        this.state = []
    }
    result = null

    async sendRequest(config, state = {}) {
        if ((state.hasOwnProperty(['set_cookies']))
            && (config.hasOwnProperty('headers'))) {
            config.headers['cookie'] = state['set_cookies'].join('; ')
        }
        this.setState(state)

        await client(config)
            .then(response => {
                this.result = response

                if (this.result.headers.hasOwnProperty('set-cookie')) {
                    for (let i = 0; i < this.result.headers['set-cookie'].length; i++) {
                        const cookie = this.result.headers['set-cookie'][i];
                        jar.setCookie(this.result.headers['set-cookie'][i], this.result.url, function (err, cookie) {
                            console.log('added cookie: ' + cookie)
                        })
                    }
                }
            })
            .catch(error => {
                this.result = error
            })

        return this.result
    }

    getSetCookie(result, data) {
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

    logResult(result) {
        console.log('')
        console.log('----------------REQUEST----------------')
        var paramsString = ''
        if (typeof result.config.params != 'undefined') {
            paramsString = '?' + util.inspect(result.config.params)
        }
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}${paramsString}`)

        this.logHeadersAndBody(result.config.headers, result.config.data)

        var response = result
        if (result.isAxiosError === true) {
            response = result.response
        }
        console.log('----------------RESPONSE----------------')

        this.logHeadersAndBody(response.headers, response.data)

        console.log(`${response.status} ${response.statusText}`)
        console.log('----------------END----------------')
    }

    logHeadersAndBody(headers, body) {
        console.log('HEADERS:')
        console.log(util.inspect(headers))
        if (typeof body != 'undefined') {
            console.log('BODY:')
            if (typeof body == 'object') {
                console.log(util.inspect(body))
            }
            else if (typeof body == 'string') {
                console.log(util.inspect(JSON.parse(body)))
            } else {
                this.console.log(`Unexpected typeof response body ${typeof body}`)
            }
        }
    }

    setState(state) {
        if (Object.keys(state) != 0) {
            this.state.push(state)   
        }
    }

    getState(key = undefined) {
        let value = null
        if (key == undefined) {
            return this.state
        }
        for (var index in this.state) {
            if (this.state[parseInt(index)].hasOwnProperty(key)) {
                let found = Object.values(this.state[parseInt(index)])
                return found[0]
            }
        }
        return value
    }

    getLastState() {
        return this.state[this.state.length - 1]
    }
}
module.exports = {
    AxiosClient
}
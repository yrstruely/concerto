import axios from 'axios'
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent'
import { CookieJar } from 'tough-cookie'
const jar = new CookieJar()
let httpCookieAgent = new HttpCookieAgent({
    jar
})
axios.defaults.httpAgent = httpCookieAgent
let httpsCookieAgent = new HttpsCookieAgent({
    jar
})
axios.defaults.httpsAgent = httpsCookieAgent
import util from 'util'
import { serialize, deserialize } from '../helpers/persistent.js'

class AxiosClientClass {
    state
    cookies
    correlationIds
    constructor() {
        this.state = this.getPersistentState()
        if (typeof (this.state) === 'undefined') {
            this.state = []
        }
        this.cookies = []
        this.correlationIds = []
    }
    result = null

    setRejectUnauthorizedCerts(rejectUnauthorizedCerts = true) {
        // Set this to false to disable CA checks
        httpCookieAgent.options.rejectUnauthorized = rejectUnauthorizedCerts
        httpsCookieAgent.options.rejectUnauthorized = rejectUnauthorizedCerts
    }

    async sendRequest(config, state = {}, polling = false, rejectUnauthorizedCerts = true) {

        this.setState(state)
        config.headers.cookie = jar.getCookieStringSync(config.url)
        if (!config.headers.cookie) {
            delete config.headers.cookie
        }

        if (config.headers['X-Correlation-ID'] != undefined) {
            config.headers['X-Correlation-ID'] = config.headers['X-Correlation-ID'] + '-auto-test'
            if (!polling && config.headers['X-Correlation-ID'].split('-auto-test').length > 2) {
                throw new Error("Error: duplicate 'X-Correlation-IDs found'")
            }
            else if (config.headers['X-Correlation-ID'].split('-auto-test').length <= 2) {
                this.setCorrelationId(config.headers['X-Correlation-ID'])
            }
        }

        await axios.request(config)
            .then(response => {
                this.result = response
                this.checkForCookies(this.result)
                this.checkForLocation(this.result)
            })
            .catch(error => {
                this.result = error
                if (typeof this.result.response !== 'undefined') {
                    this.checkForCookies(this.result.response)
                    this.checkForLocation(this.result.response)
                }
                else {
                    throw new Error(this.result.toString())
                }
            })

        if (!this.result.isAxiosError) {
            serialize(this.result.data, './results/state.json')
        }

        if (!polling) {
            this.logResult(this.result)
        }

        return this.result
    }

    delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        })
    }

    async sendRequestPollResponse(config, dataKey, expectedResponse, state = {}, maxAttempts = 10, wait = 1000) {
        let attempts = Array.from(Array(maxAttempts).keys())

        for (const attempt of attempts) {
            await this.sendRequest(config, state, true)

            if (this.result.data[dataKey] == expectedResponse) {
                break
            }
            console.log(`Polling, Attempt: ${attempt + 1} of: ${maxAttempts}`)
            await this.delay(wait)
        }
        this.logResult(this.result)
        
        return this.result
    }

    checkForCookies(result) {
        if (result.headers.hasOwnProperty('set-cookie')) {
            for (const cookie of result.headers['set-cookie']) {
                jar.setCookie(cookie, result.config.url, () => {
                    this.cookies.push(cookie)
                })
            }
        }
        if (result.status.toString().match(/2../) !== null && (result.request._redirectable._redirectCount > 0) && typeof result.request.getHeaders()['cookie'] !== 'undefined') {
            for (const cookie of result.request.getHeaders()['cookie'].split('; ')) {
                jar.setCookie(cookie, result.config.url, () => {
                    this.cookies.push(cookie)
                })
            }
        }
    }

    addCookie(cookie, url){
        jar.setCookie(cookie, url, () => {
            this.cookies.push(cookie)
        })

    }

    checkForLocation(result) {
        if (result.headers.hasOwnProperty('location')) {
            this.setState({ location: result.headers['location'] })
        }
        if (result.status.toString().match(/2../) !== null && (result.request._redirectable._redirectCount > 0) && typeof result.request.getHeaders()['location'] !== 'undefined') {
            this.setState({ location: result.request.headers['location'] })
        }
    }

    logResult(result) {
        console.log('')
        console.log('----------------REQUEST----------------')
        let paramsString = ''
        if (typeof result.config.params != 'undefined') {
            paramsString = '?' + util.inspect(result.config.params, {
                showHidden: false,
                depth: 10,
                colors: true,
                maxStringLength: 2000
            })
        }
        console.log(`${result.config.method.toUpperCase()} ${result.config.url}${paramsString}`)

        this.logHeadersAndBody(result.config.headers, result.config.data)

        let response = result
        if (result.isAxiosError === true) {
            response = result.response
        }
        console.log('----------------RESPONSE----------------')

        this.logHeadersAndBody(response.headers, response.data)

        console.log(`${response.status} ${response.statusText}`)

        console.log('----------------SET_COOKIES----------------')

        jar.getCookiesSync(response.config.url).forEach(cookie => {
            console.log('cookie: ' + cookie)
        })

        console.log('----------------END----------------')
    }

    logHeadersAndBody(headers, body) {
        console.log('HEADERS:')
        console.log(util.inspect(headers, {
            showHidden: false,
            depth: 10,
            colors: true,
            maxStringLength: 2000
        }))
        if (typeof body !== 'undefined') {
            console.log('BODY:')
            if (typeof body === 'object') {
                console.log(util.inspect(body, {
                    showHidden: false,
                    depth: 10,
                    colors: true,
                    maxStringLength: 2000
                }))
            }
            else if (typeof body === 'string' || typeof body === 'number') {
                try {
                    console.log(util.inspect(JSON.parse(body), {
                        showHidden: false,
                        depth: 10,
                        colors: true,
                        maxStringLength: 2000
                    }))
                } catch (error) {
                    console.log(body)
                }
            } else {
                this.console.log(`Unexpected typeof response body ${typeof body}`)
            }
        }
    }

    setState(state) {
        let found = false
        if (!Array.isArray(this.state)) {
            this.state = []
        }
        if (Object.keys(state) != 0) {
            this.state.forEach(object => {
                if (Object.keys(state)[0] in object) {
                    found = true
                    object[Object.keys(state)[0]] = state[Object.keys(state)[0]]
                }
            })
            if (!found) {
                this.state.push(state)
            }
        }
    }


    setPersistentState(state, file = './results/data.json') {
        this.setState(state)
        serialize(this.state, file)

    }

    getPersistentState(key = undefined, file = './results/data.json') {
        const persistentState = deserialize(file)
        return this.getState(key, persistentState)
    }

    setCorrelationId(id) {
        if (Object.keys(id) != 0) {
            this.correlationIds.push(id)
            serialize(this.correlationIds, './results/correlationIds.json')
        }
    }

    getState(key = undefined, state = this.state) {
        let value = null
        if (key == undefined) {
            return state
        }
        for (let index in state) {
            if (state[parseInt(index)].hasOwnProperty(key)) {
                let found = Object.values(state[parseInt(index)])
                return found[0]
            }
        }
        return value
    }

    getLastState() {
        return this.state[this.state.length - 1]
    }

    clearCookies() {
        jar.removeAllCookiesSync()
        this.cookies = []
    }
}

export const AxiosClient = new AxiosClientClass()

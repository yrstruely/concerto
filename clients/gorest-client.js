const { AxiosClient } = require('./axios-client.js')
const client = new AxiosClient()
const fileIO = require('../persistent.js')
const faker = require('faker')

class GorestClient extends AxiosClient {
    result = null
    baseUrl = process.env.GO_REST_BASE_URL
    path = process.env.GO_REST_URL_PATH

    customized_headers = {
        'Authorization': `Bearer ${process.env.GO_REST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }

    dataBody = {
        'name': `${faker.name.findName()}`,
        'gender': 'male',
        'email': `${faker.internet.email()}`,
        'status': 'active'
    }

    createUser(method = 'POST', endpoint = '/users') {
        const uri = `${this.baseUrl}${this.path}${endpoint}`

        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers,
            data: this.dataBody
        }

        return config
    }

    getUserById(id, method = 'GET', endpoint = '/users') {
        const uri = `${this.baseUrl}${this.path}${endpoint}/${id}`

        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers
        }

        return config
    }

    updateUserById(id, method = 'PUT', endpoint = '/users') {
        const uri = `${this.baseUrl}${this.path}${endpoint}/${id}`

        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers,
            data: this.dataBody
        }

        return config
    }

    deleteUserById(id, method = 'DELETE', endpoint = '/users') {
        const uri = `${this.baseUrl}${this.path}${endpoint}/${id}`

        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers
        }

        return config
    }

    async sendRequest(config, state = {}) {
        this.result = await super.sendRequest(config, state = {})
        if (this.result.isAxiosError != true) {
            await fileIO.serialize(this.result.data.data)
        }
        client.logResult(this.result)

        return this.result
    }
}
module.exports = {
    GorestClient
}
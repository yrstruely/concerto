require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../'
const axiosClient = require(PROJECT_DIR + 'axios-client.js')
const fileIO = require(PROJECT_DIR + 'persistent.js')
const expect = require('chai').expect
const faker = require('faker')


async function sendRequest(config, state) {
    const result = await axiosClient.makeRequest(config, state)
    data = result.data.data
    axiosClient.logResult(result)

    return result
}

describe('Get User by Id', async function () {
    const expectedHttpStatus = 200
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
        const state = fileIO.deserialize()
        const baseUrl = process.env.BASE_URL
        const path = process.env.URL_PATH
        const uri = `${baseUrl}${path}/users/${state.id}`

        const customized_headers = {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }

        const config = {
            method: 'get',
            url: uri,
            headers: customized_headers
        }
        result = await sendRequest(config, state)
        expect(result.status).equals(expectedHttpStatus)
    })
    it('Response body should have property: name', function () {
        expect(data).to.have.property('name')
    })

    it('Response body should have property: email', function () {
        expect(data).to.have.property('email')
    })

    it('Response body should have property: gender', function () {
        expect(data).to.have.property('gender')
    })

    it('Response body should have property: status', function () {
        expect(data).to.have.property('status')
    })
})

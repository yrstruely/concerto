require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../'
const { GorestClient } = require(PROJECT_DIR + 'clients/gorest-client.js')
const client = new GorestClient()
const fileIO = require(PROJECT_DIR + 'persistent.js')
const expect = require('chai').expect
const faker = require('faker')


describe('Create Persistent User', async function () {
    const expectedHttpStatus = 201
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
        const baseUrl = process.env.GO_REST_BASE_URL
        const path = process.env.GO_REST_URL_PATH
        const uri = `${baseUrl}${path}/users`

        const customized_headers = {
            'Authorization': `Bearer ${process.env.GO_REST_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }

        const body = {
            'name': `${faker.name.findName()}`,
            'gender': 'male',
            'email': `${faker.internet.email()}`,
            'status': 'active'
        }

        const config = {
            method: 'post',
            url: uri,
            headers: customized_headers,
            data: body
        }
        result = await client.sendRequest(config, {})
        data = result.data.data
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

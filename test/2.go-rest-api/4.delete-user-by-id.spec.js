const PROJECT_DIR = '../../'
require('dotenv').config()
const { GorestClient } = require(PROJECT_DIR + 'clients/gorest-client.js')
const client = new GorestClient()
const fileIO = require(PROJECT_DIR + 'persistent.js')
const expect = require('chai').expect
const faker = require('faker')


describe('Delete User by Id', async function () {
    const expectedHttpStatus = 204
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
        const state = fileIO.deserialize()
        const baseUrl = process.env.GO_REST_BASE_URL
        const path = process.env.GO_REST_URL_PATH
        const uri = `${baseUrl}${path}/users/${state.id}`

        const customized_headers = {
            'Authorization': `Bearer ${process.env.GO_REST_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }

        const config = {
            method: 'delete',
            url: uri,
            headers: customized_headers
        }

        result = await client.sendRequest(client.deleteUserById(state.id), state)
        expect(result.status).equals(expectedHttpStatus)
    })
})

require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../../'
const { HeliosClient } = require(PROJECT_DIR + 'clients/helios-client.js')
const client = new HeliosClient()
const expect = require('chai').expect


describe('Helios Time and Expense Management Experience API', async function () {
    describe('GET /ping with invalid client id', async function () {

        const expectedHttpStatus = 401
        it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {

            config = client.getPing()
            config.headers.client_secret = 'invalid'
            result = await client.sendRequest(config)
            data = result.response.data
            expect(result.response.status).equals(expectedHttpStatus)
        })
        it('Response body should have property: error, with value: Invalid Client', function () {
            expect(data).to.have.property('error')
            expect(data.error).to.equal('Invalid Client')
        })
    })
})
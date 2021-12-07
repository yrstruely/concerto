require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../../'
const { IapproveClient } = require(PROJECT_DIR + 'clients/iapprove-client.js')
const client = new IapproveClient()
const expect = require('chai').expect


describe('Helios Time and Expense Management Experience API', function () {
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
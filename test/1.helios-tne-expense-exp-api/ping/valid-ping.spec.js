const PROJECT_DIR = '../../../'
require('dotenv').config({ path: `${PROJECT_DIR}${process.env.NODE_ENV}` })
const { HeliosClient } = require(PROJECT_DIR + 'clients/helios-client.js')
const client = new HeliosClient()
const expect = require('chai').expect


describe('Helios Time and Expense Management Experience API', async function () {
    describe('GET /ping valid', async function () {

        const expectedHttpStatus = 200
        it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
            
            result = await client.sendRequest(client.getPing())
            data = result.data
            expect(result.status).equals(expectedHttpStatus)
        })
        const property = 'status'
        const value = 'Ok'
        it(`Response body should have property: ${property}, with value: ${value}`, function () {
            expect(data).to.have.property(property)
            expect(data.status).to.equal(value)
        })
    })
})

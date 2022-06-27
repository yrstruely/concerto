const PROJECT_DIR = '../../../../'
require('dotenv').config()
const { HeliosClient } = require(PROJECT_DIR + 'clients/helios-client.js')
const client = new HeliosClient()
const expect = require('chai').expect


describe('Helios Time and Expense Management Experience API', async function () {
    describe('POST /accounting-document valid', async function () {

        const expectedHttpStatus = 201

        it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {

            result = await client.sendRequest(client.postAccrual())
            expect(result.status).equals(expectedHttpStatus)
        })
        .timeout(10000)

        it(`HELIOS_TNE_EXP_BASE_URL should be 'https://dev.api.fonterra.com' because that is configured in the .env file`, function () {
            console.log(process.env.HELIOS_TNE_EXP_BASE_URL)
            expect(process.env.HELIOS_TNE_EXP_BASE_URL).to.equal('https://dev.api.fonterra.com')
        })
    })
})

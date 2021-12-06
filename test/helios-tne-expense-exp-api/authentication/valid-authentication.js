require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../../'
const { IapproveClient } = require(PROJECT_DIR + 'clients/iapprove-client.js')
const client = new IapproveClient()
const { formatDate } = require(PROJECT_DIR + './helpers/format-date.js')
const expect = require('chai').expect
const faker = require('faker')


describe('Helios Time and Expense Management Experience API', function () {
    describe('GET /ping with invalid client id', async function () {
        let fixture = {}

        beforeEach(function () {
            let postingDate = new Date()
            postingDate = Date.UTC(postingDate.getUTCFullYear(), postingDate.getUTCMonth(), postingDate.getUTCDate())
            postingDate = formatDate(postingDate)
            postingDate.toString().split('GMT')[0] + ' UTC'

            return fixture = {
                companyCode: 1456,
                postingDate: postingDate
            }
        })
        const expectedHttpStatus = 200
        it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
            const baseUrl = process.env.HELIOS_TNE_EXP_BASE_URL
            const path = process.env.HELIOS_TNE_EXP_URL_PATH
            const uri = `${baseUrl}${path}/ping`

            const customized_headers = {
                'client_id': process.env.HELIOS_TNE_EXP_CLIENT_ID,
                'client_secret': process.env.HELIOS_TNE_EXP_CLIENT_SECRET
            }

            const config = {
                method: 'get',
                url: uri,
                headers: customized_headers
            }
            result = await client.sendRequest(config, {})
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
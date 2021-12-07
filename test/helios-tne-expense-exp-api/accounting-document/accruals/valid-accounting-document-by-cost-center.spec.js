require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../../../'
const { IapproveClient } = require(PROJECT_DIR + 'clients/iapprove-client.js')
const client = new IapproveClient()
const expect = require('chai').expect


describe('Helios Time and Expense Management Experience API', function () {
    describe('POST /accounting-document valid', async function () {

        const expectedHttpStatus = 201

        it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {

            result = await client.sendRequest(client.getAccountingDocumentByCostCenter('Accrual'))
            expect(result.status).equals(expectedHttpStatus)
        })
    })
})

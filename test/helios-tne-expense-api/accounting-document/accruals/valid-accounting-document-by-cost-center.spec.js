require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../../../'
const axiosClient = require(PROJECT_DIR + 'axios-client.js')
const fileIO = require(PROJECT_DIR + 'persistent.js')
const { formatDate } = require(PROJECT_DIR + './helpers/format-date.js')
const { accountingDocumentReferences } = require(PROJECT_DIR + './helpers/accounting-document-references.js')
const expect = require('chai').expect
const faker = require('faker')
const { v4: uuidv4 } = require('uuid')


async function sendRequest(config, state) {
    const result = await axiosClient.makeRequest(config, state)
    if (result.isAxiosError != true) {
        data = result.data
    }
    else {
        data = result.response.data
    }
    axiosClient.logResult(result)

    return result
}

describe('POST /accounting-document valid', async function () {
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
    const expectedHttpStatus = 201
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
        const baseUrl = process.env.HELIOS_TNE_EXP_BASE_URL
        const path = process.env.HELIOS_TNE_EXP_URL_PATH
        const uri = `${baseUrl}${path}/accounting-document`

        const customized_headers = {
            'client_id': process.env.HELIOS_TNE_EXP_CLIENT_ID,
            'client_secret': process.env.HELIOS_TNE_EXP_CLIENT_SECRET,
            'X-Correlation-ID': uuidv4(),
            'Content-Type': 'application/json'
        }

        dataBody = {
            "companyCode": `${fixture.companyCode}`,
            "type": process.env.HELIOS_TNE_EXP_EXPENSE_CLAIM_TYPE,
            "documentDate": "2021-03-21",
            "documentReference": accountingDocumentReferences('Accrual').documentReference,
            "reversalPostingDate": `${fixture.postingDate}`,
            "reversalReason": "01",
            "items": [
                {
                    "costCenter": process.env.HELIOS_TNE_EXP_COST_CENTER,
                    "glAccount": process.env.HELIOS_TNE_EXP_GL_ACCOUNT,
                    "transactionAmount": 200,
                    "transactionCurrencyCode": "CNY",
                    "taxCode": "V0",
                    "vendorTransactionText": "abcdefghijklmnopqrstuvwxy"
                },
                {
                    "costCenter": process.env.HELIOS_TNE_EXP_COST_CENTER,
                    "glAccount": process.env.HELIOS_TNE_EXP_GL_ACCOUNT,
                    "transactionAmount": 300,
                    "transactionCurrencyCode": "CNY",
                    "taxCode": "V0",
                    "vendorTransactionText": "abcdefghijklmnopqrstuvwxy"
                }
            ]
        }

        const config = {
            method: 'post',
            url: uri,
            headers: customized_headers,
            data: dataBody
        }
        result = await sendRequest(config, {})
        expect(result.status).equals(expectedHttpStatus)
    })
})

const { AxiosClient } = require('./axios-client.js')
const client = new AxiosClient()
const fileIO = require('../persistent.js')
require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../'
const { formatDate } = require(PROJECT_DIR + './helpers/format-date.js')
const { accountingDocumentReferences } = require(PROJECT_DIR + './helpers/accounting-document-references.js')
const expect = require('chai').expect
const faker = require('faker')
const { v4: uuidv4 } = require('uuid')


class HeliosClient extends AxiosClient {
    result = null
    baseUrl = process.env.HELIOS_TNE_EXP_BASE_URL
    path = process.env.HELIOS_TNE_EXP_URL_PATH

    customized_headers = {
        'client_id': process.env.HELIOS_TNE_EXP_CLIENT_ID,
        'client_secret': process.env.HELIOS_TNE_EXP_CLIENT_SECRET,
        'X-Correlation-ID': uuidv4(),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Host': 'dev.api.fonterra.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    getPostingDate() {
        let postingDate = new Date()
        postingDate = Date.UTC(postingDate.getUTCFullYear(), postingDate.getUTCMonth(), postingDate.getUTCDate())
        postingDate = formatDate(postingDate)
        postingDate.toString().split('GMT')[0] + ' UTC'

        return postingDate
    }

    postAccrual(method = 'POST', endpoint = '/accounting-document') {
        const uri = `${this.baseUrl}${this.path}${endpoint}`
        const dataBody = {
            "companyCode": '1456',
            "type": process.env.HELIOS_TNE_EXP_EXPENSE_CLAIM_TYPE,
            "documentDate": "2021-03-21",
            "documentReference": accountingDocumentReferences('Accrual').documentReference,
            "reversalPostingDate": `${this.getPostingDate()}`,
            "reversalReason": "05",
            "items": [
                {
                    "glAccount": process.env.HELIOS_TNE_EXP_GL_ACCOUNT,
                    "costCenter": process.env.HELIOS_TNE_EXP_COST_CENTER,
                    "transactionAmount": 200,
                    "transactionGrossAmount": 200,
                    "transactionTaxAmount": 0,
                    "transactionCurrencyCode": "CNY",
                    "taxCode": "V5",
                    "lineItemText": "81273019 12月个人报销",
                    "vendorTransactionText": "abcdefghijklmnopqrstuvwxy"
                },
                {
                    "glAccount": process.env.HELIOS_TNE_EXP_GL_ACCOUNT,
                    "costCenter": process.env.HELIOS_TNE_EXP_COST_CENTER,
                    "transactionAmount": 300,
                    "transactionGrossAmount": 300,
                    "transactionTaxAmount": 0,
                    "transactionCurrencyCode": "CNY",
                    "taxCode": "V6",
                    "lineItemText": "81273019 12月个人报销",
                    "vendorTransactionText": "abcdefghijklmnopqrstuvwxy"
                }
            ]
        }
        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers,
            data: dataBody
        }
        return config
    }

    getPing(method = 'GET', endpoint = '/ping') {
        const uri = `${this.baseUrl}${this.path}${endpoint}`

        const config = {
            method: method,
            url: uri,
            headers: this.customized_headers
        }

        return config
    }

    async sendRequest(config, state = {}) {
        this.result = await super.sendRequest(config, state = {})
        if (this.result.isAxiosError != true) {
            await fileIO.serialize(this.result.data)
        }
        client.logResult(this.result)

        return this.result
    }
}
module.exports = {
    HeliosClient
}
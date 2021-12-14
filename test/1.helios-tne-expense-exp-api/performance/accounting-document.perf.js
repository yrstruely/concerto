const PROJECT_DIR = '../../../'
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import { html, jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import dotenv from "k6/x/dotenv";
const env = dotenv.parse(open(PROJECT_DIR + ".env.develop.local"))
const { formatDate } = require(PROJECT_DIR + './helpers/format-date.js')
const { accountingDocumentReferences } = require(PROJECT_DIR + './helpers/accounting-document-references.js')
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";


function getPostingDate() {
    let postingDate = new Date()
    postingDate = Date.UTC(postingDate.getUTCFullYear(), postingDate.getUTCMonth(), postingDate.getUTCDate())
    postingDate = formatDate(postingDate)
    postingDate.toString().split('GMT')[0] + ' UTC'

    return postingDate
}

function postAccrual(method = 'POST', endpoint = '/accounting-document') {
    const baseUrl = env.HELIOS_TNE_EXP_BASE_URL
    const path = env.HELIOS_TNE_EXP_URL_PATH

    const customized_headers = {
        'client_id': env.HELIOS_TNE_EXP_CLIENT_ID,
        'client_secret': env.HELIOS_TNE_EXP_CLIENT_SECRET,
        'X-Correlation-ID': uuidv4(),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Host': 'dev.api.fonterra.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    const uri = `${baseUrl}${path}${endpoint}`
    const dataBody = {
        "companyCode": '1456',
        "type": env.HELIOS_TNE_EXP_EXPENSE_CLAIM_TYPE,
        "documentDate": "2021-03-21",
        "documentReference": accountingDocumentReferences('Accrual').documentReference,
        "reversalPostingDate": `${getPostingDate()}`,
        "reversalReason": "05",
        "items": [
            {
                "glAccount": env.HELIOS_TNE_EXP_GL_ACCOUNT,
                "costCenter": env.HELIOS_TNE_EXP_COST_CENTER,
                "transactionAmount": 200,
                "transactionGrossAmount": 200,
                "transactionTaxAmount": 0,
                "transactionCurrencyCode": "CNY",
                "taxCode": "V5",
                "lineItemText": "81273019 12月个人报销",
                "vendorTransactionText": "abcdefghijklmnopqrstuvwxy"
            },
            {
                "glAccount": env.HELIOS_TNE_EXP_GL_ACCOUNT,
                "costCenter": env.HELIOS_TNE_EXP_COST_CENTER,
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
        headers: customized_headers,
        data: dataBody
    }
    return config
}

const config = postAccrual()

export const requests = new Counter('http_reqs');

export const options = {
    stages: [
        { target: 15, duration: '30s' },
        { target: 45, duration: '30s' },
        { target: 0, duration: '30s' }
    ],
    thresholds: {
        requests: ['count < 100'],
    },
};

export default function () {
    console.log(`headers = ${JSON.stringify(customized_headers)}`)
    console.log(`config = ${JSON.stringify(config.data)}`)
    const res = http.request(config.method, config.url, JSON.stringify(config.data), { headers: config.headers });

    sleep(1);

    const checkRes = check(res, {
        'status is 201': (r) => r.status === 201,
        'Document posted successfully': (r) => JSON.parse(r.body).description.includes('Document posted successfully'),
    });
}

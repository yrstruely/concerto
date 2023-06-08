
import { AxiosClient } from '@yrstruely/concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Posts by Id', async function () {
        it(`GET /posts/1 - should return a valid todo JSON response`, async function () {

            const axiosResponse = await AxiosClient.sendRequest(SampleClient.getPostById(1))

            expect(axiosResponse.status).to.equal(200)

            const data = axiosResponse.data

            expect(data.userId).to.equal(1)
            expect(data.id).to.equal(1)
            expect(data.title).to.exist
            expect(data.body).to.exist
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
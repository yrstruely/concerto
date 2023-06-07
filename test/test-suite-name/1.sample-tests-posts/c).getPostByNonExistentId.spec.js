
import { AxiosClient } from 'concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Posts with Non-existent Id', async function () {
        it(`GET /posts/-1 - should return a 404 response`, async function () {

            const axiosResponse = await AxiosClient.sendRequest(SampleClient.getPostById(-1))

            expect(axiosResponse.response.status).to.equal(404)
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
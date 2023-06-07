
import { AxiosClient } from 'concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Posts', async function () {
        it(`GET /posts - should return a valid todo JSON response`, async function () {

            const axiosResponse = await AxiosClient.sendRequest(SampleClient.getPosts())

            expect(axiosResponse.status).to.equal(200)

            const data = axiosResponse.data

            expect(data.length).to.equal(100)
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
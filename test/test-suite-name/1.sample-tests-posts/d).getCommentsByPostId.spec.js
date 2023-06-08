
import { AxiosClient } from '@yrstruely/concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Comments on a given post', async function () {
        it(`GET /posts/1/comments - should return a valid todo JSON response`, async function () {

            const axiosResponse = await AxiosClient.sendRequest(SampleClient.getCommentsOnPostByPostId(1))

            expect(axiosResponse.status).to.equal(200)

            const data = axiosResponse.data

            expect(data.length).to.equal(5)
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
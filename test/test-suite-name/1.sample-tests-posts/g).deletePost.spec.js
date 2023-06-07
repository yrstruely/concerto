
import { AxiosClient } from 'concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Delete a post', async function () {
        it(`DELETE /posts/101 - should create a new post and return its postId`, async function () {

            const createdPostId = AxiosClient.getPersistentState('createdPostId')
            const axiosResponse = await AxiosClient.sendRequest(SampleClient.deletePost(createdPostId))

            expect(axiosResponse.status).to.equal(200)
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
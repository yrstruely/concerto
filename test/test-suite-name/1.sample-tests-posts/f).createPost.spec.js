
import { AxiosClient } from '@yrstruely/concerto'
import * as SampleClient from '../../../client-configs/sample-client-config.js'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'
import faker from 'faker'
import fs from 'fs'



describe('{JSON} Placeholder Tests', async function () {
    describe('Create a post', async function () {
        it(`POST /posts - should create a new post and return its postId`, async function () {

            const axiosResponse = await AxiosClient.sendRequest(SampleClient.createPost({
                userId: 1,
                title: "delectus aut autem",
                completed: false
            }))

            expect(axiosResponse.status).to.equal(201)

            const data = axiosResponse.data
            AxiosClient.setPersistentState({ createdPostId: data.id })

            expect(data.userId).to.equal(1)
        })
            .timeout(process.env.DEFAULT_TIMEOUT)
    })
})
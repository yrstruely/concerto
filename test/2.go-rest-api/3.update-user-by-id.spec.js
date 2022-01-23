const PROJECT_DIR = '../../'
require('dotenv').config({ path: `${PROJECT_DIR}${process.env.NODE_ENV}` })
const { GorestClient } = require(PROJECT_DIR + 'clients/gorest-client.js')
const client = new GorestClient()
const fileIO = require(PROJECT_DIR + 'persistent.js')
const expect = require('chai').expect


describe('Update User by Id', async function () {
    const expectedHttpStatus = 200
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {

        const state = fileIO.deserialize()       
        result = await client.sendRequest(client.updateUserById(state.id), state)
        data = result.data.data
        expect(result.status).equals(expectedHttpStatus)
    })
    it('Response body should have property: name', function () {

        expect(data).to.have.property('name')
    })

    it('Response body should have property: email', function () {

        expect(data).to.have.property('email')
    })

    it('Response body should have property: gender', function () {

        expect(data).to.have.property('gender')
    })

    it('Response body should have property: status', function () {

        expect(data).to.have.property('status')
    })
})

require('dotenv').config({ path: '.env.develop.local' })
const PROJECT_DIR = '../../'
const { GorestClient } = require(PROJECT_DIR + 'clients/gorest-client.js')
const client = new GorestClient()
const expect = require('chai').expect


describe('Create User', async function () {

    const expectedHttpStatus = 201
    it(`HTTP Response Status should be ${expectedHttpStatus}`, async function () {
        
        result = await client.sendRequest(client.createUser())
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

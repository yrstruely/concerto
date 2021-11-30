const PROJECT_DIR = '../../'
const axios = require(PROJECT_DIR + 'axios-client.js')
const expect = require('chai').expect
const faker = require('faker')


async function run(test_name, data) {
    try {
        const baseUrl = process.env.BASE_URL
        const path = process.env.URL_PATH
        const uri = `${baseUrl}${path}/users`

        const customized_headers = {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }

        const body = {
            'name': `${faker.name.findName()}`, 
            'gender': 'male', 
            'email': `${faker.internet.email()}`, 
            'status': 'active'
        }

        const config = {
            method: 'post',
            url: uri,
            headers: customized_headers,
            data: body
        }

        data = {}
        result = await axios.makeRequest(config, data)
        data = result.data.data
        axios.logResult(result, test_name, data, test)
        console.log('data contains: ' + data)

    } catch (error) {
        result = error
        console.log(error)
    }
    return data
}

function test(result, data) {
    //describe(`${method.toUpperCase()} ${uri}`, function() {
    describe('POST https://gorest.co.in/public/v1/users', function() {
        const expectedHttpStatus = 201
        describe(`HTTP Response Status should be ${expectedHttpStatus}`, function() {
            expect(result.status, `FAILED!: HTTP Status should be ${expectedHttpStatus}`).to.equal(expectedHttpStatus)
        })
    })
    //expect(result.status, 'FAILED!: HTTP Status should be 201').to.equal(201)
    expect(data, 'FAILED!: Response body should have property: id').to.have.property('id')
    expect(data, 'FAILED!: Response body should have property: name').to.have.property('name')
    expect(data, 'FAILED!: Response body should have property: email').to.have.property('email')
    expect(data, 'FAILED!: Response body should have property: gender').to.have.property('gender')
    expect(data, 'FAILED!: Response body should have property: status').to.have.property('status')
}

module.exports = { run }
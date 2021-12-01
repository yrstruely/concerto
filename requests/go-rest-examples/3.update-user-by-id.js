const PROJECT_DIR = '../../'
const axios = require(PROJECT_DIR + "axios-client.js")
const expect = require('chai').expect
const faker = require('faker')


async function run(test_name, data) {
    try {
        const baseUrl = process.env.GO_REST_BASE_URL
        const path = process.env.GO_REST_URL_PATH
        const uri = `${baseUrl}${path}/users/${data.id}`

        const customized_headers = {
            'Authorization': `path = process.env.GO_REST_ACCESS_TOKEN`,
            'Content-Type': 'application/json'
        }

        const body = {
            'name': `${faker.name.findName()}`, 
            'gender': 'male', 
            'email': `${faker.internet.email()}`, 
            'status': 'active'
        }

        const config = {
            method: 'put',
            url: uri,
            headers: customized_headers,
            data: body
        }

        result = await axios.makeRequest(config, data)
        axios.logResult(result, test_name, data, test)
        data = result.data.data
        console.log('data contains: ' + data)
        
    } catch (error) {
        result = error
        console.log(error)
    }
    return data
}

function test(result, data) {
    expect(result.status).to.equal(200)
    expect(data).to.have.property('id')
    expect(data).to.have.property('name')
    expect(data).to.have.property('email')
    expect(data).to.have.property('gender')
    expect(data).to.have.property('status')
}

module.exports = { run }
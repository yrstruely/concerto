const PROJECT_DIR = '../../'
const axios = require(PROJECT_DIR + 'axios-client.js')
const fileIO = require(PROJECT_DIR + 'persistent.js')
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

        let data = fileIO.deserialize()
        console.log(data)
        console.log(data.id)
        data = {}
        result = await axios.makeRequest(config, data)
        data = result.data.data
        fileIO.serialize(data)
        axios.logResult(result, test_name, data, test)
        console.log('data contains: ' + data)

    } catch (error) {
        result = error
        console.log(error)
    }
    return data
}

function test(result, data) {
    expect(result.status).to.equal(201)
    expect(data).to.have.property('id')
    expect(data).to.have.property('name')
    expect(data).to.have.property('email')
    expect(data).to.have.property('gender')
    expect(data).to.have.property('status')
}

module.exports = { run }
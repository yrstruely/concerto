const axios = require("../../../axios-client.js")
const url = require('url')

const baseUrl = process.env.BASE_URL
const path = process.env.URL_PATH + '/purchase-requisitions/tasks'
const query_params = new url.URLSearchParams({
    offset: 0,
    limit: 10
})
const uri = `${baseUrl}${path}?${query_params}`

const headers = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    Cookie: 'sap-XSRF_FD0_100=YjLvuH1GRoNdcFD96TgHDw%3d%3d20211117102015a8hqV928PmCvdFXvNmWzyQeNlo9RYvL7QWDc9aWYwcM%3d;',
    'X-Correlation-ID': 'd2bd35d0-cd1c-46c5-ab85-39809178bc51',
    Authorization: 'Bearer AFBWsy6aHuyR8fo-5JkcElteyQAe91lceC9vG0c7_-kd26uM'
}

const config = {
    method: 'get',
    url: uri,
    headers: headers
}

async function run(test_name, data) {
    const result = await axios.makeRequest(config)
    axios.logResult(result, test_name)
}

module.exports = { run }
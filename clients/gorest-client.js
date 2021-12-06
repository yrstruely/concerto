const { AxiosClient } = require('./axios-client.js')
const client = new AxiosClient()
const fileIO = require('../persistent.js')

class GorestClient extends AxiosClient {
    result = null

    async sendRequest(config, state) {
        this.result = await super.sendRequest(config, state)
        if (this.result.isAxiosError != true) {
            await fileIO.serialize(this.result.data.data)
        }
        client.logResult(this.result)

        return this.result
    }
}
module.exports = {
    GorestClient
}
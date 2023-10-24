import { AxiosClient } from '@yrstruely/concerto'
import qs from 'qs'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'


/***
 * .env file variables
 * 
 * Dev:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='4750a4aa-f472-4acf-8007-1cbed39d025a'
 * ANYPOINT_MQ_HOST='mq-ap-southeast-2.anypoint.mulesoft.com'
 * ANYPOINT_MQ_BASE_URL='https://mq-ap-southeast-2.anypoint.mulesoft.com'
 * ANYPOINT_MQ_URL_PATH='/api/v1'
 * 
 * Test:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='f80dde09-ca80-47c1-a4ad-be4e7a925a47'
 * ANYPOINT_MQ_HOST='mq-ap-southeast-2.anypoint.mulesoft.com'
 * ANYPOINT_MQ_BASE_URL='https://mq-ap-southeast-2.anypoint.mulesoft.com'
 * ANYPOINT_MQ_URL_PATH='/api/v1'
 * 
 */

export class AnypointMqClientClass {
  result = null
  mqBaseUrl = process.env.ANYPOINT_MQ_BASE_URL
  mqPath = process.env.ANYPOINT_MQ_URL_PATH
  mqOrgId = process.env.ANYPOINT_API_MANAGER_ORGANIZATION_ID
  mqEnvId = process.env.ANYPOINT_API_MANAGER_ENVIRONMENT_ID


  mqLoginHeaders = {
    'Authorization': `Basic ${process.env.ANYPOINT_MQ_AUTHORIZATION_KEY}`,
    'Cache-Control': 'no-cache',
    'Host': process.env.ANYPOINT_MQ_HOST,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  mqAuthorize(method = 'POST', endpoint = '/authorize') {

    const uri = `${this.mqBaseUrl}${this.mqPath}${endpoint}`

    return {
      method: method,
      url: uri,
      headers: this.mqLoginHeaders,
      data: qs.stringify({ 'grant_type': 'client_credentials' })
    }
  }

  mqHeaders = {
    'Cache-Control': 'no-cache',
    'Host': process.env.ANYPOINT_MQ_HOST,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Authorization': `Bearer null`,
    'x-forwarded-for': '10.255.0.1',
    'X-Correlation-ID': uuidv4(),
    'Content-Type': 'application/json'
  }

  putEvent(accessToken, mq, data,
    method = 'PUT',
    endpoint = '/organizations/:orgId/environments/:envId/destinations/:mq/messages') {

    const uri = `${this.mqBaseUrl}${this.mqPath}${endpoint.replace(':orgId', this.mqOrgId).replace(':envId', this.mqEnvId).replace(':mq', mq)}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders,
      data: [
        {
          "headers": {
            "messageId": uuidv4()
          },
          "properties": {
            "contentType": "application/json; charset=UTF-8"
          },
          "body": data
        }
      ]
    }
  }

  getEvent(accessToken, mq, params,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId/destinations/:mq/messages') {

    const uri = `${this.mqBaseUrl}${this.mqPath}${endpoint.replace(':orgId', this.mqOrgId).replace(':envId', this.mqEnvId).replace(':mq', mq)}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders,
      params: params
    }
  }

  // get MQ List
  // From MQ Admin API
  // Retrieve all the destinations. When using connected app, "View destinations" or "Administer destinations" scope is needed.
  //https://anypoint.mulesoft.com/mq/admin/api/v1/organizations/{organizationId}/environments/{environmentId}/regions/{regionId}/destinations
  getMqDestinations(accessToken, regionId, params,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId/regions/:regionId/queues') {

      const uri = `https://anypoint.mulesoft.com/mq/admin${this.mqPath}${endpoint.replace(':orgId', this.mqOrgId).replace(':envId', this.mqEnvId).replace(':regionId', regionId)}`

      this.mqHeaders['X-Correlation-ID'] = uuidv4()
      this.mqHeaders['Authorization'] = `Bearer ${accessToken}`
      this.mqHeaders['Host'] = 'anypoint.mulesoft.com'
  
      return {
        method: method,
        url: uri,
        headers: this.mqHeaders,
        params: params
      }
  }


  // get MQ Stats, ie. No. In Flight Messages per queue etc.
  // From MQ Stats
  // When using connected app, "View Destinations" or "Administer destinations" scope is needed.
  //https://anypoint.mulesoft.com/mq/stats/api/v1/organizations/{organizationId}/environments/{environmentId}/regions/{regionId}/queues
  getMqStats(accessToken, regionId, destinations,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId/regions/:regionId/queues') {

      const uri = `https://anypoint.mulesoft.com/mq/stats${this.mqPath}${endpoint.replace(':orgId', this.mqOrgId).replace(':envId', this.mqEnvId).replace(':regionId', regionId)}`

      this.mqHeaders['X-Correlation-ID'] = uuidv4()
      this.mqHeaders['Authorization'] = `Bearer ${accessToken}`
      this.mqHeaders['Host'] = 'anypoint.mulesoft.com'
  
      return {
        method: method,
        url: uri,
        headers: this.mqHeaders,
        params: destinations
      }
  }
}

export const AnypointMqClient = new AnypointMqClientClass()

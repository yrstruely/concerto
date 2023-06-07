import { AxiosClient } from './axios-client.js'
import qs from 'qs'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { generateAuthHeader } from '../helpers/hmacsha256.js'
import { serialize, deserialize } from '../helpers/persistent.js'

/***
 * .env file variables
 * 
 * Dev:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_PATH='/apimanager/api/v1'
 * ANYPOINT_CLOUDHUB_BASE_PATH='/cloudhub/api'
 * ANYPOINT_API_MANAGER_OAUTH_PATH='/accounts/api/v2/oauth2'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='4750a4aa-f472-4acf-8007-1cbed39d025a'
 * 
 * Test:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_PATH='/apimanager/api/v1'
 * ANYPOINT_CLOUDHUB_BASE_PATH='/cloudhub/api'
 * ANYPOINT_API_MANAGER_OAUTH_PATH='/accounts/api/v2/oauth2'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='f80dde09-ca80-47c1-a4ad-be4e7a925a47'
 * 
 */


class AnypointApiManagerClass {
  result = null
  apiBaseUrl = process.env.ANYPOINT_API_MANAGER_BASE_URL
  apiPath = process.env.ANYPOINT_API_MANAGER_BASE_PATH
  cloudhubPath = process.env.ANYPOINT_CLOUDHUB_BASE_PATH


  headers = {
    'Cache-Control': 'no-cache',
    'Host': process.env.ANYPOINT_API_MANAGER_HOST,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'x-forwarded-for': '10.255.0.1',
    'Content-Type': 'application/json',
    'X-ANYPNT-ENV-ID': process.env.ANYPOINT_API_MANAGER_ENVIRONMENT_ID
  }

  connectedAppLogin(clientId, clientSecret, method = 'POST', endpoint = '/accounts/api/v2/oauth2/token') {
    const uri = `${this.apiBaseUrl}${endpoint}`

    return {
      method: method,
      url: uri,
      headers: this.headers,
      data: {
        "client_id" : clientId,
        "client_secret" : clientSecret,
        "grant_type": "client_credentials"
     }
    }
  }

  getApiByQuery(accessToken, query, method = 'GET', endpoint = '/organizations/:organizationId/environments/:environmentId/apis') {

    const uri = `${this.apiBaseUrl}${this.apiPath}${endpoint.replace(':organizationId', process.env.ANYPOINT_API_MANAGER_ORGANIZATION_ID).replace(':environmentId', process.env.ANYPOINT_API_MANAGER_ENVIRONMENT_ID)}`
    this.headers['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      params: query,
      headers: this.headers
    }
  }

  getPoliciesByEnvironmentApiId(accessToken, environmentApiId, method = 'GET', endpoint = '/organizations/:organizationId/environments/:environmentId/apis/:environmentApiId/policies') {

    const uri = `${this.apiBaseUrl}${this.apiPath}${endpoint.replace(':organizationId', process.env.ANYPOINT_API_MANAGER_ORGANIZATION_ID).replace(':environmentId', process.env.ANYPOINT_API_MANAGER_ENVIRONMENT_ID).replace(':environmentApiId', environmentApiId)}`
    this.headers['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.headers
    }
  }

  getAlertsByEnvironmentApiId(accessToken, params, method = 'GET', endpoint = '/notifications') {
    const uri = `${this.apiBaseUrl}${this.cloudhubPath}${endpoint}`
    this.headers['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.headers,
      params: params
    }
  }
}

export const AnypointApiManagerClient = new AnypointApiManagerClass()

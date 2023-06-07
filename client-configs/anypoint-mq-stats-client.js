import { AxiosClient } from './axios-client.js'
import qs from 'qs'
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import { generateAuthHeader } from '../helpers/hmacsha256.js'
import * as persistentState from '../helpers/persistent.js'


/***
 * .env file variables
 * 
 * Dev:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_OAUTH_PATH='/accounts/api/v2/oauth2'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='4750a4aa-f472-4acf-8007-1cbed39d025a'
 * ANYPOINT_MQ_STATS_URL_PATH='/mq/stats/api/v1'
 * ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_SCOPES='read:full offline_access'
 * ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_REDIRECT_URI='https://oauth.pstmn.io/v1/callback'
 * 
 * Test:
 * 
 * ANYPOINT_API_MANAGER_HOST='anypoint.mulesoft.com'
 * ANYPOINT_API_MANAGER_BASE_URL='https://anypoint.mulesoft.com'
 * ANYPOINT_MQ_STATS_URL_PATH='/mq/stats/api/v1'
 * ANYPOINT_API_MANAGER_OAUTH_PATH='/accounts/api/v2/oauth2'
 * ANYPOINT_API_MANAGER_ORGANIZATION_ID='0b8f2822-d82e-4f6d-8957-dca4f3cfa48e'
 * ANYPOINT_API_MANAGER_ENVIRONMENT_ID='f80dde09-ca80-47c1-a4ad-be4e7a925a47'
 * ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_SCOPES='read:full offline_access'
 * ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_REDIRECT_URI='https://oauth.pstmn.io/v1/callback'
 * 
 */

export class AnypointMqStatsClientClass {
  result = null
  mqStatsHost = process.env.ANYPOINT_API_MANAGER_HOST
  mqStatsBaseUrl = process.env.ANYPOINT_API_MANAGER_BASE_URL
  mqStatsPath = process.env.ANYPOINT_MQ_STATS_URL_PATH
  mqStatsOrgId = process.env.ANYPOINT_API_MANAGER_ORGANIZATION_ID
  mqStatsEnvId = process.env.ANYPOINT_API_MANAGER_ENVIRONMENT_ID
  anypointApiManagerOAuthPath = process.env.ANYPOINT_API_MANAGER_OAUTH_PATH
  anypointApiManagerConnectedAppClientId = process.env.ANYPOINT_MQ_STATS_CONNECTED_APP_CLIENT_ID
  anypointApiManagerConnectedAppClientSecret = process.env.ANYPOINT_MQ_STATS_CONNECTED_APP_CLIENT_SECRET
  anypointApiManagerConnectedAppOAuthState = uuidv4()
  anypointApiManagerConnectedAppOAuthScopes = process.env.ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_SCOPES
  anypointApiManagerConnectedAppOAuthRedirectUri = process.env.ANYPOINT_MQ_STATS_CONNECTED_APP_OAUTH_REDIRECT_URI


  loginHeaders = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "referrer-policy": "no-referrer",
    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "Referer": this.mqStatsBaseUrl,
    "Referrer-Policy": "origin"
  }

  login(payload, method = 'POST', endpoint = '/login') {

    const uri = `${this.mqStatsBaseUrl}/accounts${endpoint}`

    return {
      method: method,
      url: uri,
      headers: this.loginHeaders,
      data: payload
    }
  }

  connectedAppOAuthHeaders = {
    'Host': this.mqStatsHost,
    'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Upgrade-Insecure-Requests': 1,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Accept-Language': 'en-US,en;q=0.9',
    "x-requested-with": "XMLHttpRequest",
    'Referer': this.mqStatsBaseUrl
  }

  //https://anypoint.mulesoft.com/accounts/api/v2/oauth2/authorize?response_type=code&client_id=099cadc60d2d4f2099475b751055e510&state=d2c02f5e-e356-40fd-a780-6c02f7d0848a&scope=read%3Afull%20offline_access&redirect_uri=https%3A%2F%2Foauth.pstmn.io%2Fv1%2Fcallback
  connectedAppOAuthAuthorize(updateSecFetchSite = false, method = 'GET', endpoint = '/authorize') {

    const uri = `${this.mqStatsBaseUrl}${this.anypointApiManagerOAuthPath}${endpoint}`

    const params = {
      response_type: 'code',
      client_id: this.anypointApiManagerConnectedAppClientId,
      state: this.anypointApiManagerConnectedAppOAuthState,
      scope: this.anypointApiManagerConnectedAppOAuthScopes,
      redirect_uri: this.anypointApiManagerConnectedAppOAuthRedirectUri
    }

    if (updateSecFetchSite) {
      this.connectedAppOAuthHeaders['Sec-Fetch-Site'] = 'same-origin'
      delete this.connectedAppOAuthHeaders['x-requested-with']
    }
    else {
      this.connectedAppOAuthHeaders['X-Requested-With'] = 'XMLHttpRequest'
    }

    return {
      method: method,
      url: uri,
      params,
      headers: this.connectedAppOAuthHeaders
    }
  }

  //https://anypoint.mulesoft.com/accounts/api/v2/oauth2/token
  connectedAppOAuthRequestToken(authorizationCode, method = 'POST', endpoint = '/token') {

    const uri = `${this.mqStatsBaseUrl}${this.anypointApiManagerOAuthPath}${endpoint}`

    return {
      method: method,
      url: uri,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        'grant_type': 'authorization_code',
        'code': authorizationCode,
        'redirect_uri': this.anypointApiManagerConnectedAppOAuthRedirectUri,
        'client_id': this.anypointApiManagerConnectedAppClientId,
        'client_secret': this.anypointApiManagerConnectedAppClientSecret
      })
    }
  }

  connectedAppAccountsHeaders = {
    'Host': this.mqStatsHost,
    'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Upgrade-Insecure-Requests': '1',
    'Accept': 'application/json, text/plain, */*',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Language': 'en-US,en;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': this.mqStatsBaseUrl
  }

  //https://anypoint.mulesoft.com/accounts/api/profile
  connectedAppAccountsProfile(method = 'GET', endpoint = '/profile') {

    const uri = `${this.mqStatsBaseUrl}/accounts/api${endpoint}`

    return {
      method: method,
      url: uri,
      headers: this.connectedAppAccountsHeaders
    }
  }

  //https://anypoint.mulesoft.com/accounts/login
  connectedAppAccountsLogin(xsrfToken, username, password, method = 'POST', endpoint = '/login') {

    const uri = `${this.mqStatsBaseUrl}/accounts${endpoint}`

    this.connectedAppAccountsHeaders['Referrer-Policy'] = 'no-referrer'
    this.connectedAppAccountsHeaders['Content-Type'] = 'application/json'
    this.connectedAppAccountsHeaders['Origin'] = this.mqStatsBaseUrl
    this.connectedAppAccountsHeaders['X-XSRF-TOKEN'] = xsrfToken

    return {
      method: method,
      url: uri,
      headers: this.connectedAppAccountsHeaders,
      data: {
        username: username,
        password: password
      }
    }
  }


  mqHeaders = {
    'Cache-Control': 'no-cache',
    'Host': process.env.ANYPOINT_API_MANAGER_HOST,
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Authorization': `Bearer null`,
    'x-forwarded-for': '10.255.0.1',
    'X-Correlation-ID': uuidv4(),
    'Content-Type': 'application/json'
  }

  getStatsByOrganisation(accessToken, params,
    method = 'GET',
    endpoint = '/organizations/:orgId') {

    const uri = `${this.mqStatsBaseUrl}${this.mqStatsPath}${endpoint.replace(':orgId', this.mqStatsOrgId)}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders,
      params: params
    }
  }

  getStatsByEnvironment(accessToken, params,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId') {

    const uri = `${this.mqStatsBaseUrl}${this.mqStatsPath}${endpoint.replace(':orgId', this.mqStatsOrgId).replace(':envId', this.mqStatsEnvId)}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders,
      params: params
    }
  }

  getRealtimeStats(accessToken, region, mq,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId/regions/:region/queues') {

    const uri = `${this.mqStatsBaseUrl}${this.mqStatsPath}${endpoint.replace(':orgId', this.mqStatsOrgId).replace(':envId', this.mqStatsEnvId).replace(':region', region)}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders,
      params: URLSearchParams({'destinationIds': mq})
    }
  }

  getHistoricStats(accessToken, region, mq,
    method = 'GET',
    endpoint = '/organizations/:orgId/environments/:envId/regions/:region/queues/') {

    const uri = `${this.mqStatsBaseUrl}${this.mqStatsPath}${endpoint.replace(':orgId', this.mqStatsOrgId).replace(':envId', this.mqStatsEnvId).replace(':region', region)}${mq}`

    this.mqHeaders['X-Correlation-ID'] = uuidv4()
    this.mqHeaders['Authorization'] = `Bearer ${accessToken}`

    return {
      method: method,
      url: uri,
      headers: this.mqHeaders
    }
  }
}

export const AnypointMqStatsClient = new AnypointMqStatsClientClass()
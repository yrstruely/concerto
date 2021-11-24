const axios = require("../../../axios-client.js")
const url = require('url')
const expect = require('chai').expect


async function run(test_name, data) {
    try {
        const uri = 'https://login.microsoftonline.com/c5d7dc78-3f45-4492-8053-9441aee4531b/saml2'

        const form_params = new url.URLSearchParams()
        form_params.append('SAMLRequest', 'PHNhbWxwOkF1dGhuUmVxdWVzdCBJRD0iUzAwNTA1NmIzLTJlOWEtMWVkYy05Mzk1LWNjN2ViNGNiNzc1YSIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMjEtMTEtMjNUMjI6NDA6NDJaIiBEZXN0aW5hdGlvbj0iaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2M1ZDdkYzc4LTNmNDUtNDQ5Mi04MDUzLTk0NDFhZWU0NTMxYi9zYW1sMiIgRm9yY2VBdXRobj0iZmFsc2UiIElzUGFzc2l2ZT0iZmFsc2UiIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiPjxzYW1sOklzc3VlciB4bWxuczpzYW1sPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj5TUlZQcm92aWRlcl9GRDA8L3NhbWw6SXNzdWVyPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxkczpTaWduZWRJbmZvPjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8&#x2b;PGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZHNpZy1tb3JlI3JzYS1zaGEyNTYiLz48ZHM6UmVmZXJlbmNlIFVSST0iI1MwMDUwNTZiMy0yZTlhLTFlZGMtOTM5NS1jYzdlYjRjYjc3NWEiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybXM&#x2b;PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkczpEaWdlc3RWYWx1ZT5ocmRIb084bVRlYjNlVGJUcmNwYkpYK3pwM0hzNS9Za3I1ZTdKS2wwbzNnPTwvZHM6RGlnZXN0VmFsdWU&#x2b;PC9kczpSZWZlcmVuY2U&#x2b;PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5FWUI1REtMNVVNV093RFZVUnNiSkU3SGhkdUhDbkZuWFlSd2RyWHZpdWZCZ3prVEhZL24zaVRiS0NwWW1uSmdESlJXK1U3aVNLRnBEClM2RTRUM2xQUzQvaHNtWnJlRndiYkVYS0pYcTBrV0R2RFc4aGJnQWtBS2VGeU5wWEttMkZjeWgrU0E3bUNSeGNDSjliUklIaXcxNzkKSFVqUFRRL1FkaTZPNVREbWErMD08L2RzOlNpZ25hdHVyZVZhbHVlPjwvZHM6U2lnbmF0dXJlPjxzYW1scDpOYW1lSURQb2xpY3kgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoxLjE6bmFtZWlkLWZvcm1hdDp1bnNwZWNpZmllZCIgQWxsb3dDcmVhdGU9InRydWUiLz48L3NhbWxwOkF1dGhuUmVxdWVzdD4&#x3d;')
        form_params.append('RelayState', 'oucqqvqvwbtosezaoredcoztzvoccxebucbxxva')

        const customized_headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "brcap=0; ESTSSSOTILES=1; AADSSOTILES=1; wlidperf=FR=L&ST=1624511563634; CCState=Q240S1FtdGxjbko1TG1oaGNuSnBjMEJtYjI1MFpYSnlZUzVqYjIxOFlYQndPakF3TURBd01EQXlMVEF3TURBdE1HWm1NUzFqWlRBd0xUQXdNREF3TURBd01EQXdNQklCQUJvSkNjeWFSN3dGYzlsSU9BQklBRklTQ2hCNDNOZkZSVCtTUklCVGxFR3U1Rk1iV2hJS0VOR1BLN0ZWbENkSW5hd005aW5rRUdBS2ZncENhMlZ5Y25rdWFHRnljbWx6UUdadmJuUmxjbkpoTG1OdmJYeGhjSEE2Wmpjd01EQmtNV1F0T1dOaVlpMDBZVFl4TFRreE5qa3RObVV3WlRnMVpqYzFNekl3RWdFQUdna0pBQUFBQUFBQUFBQTRBVWdBVWhJS0VIamMxOFZGUDVKRWdGT1VRYTdrVXh0YUVnb1EwWThyc1ZXVUowaWRyQXoyS2VRUVlCSVNDaEFUQmZneVhIWGJUYUlhYjZsemgwTmxHZ2tKQVFjUzlLcHcyVWc9; x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; ESTSAUTHLIGHT=+295e496b-c389-41cd-b5bb-3d814d1054b6; ESTSSC=00; ESTSAUTHPERSISTENT=0.ASYAeNzXxUU_kkSAU5RBruRTG3rt192ku11HpI7yG_Y58bkmAIM.AgABAAQAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P8grLaaZP9Z9pByzCkdgfQKNe0OeuiUJ0S0_AljOIII-DwawlYCIFNsnRFlrr5TTcbw_KNaZ_owPeb-qh1V2C4xcoAxiGeArMa9jnk3leesujTK4_aMY2CYxN9w5is4tPRfwJNXwZ0YFidbtycGM0kS86YFz_Zt42Ki1E91yqyQXaYn1fhEYYi_on9mQ5rSKbqAka0gm5wpocShhdqitUveu9F3YceE2uUNVQiIOVG1P1-irANGJINMuiN6dUONLPJpfBC_odZmpRxO7GyC8SYZhG5FNetLCEu0T1h9K12c0wv3ci6hHAoi0jdYfMZs52PsR6-aH6wYsjbAefmGqrhPNPJGeQHpghyFpKVUHPCmYScOnVNzmX7XeZ17Ygk32Y9cLt3_WnE20Cf8vjBb4JyzlxTW4AOV0t0T0RdcEJhWc2Xlh3Xp47hWv8OLKBhQTan9067Vuo_e7Yzg1TK4p5Aj1YtZ0EvoAdJlg8mUTWvJkmrB-r-q0q45vlcWx2unygdqq5Yvvx2f7Bi7291Rz7wTQ5K0i-MRCCBkncT0E2YH5IyUz55wBWST1TLoopyK5PVfzyDthHXuXX_LKfSO_KAkrcqLQg; ESTSAUTH=0.ASYAeNzXxUU_kkSAU5RBruRTG3rt192ku11HpI7yG_Y58bkmAIM.AgABAAQAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P9TXOrxAOadJ3O3p8Fmu236ctUs5Quqc8Y1l1ROlVc1i9uGvxvJCBPv-VB-JD09SYF5zrBva5N5DA; ch=PWEorBdOu5euIJ-n_MUpCzzCguKiFVLJibhpy49MbgY; buid=0.ASYAeNzXxUU_kkSAU5RBruRTG3rt192ku11HpI7yG_Y58bkmAIM.AQABAAEAAAD--DLA3VO7QrddgJg7WevreFFI8KxiAt2CeUzhgSsDBx_Rn1c7hdADmbft2BFk3YP800Ba5EMYoV5FP5d2LWjMAnxjtmfzvHQXuXP5ZrEMlO_gc1t1JCnVScY9uWhcOhE4cvc2xg1fEueullP1LfHFJt8zEX3XfCNjouLTIWTZR1dxwwiacrwbOiAUkTykz_QgAA; SignInStateCookie=CAgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P89jQSnN4dCq52wf95O6j9OvbflogtX8Ecb22xNnSGoh3_DkUlvkeP9WJoAmMZos1mGVVdFeqp2CKHnfOInIoGlDSAhFOC29hh_FIWjTVb3Etba4zYj6UPhjxjTZH48qH79Q60xh1-pwFoWvSfb2Ic9_nEDtZB4AK5NlwPypq_e4LMKdwupJQu1v24ngTggJZNjUaBKEhOAXxcZDvAf-STd72sCTxVYB5o39qaaJ2v2MwJ2jt8rhggdbA0L4z_5i8zWbv8aogEaBTNCBYK2GWlhqxU9uq2560lSXdJbF-eljZd42iGYToWh39JeGUWuuqjd3NsSbPFLzCMs8adWSiBAohN2OE3GbhfN2F5AvHDCWJfjp72u8oCp2tJxtSUYTdzDyk_V081TbfY9a3GpD3vYrpeWETKjP_dMjp2g; fpc=AoejStitZSZLp-coBBKV1niQDQzHAQAAAF9vL9kOAAAAxZmbWAEAAADMbC_ZDgAAABqjABYBAAAAq28v2Q4AAAA; esctx=AQABAAAAAAD--DLA3VO7QrddgJg7WevrvAPAydSET-Ep_8ghdmsdtxaF1yGJIMIxnoFC_aGOTFavJMUaCzwf8tJvj0gPC_xtcnDrBs2iX5pbwptjwss5w_MQ0cri5GqYNZXfkQRf8Fottp_nd-N-fIlcDy9FHxf5vf28Lg549lt1yqiqRc_qpGLNViETCtT0d_xGCb3tMrsgAA",
            "Referer": "https://go-dev.test.fonterra.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }

        const config = {
            method: 'POST',
            url: uri,
            headers: customized_headers,
            data: form_params
        }

        const result = await axios.makeRequest(config, data)
        data = axios.getSetCookie(result, data)
        axios.logResult(result, test_name, data, test)

    } catch (error) {
        console.log(error)
    }
    return data
}

function test(result, data) {
    expect(result.status).to.equal(200)
}

module.exports = { run }

import * as crypto from "crypto";

export function generateAuthHeader(secretKey, payload) {

    if (typeof payload === 'object') {
        payload = formattedStringify(payload)
    }
    const hash = crypto.createHmac('sha256', secretKey).update(payload).digest('hex')
    
    return 'sha256=' + hash;
}

export function formattedStringify(jsonObject) {
    return JSON.stringify(jsonObject, null, 4).replaceAll('\n', '\r\n')
}

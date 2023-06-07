import crypto from 'crypto'

export function generateAuthHeader(secretKey, payload) {

    const hash = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
    console.log('---------------------------------------'+hash)
    return 'sha256=' + hash;
};

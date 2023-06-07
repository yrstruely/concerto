
export function encode(clientID, clientSecret) {

    return new Buffer.from(clientID + ':' + clientSecret).toString('base64')
};


export function decode(base64String) {

    return new Buffer.from(base64String, 'base64').toString('ascii')  
};

export const keys = x => Object.getOwnPropertyNames(x).concat(Object.getOwnPropertyNames(x?.__proto__))
export const isObject = v => Object.prototype.toString.call(v) === '[object Object]'

export function classToObject(proto) {
    let jsoned = {};
    let toConvert = proto || this;
    Object.getOwnPropertyNames(toConvert).forEach((prop) => {
        const val = toConvert[prop];
        // don't include those
        if (prop === 'classToObject' || prop === 'constructor') {
            return;
        }
        if (typeof val === 'function') {
            jsoned[prop] = val.bind(jsoned);
            return;
        }
        jsoned[prop] = val;
    });

    const inherited = Object.getPrototypeOf(toConvert);
    if (inherited !== null) {
        Object.keys(classToObject(inherited)).forEach(key => {
            if (!!jsoned[key] || key === 'constructor' || key === 'classToObject')
                return;
            if (typeof inherited[key] === 'function') {
                jsoned[key] = inherited[key].bind(jsoned);
                return;
            }
            jsoned[key] = inherited[key];
        });
    }
    return jsoned;
}
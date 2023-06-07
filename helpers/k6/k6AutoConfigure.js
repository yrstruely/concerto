
export function create(clientConfig) {

    const clientConfigArray = Object.entries(clientConfig)

    const clientConfigObjects = clientConfigArray.filter(a => typeof a[1] === 'object')
    for (const obj of clientConfigObjects) {
        obj[1] = JSON.stringify(obj[1])
    }

    const clientConfigFunctions = clientConfigArray.filter(a => typeof a[1] === 'function')
    for (const fn of clientConfigFunctions) {
        fn[1] = fn[1].toString()
    }

    // Serialize the array of arrays
    fs.writeFileSync('../client-configs/serialized-client-config-objects.txt', JSON.stringify(clientConfigObjects));
    fs.writeFileSync('../client-configs/serialized-client-config-functions.txt', JSON.stringify(clientConfigFunctions));

    /* How to run the stringified functions once brought back from persistence:
       eval(`(${K6Config[2][1]})()`)  --- note you can add parameters:
       eval(`(${K6Config[2][1]})('param a', 'param b')`) etc.
    */
}


export function readK6Config() {
    let clientConfigObjects = JSON.parse(fs.readFileSync('../client-configs/serialized-client-config-objects.txt').toString())
    let clientConfigFunctions = JSON.parse(fs.readFileSync('../client-configs/serialized-client-config-functions.txt').toString())


    let clientConfig = {};
    let functionVars = ''

    // Add objects to clientConfig
    clientConfigObjects.forEach(obj => {
        clientConfig[obj[0]] = JSON.parse(obj[1])
    });

    // Refactor functions to use objects from clientConfig
    clientConfigFunctions.forEach(fx => {
        clientConfigObjects.forEach((value, index, obj) => {
            fx[1] = fx[1].replaceAll(value[0], `clientConfig[clientConfigObjects[${index}][0]]`)
        });
    });

    // Add functions to clientConfig
    clientConfigFunctions.forEach(fx => {
        clientConfig[fx[0]] = fx[1]
    });

    // Refactor objects to use functions from clientConfig
    clientConfigObjects.forEach(obj => {
        clientConfigFunctions.forEach((value, index, fx) => {
            obj[1] = obj[1].replaceAll(value[0], `eval(clientConfig[clientConfigFunctions[${index}][0]])()`)
        });
    });

    ///* Usage Examples
    console.log(clientConfig[clientConfigObjects[1][0]])   // Displaying an object
    console.log(clientConfig[clientConfigFunctions[0][0]])   // Displaying a function
    console.log(clientConfig[clientConfigObjects[1][0]]['X-Correlation-ID'])   // Retrieving an element from an object
    console.log(eval(`(${clientConfig[clientConfigFunctions[0][0]]})(${functionVars})`).toString())   // Executing a function
    //*/
}

createK6Config(ClientConfig)
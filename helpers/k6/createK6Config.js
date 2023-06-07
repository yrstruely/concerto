import fs from 'fs'


export function createK6Config() {
    let files
    try {

        files = fs.readdirSync('./client-configs/').filter((allFilesPaths) =>
            allFilesPaths.match(/-client-config\.js$/) !== null)
    } catch (error) {
        console.error(error)
    }

    if (!files) {
        throw new Error('File ./client-configs/????-client-config.js Not found! Make sure you are running this command from the project\'s root directory.')
    } else if (files.length > 1) {
        throw new Error("More than one xxx-client-config.js files found! There can be only one!")
    }

    let clientConfig
    (async () => {
        clientConfig = await import(`file:///${process.cwd().replace(/\\/g, '/')}/client-configs/${files[0]}`)
            .then((clientConfig) => {
                const clientConfigArray = Object.entries(clientConfig)

                const clientConfigObjects = clientConfigArray.filter(a => typeof a[1] === 'object')
                for (const obj of clientConfigObjects) {
                    obj[1] = JSON.stringify(obj[1])
                }

                const clientConfigFunctions = clientConfigArray.filter(a => typeof a[1] === 'function')
                for (const fn of clientConfigFunctions) {
                    fn[1] = fn[1].toString()
                }

                try {
                    fs.rmSync('./client-configs/k6-config.js')
                } catch (error) { }

                let k6Imports
                let k6Exports
                let stream
                try {
                    k6Imports = fs.readFileSync('./client-configs/k6-imports-template.js')
                    fs.writeFileSync('./client-configs/k6-config.js', k6Imports.toString() + '\n\n')

                    stream = fs.createWriteStream('./client-configs/k6-config.js', { flags: 'a' });

                    clientConfigObjects.forEach(obj => {
                        stream.write(`let ${obj[0]} = ${obj[1]}\n\n`)
                    });


                    clientConfigFunctions.forEach(fx => {
                        stream.write(`${fx[1]}\n\n`)
                    });

                    k6Exports = fs.readFileSync('./client-configs/k6-exports-template.js')
                    stream.write(k6Exports)
                } catch (error) {
                    console.error(error)
                } finally {
                    stream.end();
                }
            })
    })();
}
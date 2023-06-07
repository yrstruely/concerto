import fs from 'fs'

export function serialize(data, file) {
    try {
        const serialized_data = JSON.stringify(data)
        fs.writeFileSync(file, serialized_data)
    } catch (error) {
        console.error('Error writing data to file: ' + error)
    }
}

export function deserialize(file) {
    try {
        const serialized_data = fs.readFileSync(file)
        return JSON.parse(serialized_data)
    } catch (error) {
        console.error('Error reading file: ' + error)
    }
}

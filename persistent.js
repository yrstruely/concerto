const fs = require('fs');

function serialize(data) {
    try {
        const serialized_data = JSON.stringify(data);
        if (typeof(serialized_data) == undefined) {
            throw "Error: attempting to serialize undefined data!"
        }
        fs.writeFileSync('./results/data.json', serialized_data);
        console.log('Wrote data to file');
    } catch (error) {
        console.log(error);
    }
}

function deserialize() {
    try {
        const serialized_data = fs.readFileSync('./results/data.json');
        const data = JSON.parse(serialized_data);
        console.log('Read data from file');

        return data;

    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    serialize,
    deserialize
}
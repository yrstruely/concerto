const fs = require('fs');

function serialize(data) {
    const serialized_data = JSON.stringify(data);

    fs.writeFile('/results/data.json', serialized_data, (error) => {
        if (error) {
            throw error;
        }
        console.log('Wrote data to file');
    });
}
function deserialize() {
    try {
        const serialized_data = fs.readFileSync('/results/data.json');
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
const fs = require('fs')

function getDeviceData(res, text) {
    fs.readFile('./data/deviceData/' + text + '.json', (err, file) => {
        if (err) {
            console.log(err)
        }

        obj = JSON.parse(file)

        var jsonString = JSON.stringify(obj[0].uplink_message.decoded_payload, ' ', ' ')
        var parts = jsonString.split(' ')
        var vars = []
        for (let i = 1; i < parts.length; i += 2) {
            vars.push(parts[i].replace(/\W/g, ''))
        }

        var senddata = []

        vars.forEach(variable => {
            var data = {
                title: variable,
                graphdata: []
            }

            obj.forEach(element => {
                //var date = new Date(element.received_at)

                data.graphdata.push({
                    x: element.received_at,
                    y: element.uplink_message.decoded_payload[variable]
                })
            });

            senddata.push(data)
        });

        res.writeHead(200)
        res.end(JSON.stringify(senddata))
    })
}

module.exports = { getDeviceData }
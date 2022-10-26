const mqtt = require('mqtt')
const fs = require('fs')

function mqttWorker(device) {
    device.port = 1883;
    var topic = 'v3/' + device.username + '/devices/' + device.device_id + '/up'
    var client = mqtt.connect("mqtt://eu1.cloud.thethings.network", device)

    client.on("connect", () => {
        console.log('device : ' + device.username + " connected: " + client.connected)
    })

    client.subscribe(topic, {pos: 1})

    client.on("message", (topic, msg) => {
        fs.readFile('data/deviceData/' + device.username + ".json", (err, input) => {
            if (err) {
                console.log(err)
            }

            data = JSON.parse(input)
            newData = JSON.parse(msg)
            data.push(newData)

            fs.writeFile('data/deviceData/' + device.username + '.json', JSON.stringify(data, null, '\t'), (err) => {
                if (err) {
                    console.log(err)
                }
                console.log('message resived Device: ' + device.username)
            })
        })
    })

    client.on('error', function (error) {
        console.log("Can't connect" + error);
        client.end()
    });
}

module.exports = {mqttWorker}
const Devices = require('./controller/Devices.js')
const mqttBroker = require('./controller/mqttBroker.js')
const Home = require('./controller/Home.js')
const API = require('./controller/API.js')

const http = require('http')
const fs = require('fs')

const requestListener = function (req, res) {
    path = req.url
    pathParts = path.split('/')

    //controller
    switch (pathParts[1]) {
        case "devices":
            Devices.DevicesController(req, res)
            break;

        case "api":
            API.getDeviceData(res, pathParts[3])
            break;

        case "js":
            fs.readFile("js/" + pathParts[2], (err, data) => {
                if (err) {
                    console.log(err)
                }

                res.writeHead(200)
                res.end(data)
            })
            break;

        case "css":
            fs.readFile("./css/" + pathParts[2], (err, data) => {
                if (err) {
                    console.log(err)
                }

                res.writeHead(200)
                res.end(data)
            })

        default:
            Home.home(res)
            break;
    }
}

const server = http.createServer(requestListener)

server.listen(3000, '192.168.2.138', () => {
    console.log('Server running')
    console.log('Server is listening on ip: 192.168.2.138:3000')
})

//start mqtt at beginning
if (!fs.existsSync('./data/deviceData')) {
    fs.mkdirSync('./data/deviceData', { recursive: true })
    fs.writeFile('./data/devices.json', '[]', () => {
        console.log("devices.json file is created")
    })
}

fs.readFile('data/devices.json', (err, file) => {
    if (err) {
        console.log(err)
        return
    }

    var devices = JSON.parse(file)

    devices.forEach(device => {
        mqttBroker.mqttWorker(device)
    });
})
const Devices = require('./controller/Devices.js')
const mqttBroker = require('./controller/mqttBroker.js')
const Home = require('./controller/Home.js')

const http = require('http')
const fs = require('fs')

const requestListener = function (req, res) {
    path = req.url
    pathParts = path.split('/')

    //method
    if (req.method == "GET") {
        //controller
        switch (pathParts[1]) {
            case "devices":
                switch (pathParts[2]) {
                    case "add":
                        //add device page
                        Devices.Add(res)
                        break;

                    case "edit":
                        Devices.deviceEdit(res, pathParts[3])
                        break;

                    case "data":
                        Devices.getDevice(res, pathParts[3])
                        break;

                    default:
                        //default devices
                        Devices.Default(res)
                        break;
                }
                break;

            case "api":
                Devices.getDeviceData(res, pathParts[3])
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
    else if (req.method == "POST") {
        switch (pathParts[1]) {
            case "devices":
                switch (pathParts[2]) {
                    case 'add':
                        Devices.AddPost(res, req)
                        break

                    case 'edit':
                        Devices.editPost(res, req)
                        break
                }
                break;
        }
    } else {
        //method delete
        switch (pathParts[1]) {
            case "devices":
                var device = pathParts[3];
                Devices.DeleteDevice(res, req, device)
                break;

            default:
                break;
        }
    }
}

const server = http.createServer(requestListener)

server.listen(3000, '192.168.2.138', () => {
    console.log('Server running')
})

//start mqtt at beginning
if (!fs.existsSync('./data/deviceData')) {
    fs.mkdirSync('./data/deviceData', {recursive: true})
    fs.writeFile('./data/devices.json', '[]',() => {
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
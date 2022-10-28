const fs = require('fs')
const mqttBroker = require('./mqttBroker')

function Default(res) {
    res.writeHead(200, {
        'content-type': 'Text/html'
    })

    fs.readFile("data/devices.json", (err, file) => {
        if (err) {
            console.log(err)
        }

        devices = JSON.parse(file)

        text = "<button class=\"btn btn-primary\" type=\"button\" onclick=\"addClick()\">Add</button>"
        text += "<table class=\"table\"><tbody>"
        var count = 0;
        devices.forEach(device => {
            text += "<tr><td><div class=\"card\"><div class=\"card-header\">" + device.name + "</div><div class=\"card-body\"><li>" + device.username + "</li><li>" + device.device_id + "</li></div></div></td><td>"
            text += "<button class=\"btn btn-danger removeBtn\" id=\"" + count + "\" onclick=\"rmBtnClick(this)\">Remove</button>"
            text += "<button class=\"btn btn-primary\" id=\"" + count + "\" type=\"button\" onclick=\"editClick(this)\">Edit</button>"
            text += "<button class=\"btn btn-light\" id=\"" + count + "\" type=\"button\" onclick=\"upClick(this)\">up</button>"
            text += "<button class=\"btn btn-light\" id=\"" + count + "\" type=\"button\" onclick=\"downClick(this)\">down</button>"
            text += "</td></tr>"
            count++
        });
        text += "</tbody></table>"
        text += "<script src=\"/js/devices.js\"></script>"

        finishPage(text, res)
    })
}

function Add(res) {
    fs.readFile("html/addDevice.html", (err, file) => {
        if (err) {
            console.log(err)
        }
        res.writeHead(200, {
            'content-type': 'Text/html'
        })
        finishPage(file, res)
    })
}

function finishPage(text, res) {
    fs.readFile("html/layout.html", function (err, file) {
        if (err) {
            console.log(err)
        }

        var parts = file.toString().split("<mainspace>")
        var test = parts[0] + "<mainspace>" + text + parts[1];

        res.writeHead(200, {
            'content-type': 'Text/html'
        })
        res.write(test)
        res.end()
    })
}

function AddPost(res, req) {
    req.on('error', (err) => {
        console.log(err)
    })

    var data = ""
    req.on('data', (chunk) => {
        data += chunk
    })

    req.on('end', () => {
        //console.log(data)
        obj = JSON.parse(data)

        mqttBroker.mqttWorker(obj)

        fs.writeFile('data/deviceData/' + obj.username + '.json', '[]', (err) => {
            if (err) {
                console.log('add(post): ' + err)
            }
        })

        fs.readFile("data/devices.json", (err, fileData) => {
            if (err) {
                console.log(err)
            }

            devices = JSON.parse(fileData)
            devices.push(obj)

            fs.writeFile("data/devices.json", JSON.stringify(devices, null, '\t'), () => {
                res.writeHead(200)
                res.end()
            })
        })
    })
}

function DeleteDevice(res, req, device) {
    fs.readFile("data/devices.json", (err, file) => {
        if (err) {
            console.log(err)
        }

        var devices = JSON.parse(file);
        devices.splice(device)

        fs.writeFile("data/devices.json", JSON.stringify(devices, null, '\t'), () => {
            res.writeHead(200)
            res.end()
        })
    })
}

function getDevice(res, text) {
    fs.readFile('./html/deviceData.html', (err, file) => {
        if (err) {
            console.log(err)
        }
        var output = "<h2 id=\"device\" style=\"text-align: center; \">" + text + "</h2>"
        output += file
        finishPage(output, res)
    })
}

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

function deviceEdit(res, deviceInt) {
    deviceInt = Number(deviceInt)
    fs.readFile('./html/editDevice.html', (err, htmlFile) => {
        if (err) {
            console.log(err)
        }

        fs.readFile('./data/devices.json', (err, file) => {
            if (err) {
                console.log(err)
            }

            devices = JSON.parse(file)
            device = devices[deviceInt]
            var splitFile = htmlFile.toString().split('value=\"')

            try {
                text = splitFile[0] + "value=\"" + device.name + splitFile[1] + "value=\"" + device.username + splitFile[2] + "value=\"" + device.device_id + splitFile[3]
            } catch (error) {
                res.writeHead(404)
                res.end(error)
                return
            }

            finishPage(text, res)
        })
    })
}

function editPost(res, req) {
    req.on('error', (err) => {
        console.log(err)
    })

    var data = ""
    req.on('data', (chunk) => {
        data += chunk
    })

    req.on('end', () => {
        //console.log(data)
        obj = JSON.parse(data)

        fs.readFile("data/devices.json", (err, fileData) => {
            if (err) {
                console.log(err)
            }

            devices = JSON.parse(fileData)

            for (let i = 0; i < devices.length; i++) {
                if (devices[i].username == obj.username) {
                    var psw = device.password;
                    devices[i] = obj
                    devices[i].password = psw
                }
            }

            fs.writeFile("data/devices.json", JSON.stringify(devices, null, '\t'), () => {
                res.writeHead(200)
                res.end()
            })
        })
    })
}

function deviceUp(res, id) {
    fs.readFile('data/devices.json', (err, file) => {
        if (err) {
            console.log(err)
            return
        }
        var devices
        try {
            devices = JSON.parse(file)
        } catch (ex) {
            console.log(ex)
            waitPage(res)
            return
        }

        var out_obj = []

        if (0 == id) {
            var obj = devices[id]

            for (let i = 1; i < devices.length; i++) {
                out_obj.push(devices[i])
            }
            out_obj.push(obj)
        } else {
            var obj = devices[id]
            for (let i = 0; i < devices.length; i++) {
                if (i == id - 1) {
                    out_obj.push(obj)
                }
                out_obj.push(devices[i])
                i++
            }
        }

        fs.writeFile('data/devices.json', JSON.stringify(out_obj, null, '\t'), () => {
            res.writeHead(200)
            res.end()
        })
    })
}

function deviceDown(res, id) {
    fs.readFile('data/devices.json', (err, file) => {
        if (err) {
            console.log(err)
            return
        }

        var devices

        try {
            devices = JSON.parse(file)
        } catch (ex) {
            console.log(ex)
            waitPage(res)
            return
        }

        var out_obj = []

        if (id == devices.length - 1) {
            out_obj.push(devices[id])

            for (let i = 0; i < devices.length - 1; i++) {
                out_obj.push(devices[i])
            }
        } else {
            var obj = devices[id]

            for (let i = 0; i < devices.length; i++) {
                if (i == id) {
                    out_obj.push(devices[i + 1])
                    out_obj.push(obj)
                    i++
                }
                else {
                    out_obj.push(devices[i])
                }

            }
        }

        fs.writeFile('data/devices.json', JSON.stringify(out_obj, null, '\t'), () => {
            res.writeHead(200)
            res.end()
        })
    })
}

function waitPage(res) {
    text = "<div id=\"text\"></div><script src=\"/js/waitPage.js\"></script>"
    finishPage(text, res)
}

module.exports = { Default, Add, AddPost, DeleteDevice, getDevice, getDeviceData, deviceEdit, editPost, deviceUp, deviceDown }
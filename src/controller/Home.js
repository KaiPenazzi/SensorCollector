const fs = require('fs')

function home(res) {
    fs.readFile('data/devices.json', (err, file) => {
        if (err) {
            console.log(err)
        }

        devices = JSON.parse(file)
        text = "<script type=\"text/javascript\">window.setTimeout(() => { document.location.reload(true); }, 15000);</script>"
        text += "<table class=\"table\"><tbody>"

        var count = 0
        devices.forEach(device => {
            fs.readFile('data/deviceData/' + device.username + '.json', (err, datafile) => {
                if (err) {
                    console.log(err)
                }

                data = JSON.parse(datafile)
                try {
                    text += "<tr><td><div class=\"card\"><div class=\"card-header\"><h6><a href=\"/devices/data/" + device.username + "\">" + device.name + " | " + new Date(data[data.length - 1].received_at).toLocaleString('de') + "<a></h6></div>"
                    text += "<div class=\"card-body\">"

                    var jsonString = JSON.stringify(data[data.length - 1].uplink_message.decoded_payload, ' ', ' ')
                    var parts = jsonString.split(' ')
                    for (let i = 1; i < parts.length; i += 2) {
                        text += parts[i].replace(/\W/g, '') + ": " + data[data.length - 1].uplink_message.decoded_payload[parts[i].replace(/\W/g, '')] + "<br>"
                    }

                    text += "</div></td></tr>"

                } catch (error) {
                    console.log(error)
                }

                if (count == devices.length - 1) {
                    text += "</tbody></table>"
                    finishPage(text, res)
                    return
                }
                count++
            })
        });

        if (devices.length == 0) {
            finishPage('no Devices', res)
        }
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

module.exports = { home }
function upClick(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("post", "devices/up/" + id.attributes["id"].value)
    xhr.send()
    window.open("/devices", "_self")
}

function downClick(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("post", "devices/down/" + id.attributes["id"].value)
    xhr.send()
    window.open("/devices", "_self")
}
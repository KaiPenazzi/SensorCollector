function addClick() {
    window.open("/devices/add","_self")
}

function rmBtnClick(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "devices/" + id.attributes["id"].value)
    xhr.send()
    window.open("/devices", "_self")
}

function editClick(id) {
    window.open("/devices/edit/" + id.attributes["id"].value + "/", "_self")
}
function buttonOnClick() {
    var formData = new FormData()
    formData.append("name", document.getElementById("name").value)
    formData.append("username", document.getElementById("username").value)
    formData.append("device_id", document.getElementById("device_id").value)

    var obj = {}
    formData.forEach((value, key) => {
        obj[key] = value;
    })

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "192.168.2.138:3000/device/edit")
    var text = JSON.stringify(obj)
    xhr.send(JSON.stringify(obj))
    xhr.onreadystatechange = () => {
        if (req.readyState == 4) {
            if (req.status == 200) window.close()
        }
    }
}
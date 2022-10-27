var start = 4

setInterval(() => {

    var space = document.getElementById("text")
    space.innerHTML = "warte noch: " + start

    start--

    if (start <= 0) {
        window.open("/home", "_self")
    }
}, 1000);
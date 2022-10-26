var name = document.getElementById("device").innerHTML
var chartspace = document.getElementById("chartSpace")

var xhr = new XMLHttpRequest();

xhr.open("GET", "/api/data/" + name)
xhr.send()

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.responseText)
        makeChart(data)
    }
}

function makeChart(data) {
    var text = "<table class=\"table\"><tbody>"
    for (let i = 0; i < data.length; i++) {
        text += "<tr><td><div class\"card\"><div class\"card-body\">"
        text += "<div id=\"chartContainer" + i + "\" style=\"height: 300px; width: 100%;\"></div>"
        text += "</div></div></td></tr>"
    }

    text += "</tbody></table>"
    chartspace.innerHTML = text

    let count = 0
    data.forEach(element => {

        element.graphdata.forEach(element => {
            element.x = new Date(element.x)
            element.y = Number(element.y)
        });

        var dataset = {
            theme: "light2",
            title:{
                text: element.title
            },
            axisX:{      
                valueFormatString: "DD-MM-YY HH:mm" ,
            },
            data: [{
                type: "line",
                indexLabelFontSize: 16,
                dataPoints: element.graphdata
            }]
        }

        var chart = new CanvasJS.Chart("chartContainer" + count, dataset);
        chart.render();
        count++
    });
}
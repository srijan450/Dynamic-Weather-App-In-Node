const http = require("http");
const fs = require('fs');
const path = require("path")
const requests = require('requests');
const homefile = fs.readFileSync(path.join(__dirname, "./Home.html"), "utf-8");
const server = http.createServer();
const port = process.env.PORT || 5000;

const replaceVal = (temp, orignal) => {
    let temprature = temp.replace("{% tempVal %}", Math.round(orignal.main.temp - 273.15))
    temprature = temprature.replace("{% city %}", orignal.name)
    temprature = temprature.replace("{% minVal %}", Math.round(orignal.main.temp_min - 273.15))
    temprature = temprature.replace("{% maxVal %}", Math.round(orignal.main.temp_max - 273.15))
    return temprature;
}

server.on('request', (req, res) => {
    if (req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=varanasi&appid=f1213eed1fc7a1eb9dd4ab8823bf38a1`)
            .on('data', function (chunk) {
                const objdata = JSON.parse(chunk)

                const arrData = [objdata]

                const realTimeData = arrData.map((val) => {
                    return replaceVal(homefile, val);
                })
                    .join("")
                res.write(realTimeData);
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
                res.end();
            });
    }
})
server.listen(port, 'localhost', (err) => {
    if (err)
        console.log("server is started");
    else {
        console.log(`server started at port ${port}`);
    }
})

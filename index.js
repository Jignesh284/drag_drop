const bodyParser = require('body-parser');
const express = require('express');
const app = express();
var port = process.env.PORT || 2200;

const server = app.listen(port, console.log(`holabeat up on ${port}`))
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.use(express.static('public'))

app.post("/result", (req, res) => {
  let { result } = req.body;
  let output = [];
  let red = 0;
  let blue = 0;
  let green = 0;
  if (!result)
    res.send({ data: output });
  for (i = 0; i < result.length; i++) {
    let str;
    if (result[i].color == 'red') {
      red++;
      str = `${result[i].color} ${red} : ${result[i].text}`;
    } else if (result[i].color == 'green') {
      green++;
      str = `${result[i].color} ${green} : ${result[i].text}`;
    } else if (result[i].color == 'blue') {
      blue++;
      str = `${result[i].color} ${blue} : ${result[i].text}`;
    }
    output.push(str);
  }
  res.send({ data: output });
})

app.use("/", (req, res) => {
  res.sendfile('./views/index.html');
})





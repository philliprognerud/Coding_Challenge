const express = require("express");
const app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.json());
require("./routes/routes")(app);

app.listen(8080, process.env.IP, function() {
  console.log("server has started");
});

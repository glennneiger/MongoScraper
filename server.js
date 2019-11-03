let express = require("express");
// let logger = require("morgan");
let mongoose = require("mongoose");

// Require all models
// let db = require("./models");

let PORT = 3030;

// Initialize Express
let app = express();

// Connect to the Mongo DB
mongoose.connect('mongodb+srv://Jmuniak33:Redmaple33@bytecloud-5wcvo.mongodb.net/article?retryWrites=true&w=majority', { useNewUrlParser: true });

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routes
app.use("/", require("./routes/routes"));


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

const express = require("express");
const app = express();
const connectDB = require("./config/db");
var bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

//Init Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Connect Database
connectDB();

//Define Routes
app.use("/user", require("./routes/api/form"));
app.use("/profile", require("./routes/api/profile"));
app.use("/auth", require("./routes/api/auth"));

app.get("/", (req, res) => res.send("e ai? testando muito"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname));
});

app.listen(PORT, console.group(`conected on Port:${PORT}`));

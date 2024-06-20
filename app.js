require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const router = express.Router();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error)
})
database.once("connected", () => {
    console.log("Database connected")
})

router.get("/", (req, res) => {
    res.send("Welcome to the Absensi API");
});

app.use("/api/v1", router);
app.listen(port, () => {
    console.log(`Absensi API: listening on port ${port}`);
});

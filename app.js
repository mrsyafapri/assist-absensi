const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
require("dotenv").config();

const swaggerDocs = require('./swagger');
const attendanceRoutes = require("./routes/attendance");

const app = express();
const router = express.Router();
const port = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const perusahaanServicesUrls = process.env.PERUSAHAAN_SERVICES_URLS.split(',');
const allowedOrigins = [...perusahaanServicesUrls, `http://localhost:${port}`];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database connected");
});

router.get("/", (req, res) => {
    res.send("Welcome to the Absensi API");
});

router.use("/absensi", attendanceRoutes);

app.use("/api/v1", router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`Absensi API: listening on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

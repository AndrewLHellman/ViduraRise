const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
// const path = require('path');

const PORT = 3200;
const app = express();

require("./models/imageMetaData");
require("./models/instrumentData");
require("./models/userData");
require("./models/storageData");
require("./models/projects");

require("dotenv").config();
// app.use(cors({ origin: 'http://52.200.252.209:3000' }));


const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 
app.use(bodyParser.json());
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb' }));

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: oneDay,
    },
  })
);

try {
  mongoose.connect(process.env.DB_CONNECT_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongo Connected Successfully!");
} catch (error) {
  console.log(err);
}

// default route
app.get("/", async (req, res) => {
  return res.json({ status: 1 });
});

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.use("/", require("./routes/all_s3_apis"));
app.use("/", require("./routes/instrument_apis"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/storage_api"));
app.use("/", require("./routes/project_apis"));
app.use("/", require("./routes/imageApi"));
app.use("/", require("./routes/dasboardData"));

app.listen(PORT, () => {
  console.log(`Web Server running on port ${PORT}`);
});

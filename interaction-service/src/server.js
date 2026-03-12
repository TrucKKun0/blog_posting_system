const express = require("express");
const {corsConfig} = require("./config/corsConfig");
const {connectDB} = require("./config/dbConfig");
const router = require("./router/interactionRouter");
const {rateLimiter} = require("./middleware/rateLimiter");
const logger = require("./config/loggerConfig");
const helmet = require("helmet");
const {connectToRabbitMQ} = require("./config/rabbitMqConfig");

connectDB();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(corsConfig);
app.use(rateLimiter(50,1000*60));

app.use("/api/interactions",router);
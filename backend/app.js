require('express-async-errors')
const config = require("./utils/config");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const blogsRouter = require("./controllers/blogs.route");
const usersRouter = require("./controllers/users.route")
const loginRouter = require("./controllers/login.route")
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware")
const app = express();

app.use(express.static(path.join(__dirname, 'dist')))

// Handle client-side routing - serve index.html for non-API routes
app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) {
        return next() // Let API routes handle themselves
    }
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB");
    })
    .catch((err) => {
        logger.error("error connection to MongoDB:", err.message);
    });
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan(":method :url status: :status - :response-time ms :req-body"));
app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing.route')
    app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
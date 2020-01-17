const path = require("path");
const express = require("express");
require('./db/mongoose');
const hbs = require("hbs");
const userRouter = require('./routers/user');
const partyRouter = require('./routers/party');
const viewsRouter = require('./routers/views');

const app = express();
const port = process.env.PORT;

// Define paths for express config
const publicDirectory = path.join(__dirname, "../dist");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Set up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectory));

app.use(express.json());
app.use(userRouter);
app.use(partyRouter);
app.use(viewsRouter);

// ------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
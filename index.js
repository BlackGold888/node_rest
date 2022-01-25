const express = require('express');
const db = require('./models');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session(
    {
        secret: process.env.SECRET_KEY || 'blackgold',
        resave: false,
        saveUninitialized: false
    }
));

//Routers
const postRouter = require('./routes/postsRouts');
app.use("/api", postRouter);

const userRouter = require('./routes/userRouts');
app.use("/user", userRouter);

db.sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
});

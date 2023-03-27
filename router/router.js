const express = require('express');
const dotenv = require('dotenv');
const DB = require('../controllers/dbcontroller.js');
const app = express();
dotenv.config();

// ROUTES //

function LoadRoutes(routes) {
    routes.forEach(route => {
        app.post(`/${route}`, (req, res) => {
           DB.verifywhitelist(route, req.ip.replace('::', ''), req.headers['message']);
           res.send('Info Received');
        });
    });
}


app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening at http://localhost:${process.env.PORT || 3000}`);
});

exports.LoadRoutes = LoadRoutes;
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Import routes
const useres = require('./routers/users');
// const preferencesRoutes = require('./routers/preferences');
// const vacationRoutes = require('./routers/vacation');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
    res.set('Content-Type', 'application/json');
    next();
});

// Routes
app.use('/users', useres);
// app.use('/preferences', preferencesRoutes);
// app.use('/vacation', vacationRoutes);

app.listen(port);
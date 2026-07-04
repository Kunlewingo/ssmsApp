const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// CREATE EXPRESS APP
const app = express();


// PORT
const PORT = process.env.PORT || 5000;


// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());

app.use(express.json());


// ==========================
// API ROUTES
// ==========================

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/students', require('./routes/studentRoutes'));

app.use('/api/courses', require('./routes/courseRoutes'));

app.use('/api/results', require('./routes/resultRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));


// ==========================
// DEFAULT ROUTE
// ==========================

app.get('/', (req, res) => {

    res.json({
        message: "School Management System API is running"
    });

});


// ==========================
// ERROR HANDLING MIDDLEWARE
// ==========================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({

        message: "Something went wrong on the server"

    });

});


// ==========================
// DATABASE CONNECTION
// ==========================

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected Successfully");


    // START SERVER ONLY AFTER DATABASE CONNECTS

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });


})


.catch((error) => {

    console.log("MongoDB Connection Error:");

    console.log(error.message);

});
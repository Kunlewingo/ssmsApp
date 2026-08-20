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

app.use('/api/faculties', require('./routes/facultyRoutes'));

app.use('/api/departments', require('./routes/departmentRoutes'));

app.use('/api/registration', require('./routes/registrationRoutes'));

app.use('/api/gpa', require('./routes/gpaRoutes'));

// NOTE: the old '/api/admin' mount (require('./routes/adminRoutes')) has been
// removed. It backed the deleted admin-login component, which used a
// different (username-based, tokenless) login flow than the working
// /api/auth/login endpoint. Admin auth now goes exclusively through
// /api/auth/login + /api/auth/register.


// ==========================
// DEFAULT ROUTE
// ==========================

app.get('/', (req, res) => {

    res.json({
        message: "School Management System API is running"
    });

});


// ==========================
// 404 HANDLER (unmatched routes)
// ==========================
// Without this, an unmatched route falls through to Express's default
// handler, which sends a raw HTML "Cannot GET /..." page instead of JSON —
// exactly the kind of ugly raw response we don't want reaching the frontend.

app.use((req, res) => {
    res.status(404).json({ message: 'This resource could not be found.' });
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

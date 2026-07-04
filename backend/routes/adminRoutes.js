const express = require('express');

const router = express.Router();


// TEST ADMIN USER

const ADMIN = {
    username: "admin",
    password: "admin123"
};


// LOGIN ROUTE

router.post('/login', (req, res) => {


    console.log("LOGIN BODY:", req.body);


    const { username, password } = req.body;


    if (!username || !password) {

        return res.status(400).json({

            message: "Missing credentials"

        });

    }


    if (
        username === ADMIN.username &&
        password === ADMIN.password
    ) {

        return res.json({

            message: "Admin login successful",

            admin: username

        });

    }


    res.status(401).json({

        message: "Invalid username or password"

    });


});


module.exports = router;
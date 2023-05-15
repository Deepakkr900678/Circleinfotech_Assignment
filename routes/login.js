const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/users")
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = "RESTAPI";

router.use(bodyParser.json())

// Route for register.

router.post("/register",
    body('email').isEmail(),
    body('name').isAlpha(),
    body('password').isLength({ min: 6, max: 16 }),
    async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { name, email, password } = req.body;

            let user = await User.findOne({ email });
            //Check wheather user is already registered
            if (user) {
                return res.status(404).json({
                    status: "0",
                    message: "Email already exists"
                });
            }

            // Hash the password before saving to the database
            bcrypt.hash(password, 10, async function (err, hash) {

                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    });
                }
                // console.log(err, hash );

                const user = await User.create({
                    name,
                    email,
                    password: hash
                })
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                }, secret);
                return res.json({
                    status: "1",
                    message: "Registration successful",
                    user,
                    token
                })
            })
        } catch (e) {
            res.status(500).json({
                status: "0",
                message: e.message
            })
        }

    })

// Route for login

router.post("/login", body('email').isEmail(),
    body('password').isLength({ min: 6, max: 16 }), async (req, res) => {

        try {
            //Finds the validation errors in this request and wraps them in an object with handy functions.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    // errors: errors.array(),
                    message: "Please enter your email first"
                })
            }

            const { email, password } = req.body;

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    status: "0",
                    message: "User doesnt exist"
                });
            }

            // Compare the password with hash password.
            bcrypt.compare(password, user.password, function (err, result) {
                //Result === true
                if (err) {
                    return res.status(500).json({
                        status: "0",
                        message: "Password is incorrect please check your password"
                    });
                }
                if (result) {
                    // Token will be used to track the user for further operation
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                    }, secret);


                    res.status(200).json({
                        status: "1",
                        message: "Login Successfully",
                        user,
                        token,
                    });

                } else {
                    res.status(401).json({
                        status: "0",
                        message: "Invalid Credentials !! Please provide correct email and password"
                    });
                }
            })
        } catch (e) {
            res.status(401).json({
                status: "1",
                message: "Email and Password both are incorrect please check"
            })
        }

    })

// Route for password reset
router.post("/forgot-password", body('email').isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "0",
                message: "User doesn't exist"
            });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // TODO: Send an email to the user with the password reset link containing the resetToken

        res.status(200).json({
            status: "1",
            message: "Password reset token has been sent to your email"
        });
    } catch (e) {
        res.status(500).json({
            status: "0",
            message: "Internal server error"
        });
    }
});

// Route for resetting the password with the reset token

router.post("/reset-password", body('password').isLength({ min: 6, max: 16 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Password must be between 6 to 16 characters long"
            });
        }

        const { resetToken, password } = req.body;

        let user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                status: "0",
                message: "Invalid or expired reset token"
            });
        }

        // Update the user's password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            status: "1",
            message: "Password reset successful"
        });
    } catch (e) {
        res.status(500).json({
            status: "0",
            message: "Internal server error"
        });
    }
});


router.get("/register", (req, res) => {
    res.send("OK")
})

module.exports = router;
const express = require("express");
const loginRoutes = require("./routes/login")

const app = express();

//CREATE OPERATIONS for all the users

app.post("/api/v1/users", (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function (err) {
                if (err) {
                    return res.status(401).json({
                        status: "0",
                        message: "Invalid token"
                    })
                }
                const token = req.headers.authorization;
                const decodedToken = jwt.verify(token, secret);
                const userId = decodedToken.data;
                User.create(req.body)
                    .then(user => {
                        if (!user) {
                            return res.status(404).json({
                                status: "0",
                                message: "User not found"
                            });
                        }
                        return res.status(200).json({
                            status: "1",
                            message: "user create successfully"
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: "0",
                            message: "Internal server error"
                        });
                    });
            })
        } else {
            return res.status(401).json({
                status: "0",
                message: "Invalid token"
            })
        }
    }
})

//READ OPERATION for all the users.

app.get("/api/v1/users", (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function (err) {
                if (err) {
                    return res.status(401).json({
                        status: "0",
                        message: "Invalid token"
                    })
                }
                const token = req.headers.authorization;
                const decodedToken = jwt.verify(token, secret);
                const userId = decodedToken.data;
                User.find()
                    .then(user => {
                        if (!user) {
                            return res.status(404).json({
                                status: "0",
                                message: "User not found"
                            });
                        }
                        return res.status(200).json({
                            status: "1",
                            message: "Get all the user successfully"
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: "0",
                            message: "Internal server error"
                        });
                    });
            })
        } else {
            return res.status(401).json({
                status: "0",
                message: "Invalid token"
            })
        }
    }
})


//UPDATE OPERATIONS---Update the exesting data

app.put("/api/v1/users", (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function (err) {
                if (err) {
                    return res.status(401).json({
                        status: "0",
                        message: "Invalid token"
                    })
                }
                const token = req.headers.authorization;
                const decodedToken = jwt.verify(token, secret);
                const userId = decodedToken.data;
                User.findOneAndUpdate({ _id: userId })
                    .then(user => {
                        if (!user) {
                            return res.status(404).json({
                                status: "0",
                                message: "User not found"
                            });
                        }
                        return res.status(200).json({
                            status: "1",
                            message: "User Update successfully"
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: "0",
                            message: "Internal server error"
                        });
                    });
            })
        } else {
            return res.status(401).json({
                status: "0",
                message: "Invalid token"
            })
        }
    }
})

//DELETE OPERATIONS---Delete the specific users.

app.delete("/api/v1/users", (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function (err) {
                if (err) {
                    return res.status(401).json({
                        status: "0",
                        message: "Invalid token"
                    })
                }
                const token = req.headers.authorization;
                const decodedToken = jwt.verify(token, secret);
                const userId = decodedToken.data;
                User.findOneAndDelete({ _id: userId })
                    .then(user => {
                        if (!user) {
                            return res.status(404).json({
                                status: "0",
                                message: "User not found"
                            });
                        }
                        return res.status(200).json({
                            status: "1",
                            message: "User deleted successfully"
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: "0",
                            message: "Internal server error"
                        });
                    });
            })
        } else {
            return res.status(401).json({
                status: "0",
                message: "Invalid token"
            })
        }
    }
})

app.use("/api/v1", loginRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("*", (req, res) => {
    res.send("Hello World");
})

app.listen(3000, () => console.log("The server is up at 3000 port"));
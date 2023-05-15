const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://signup12345:signup12345@cluster0.h0r9fgj.mongodb.net/signup?retryWrites=true&w=majority')
    .then(console.log("Login Successful"))
    .catch(console.error)
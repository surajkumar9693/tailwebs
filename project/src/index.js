const express = require('express');
const route = require('./Routes/route.js');
const { default: mongoose } = require('mongoose');
mongoose.set('strictQuery', false);
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://surajkumar96:6i0d4EhtRtZ5xCEQ@cluster0.mqcx8wl.mongodb.net/test", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});




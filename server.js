const dotenv = require('dotenv');
dotenv.config({path: "./.env"});

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STR)
.then((conn) => {
    console.log("DB connection successful");
}).catch((error) => {
    console.log('Some error has occured' + error);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started...');
})

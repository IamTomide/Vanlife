const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true })
.then((conn) => {
    console.log("DB connection successful");
}).catch((error) => {
    console.log('Some error has occured' + error);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started...');
})

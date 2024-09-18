const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const Van = require('../model/vanmodel');

mongoose.connect(process.env.CONN_STR)
.then((conn) => {
    console.log("DB connection succesful");
}).catch((error) => {
console.log('Some error has occured' + error);
});

const vans = JSON.parse(fs.readFileSync('Data/vans.json', 'utf-8'));

const deleteVans = async () => {
    try{
        await Van.deleteMany();
        console.log('Data successfully deleted');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
};

const importVans = async () => {
    try{
        await Van.create(vans);
        console.log('Data successfully imported');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
};

if (process.argv[2] === '--import'){
    importVans();
};
if (process.argv[2] === '--delete'){
    deleteVans();
};


const fs = require('fs');
const express = require('express');
let app = express();
app.use(express.json());
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const authRouter = require('./Routes/authroutes');
const authcontroller = require('./middleware/authMiddleware');
const methodOverride = require('method-override');
const Van = require('./model/vanmodel');
const vansRouter = require('./Routes/vanroutes');
app.use('/api/v1/vans', vansRouter);

app.use(cookieParser());
app.use('/api/v1/users', authRouter);
app.use(express.urlencoded({ extended: true }));
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(express.static('./public'));
app.use(methodOverride('_method'));


const signin = fs.readFileSync('./public/template/signin.html', 'utf-8');
const login = fs.readFileSync('./public/template/login.html', 'utf-8');
const html = fs.readFileSync('./public/template/index.html', 'utf-8');
const about = fs.readFileSync('./public/template/about.html', 'utf-8');
const vans = fs.readFileSync('./public/template/vans.html', 'utf-8');
const productlist = fs.readFileSync('./public/template/productlist.html', 'utf-8');
const producthtml = fs.readFileSync('./public/template/product.html', 'utf-8');
const productDetail = fs.readFileSync('./public/template/proddetail.html', 'utf-8');
const invalidurl = fs.readFileSync('./public/template/invalidurl.html', 'utf-8');
const hostTemplate = fs.readFileSync('./public/template/hostTemplate.html', 'utf-8');
const dashboard = fs.readFileSync('./public/template/dashboard.html', 'utf-8');
const hostvans = fs.readFileSync('./public/template/hostvans.html', 'utf-8');
const van = fs.readFileSync('./public/template/vandetail.html', 'utf-8');
const detail = fs.readFileSync('./public/template/detail.html', 'utf-8');
const pricing = fs.readFileSync('./public/template/pricing.html', 'utf-8');
const photos = fs.readFileSync('./public/template/photos.html', 'utf-8');
const editform = fs.readFileSync('./public/template/editform.html', 'utf-8');


function replacehtml(template, product) {
    let output = template.replaceAll('{{%image%}}', product.image);
    output = output.replaceAll('{{%status%}}', product.status);
    output = output.replaceAll('{{%id%}}', product._id);
    output = output.replaceAll('{{%name%}}', product.name);
    output = output.replaceAll('{{%price%}}', product.price);
    output = output.replaceAll('{{%desc%}}', product.description);

    return output;
}

function callvanbyid(id) {
    try{
        const van = Van.findById(id);
        return van;
    }catch(err){
        return err.message;
    }
}
async function updatevan(userId, updateData) {
    try {
      const updatedvan = Van.findByIdAndUpdate(
        userId,          
        updateData,
        {
          new: true,    
          runValidators: true 
        });
        return updatedvan;
    } catch (error) {
      console.error('Error updating van:', error);
    }
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

app.get('/', (req,res) => {  
    res.status(200).send(html);
})
app.get('/home', (req,res) => {  
    res.status(200).send(html);
})
app.get('/about', (req,res) => {  
    res.status(200).send(about);
})
app.get('/vans', async (req,res) => {
    const allvans = await Van.find();
    let producthtmlarray = allvans.map((product) => {
        return replacehtml(productlist, product)
    })
    let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
    res.status(200).send(vansresponsehtml);
})

app.get('/vans/status/:status', async (req,res) => {
    const status = req.params.status;
    const statusvans = await Van.find( {status} );
    let producthtmlarray = statusvans.map((product) => {
    return replacehtml(productlist, product)
    })
    let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
    if (status === "Simple") {
        vansresponsehtml = vansresponsehtml.replace('{{selectedsimple}}', 'selectedsimple');}
    else if(status === "Luxury") {
        vansresponsehtml = vansresponsehtml.replace('{{selectedluxury}}', 'selectedluxury');}
    else if(status === "Rugged"){
        vansresponsehtml = vansresponsehtml.replace('{{selectedrugged}}', 'selectedrugged');}
    res.status(200).send(vansresponsehtml);
})
app.get('/vans/:_id', async (req, res) => {
    let product = await callvanbyid(req.params._id);
    let productidhtml = replacehtml(productDetail, product);
    let vansresponsehtml = producthtml.replace('{{%content%}}', productidhtml);
    res.status(200).send(vansresponsehtml);
})
app.get('/about', (req,res) => {  
    res.status(200).send(about);
})
app.get('/login', (req,res) => {  
    res.status(200).send(login);
})
app.get('/signin', (req,res) => {  
    res.status(200).send(signin);
})
app.get('/host', authcontroller.protect, async (req,res) => {
    const useremail = req.user.email;
    const vans = await Van.find( {useremail} );
    const pricelist = [];
    let limit = 2;
    vans.forEach((prod) => {
        pricelist.push(parseInt(prod.price));
    });
    const initialValue = 0;
    const pricesum = pricelist.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue);
    let producthtmlarray = vans.slice(0, limit).map((product) => {
        return replacehtml(hostTemplate, product)
    })

    let responsehtml = dashboard.replace('{{%income%}}', pricesum);
    responsehtml = responsehtml.replace('{{%content%}}', producthtmlarray.join(''));
    res.status(200).send(responsehtml);   
})
app.get('/host/vans', authcontroller.protect, async (req,res) => {
    const useremail = req.user.email;
    const vans = await Van.find( {useremail} );
    let producthtmlarray = vans.map((product) => {
    return replacehtml(hostTemplate, product)
    });
    let responsehtml = hostvans.replace('{{%content%}}', producthtmlarray.join(''));
    res.status(200).send(responsehtml);
})

app.get('/host/vans/:_id', authcontroller.protect, async (req, res) => {
        let product = await callvanbyid(req.params._id);
        let producthtml = replacehtml(detail, product);
        let vansresponsehtml = van.replace('{{%content%}}', producthtml);
        res.status(200).send(vansresponsehtml);
})

app.get('/host/vans/:_id/pricing', authcontroller.protect, async (req, res) => {
    let product = await callvanbyid(req.params._id);
    let producthtml = replacehtml(pricing, product);
    let vansresponsehtml = van.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
})
app.get('/host/vans/:_id/photos', authcontroller.protect, async (req, res) => {
    let product = await callvanbyid(req.params._id);
    let producthtml = replacehtml(photos, product);
    let vansresponsehtml = van.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
})
app.get('/logout', async (req,res) => { 
    res.clearCookie('jwt', { path: '/' });
    res.status(200).redirect("/login");   
})
app.get('/host/van/edit/:_id', authcontroller.protect, async (req,res) => { 
    let product = await callvanbyid(req.params._id);
    let producthtml = replacehtml(editform, product);
    let vansresponsehtml = hostvans.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
})
app.patch('/update/:_id', authcontroller.protect, upload.single('image'), async (req,res) => {
    try{
        const data = {...req.body, image: req.file.path.slice(6)};
        const van = await updatevan(req.params._id, data);
        res.status(200).redirect("/host/vans");
    }catch{
        console.error(error);
    }
})
app.post('/host/createvan', authcontroller.protect, upload.single('image'), async (req,res) => {
    try{
        const data = {...req.body, image: req.file.path.slice(6), useremail: req.user.email};
        const van = await Van.create(data);
        res.status(200).redirect("/host/vans");
    }catch(error){
        console.error(error);
    }
})
// app.all("*", (req,res) => {  
//     res.status(200).send(invalidurl);
// })


module.exports = app;
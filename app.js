const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
// const router = express.Router();

const vansRouter = require('./Routes/vanroutes');
let app = express();
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(express.static('./public'));


app.use('/api/v1/vans', vansRouter);
const signin = fs.readFileSync('./public/template/signin.html', 'utf-8');
const html = fs.readFileSync('./public/template/index.html', 'utf-8');
const about = fs.readFileSync('./public/template/about.html', 'utf-8');
const vans = fs.readFileSync('./public/template/vans.html', 'utf-8');
const productlist = fs.readFileSync('./public/template/productlist.html', 'utf-8');
const producthtml = fs.readFileSync('./public/template/product.html', 'utf-8');
const productDetail = fs.readFileSync('./public/template/proddetail.html', 'utf-8');
const invalidurl = fs.readFileSync('./public/template/invalidurl.html', 'utf-8');
const PRODUCTS = "http://127.0.0.1:3000/api/v1/vans";
const SIMPLE = "http://127.0.0.1:3000/api/v1/vans/?status=Simple";
const RUGGED = "http://127.0.0.1:3000/api/v1/vans/?status=Rugged";
const LUXURY = "http://127.0.0.1:3000/api/v1/vans/?status=Luxury";


function replacehtml(template, product) {
    let output = template.replace('{{%image%}}', product.image);
    output = output.replaceAll('{{%status%}}', product.status);
    output = output.replace('{{%id%}}', product.id);
    output = output.replace('{{%name%}}', product.name);
    output = output.replace('{{%price%}}', product.price);
    output = output.replace('{{%desc%}}', product.description);

    return output;
}

app.get('/', (req,res) => {  
    res.status(200).send(html);
})
app.get('/home', (req,res) => {  
    res.status(200).send(html);
})
app.get('/about', (req,res) => {  
    res.status(200).send(about);
})
app.get('/vans', (req,res) => {
    fetch(PRODUCTS)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let productarray = data.data.vans;
        let producthtmlarray = productarray.map((product) => {
            return replacehtml(productlist, product)
        })
        let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
        res.status(200).send(vansresponsehtml);
        })
    })

app.get('/vans/simple', (req,res) => {
    fetch(SIMPLE)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let productarray = data.data.vans;
        let producthtmlarray = productarray.map((product) => {
            return replacehtml(productlist, product)
        })
        let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
        res.status(200).send(vansresponsehtml);
        })
    })

app.get('/vans/rugged', (req,res) => {
    fetch(RUGGED)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let productarray = data.data.vans;
        let producthtmlarray = productarray.map((product) => {
            return replacehtml(productlist, product)
        })
        let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
        res.status(200).send(vansresponsehtml);
        })
    })
app.get('/vans/luxury', (req,res) => {
    fetch(LUXURY)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let productarray = data.data.vans;
        let producthtmlarray = productarray.map((product) => {
            return replacehtml(productlist, product)
        })
        let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
        res.status(200).send(vansresponsehtml);
        })
    })

app.get('/vans/:id', (req, res) => {
    const producturl = `http://127.0.0.1:3000/api/v1/vans/?id=${req.params.id}`;
    console.log(producturl);
    fetch(producturl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let productarray = data.data.vans;
        let producthtmlarray = productarray.map((product) => {
            return replacehtml(productDetail, product)
        })
        let vansresponsehtml = producthtml.replace('{{%content%}}', producthtmlarray);
        res.status(200).send(vansresponsehtml);
    })
})
app.get('/about', (req,res) => {  
    res.status(200).send(about);
})
app.get('/signin', (req,res) => {  
    res.status(200).send(signin);
})
app.all("*", (req,res) => {  
    res.status(200).send(invalidurl);
})


module.exports = app;

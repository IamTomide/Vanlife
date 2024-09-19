const fs = require('fs');
const Van = require('../model/vanmodel');
const helper = require('../helper/helper');

const signin = fs.readFileSync('./public/template/signin.html', 'utf-8');
const login = fs.readFileSync('./public/template/login.html', 'utf-8');
const html = fs.readFileSync('./public/template/index.html', 'utf-8');
const about = fs.readFileSync('./public/template/about.html', 'utf-8');
const vans = fs.readFileSync('./public/template/vans.html', 'utf-8');
const productlist = fs.readFileSync('./public/template/productlist.html', 'utf-8');
const producthtml = fs.readFileSync('./public/template/product.html', 'utf-8');
const productDetail = fs.readFileSync('./public/template/proddetail.html', 'utf-8');
const invalidurl = fs.readFileSync('./public/template/invalidurl.html', 'utf-8');

function callvanbyid(id) {
    try{
        const van = Van.findById(id);
        return van;
    }catch(err){
        return err.message;
    }
}



exports.gethome = (req,res) => {  
    res.status(200).send(html);
}

exports.about = (req,res) => {  
    res.status(200).send(about);
}

exports.allvans = async (req,res) => {
    const allvans = await Van.find();
    let producthtmlarray = allvans.map((product) => {
        return helper.replacehtml(productlist, product)
    })
    let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
    res.status(200).send(vansresponsehtml);
}

exports.sortStatus = async (req,res) => {
    const status = req.params.status;
    const statusvans = await Van.find( {status} );
    let producthtmlarray = statusvans.map((product) => {
    return helper.replacehtml(productlist, product)
    })
    let vansresponsehtml = vans.replace('{{content}}', producthtmlarray.join(''));
    if (status === "Simple") {
        vansresponsehtml = vansresponsehtml.replace('{{selectedsimple}}', 'selectedsimple');}
    else if(status === "Luxury") {
        vansresponsehtml = vansresponsehtml.replace('{{selectedluxury}}', 'selectedluxury');}
    else if(status === "Rugged"){
        vansresponsehtml = vansresponsehtml.replace('{{selectedrugged}}', 'selectedrugged');}
    res.status(200).send(vansresponsehtml);
}

exports.vaninfo = async (req, res) => {
    let product = await callvanbyid(req.params._id);
    let productidhtml = helper.replacehtml(productDetail, product);
    let vansresponsehtml = producthtml.replace('{{%content%}}', productidhtml);
    res.status(200).send(vansresponsehtml);
}

exports.login = (req,res) => {  
    res.status(200).send(login);
}

exports.signin = (req,res) => {  
    res.status(200).send(signin);
}
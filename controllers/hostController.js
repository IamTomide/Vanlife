const fs = require('fs');
const Van = require('../model/vanmodel');
const helper = require('../helper/helper');

const invalidurl = fs.readFileSync('./public/template/invalidurl.html', 'utf-8');
const hostTemplate = fs.readFileSync('./public/template/hostTemplate.html', 'utf-8');
const dashboard = fs.readFileSync('./public/template/dashboard.html', 'utf-8');
const hostvans = fs.readFileSync('./public/template/hostvans.html', 'utf-8');
const van = fs.readFileSync('./public/template/vandetail.html', 'utf-8');
const detail = fs.readFileSync('./public/template/detail.html', 'utf-8');
const pricing = fs.readFileSync('./public/template/pricing.html', 'utf-8');
const photos = fs.readFileSync('./public/template/photos.html', 'utf-8');
const editform = fs.readFileSync('./public/template/editform.html', 'utf-8');

exports.gethost = async (req,res) => {
    try{
    const useremail = req.user.email;
    const vans = await Van.findvan({useremail});
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
        return helper.replacehtml(hostTemplate, product)
    })
    let responsehtml = dashboard.replace('{{%income%}}', pricesum);
    responsehtml = responsehtml.replace('{{%content%}}', producthtmlarray.join(''));
    res.status(200).send(responsehtml);
    }catch(err) {
        res.status(200).send(err.message);
    }
}

exports.gethostvans = async (req,res) => {
    const useremail = req.user.email;
    const vans = await Van.findvan( {useremail} );
    let producthtmlarray = vans.map((product) => {
    return helper.replacehtml(hostTemplate, product)
    });
    let responsehtml = hostvans.replace('{{%content%}}', producthtmlarray.join(''));
    res.status(200).send(responsehtml);
}

exports.gethostvansbyid = async (req, res) => {
    let product = await Van.callvanbyid(req.params._id);
    let producthtml = helper.replacehtml(detail, product);
    let vansresponsehtml = van.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
}

exports.getprice = async (req, res) => {
    let product = await Van.callvanbyid(req.params._id);
    let producthtml = helper.replacehtml(pricing, product);
    let vansresponsehtml = van.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
}

exports.getphoto = async (req, res) => {
    let product = await Van.callvanbyid(req.params._id);
    let producthtml = helper.replacehtml(photos, product);
    let vansresponsehtml = van.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
}

exports.logout = async (req,res) => { 
    res.clearCookie('jwt', { path: '/' });
    res.status(200).redirect("/login");   
}

exports.geteditform = async (req,res) => { 
    let product = await Van.callvanbyid(req.params._id);
    let producthtml = helper.replacehtml(editform, product);
    let vansresponsehtml = hostvans.replace('{{%content%}}', producthtml);
    res.status(200).send(vansresponsehtml);
}
exports.update = async (req,res) => { 
    try{
        const data = {...req.body, image: req.file.path.slice(6)};
        const van = await Van.updatevan(req.params._id, data);
        res.status(200).redirect("/host/vans");
        }catch{
        console.error(error);
        }
    }

exports.createvan = async (req,res) => {
    try{
        const data = {...req.body, image: req.file.path.slice(6), useremail: req.user.email};
        const van = await Van.createnewvan(data);
        res.status(200).redirect("/host/vans");
    }catch(error){
        console.error(error);
    }
}

exports.invalidUrl = (req,res) => {  
    res.status(200).send(invalidurl);
}


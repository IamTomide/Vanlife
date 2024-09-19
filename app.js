const fs = require('fs');
const express = require('express');
let app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const authRouter = require('./Routes/authroutes');
const authMiddleware = require('./middleware/authMiddleware');
const hostController = require('./controllers/hostController');
const userController = require('./controllers/usercontroller');
const methodOverride = require('method-override');
const vansRouter = require('./Routes/vanroutes');
app.use('/api/v1/vans', vansRouter);

app.use(cookieParser());
app.use('/api/v1/users', authRouter);
app.use(express.static('./public'));
app.use(methodOverride('_method'));

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

app.get('/', userController.gethome);
app.get('/home', userController.gethome)
app.get('/about', userController.about)
app.get('/vans', userController.allvans)
app.get('/vans/status/:status', userController.sortStatus)
app.get('/vans/:_id', userController.vaninfo)
app.get('/login', userController.login)
app.get('/signin', userController.signin)



app.get('/host',authMiddleware.protect, hostController.gethost);

app.get('/host/vans', authMiddleware.protect, hostController.gethostvans);

app.get('/host/vans/:_id', authMiddleware.protect, hostController.gethostvansbyid);

app.get('/host/vans/:_id/pricing', authMiddleware.protect, hostController.getprice);

app.get('/host/vans/:_id/photos', authMiddleware.protect,hostController.getphoto);

app.get('/logout', hostController.logout);

app.get('/host/van/edit/:_id', authMiddleware.protect, hostController.geteditform);

app.patch('/update/:_id', authMiddleware.protect, upload.single('image'), hostController.update);

app.post('/host/createvan', authMiddleware.protect, upload.single('image'), hostController.createvan);

app.all("*", hostController.invalidUrl);


module.exports = app;
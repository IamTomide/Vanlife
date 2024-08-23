const Van = require('../model/vanmodel');

exports.getAllVans = async(req, res) => {
    try{
        const filterFields = ['sort', 'fields', 'limit', 'page'];
        const queryCopy = {...req.query};
        filterFields.forEach((elem) => {
            delete queryCopy[elem];
        })

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryStr);
        
        if (req.query.price) {
            if (queryObj.price.$lte){
                queryObj.price.$lte *= 100;
            } else if(queryObj.price.$gte) {
                queryObj.price.$gte *= 100;
            }else if(queryObj.price.$lt) {
                queryObj.price.$gt *= 100;
            } else{
                queryObj.price.$lt *= 100;
            }
            }
        
        let query = Van.find(queryObj);
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join('');
            query = query.sort(sortBy);
        }else{
            query = query.sort('id');
        }
        const page = req.query.page*1 || 1;
        const limit = req.query.limit*1 || 10;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const vansCount = await Van.countDocuments();
            if (skip >= vansCount) {
                throw new Error("This page is not found!");
            }
        }

        const vans = await query;
        res.status(200).json({
            status: 'success',
            length: vans.length,
            data: {
                vans
            }
        })


    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    } 
}

exports.getVan = async(req, res) => {
    try{
        const van = await Van.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                van
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    } 
}

exports.createVan = async(req, res) => {
    try{
        const van = await Van.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                van
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.updateVan = async(req, res) => {
    try{
        const updatedvan = await Van.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            status: 'success',
            data: {
                van: updatedvan
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteVan = async(req, res) => {
    try{
        await Van.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: {
                van: null
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}
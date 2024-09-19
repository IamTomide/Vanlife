const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is a required field']
    },
    useremail: {
        type: String,
        required: [true, 'useremail is a required field']
    },
    image: {
        type: String,
        required: [true, 'image is a required field']
    },
    status: {
        type: String,
        required: [true, 'Status is a required field']
    },
    description: {
        type: String,
        required: [true, 'Status is a required field']
    },
    price: {
        type: Number,
        get: v => (v/100).toFixed(2),
        set: v => v*100,
        required: [true, 'Price is a required field']
    }
}, {timestamps: true, toJSON: {getters: true}});

const Van = mongoose.model('Van', vanSchema);

Van.findvan = function (query) {
    try{
        const van = Van.find(query);
        return van;
    }catch(err){
        return err.message;
    }
}
Van.callvanbyid = function (id) {
    try{
        const van = Van.findById(id);
        return van;
    }catch(err){
        return err.message;
    }
}

Van.updatevan = function (userId, updateData) {
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

  Van.createnewvan = async function (body) {
    try{
        const van = Van.create(body);
        return van;
    }catch(err){
        return err.message;
    }
  }

module.exports = Van;


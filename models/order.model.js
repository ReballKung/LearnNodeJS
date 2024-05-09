const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    productID : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'products' , 
        required : true
    },
    UserID : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'users' , 
        required : true
    },
    amount :
    {
        type : Number,  
        required : true
    }
});

module.exports = mongoose.model('orders' , orderSchema);
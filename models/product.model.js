const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    productName : 
    {
        type : String , 
        required : true , 
        unique : true
    } ,
    type :
    {
        type : String
    },
    price :
    {
        type : Number 
    },
    stock : 
    {
        type : Number , 
        required : true
    }
});

module.exports = mongoose.model('products' , productSchema);
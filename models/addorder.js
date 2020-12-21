const mongoose=require('mongoose');



const alienSchema=new mongoose.Schema({
   
    date:{
        type:String,
        required:true
    },
    item:{
        type:String,
        required:true
    },
    
    itemquantity:{
        type:String,
        required:true
    },
    totalamount:{
        type:String,
        required:true
    },
    employeename:{
        type:String,
        required:true
    }
});


module.exports=mongoose.model('Addorder',alienSchema);
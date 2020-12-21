const mongoose=require('mongoose');



const alienSchema=new mongoose.Schema({
   
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    displayName: { type: String },
    contact:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});


module.exports=mongoose.model('User',alienSchema);
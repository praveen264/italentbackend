const mongoose=require('mongoose');



const alienSchema=new mongoose.Schema({
   
  
    item:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
});


module.exports=mongoose.model('Additem',alienSchema);
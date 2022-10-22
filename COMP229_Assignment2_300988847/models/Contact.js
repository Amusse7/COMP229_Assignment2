const mongoose=require('mongoose');
const contactSchema = new mongoose.Schema({ 
    email:String,
    name:String,
    phone:String
});


module.exports=mongoose.model('Contacts', contactSchema, 'Contacts');
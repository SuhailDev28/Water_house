import mongoose from 'mongoose';
const schema=new mongoose.Schema({email:{type:String,unique:true,required:true,lowercase:true},passwordHash:{type:String,required:true},role:{type:String,default:'admin'}},{timestamps:true});export default mongoose.model('Admin',schema);

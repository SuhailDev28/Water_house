import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},slug:String,category:String,description:String,price:Number,image:String,ingredients:[String],functionalBenefits:[String],active:{type:Boolean,default:true},sortOrder:{type:Number,default:0}},{timestamps:true});export default mongoose.model('MenuItem',schema);

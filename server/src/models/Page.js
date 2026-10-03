import mongoose from 'mongoose';
const schema=new mongoose.Schema({slug:{type:String,unique:true,required:true},title:String,hero:{title:String,subtitle:String,image:String},sections:[mongoose.Schema.Types.Mixed],seo:{title:String,description:String},published:{type:Boolean,default:true}},{timestamps:true});export default mongoose.model('Page',schema);

import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  type:{type:String,required:true,index:true},
  name:{type:String,required:true},
  slug:{type:String,required:true},
  description:String,
  image:String,
  meta:mongoose.Schema.Types.Mixed,
  active:{type:Boolean,default:true},
  sortOrder:{type:Number,default:0}
},{timestamps:true});
schema.index({type:1,slug:1},{unique:true});
export default mongoose.model('ContentCollection',schema);

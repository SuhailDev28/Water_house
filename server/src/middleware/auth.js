import jwt from 'jsonwebtoken';
export function requireAdmin(req,res,next){const token=(req.headers.authorization||'').replace('Bearer ','');try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return res.status(401).json({message:'Unauthorized'})}}

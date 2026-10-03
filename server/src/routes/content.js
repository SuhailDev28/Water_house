import {Router} from 'express';import {cms} from '../services/cms.js';const r=Router();
r.get('/pages/:slug',async(req,res,next)=>{try{const page=await cms.getPage(req.params.slug);if(!page)return res.status(404).json({message:'Page not found'});res.json(page)}catch(e){next(e)}});
r.get('/menu',async(req,res,next)=>{try{res.json(await cms.getMenu())}catch(e){next(e)}});
r.get('/collections/:type',async(req,res,next)=>{try{res.json(await cms.getCollection(req.params.type))}catch(e){next(e)}});
export default r;

import Page from '../models/Page.js';
import MenuItem from '../models/MenuItem.js';
import ContentCollection from '../models/ContentCollection.js';

// Provider-neutral content gateway. The React client talks only to the Water House API.
// Swap CMS_PROVIDER later without changing client routes or components.
const internal={
  getPage:(slug)=>Page.findOne({slug,published:true}).lean(),
  getMenu:()=>MenuItem.find({active:true}).sort({sortOrder:1,createdAt:-1}).lean(),
  getCollection:(type)=>ContentCollection.find({type,active:true}).sort({sortOrder:1,name:1}).lean()
};

async function externalJson(path){
  const base=process.env.CMS_API_URL?.replace(/\/$/,'');
  if(!base) throw new Error('CMS_API_URL is required for external CMS provider');
  const headers=process.env.CMS_API_TOKEN?{Authorization:`Bearer ${process.env.CMS_API_TOKEN}`}:{ };
  const r=await fetch(`${base}${path}`,{headers});
  if(!r.ok) throw new Error(`CMS request failed: ${r.status}`);
  return r.json();
}

// Generic adapter for a normalized headless-CMS facade. For vendor-specific APIs,
// add a provider object that returns the same normalized objects as `internal`.
const headless={
  getPage:(slug)=>externalJson(`/pages/${slug}`),
  getMenu:()=>externalJson('/menu'),
  getCollection:(type)=>externalJson(`/collections/${type}`)
};

const providers={internal,headless};
export const cms=providers[process.env.CMS_PROVIDER||'internal']||internal;

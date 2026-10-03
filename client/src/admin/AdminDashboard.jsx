import { useEffect,useState } from 'react';import { api } from '../services/api';

export default function AdminDashboard(){
  const [menu,setMenu]=useState([]),[functions,setFunctions]=useState([]),[msg,setMsg]=useState('');
  const load=()=>Promise.all([api('/admin/menu'),api('/admin/collections/functions')]).then(([m,f])=>{setMenu(m);setFunctions(f)}).catch(()=>location.href='/admin');
  useEffect(()=>{load()},[]);
  async function addMenu(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));d.price=Number(d.price||0);d.category='Flavour';await api('/admin/menu',{method:'POST',body:JSON.stringify(d)});e.currentTarget.reset();setMsg('Flavour added');load()}
  async function addFunction(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));d.slug=d.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-');await api('/admin/collections/functions',{method:'POST',body:JSON.stringify(d)});e.currentTarget.reset();setMsg('Function added');load()}
  async function removeMenu(id){await api(`/admin/menu/${id}`,{method:'DELETE'});load()}
  async function removeFunction(id){await api(`/admin/collections/functions/${id}`,{method:'DELETE'});load()}
  return <div className="admin-shell"><aside><h2>water<br/>house</h2><p>CONTENT STUDIO</p><a href="/">View website</a><a href="/menu">View menu</a></aside><main><span className="eyebrow">WATER HOUSE CMS</span><h1>Content Dashboard</h1><p>Manage brand content in MongoDB now. The public API remains provider-neutral for future Strapi, Sanity, Contentful, Directus or Payload integration.</p>{msg&&<p><strong>{msg}</strong></p>}
  <section className="admin-card"><h2>Flavours</h2><form className="admin-form" onSubmit={addMenu}><input name="name" placeholder="Flavour name" required/><input name="slug" placeholder="Slug, e.g. white-peach" required/><input name="description" placeholder="Short description"/><input name="price" type="number" placeholder="Optional price QAR"/><button className="btn primary">Add flavour</button></form><div>{menu.map(x=><div className="admin-row" key={x._id}><span><strong>{x.name}</strong><small>{x.description}</small></span><button onClick={()=>removeMenu(x._id)}>Remove</button></div>)}</div></section>
  <section className="admin-card"><h2>Functional boosts</h2><form className="admin-form" onSubmit={addFunction}><input name="name" placeholder="Function name" required/><input name="description" placeholder="Benefit line"/><button className="btn primary">Add function</button></form><div>{functions.map(x=><div className="admin-row" key={x._id}><span><strong>{x.name}</strong><small>{x.description}</small></span><button onClick={()=>removeFunction(x._id)}>Remove</button></div>)}</div></section>
  </main></div>
}

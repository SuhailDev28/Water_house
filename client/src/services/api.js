const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path, options={}){
  const token=localStorage.getItem('wh_admin_token');
  const headers={...(options.body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{}) ,...(options.headers||{})};
  const res=await fetch(`${API}${path}`,{...options,headers});
  if(!res.ok) throw new Error((await res.json().catch(()=>({}))).message||'Request failed');
  return res.status===204?null:res.json();
}

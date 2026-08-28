const PREFIX='guimas-imposto-shell-v';
const CACHE=PREFIX+'3';
const SHELL=['./index.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(r.mode==='navigate'||r.destination==='document'){
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{
   if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp)).catch(()=>{})}
   return res;
  }).catch(()=>caches.match('./index.html')));return;
 }
 const same=u.origin===self.location.origin;
 const staticRemote=u.hostname==='www.gstatic.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='fonts.googleapis.com';
 if(!same&&!staticRemote)return;
 e.respondWith(caches.match(r).then(hit=>{
  const net=fetch(r).then(res=>{
   if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{})}
   return res;
  }).catch(()=>hit);
  return hit||net;
 }));
});

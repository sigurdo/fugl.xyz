if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise(async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()})),r.then(()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]})},r=(r,i)=>{Promise.all(r.map(e)).then(e=>i(1===e.length?e[0]:e))},i={require:Promise.resolve(r)};self.define=(r,s,c)=>{i[r]||(i[r]=Promise.resolve().then(()=>{let i={};const d={uri:location.origin+r.slice(1)};return Promise.all(s.map(r=>{switch(r){case"exports":return i;case"module":return d;default:return e(r)}})).then(e=>{const r=c(...e);return i.default||(i.default=r),i})}))}}define("./sw.js",["./workbox-bb3da388"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"api/observations/",revision:"faae041e83544536e9dd38dae4bf63c8"},{url:"api/register/",revision:"488966ae6e06a4865a386b4df625a788"},{url:"api/register/test.html",revision:"6c28b7b2e6ff45556b37101e8c5596d3"},{url:"api/turbines/",revision:"4e40d89df3582c72b7ba2a3c603cecc9"},{url:"bird_windmill.jpeg",revision:"b2d1712f9581c57c68ceb2cd43084f06"},{url:"bluesky.jpg",revision:"e1e1e790020161836152b34dcf45f17e"},{url:"charts/BirdDataGraph.js",revision:"a780820b7a7a15b40fa1d1587bc6db05"},{url:"charts/index.html",revision:"6bbbebd72f03642da3f612ddefc739df"},{url:"charts/inputModule.css",revision:"0a0fd77a75077caad7ebc84964ae5ddf"},{url:"charts/InputModule.js",revision:"ff19d4d8c7ed983b3041dee55b4fa9b2"},{url:"documentation/index.html",revision:"8fcf08f6b16396d3712ef4434f61c333"},{url:"index.html",revision:"2f0d4816f7ea57e6f4753aec45ecbee9"},{url:"live/index.html",revision:"f7c1570c2eb434b5f956fbc33151bd77"},{url:"style_fugl.css",revision:"d250bf6c63880aeeb9258cdc91e01f8e"},{url:"test1.php",revision:"b428906336cc6a23089e3bb7c8722552"},{url:"wallpaper-edit.jpg",revision:"124bb17d28ab2122429973fc2b3d26b2"},{url:"wallpaper.jpg",revision:"a280ec0db77419ee9f580d7805d4a2dc"},{url:"windmill.jpg",revision:"f6be663845c09b36bf661ccc5c48a850"}],{})}));
//# sourceMappingURL=sw.js.map

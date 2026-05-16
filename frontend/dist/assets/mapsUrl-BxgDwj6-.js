import{c as i,z as s}from"./index-BZfISts-.js";/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],$=i("chevron-left",p);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]],v=i("droplets",u);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],x=i("heart",m);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],N=i("play",f);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],_=i("share-2",g);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]],S=i("tag",w),l="animall_wishlist",y=()=>{try{return JSON.parse(localStorage.getItem(l)||"[]")}catch{return[]}},k=t=>{localStorage.setItem(l,JSON.stringify(t)),window.dispatchEvent(new CustomEvent("wishlist:change",{detail:t}))},b=t=>y().includes(t),C=t=>{const e=y(),n=e.indexOf(t);return n>=0?e.splice(n,1):e.push(t),k(e),n<0},z=t=>{const e=n=>t(n.detail);return window.addEventListener("wishlist:change",e),()=>window.removeEventListener("wishlist:change",e)},E=async({title:t,text:e,url:n,tr:c})=>{const o=n||window.location.href;if(navigator.share)try{await navigator.share({title:t,text:e,url:o});return}catch{}try{await navigator.clipboard.writeText(o),s.success(c?c("link_copied"):"Link copied")}catch{s(o,{duration:4e3})}},a="https://www.google.com/maps/search/?api=1&query=";function L({address:t,location:e,lat:n,lng:c}={}){if(typeof n=="number"&&typeof c=="number"&&!Number.isNaN(n)&&!Number.isNaN(c))return`${a}${n},${c}`;if(t&&typeof t.lat=="number"&&typeof t.lng=="number")return`${a}${t.lat},${t.lng}`;if(t&&typeof t=="object"){const r=[t.line1,t.area,t.city,t.district,t.state,t.pincode].map(h=>(h||"").toString().trim()).filter(Boolean);if(r.length>0)return`${a}${encodeURIComponent(r.join(", "))}`}const o=(e||"").toString().trim();return o?`${a}${encodeURIComponent(o)}`:null}export{$ as C,v as D,x as H,N as P,_ as S,S as T,E as a,b as i,L as m,z as s,C as t};

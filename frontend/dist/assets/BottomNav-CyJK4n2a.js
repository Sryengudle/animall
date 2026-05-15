import{c,j as e,P as o,b as x,y as d}from"./index-DhRMgBdE.js";/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M2 6h4",key:"aawbzj"}],["path",{d:"M2 10h4",key:"l0bgd4"}],["path",{d:"M2 14h4",key:"1gsvsf"}],["path",{d:"M2 18h4",key:"1bu2t1"}],["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["path",{d:"M16 2v20",key:"rotuqe"}]],u=c("notebook",y);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"m8 11 2 2 4-4",key:"1sed1v"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],p=c("search-check",m);function l({size:t=24,className:a="",...r}){return e.jsxs("svg",{width:t,height:t,viewBox:"0 0 32 32",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",className:a,"aria-hidden":"true",...r,children:[e.jsx("path",{d:"M3.5 9.5 L2.5 6 M7.5 9.5 L8.5 6",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",fill:"none"}),e.jsx("rect",{x:"2",y:"10",width:"6.5",height:"8",rx:"1.6"}),e.jsx("rect",{x:"7",y:"13",width:"20",height:"10",rx:"2"}),e.jsx("path",{d:"M27 14 v6 q1 1.5 2 1 q1 -.6 -.4 -1.4 L27 18"}),e.jsx("rect",{x:"9",y:"23",width:"2",height:"5",rx:"0.5"}),e.jsx("rect",{x:"13",y:"23",width:"2",height:"5",rx:"0.5"}),e.jsx("rect",{x:"19",y:"23",width:"2",height:"5",rx:"0.5"}),e.jsx("rect",{x:"23",y:"23",width:"2",height:"5",rx:"0.5"})]})}l.propTypes={size:o.oneOfType([o.number,o.string]),className:o.string};const b=[{key:"buy",to:"/buy",icon:p,labelKey:"nav_buy"},{key:"sell",to:"/sell",icon:l,labelKey:"nav_sell",emphasis:!0},{key:"my_cattle",to:"/my-listings",icon:u,labelKey:"nav_my_cattle"}];function g(){const{tr:t}=x();return e.jsx("nav",{role:"navigation","aria-label":t("nav_my_cattle"),className:"fixed bottom-0 left-0 right-0 z-40 bg-surface-0 border-t border-surface-200 safe-bottom",children:e.jsx("ul",{className:"flex items-stretch justify-around px-2 pt-2 pb-1.5",children:b.map(({key:a,to:r,icon:h,labelKey:n,emphasis:i})=>e.jsx("li",{className:"flex-1",children:e.jsx(d,{to:r,end:r==="/","aria-label":t(n),className:({isActive:s})=>`flex flex-col items-center gap-1 py-1.5 px-1
                 min-h-touch justify-center rounded-2xl
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300
                 transition-colors
                 ${s?"text-brand-800":"text-surface-500 hover:text-surface-700"}`,children:({isActive:s})=>e.jsxs(e.Fragment,{children:[e.jsx(h,{size:i?30:24,strokeWidth:s?2.2:1.8,className:s?"scale-105 transition-transform":"transition-transform"}),e.jsx("span",{className:`text-micro ${i||s?"!font-bold":"!font-semibold"}`,children:t(n)})]})})},a))})})}export{g as B,l as C};

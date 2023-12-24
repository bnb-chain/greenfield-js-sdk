"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[729],{8216:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>l,default:()=>m,frontMatter:()=>i,metadata:()=>c,toc:()=>d});var t=r(5250),s=r(1340),o=r(3880),a=r(8119);const i={id:"checksums",title:"cacluting checksum is slow",order:1},l=void 0,c={id:"FAQs/checksums",title:"cacluting checksum is slow",description:"We're using reed-solomon.",source:"@site/docs/FAQs/caclute-checksum-is-slow.mdx",sourceDirName:"FAQs",slug:"/FAQs/checksums",permalink:"/greenfield-js-sdk/FAQs/checksums",draft:!1,unlisted:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/FAQs/caclute-checksum-is-slow.mdx",tags:[],version:"current",frontMatter:{id:"checksums",title:"cacluting checksum is slow",order:1},sidebar:"GettingStartSidebar",previous:{title:"FAQs",permalink:"/greenfield-js-sdk/category/faqs"}},u={},d=[{value:"Benchmarking",id:"benchmarking",level:2},{value:"Usage",id:"usage",level:2}];function h(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["We're using ",(0,t.jsx)(n.a,{href:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/packages/reed-solomon",children:"reed-solomon"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["It is a lightweight implementation of ",(0,t.jsx)(n.a,{href:"https://github.com/klauspost/reedsolomon",children:"klauspost/reedsolomon"}),", just to be compatible with ",(0,t.jsx)(n.a,{href:"https://github.com/bnb-chain/greenfield-common/blob/master/go/hash/hash.go",children:"greenfield-common"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"As we all know, JavaScript is not good at this kind of intensive computing. In fact, the results we tested on local Nodejs were about 10 times slower than Go."}),"\n",(0,t.jsxs)(n.p,{children:["But to be able to use it in the Javascript, we created ",(0,t.jsx)(n.a,{href:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/packages/reed-solomon",children:"reed-solomon"}),", which is the core library."]}),"\n",(0,t.jsx)(n.h2,{id:"benchmarking",children:"Benchmarking"}),"\n",(0,t.jsxs)(n.p,{children:["If not counting big files (how big is depending on the user's device), here are the ",(0,t.jsx)(n.a,{href:"https://github.com/bnb-chain/greenfield-js-sdk/blob/main/packages/reed-solomon/benchmark.md",children:"results"})," of our tests on the Apple M2."]}),"\n",(0,t.jsx)(n.p,{children:"Note, you don't have to have webworker or worker_threads on to get faster performance. Because running worker also has performance loss."}),"\n",(0,t.jsx)(n.p,{children:"When calculating small files, using core is faster than using worker."}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsxs)(n.p,{children:["You can use core lib directly in the browser and Nodejs, or you can use us to run on the worker(browser use ",(0,t.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers",children:"webworker"}),", Nodejs use ",(0,t.jsx)(n.a,{href:"https://nodejs.org/api/worker_threads.html",children:"worker_threads"}),")."]}),"\n",(0,t.jsxs)(o.Z,{groupId:"example",children:[(0,t.jsxs)(a.Z,{value:"browser",label:"Browser",children:[(0,t.jsx)(n.p,{children:"When you are developing Greenfield and need to create objects, if you are sure that the files are small (maybe less than 5m or 10m), you can directly use the ESM solution:"}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",metastring:'title="core lib (ESM)"',children:"import {ReedSolomon} from '@bnb-chain/reed-solomon'\n\nconst rs = new ReedSolomon();\nconst res = rs.encode(new Uint8Array(fileBuffer))\n"})}),(0,t.jsx)(n.p,{children:"It also supports UMD mode calls (simpler and more convenient):"}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-html",metastring:'title="core lib (UMD)"',children:"\x3c!-- prefetch js --\x3e\n<link rel=\"prefetch\" href=\"https://unpkg.com/@bnb-chain/reed-solomon/dist/index.aio.js\" />\n<script src=\"https://unpkg.com/@bnb-chain/reed-solomon/dist/index.aio.js\"><\/script>\n\n<body>\n  <input type=\"file\" id=\"file\" />\n  <button id=\"btn\">\n    get reed solomon\n  </button>\n  <script type=\"module\">\n    const fileInput = document.getElementById('file');\n\n    // not use webworker\n    document.getElementById('btn').onclick = async function() {\n      const selectFile = fileInput.files[0];\n      const arrBuffer = await selectFile.arrayBuffer()\n      if (!arrBuffer) alert('no file selected');\n\n      const sourceData = new Uint8Array(arrBuffer)\n      console.time('cost')\n      console.log('file size', sourceData.length / 1024 / 1024, 'm')\n      const rs = new RS.ReedSolomon()\n      const res = await rs.encode(sourceData)\n      console.log('res', res)\n      console.timeEnd('cost')\n    }\n\n  <\/script>\n</body>\n"})}),(0,t.jsx)(n.p,{children:"If the file is larger, this method may cause the page to freeze when calculating. We recommend using the worker mode:"}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-html",metastring:'title="webworker (only support UMD)"',children:'\x3c!-- prefetch js --\x3e\n<link rel="prefetch" href="https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js" />\n<link rel="prefetch" href="https://unpkg.com/@bnb-chain/reed-solomon/dist/utils.aio.js" />\n<script src="https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js"><\/script>\n\n<body>\n  <input type="file" id="file" />\n\n  <button id="worker-btn">\n    get reed solomon (webworker)\n  </button>\n\n  <script>\n    const rs = new WebAdapter.WebAdapterReedSolomon()\n    // will create 6 webworker\n    rs.initWorkers({\n      workerNum: 6,\n      injectWorker,\n    })\n\n    document.getElementById(\'worker-btn\').onclick = async function() {\n      const selectFile = fileInput.files[0];\n      const arrBuffer = await selectFile.arrayBuffer()\n      if (!arrBuffer) alert(\'no file selected\');\n\n      const sourceData = new Uint8Array(arrBuffer)\n      const res = await rs.encodeInWorker(sourceData)\n    }\n\n    // inject worker\n    function injectWorker() {\n      // or download this file and put it to your CDN server\n      importScripts(\'https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js\');\n      importScripts(\'https://unpkg.com/@bnb-chain/reed-solomon/dist/utils.aio.js\');\n\n      const rs = new WebAdapter.WebAdapterReedSolomon();\n      onmessage = function (event) {\n        const { index, chunk } = event.data;\n        const encodeShard = rs.getEncodeShard(chunk, index)\n        postMessage(encodeShard);\n      };\n    }\n  <\/script>\n</body>\n'})})]}),(0,t.jsxs)(a.Z,{value:"nodejs",label:"Nodejs",children:[(0,t.jsxs)(n.p,{children:["Nodejs can also be used in two ways, directly with core library, or with ",(0,t.jsx)(n.a,{href:"https://nodejs.org/api/worker_threads.html",children:"worker_threads"})," (calculating large files)."]}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",metastring:'title="core lib"',children:"const { ReedSolomon } = require('@bnb-chain/reed-solomon')\n\nconst rs = new ReedSolomon();\nconst res = await rs.encode(Uint8Array.from(fileBuffer));\n"})}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",metastring:'title="worker_threads"',children:"const { NodeAdapterReedSolomon } = require('@bnb-chain/reed-solomon/node.adapter');\n\nconst fileBuffer = fs.readFileSync('./output_file');\n\nconst rs = new NodeAdapterReedSolomon();\nconst res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer))\n"})})]})]})]})}function m(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},8119:(e,n,r)=>{r.d(n,{Z:()=>a});r(79);var t=r(3230);const s={tabItem:"tabItem_jc9D"};var o=r(5250);function a(e){let{children:n,hidden:r,className:a}=e;return(0,o.jsx)("div",{role:"tabpanel",className:(0,t.Z)(s.tabItem,a),hidden:r,children:n})}},3880:(e,n,r)=>{r.d(n,{Z:()=>x});var t=r(79),s=r(3230),o=r(4803),a=r(7911),i=r(9121),l=r(3757),c=r(2052),u=r(8991);function d(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:r}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:r,attributes:t,default:s}}=e;return{value:n,label:r,attributes:t,default:s}}))}(r);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,r])}function m(e){let{value:n,tabValues:r}=e;return r.some((e=>e.value===n))}function p(e){let{queryString:n=!1,groupId:r}=e;const s=(0,a.k6)(),o=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,l._X)(o),(0,t.useCallback)((e=>{if(!o)return;const n=new URLSearchParams(s.location.search);n.set(o,e),s.replace({...s.location,search:n.toString()})}),[o,s])]}function f(e){const{defaultValue:n,queryString:r=!1,groupId:s}=e,o=h(e),[a,l]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=r.find((e=>e.default))??r[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:o}))),[c,d]=p({queryString:r,groupId:s}),[f,b]=function(e){let{groupId:n}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(n),[s,o]=(0,u.Nk)(r);return[s,(0,t.useCallback)((e=>{r&&o.set(e)}),[r,o])]}({groupId:s}),g=(()=>{const e=c??f;return m({value:e,tabValues:o})?e:null})();(0,i.Z)((()=>{g&&l(g)}),[g]);return{selectedValue:a,selectValue:(0,t.useCallback)((e=>{if(!m({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),d(e),b(e)}),[d,b,o]),tabValues:o}}var b=r(3614);const g={tabList:"tabList_WnI6",tabItem:"tabItem_R4Tu"};var w=r(5250);function k(e){let{className:n,block:r,selectedValue:t,selectValue:a,tabValues:i}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.o5)(),u=e=>{const n=e.currentTarget,r=l.indexOf(n),s=i[r].value;s!==t&&(c(n),a(s))},d=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const r=l.indexOf(e.currentTarget)+1;n=l[r]??l[0];break}case"ArrowLeft":{const r=l.indexOf(e.currentTarget)-1;n=l[r]??l[l.length-1];break}}n?.focus()};return(0,w.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":r},n),children:i.map((e=>{let{value:n,label:r,attributes:o}=e;return(0,w.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>l.push(e),onKeyDown:d,onClick:u,...o,className:(0,s.Z)("tabs__item",g.tabItem,o?.className,{"tabs__item--active":t===n}),children:r??n},n)}))})}function j(e){let{lazy:n,children:r,selectedValue:s}=e;const o=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){const e=o.find((e=>e.props.value===s));return e?(0,t.cloneElement)(e,{className:"margin-top--md"}):null}return(0,w.jsx)("div",{className:"margin-top--md",children:o.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function v(e){const n=f(e);return(0,w.jsxs)("div",{className:(0,s.Z)("tabs-container",g.tabList),children:[(0,w.jsx)(k,{...e,...n}),(0,w.jsx)(j,{...e,...n})]})}function x(e){const n=(0,b.Z)();return(0,w.jsx)(v,{...e,children:d(e.children)},String(n))}},1340:(e,n,r)=>{r.d(n,{Z:()=>i,a:()=>a});var t=r(79);const s={},o=t.createContext(s);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);
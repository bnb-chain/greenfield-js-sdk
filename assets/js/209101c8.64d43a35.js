"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[888],{4852:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var r=n(9231);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),p=s(n),u=i,m=p["".concat(c,".").concat(u)]||p[u]||f[u]||a;return n?r.createElement(m,l(l({ref:t},d),{},{components:n})):r.createElement(m,l({ref:t},d))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,l=new Array(a);l[0]=u;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[p]="string"==typeof e?e:i,l[1]=o;for(var s=2;s<a;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},240:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>f,frontMatter:()=>a,metadata:()=>o,toc:()=>s});var r=n(6e3),i=(n(9231),n(4852));const a={id:"greenfield-client",title:"Greenfield Client",sidebar_position:1},l="Create Greenfield Client",o={unversionedId:"client/greenfield-client",id:"client/greenfield-client",title:"Greenfield Client",description:"| params         | description         |",source:"@site/docs/client/greenfield.mdx",sourceDirName:"client",slug:"/client/greenfield-client",permalink:"/client/greenfield-client",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/docs_sit/doc-site/docs/client/greenfield.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"greenfield-client",title:"Greenfield Client",sidebar_position:1},sidebar:"GettingStartSidebar",previous:{title:"Client",permalink:"/category/client"},next:{title:"Tx Client",permalink:"/client/tx-client"}},c={},s=[{value:"Usage",id:"usage",level:2}],d={toc:s},p="wrapper";function f(e){let{components:t,...n}=e;return(0,i.kt)(p,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"create-greenfield-client"},"Create Greenfield Client"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"params"),(0,i.kt)("th",{parentName:"tr",align:null},"description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"GRPC_URL"),(0,i.kt)("td",{parentName:"tr",align:null},"Greenfield grpc url")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"GREEN_CHAIN_ID"),(0,i.kt)("td",{parentName:"tr",align:null},"Greenfield chain id")))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { Client } from '@bnb-chain/greenfield-js-sdk';\n\n// Node.js\nconst client = Client.create(GRPC_URL, GREEN_CHAIN_ID);\n\n// Browser\nconst client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID), {\n  zkCryptoUrl:\n    'https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.2-alpha.4/dist/node/zk-crypto.wasm',\n});\n")),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Browser need load wasm manually.")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("p",null,"The JS SDK consists of two parts:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Chain: ",(0,i.kt)("a",{parentName:"li",href:"https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest"},"https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest")),(0,i.kt)("li",{parentName:"ul"},"Storage Provider: ",(0,i.kt)("a",{parentName:"li",href:"https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest"},"https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest"))))}f.isMDXComponent=!0}}]);
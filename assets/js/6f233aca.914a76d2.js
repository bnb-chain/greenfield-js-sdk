"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[411],{4852:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>g});var r=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=l(n),m=a,g=u["".concat(p,".").concat(m)]||u[m]||d[m]||i;return n?r.createElement(g,o(o({ref:t},c),{},{components:n})):r.createElement(g,o({ref:t},c))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[u]="string"==typeof e?e:a,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7643:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var r=n(6e3),a=(n(9231),n(4852));const i={id:"sp-client",sidebar_position:3,title:"Storage Provider Client"},o=void 0,s={unversionedId:"client/sp-client",id:"client/sp-client",title:"Storage Provider Client",description:"The api related to storage provider are some troublesome.",source:"@site/docs/client/sp-client.mdx",sourceDirName:"client",slug:"/client/sp-client",permalink:"/greenfield-js-sdk/client/sp-client",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/client/sp-client.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"sp-client",sidebar_position:3,title:"Storage Provider Client"},sidebar:"GettingStartSidebar",previous:{title:"Query Client",permalink:"/greenfield-js-sdk/client/query-client"},next:{title:"API",permalink:"/greenfield-js-sdk/category/api"}},p={},l=[{value:"AuthType",id:"authtype",level:2},{value:"Sp Api Example",id:"sp-api-example",level:2}],c={toc:l},u="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"The api related to storage provider are some troublesome."),(0,a.kt)("h2",{id:"authtype"},"AuthType"),(0,a.kt)("p",null,"SDK support two\n",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest#authentication-type"},"authentication type"),":"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"ECDSA: It is usually used on Node.js(Because it need to use a private key)"),(0,a.kt)("li",{parentName:"ul"},"EDDSA: It is usually used in a browser")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="AuthType"',title:'"AuthType"'},"/**\n * ECDSA Signature\n */\nexport type ECDSA = {\n  type: 'ECDSA',\n  privateKey: string,\n};\n/**\n * EDDSA Signature\n */\nexport type EDDSA = {\n  type: 'EDDSA',\n  seed: string,\n  domain: string,\n  address: string,\n};\nexport type AuthType = ECDSA | EDDSA;\n")),(0,a.kt)("h2",{id:"sp-api-example"},"Sp Api Example"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"getBucketReadQuota")," as example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="browser"',title:'"browser"'},"const getAllSps = async () => {\n  const sps = await getSps();\n\n  return sps.map((sp) => {\n    return {\n      address: sp.operatorAddress,\n      endpoint: sp.endpoint,\n      name: sp.description?.moniker,\n    };\n  });\n};\n\n// generate seed:\nconst allSps = await getAllSps();\nconst offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(\n  {\n    sps: allSps,\n    chainId: GREEN_CHAIN_ID,\n    expirationMs: 5 * 24 * 60 * 60 * 1000,\n    domain: window.location.origin,\n    address: 'your address',\n  },\n  provider: 'wallet provider',\n);\n\n// request sp api\nconst bucketQuota = await client.bucket.getBucketReadQuota(\n  {\n    bucketName,\n  },\n  {\n    type: 'EDDSA',\n    seed: offchainAuthRes.seedString,\n    domain: window.location.origin,\n    address: 'your address',\n  },\n);\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="Nodejs"',title:'"Nodejs"'},"// request sp api\nconst bucketQuota = await client.bucket.getBucketReadQuota(\n  {\n    bucketName,\n  },\n  {\n    type: 'ECDSA',\n    privateKey: '0x....',\n  },\n);\n")))}d.isMDXComponent=!0}}]);
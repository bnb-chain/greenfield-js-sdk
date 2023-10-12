"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[285],{4852:(t,e,a)=>{a.d(e,{Zo:()=>d,kt:()=>b});var n=a(9231);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function o(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var s=n.createContext({}),c=function(t){var e=n.useContext(s),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},d=function(t){var e=c(t.components);return n.createElement(s.Provider,{value:e},t.children)},m="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},p=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,l=t.originalType,s=t.parentName,d=o(t,["components","mdxType","originalType","parentName"]),m=c(a),p=r,b=m["".concat(s,".").concat(p)]||m[p]||u[p]||l;return a?n.createElement(b,i(i({ref:e},d),{},{components:a})):n.createElement(b,i({ref:e},d))}));function b(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=a.length,i=new Array(l);i[0]=p;var o={};for(var s in e)hasOwnProperty.call(e,s)&&(o[s]=e[s]);o.originalType=t,o[m]="string"==typeof t?t:r,i[1]=o;for(var c=2;c<l;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},926:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>l,metadata:()=>o,toc:()=>c});var n=a(6e3),r=(a(9231),a(4852));const l={id:"tx-client",sidebar_position:1,title:"Tx Client"},i=void 0,o={unversionedId:"client/tx-client",id:"client/tx-client",title:"Tx Client",description:"About Tx",source:"@site/docs/client/tx-client.mdx",sourceDirName:"client",slug:"/client/tx-client",permalink:"/greenfield-js-sdk/client/tx-client",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/docs_sit/doc-site/docs/client/tx-client.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"tx-client",sidebar_position:1,title:"Tx Client"},sidebar:"GettingStartSidebar",previous:{title:"Greenfield Client",permalink:"/greenfield-js-sdk/client/greenfield-client"},next:{title:"Query Client",permalink:"/greenfield-js-sdk/client/query-client"}},s={},c=[{value:"About Tx",id:"about-tx",level:2},{value:"simulate",id:"simulate",level:2},{value:"broadcast",id:"broadcast",level:2},{value:"Example",id:"example",level:2},{value:"1. construct a transaction",id:"1-construct-a-transaction",level:3},{value:"2. simulate",id:"2-simulate",level:3},{value:"3. broadcast",id:"3-broadcast",level:3}],d={toc:c},m="wrapper";function u(t){let{components:e,...a}=t;return(0,r.kt)(m,(0,n.Z)({},d,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"about-tx"},"About Tx"),(0,r.kt)("p",null,"A transaction contains at least:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"construct a transaction: The sdk already provides each transaction type"),(0,r.kt)("li",{parentName:"ol"},"simulate: ",(0,r.kt)("a",{parentName:"li",href:"#simulate"},"txClient.simulate")),(0,r.kt)("li",{parentName:"ol"},"broadcast ",(0,r.kt)("a",{parentName:"li",href:"#broadcast"},"txClient.broadcast"))),(0,r.kt)("h2",{id:"simulate"},"simulate"),(0,r.kt)("p",null,"Just Simulate a transaction and valid transaction."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"denom"),(0,r.kt)("td",{parentName:"tr",align:null},"the coin denom to query balances for")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="simulate tx"',title:'"simulate','tx"':!0},"// `tx` is a transaction constructed by the sdk\nconst simulateInfo = await tx.simulate({\n  denom: 'BNB',\n});\n")),(0,r.kt)("h2",{id:"broadcast"},"broadcast"),(0,r.kt)("p",null,"Broadcast the transaction to the chain."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"denom"),(0,r.kt)("td",{parentName:"tr",align:null},"the coin denom to query balances for")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"gasLimit"),(0,r.kt)("td",{parentName:"tr",align:null},"can be set to any number, but not too small or the transaction may fail (recommended use ",(0,r.kt)("inlineCode",{parentName:"td"},"simulateInfo.gasLimit"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"gasPrice"),(0,r.kt)("td",{parentName:"tr",align:null},"1 unit of Gas that the transaction sender is willing to pay.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"payer"),(0,r.kt)("td",{parentName:"tr",align:null},"transaction sender")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"granter"),(0,r.kt)("td",{parentName:"tr",align:null},"transaction ganter (Generally empty ",(0,r.kt)("inlineCode",{parentName:"td"},"''"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"signTypedDataCallback"),(0,r.kt)("td",{parentName:"tr",align:null},"broadcast use ",(0,r.kt)("inlineCode",{parentName:"td"},"window.ethereum")," as signature provider by default.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"privateKey"),(0,r.kt)("td",{parentName:"tr",align:null},"If you broadcast in Nodejs, you can broadcast a tx by privateKey")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="broadcast tx"',title:'"broadcast','tx"':!0},"// broadcast tx\nconst broadcastRes = await transferTx.broadcast({\n  denom: 'BNB',\n  gasLimit: Number(simulateInfo.gasLimit),\n  gasPrice: simulateInfo.gasPrice,\n  payer: '0x0000000000000000000000000000000000000001',\n  granter: '',\n});\n")),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"If you want to use others wallet, you can set ",(0,r.kt)("inlineCode",{parentName:"p"},"signTypedDataCallback"),":"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"// trustwallet:\nconst broadcastRes = await transferTx.broadcast({\n  // ...\n  signTypedDataCallback: async (addr: string, message: string) => {\n    return await window.trustwallet.request({\n      method: 'eth_signTypedData_v4',\n      params: [addr, message],\n    });\n  },\n});\n")),(0,r.kt)("p",{parentName:"admonition"},"If you broadcast in Nodejs, you can broadcast a tx by privateKey:"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const broadcastRes = await transferTx.broadcast({\n  // ...\n  privateKey: '0x.......',\n});\n"))),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("p",null,"Take ",(0,r.kt)("inlineCode",{parentName:"p"},"transfer")," tx as an example."),(0,r.kt)("h3",{id:"1-construct-a-transaction"},"1. construct a transaction"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="construct tx"',title:'"construct','tx"':!0},"const transferTx = await client.account.transfer({\n  fromAddress: address,\n  toAddress: transferInfo.to,\n  amount: [\n    {\n      denom: 'BNB',\n      amount: '1000000000',\n    },\n  ],\n});\n")),(0,r.kt)("h3",{id:"2-simulate"},"2. simulate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="simulate tx"',title:'"simulate','tx"':!0},"const simulateInfo = await transferTx.simulate({\n  denom: 'BNB',\n});\n")),(0,r.kt)("h3",{id:"3-broadcast"},"3. broadcast"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="broadcast tx"',title:'"broadcast','tx"':!0},"const broadcastRes = await transferTx.broadcast({\n  denom: 'BNB',\n  gasLimit: Number(simulateInfo.gasLimit),\n  gasPrice: simulateInfo.gasPrice,\n  payer: address,\n  granter: '',\n});\n")))}u.isMDXComponent=!0}}]);
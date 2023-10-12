"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[922],{4852:(t,e,a)=>{a.d(e,{Zo:()=>m,kt:()=>y});var n=a(9231);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function p(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var o=n.createContext({}),d=function(t){var e=n.useContext(o),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},m=function(t){var e=d(t.components);return n.createElement(o.Provider,{value:e},t.children)},s="mdxType",c={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},u=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,l=t.originalType,o=t.parentName,m=p(t,["components","mdxType","originalType","parentName"]),s=d(a),u=r,y=s["".concat(o,".").concat(u)]||s[u]||c[u]||l;return a?n.createElement(y,i(i({ref:e},m),{},{components:a})):n.createElement(y,i({ref:e},m))}));function y(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=a.length,i=new Array(l);i[0]=u;var p={};for(var o in e)hasOwnProperty.call(e,o)&&(p[o]=e[o]);p.originalType=t,p[s]="string"==typeof t?t:r,i[1]=p;for(var d=2;d<l;d++)i[d]=a[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2780:(t,e,a)=>{a.d(e,{ZP:()=>p});var n=a(6e3),r=(a(9231),a(4852));const l={toc:[]},i="wrapper";function p(t){let{components:e,...a}=t;return(0,r.kt)(i,(0,n.Z)({},l,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"This is only ",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client"},"construct")," tx, next need ",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client#simulate"},"simulate")," and\n",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client#broadcast"},"broadcast"))))}p.isMDXComponent=!0},829:(t,e,a)=>{a.d(e,{Z:()=>r});var n=a(9231);const r=t=>{const{type:e}=t;return n.createElement("span",{style:{backgroundColor:"#25c2a0",borderRadius:"5px",color:"#FFF",fontSize:14,padding:2}},e)}},6847:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>m,contentTitle:()=>o,default:()=>y,frontMatter:()=>p,metadata:()=>d,toc:()=>s});var n=a(6e3),r=(a(9231),a(4852)),l=a(829),i=a(2780);const p={id:"payment",title:"Payment"},o=void 0,d={unversionedId:"api/payment",id:"api/payment",title:"Payment",description:"getStreamRecord",source:"@site/docs/api/payment.mdx",sourceDirName:"api",slug:"/api/payment",permalink:"/greenfield-js-sdk/api/payment",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/docs_sit/doc-site/docs/api/payment.mdx",tags:[],version:"current",frontMatter:{id:"payment",title:"Payment"},sidebar:"GettingStartSidebar",previous:{title:"Object",permalink:"/greenfield-js-sdk/api/object"},next:{title:"Sp",permalink:"/greenfield-js-sdk/api/sp"}},m={},s=[{value:'getStreamRecord <ApiTypes type="Query" />',id:"getstreamrecord-",level:2},{value:'deposit <ApiTypes type="Tx" />',id:"deposit-",level:2},{value:'withdraw <ApiTypes type="Tx" />',id:"withdraw-",level:2},{value:'disableRefund <ApiTypes type="Tx" />',id:"disablerefund-",level:2},{value:'listUserPaymentAccounts <ApiTypes type="Storage Provider" />',id:"listuserpaymentaccounts-",level:2}],c={toc:s},u="wrapper";function y(t){let{components:e,...a}=t;return(0,r.kt)(u,(0,n.Z)({},c,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"getstreamrecord-"},"getStreamRecord ",(0,r.kt)(l.Z,{type:"Query",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Retrieve stream record information for a given stream address."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"account"),(0,r.kt)("td",{parentName:"tr",align:null},"The address of the stream record to be queried.")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"await client.payment.getStreamRecord('0x...');\n")),(0,r.kt)("h2",{id:"deposit-"},"deposit ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Deposit BNB to a payment account."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"),(0,r.kt)("th",{parentName:"tr",align:null}))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"to"),(0,r.kt)("td",{parentName:"tr",align:null},"payment address of the stream record to receive the deposit"),(0,r.kt)("td",{parentName:"tr",align:null})),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"creator"),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"operator's account")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"amount"),(0,r.kt)("td",{parentName:"tr",align:null},"the amount to deposit"),(0,r.kt)("td",{parentName:"tr",align:null})))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.payment.deposit({\n  amount: '1000000000',\n  creator: '0x...',\n  to: '0x...',\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"withdraw-"},"withdraw ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Withdraws BNB from a payment account."),(0,r.kt)("p",null,"Withdrawal will trigger settlement, i.e., updating static balance and buffer balance. If the\nwithdrawal amount is greater than the static balance after settlement it will fail. If the\nwithdrawal amount is equal to or greater than 100BNB, it will be timelock-ed for 1 day duration. And\nafter the duration, a message without ",(0,r.kt)("inlineCode",{parentName:"p"},"from")," field should be sent to get the funds."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"creator"),(0,r.kt)("td",{parentName:"tr",align:null},"operator's account")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"amount"),(0,r.kt)("td",{parentName:"tr",align:null},"the amount to withdraw")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"from"),(0,r.kt)("td",{parentName:"tr",align:null},"payment address")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.payment.withdraw({\n  amount: '100000000',\n  creator: '0x...',\n  from: '0x..',\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"disablerefund-"},"disableRefund ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Disable refund/withdrawal for a payment account. After disabling withdrawal of a payment account, no\nmore withdrawal can be executed. The action cannot be reverted."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"owner"),(0,r.kt)("td",{parentName:"tr",align:null},"operator address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"addr"),(0,r.kt)("td",{parentName:"tr",align:null},"payment address")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.payment.disableRefund({\n  owner: address,\n  addr: paymentAccount,\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"listuserpaymentaccounts-"},"listUserPaymentAccounts ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"list user payment info."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"account"),(0,r.kt)("td",{parentName:"tr",align:null},"the address of user")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"authType"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/client/sp-client#authtype"},"AuthType"))))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const res = await client.payment.listUserPaymentAccounts(\n  {\n    account: address,\n  },\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n);\n")),(0,r.kt)("p",null,"List payment info by a user address."))}y.isMDXComponent=!0}}]);
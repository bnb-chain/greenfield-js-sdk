"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[982],{4852:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),o=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=o(e.components);return r.createElement(s.Provider,{value:t},e.children)},g="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),g=o(n),u=a,m=g["".concat(s,".").concat(u)]||g[u]||d[u]||i;return n?r.createElement(m,l(l({ref:t},p),{},{components:n})):r.createElement(m,l({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=u;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[g]="string"==typeof e?e:a,l[1]=c;for(var o=2;o<i;o++)l[o]=n[o];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},3405:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>o});var r=n(6e3),a=(n(9231),n(4852));const i={id:"query-client",title:"Query Client",sidebar_position:2},l=void 0,c={unversionedId:"client/query-client",id:"client/query-client",title:"Query Client",description:"It's actually an encapsulation of the",source:"@site/docs/client/query-client.mdx",sourceDirName:"client",slug:"/client/query-client",permalink:"/greenfield-js-sdk/client/query-client",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/client/query-client.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"query-client",title:"Query Client",sidebar_position:2},sidebar:"GettingStartSidebar",previous:{title:"Tx Client",permalink:"/greenfield-js-sdk/client/tx-client"},next:{title:"Storage Provider Client",permalink:"/greenfield-js-sdk/client/sp-client"}},s={},o=[{value:"getAuthQueryClient",id:"getauthqueryclient",level:2},{value:"getBankQueryClient",id:"getbankqueryclient",level:2},{value:"getBridgeQueryClient",id:"getbridgequeryclient",level:2},{value:"getChallengeQueryClient",id:"getchallengequeryclient",level:2},{value:"getCrosschainQueryClient",id:"getcrosschainqueryclient",level:2},{value:"getFeeGrantQueryClient",id:"getfeegrantqueryclient",level:2},{value:"getGashubClient",id:"getgashubclient",level:2},{value:"getPaymentQueryClient",id:"getpaymentqueryclient",level:2},{value:"getSpQueryClient",id:"getspqueryclient",level:2},{value:"getStorageQueryClient",id:"getstoragequeryclient",level:2},{value:"getVirtualGroupClient",id:"getvirtualgroupclient",level:2}],p={toc:o},g="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(g,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"It's actually an encapsulation of the\n",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest"},"Blockchain API"),"."),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"In most cases, you probably don't need to use the \u2018Query Client` directly.")),(0,a.kt)("h2",{id:"getauthqueryclient"},"getAuthQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getAuthQueryClient();\nawait rpc.Account({\n  address: '0x0000000000000000000000000000000000000001',\n});\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/account-info"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/account-info")),(0,a.kt)("h2",{id:"getbankqueryclient"},"getBankQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getBankQueryClient();\nawait rpc.Balance({\n  address: '0x0000000000000000000000000000000000000001',\n  denom: 'BNB',\n});\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/account-info"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/account-info")),(0,a.kt)("h2",{id:"getbridgequeryclient"},"getBridgeQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getBridgeQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/bridge-params"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/bridge-params")),(0,a.kt)("h2",{id:"getchallengequeryclient"},"getChallengeQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getChallengeQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/attested-challenge"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/attested-challenge")),(0,a.kt)("h2",{id:"getcrosschainqueryclient"},"getCrosschainQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getCrosschainQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/attested-challenge"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/attested-challenge")),(0,a.kt)("h2",{id:"getfeegrantqueryclient"},"getFeeGrantQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getFeeGrantQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/allowance"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/allowance")),(0,a.kt)("h2",{id:"getgashubclient"},"getGashubClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await this.queryClient.getGashubClient();\nawait rpc.MsgGasParams(request);\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/msg-gas-params"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/msg-gas-params")),(0,a.kt)("h2",{id:"getpaymentqueryclient"},"getPaymentQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await this.queryClient.getPaymentQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/msg-gas-params"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/msg-gas-params")),(0,a.kt)("h2",{id:"getspqueryclient"},"getSpQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await this.queryClient.getSpQueryClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis:\n",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/query-global-sp-store-price-by-time"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/query-global-sp-store-price-by-time")),(0,a.kt)("h2",{id:"getstoragequeryclient"},"getStorageQueryClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getStorageQueryClient();\nawait rpc.HeadBucketById({\n  bucketId: '1',\n});\n")),(0,a.kt)("p",null,"More apis: ",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/query-group-members-exist"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/query-group-members-exist")),(0,a.kt)("h2",{id:"getvirtualgroupclient"},"getVirtualGroupClient"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const rpc = await client.queryClient.getVirtualGroupClient();\nawait rpc.Params();\n")),(0,a.kt)("p",null,"More apis:\n",(0,a.kt)("a",{parentName:"p",href:"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/available-global-virtual-group-families"},"https://docs.bnbchain.org/greenfield-docs/docs/greenfield-api/available-global-virtual-group-families")))}d.isMDXComponent=!0}}]);
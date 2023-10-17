"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[87],{4852:(t,e,a)=>{a.d(e,{Zo:()=>c,kt:()=>o});var n=a(9231);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function p(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},l=Object.keys(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(n=0;n<l.length;n++)a=l[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var d=n.createContext({}),u=function(t){var e=n.useContext(d),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},c=function(t){var e=u(t.components);return n.createElement(d.Provider,{value:e},t.children)},k="mdxType",s={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},m=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,l=t.originalType,d=t.parentName,c=p(t,["components","mdxType","originalType","parentName"]),k=u(a),m=r,o=k["".concat(d,".").concat(m)]||k[m]||s[m]||l;return a?n.createElement(o,i(i({ref:e},c),{},{components:a})):n.createElement(o,i({ref:e},c))}));function o(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=a.length,i=new Array(l);i[0]=m;var p={};for(var d in e)hasOwnProperty.call(e,d)&&(p[d]=e[d]);p.originalType=t,p[k]="string"==typeof t?t:r,i[1]=p;for(var u=2;u<l;u++)i[u]=a[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},2780:(t,e,a)=>{a.d(e,{ZP:()=>p});var n=a(6e3),r=(a(9231),a(4852));const l={toc:[]},i="wrapper";function p(t){let{components:e,...a}=t;return(0,r.kt)(i,(0,n.Z)({},l,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"This is only ",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client"},"construct")," tx, next need ",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client#simulate"},"simulate")," and\n",(0,r.kt)("a",{parentName:"p",href:"/client/tx-client#broadcast"},"broadcast"))))}p.isMDXComponent=!0},829:(t,e,a)=>{a.d(e,{Z:()=>r});var n=a(9231);const r=t=>{const{type:e}=t;return n.createElement("span",{style:{backgroundColor:"#25c2a0",borderRadius:"5px",color:"#FFF",fontSize:14,padding:2}},e)}},9883:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>c,contentTitle:()=>d,default:()=>o,frontMatter:()=>p,metadata:()=>u,toc:()=>k});var n=a(6e3),r=(a(9231),a(4852)),l=a(829),i=a(2780);const p={id:"bucket",title:"Bucket"},d=void 0,u={unversionedId:"api/bucket",id:"api/bucket",title:"Bucket",description:"createBucket",source:"@site/docs/api/bucket.mdx",sourceDirName:"api",slug:"/api/bucket",permalink:"/greenfield-js-sdk/api/bucket",draft:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/api/bucket.mdx",tags:[],version:"current",frontMatter:{id:"bucket",title:"Bucket"},sidebar:"GettingStartSidebar",previous:{title:"Account",permalink:"/greenfield-js-sdk/api/account"},next:{title:"Crosschain",permalink:"/greenfield-js-sdk/api/crosschain"}},c={},k=[{value:'createBucket <ApiTypes type="Storage Provider" /> <ApiTypes type="Tx" />',id:"createbucket--",level:2},{value:'deleteBucket <ApiTypes type="Tx" />',id:"deletebucket-",level:2},{value:'deleteBucketPolicy <ApiTypes type="Tx" />',id:"deletebucketpolicy-",level:2},{value:'getBucketMeta <ApiTypes type="Storage Provider" />',id:"getbucketmeta-",level:2},{value:'getBucketPolicy <ApiTypes type="Query" />',id:"getbucketpolicy-",level:2},{value:'getBucketReadQuota <ApiTypes type="Storage Provider" />',id:"getbucketreadquota-",level:2},{value:'headBucket <ApiTypes type="Query" />',id:"headbucket-",level:2},{value:'headBucketById <ApiTypes type="Query" />',id:"headbucketbyid-",level:2},{value:'headBucketExtra <ApiTypes type="Query" />',id:"headbucketextra-",level:2},{value:'listBucketReadRecords <ApiTypes type="Storage Provider" />',id:"listbucketreadrecords-",level:2},{value:'listBuckets <ApiTypes type="Storage Provider" />',id:"listbuckets-",level:2},{value:'listBucketsByIds <ApiTypes type="Storage Provider" />',id:"listbucketsbyids-",level:2},{value:'listBucketsByPaymentAccount <ApiTypes type="Storage Provider" />',id:"listbucketsbypaymentaccount-",level:2},{value:'putBucketPolicy <ApiTypes type="Tx" />',id:"putbucketpolicy-",level:2},{value:'updateBucketInfo <ApiTypes type="Tx" />',id:"updatebucketinfo-",level:2}],s={toc:k},m="wrapper";function o(t){let{components:e,...a}=t;return(0,r.kt)(m,(0,n.Z)({},s,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"createbucket--"},"createBucket ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})," ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Create a new bucket in greenfield. This API sends a request to the storage provider to get approval\nfor creating bucket and sends the createBucket transaction to the Greenfield."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"creator"),(0,r.kt)("td",{parentName:"tr",align:null},"creator account address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"visibility"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/types/visibility"},"VisibilityType"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"chargedReadQuota"),(0,r.kt)("td",{parentName:"tr",align:null},"defines the traffic quota that you read from primary sp")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"spInfo"),(0,r.kt)("td",{parentName:"tr",align:null},"primary sp address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"paymentAddress"),(0,r.kt)("td",{parentName:"tr",align:null},"payment address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"authType"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/client/sp-client#authtype"},"AuthType"))))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.bucket.createBucket(\n  {\n    bucketName: 'bucket_name',\n    creator: address,\n    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',\n    chargedReadQuota: '0',\n    spInfo: {\n      primarySpAddress: 'primary_sp_address',\n    },\n    paymentAddress: address,\n  },\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n);\n")),(0,r.kt)("h2",{id:"deletebucket-"},"deleteBucket ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Send DeleteBucket msg to greenfield chain and return txn hash."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"The name of the bucket to be deleted")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"operator"),(0,r.kt)("td",{parentName:"tr",align:null},"operator account address")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.bucket.deleteBucket({\n  bucketName: bucketName,\n  operator: address,\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"deletebucketpolicy-"},"deleteBucketPolicy ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Delete the bucket policy of the principal."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"operator"),(0,r.kt)("td",{parentName:"tr",align:null})),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"The bucket name identifies the bucket")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"principalAddr"),(0,r.kt)("td",{parentName:"tr",align:null},"Principal define the roles that can grant permissions")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"principalType"),(0,r.kt)("td",{parentName:"tr",align:null},"PrincipalType refers to the identity type of system users or entities.")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const tx = await client.bucket.deleteBucketPolicy(\n  address,\n  bucketName,\n  address,\n  'PRINCIPAL_TYPE_GNFD_ACCOUNT',\n);\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"getbucketmeta-"},"getBucketMeta ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"This API is used to get bucket meta by bucket name."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const bucketInfo = await client.bucket.getBucketMeta({\n  bucketName,\n});\n")),(0,r.kt)("h2",{id:"getbucketpolicy-"},"getBucketPolicy ",(0,r.kt)(l.Z,{type:"Query",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Get the bucket policy info of the user specified by principalAddr."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"import { GRNToString, newBucketGRN } from '@bnb-chain/greenfield-js-sdk';\nawait client.bucket.getBucketPolicy({\n  resource: GRNToString(newBucketGRN(bucketName)),\n  principalAddress: '0x00..',\n});\n")),(0,r.kt)("h2",{id:"getbucketreadquota-"},"getBucketReadQuota ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Query the quota info of the specific bucket of current month."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"authType"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/client/sp-client#authtype"},"AuthType"))))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"await client.bucket.getBucketReadQuota(\n  {\n    bucketName,\n  },\n  {\n    type: 'EDDSA',\n    seed: offChainData.seedString,\n    domain: window.location.origin,\n    address,\n  },\n);\n")),(0,r.kt)("h2",{id:"headbucket-"},"headBucket ",(0,r.kt)(l.Z,{type:"Query",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"query the bucketInfo on chain, return the bucket info if exists."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const bucketInfo = await client.bucket.headBucket(bucketName);\n")),(0,r.kt)("h2",{id:"headbucketbyid-"},"headBucketById ",(0,r.kt)(l.Z,{type:"Query",mdxType:"ApiTypes"})),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketId"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket id")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const bucketInfo = await client.bucket.headBucketById(bucketId);\n")),(0,r.kt)("h2",{id:"headbucketextra-"},"headBucketExtra ",(0,r.kt)(l.Z,{type:"Query",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Queries a bucket extra info (with gvg bindings and price time) with specify name."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const bucketInfo = await client.bucket.headBucketExtra(bucketName);\n")),(0,r.kt)("h2",{id:"listbucketreadrecords-"},"listBucketReadRecords ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"List the download record info of the specific bucket of the current month."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"authType"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/client/sp-client#authtype"},"AuthType"))))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"await client.bucket.listBucketReadRecords(\n  {\n    bucketName,\n    startTimeStamp,\n    endTimeStamp,\n    maxRecords: 1000,\n  },\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n);\n")),(0,r.kt)("h2",{id:"listbuckets-"},"listBuckets ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Lists the bucket info of the user."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"address"),(0,r.kt)("td",{parentName:"tr",align:null},"user account")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const res = await client.bucket.listBuckets({\n  address,\n});\n")),(0,r.kt)("h2",{id:"listbucketsbyids-"},"listBucketsByIds ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Lists the bucket info of the user."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ids"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket ids array")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"await client.bucket.listBucketsByIds({\n  ids: ['1', '2'],\n});\n")),(0,r.kt)("h2",{id:"listbucketsbypaymentaccount-"},"listBucketsByPaymentAccount ",(0,r.kt)(l.Z,{type:"Storage Provider",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"List bucket info by payment account."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"paymentAccount"),(0,r.kt)("td",{parentName:"tr",align:null},"payment account address")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"const res = await client.bucket.listBucketsByPaymentAccount({\n  paymentAccount: '0x00...',\n});\n")),(0,r.kt)("h2",{id:"putbucketpolicy-"},"putBucketPolicy ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Apply bucket policy to the principal, return the txn hash."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"statements"),(0,r.kt)("td",{parentName:"tr",align:null},"Policies outline the specific details of permissions, including the Effect, ActionList, and Resources.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"principal"),(0,r.kt)("td",{parentName:"tr",align:null},"Indicates the marshaled principal content of greenfield permission types, users can generate it by NewPrincipalWithAccount or NewPrincipalWithGroupId method.")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"import { GRNToString, newBucketGRN, PermissionTypes } from '@bnb-chain/greenfield-js-sdk';\nconst statement: PermissionTypes.Statement = {\n  effect: PermissionTypes.Effect.EFFECT_ALLOW,\n  actions: [PermissionTypes.ActionType.ACTION_UPDATE_BUCKET_INFO],\n  resources: [GRNToString(newBucketGRN(bucketName))],\n};\nconst tx = await client.bucket.putBucketPolicy(bucketName, {\n  operator: address,\n  statements: [statement],\n  principal: {\n    type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,\n    value: '0x0000000000000000000000000000000000000001',\n  },\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}),(0,r.kt)("h2",{id:"updatebucketinfo-"},"updateBucketInfo ",(0,r.kt)(l.Z,{type:"Tx",mdxType:"ApiTypes"})),(0,r.kt)("p",null,"Update the bucket meta on chain, including read quota, payment address or visibility. It will send\nthe MsgUpdateBucketInfo msg to greenfield to update the meta."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"params"),(0,r.kt)("th",{parentName:"tr",align:null},"description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bucketName"),(0,r.kt)("td",{parentName:"tr",align:null},"bucket name")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"operator"),(0,r.kt)("td",{parentName:"tr",align:null},"operator account address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"visibility"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/types/visibility"},"VisibilityType"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"paymentAddress"),(0,r.kt)("td",{parentName:"tr",align:null},"payment address")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"chargedReadQuota"),(0,r.kt)("td",{parentName:"tr",align:null},"defines the traffic quota that you read from primary sp")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="example"',title:'"example"'},"await client.bucket.updateBucketInfo({\n  bucketName: bucketName,\n  operator: address,\n  visibility: 1,\n  paymentAddress: address,\n  chargedReadQuota: '100',\n});\n")),(0,r.kt)(i.ZP,{mdxType:"Tx"}))}o.isMDXComponent=!0}}]);
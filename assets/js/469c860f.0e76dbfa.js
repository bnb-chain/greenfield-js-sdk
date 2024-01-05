"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[87],{8695:(e,t,n)=>{n.d(t,{ZP:()=>c});var s=n(5250),r=n(1340);function i(e){const t={a:"a",admonition:"admonition",p:"p",...(0,r.a)(),...e.components};return(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["This is only ",(0,s.jsx)(t.a,{href:"/client/tx-client",children:"construct"})," tx, next need ",(0,s.jsx)(t.a,{href:"/client/tx-client#simulate",children:"simulate"})," and\n",(0,s.jsx)(t.a,{href:"/client/tx-client#broadcast",children:"broadcast"})]})})}function c(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(i,{...e})}):i(e)}},8012:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>h,default:()=>j,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var s=n(5250),r=n(1340),i=n(918),c=n(7227),a=n(7002),d=n(8695);const l={id:"bucket",title:"Bucket"},h=void 0,o={id:"api/bucket",title:"Bucket",description:"createBucket",source:"@site/docs/api/bucket.mdx",sourceDirName:"api",slug:"/api/bucket",permalink:"/greenfield-js-sdk/api/bucket",draft:!1,unlisted:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/api/bucket.mdx",tags:[],version:"current",frontMatter:{id:"bucket",title:"Bucket"},sidebar:"GettingStartSidebar",previous:{title:"Account",permalink:"/greenfield-js-sdk/api/account"},next:{title:"Crosschain",permalink:"/greenfield-js-sdk/api/crosschain"}},u={},p=[{value:"createBucket <ApiTypes></ApiTypes> <ApiTypes></ApiTypes>",id:"createbucket--",level:2},{value:"deleteBucket <ApiTypes></ApiTypes>",id:"deletebucket-",level:2},{value:"deleteBucketPolicy <ApiTypes></ApiTypes>",id:"deletebucketpolicy-",level:2},{value:"getBucketMeta <ApiTypes></ApiTypes>",id:"getbucketmeta-",level:2},{value:"getBucketPolicy <ApiTypes></ApiTypes>",id:"getbucketpolicy-",level:2},{value:"getBucketReadQuota <ApiTypes></ApiTypes>",id:"getbucketreadquota-",level:2},{value:"headBucket <ApiTypes></ApiTypes>",id:"headbucket-",level:2},{value:"headBucketById <ApiTypes></ApiTypes>",id:"headbucketbyid-",level:2},{value:"headBucketExtra <ApiTypes></ApiTypes>",id:"headbucketextra-",level:2},{value:"listBucketReadRecords <ApiTypes></ApiTypes>",id:"listbucketreadrecords-",level:2},{value:"listBuckets <ApiTypes></ApiTypes>",id:"listbuckets-",level:2},{value:"listBucketsByIds <ApiTypes></ApiTypes>",id:"listbucketsbyids-",level:2},{value:"listBucketsByPaymentAccount <ApiTypes></ApiTypes>",id:"listbucketsbypaymentaccount-",level:2},{value:"putBucketPolicy <ApiTypes></ApiTypes>",id:"putbucketpolicy-",level:2},{value:"updateBucketInfo <ApiTypes></ApiTypes>",id:"updatebucketinfo-",level:2}];function x(e){const t={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.h2,{id:"createbucket--",children:["createBucket ",(0,s.jsx)(a.Z,{type:"Storage Provider"})," ",(0,s.jsx)(a.Z,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Create a new bucket in greenfield. This API sends a request to the storage provider to get approval\nfor creating bucket and sends the createBucket transaction to the Greenfield."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"creator"}),(0,s.jsx)(t.td,{children:"creator account address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"visibility"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/visibility",children:"VisibilityType"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"chargedReadQuota"}),(0,s.jsx)(t.td,{children:"defines the traffic quota that you read from primary sp"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"spInfo"}),(0,s.jsx)(t.td,{children:"primary sp address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"paymentAddress"}),(0,s.jsx)(t.td,{children:"payment address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"tags"}),(0,s.jsx)(t.td,{children:"defines a list of tags which will be set to the bucket"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]})]})]}),"\n",(0,s.jsxs)(i.Z,{groupId:"example",children:[(0,s.jsx)(c.Z,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"const tx = await client.bucket.createBucket(\n  {\n    bucketName: 'bucket_name',\n    creator: address,\n    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',\n    chargedReadQuota: '0',\n    spInfo: {\n      primarySpAddress: 'primary_sp_address',\n    },\n    paymentAddress: address,\n    tags: {\n      tags: [],\n    },\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(c.Z,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"const createBucketTx = await client.bucket.createBucket(\n  {\n    bucketName: bucketName,\n    creator: ACCOUNT_ADDRESS,\n    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',\n    chargedReadQuota: '0',\n    spInfo: {\n      primarySpAddress: spInfo.primarySpAddress,\n    },\n    paymentAddress: ACCOUNT_ADDRESS,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsxs)(t.h2,{id:"deletebucket-",children:["deleteBucket ",(0,s.jsx)(a.Z,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Send DeleteBucket msg to greenfield chain and return txn hash."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"The name of the bucket to be deleted"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"operator account address"})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const tx = await client.bucket.deleteBucket({\n  bucketName: bucketName,\n  operator: address,\n});\n"})}),"\n",(0,s.jsx)(d.ZP,{}),"\n",(0,s.jsxs)(t.h2,{id:"deletebucketpolicy-",children:["deleteBucketPolicy ",(0,s.jsx)(a.Z,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Delete the bucket policy of the principal."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"The bucket name identifies the bucket"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principalAddr"}),(0,s.jsx)(t.td,{children:"Principal define the roles that can grant permissions"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principalType"}),(0,s.jsx)(t.td,{children:"PrincipalType refers to the identity type of system users or entities."})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const tx = await client.bucket.deleteBucketPolicy(\n  address,\n  bucketName,\n  address,\n  'PRINCIPAL_TYPE_GNFD_ACCOUNT',\n);\n"})}),"\n",(0,s.jsx)(d.ZP,{}),"\n",(0,s.jsxs)(t.h2,{id:"getbucketmeta-",children:["getBucketMeta ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"This API is used to get bucket meta by bucket name."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const bucketInfo = await client.bucket.getBucketMeta({\n  bucketName,\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"getbucketpolicy-",children:["getBucketPolicy ",(0,s.jsx)(a.Z,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"Get the bucket policy info of the user specified by principalAddr."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"import { GRNToString, newBucketGRN } from '@bnb-chain/greenfield-js-sdk';\nawait client.bucket.getBucketPolicy({\n  resource: GRNToString(newBucketGRN(bucketName)),\n  principalAddress: '0x00..',\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"getbucketreadquota-",children:["getBucketReadQuota ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Query the quota info of the specific bucket of current month."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]})]})]}),"\n",(0,s.jsxs)(i.Z,{groupId:"example",children:[(0,s.jsx)(c.Z,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"const tx = await client.bucket.getBucketReadQuota(\n  {\n    bucketName,\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    seed: offChainData.seedString,\n    domain: window.location.origin,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(c.Z,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"const tx = await client.bucket.getBucketReadQuota(\n  {\n    bucketName,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsxs)(t.h2,{id:"headbucket-",children:["headBucket ",(0,s.jsx)(a.Z,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"query the bucketInfo on chain, return the bucket info if exists."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const bucketInfo = await client.bucket.headBucket(bucketName);\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"headbucketbyid-",children:["headBucketById ",(0,s.jsx)(a.Z,{type:"Query"})]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketId"}),(0,s.jsx)(t.td,{children:"bucket id"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const bucketInfo = await client.bucket.headBucketById(bucketId);\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"headbucketextra-",children:["headBucketExtra ",(0,s.jsx)(a.Z,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"Queries a bucket extra info (with gvg bindings and price time) with specify name."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const bucketInfo = await client.bucket.headBucketExtra(bucketName);\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listbucketreadrecords-",children:["listBucketReadRecords ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"List the download record info of the specific bucket of the current month."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]})]})]}),"\n",(0,s.jsxs)(i.Z,{groupId:"example",children:[(0,s.jsx)(c.Z,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"const tx = await client.bucket.listBucketReadRecords(\n  {\n    bucketName,\n    startTimeStamp,\n    endTimeStamp,\n    maxRecords: 1000,\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(c.Z,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"const tx = await client.bucket.listBucketReadRecords(\n  {\n    bucketName,\n    startTimeStamp,\n    endTimeStamp,\n    maxRecords: 1000,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsxs)(t.h2,{id:"listbuckets-",children:["listBuckets ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Lists the bucket info of the user."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"address"}),(0,s.jsx)(t.td,{children:"user account"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const res = await client.bucket.listBuckets({\n  address,\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listbucketsbyids-",children:["listBucketsByIds ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Lists the bucket info of the user."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"ids"}),(0,s.jsx)(t.td,{children:"bucket ids array"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"await client.bucket.listBucketsByIds({\n  ids: ['1', '2'],\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listbucketsbypaymentaccount-",children:["listBucketsByPaymentAccount ",(0,s.jsx)(a.Z,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"List bucket info by payment account."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"paymentAccount"}),(0,s.jsx)(t.td,{children:"payment account address"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"const res = await client.bucket.listBucketsByPaymentAccount({\n  paymentAccount: '0x00...',\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"putbucketpolicy-",children:["putBucketPolicy ",(0,s.jsx)(a.Z,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Apply bucket policy to the principal, return the txn hash."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"statements"}),(0,s.jsx)(t.td,{children:"Policies outline the specific details of permissions, including the Effect, ActionList, and Resources."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principal"}),(0,s.jsx)(t.td,{children:"Indicates the marshaled principal content of greenfield permission types, users can generate it by NewPrincipalWithAccount or NewPrincipalWithGroupId method."})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"import { GRNToString, newBucketGRN, PermissionTypes } from '@bnb-chain/greenfield-js-sdk';\nconst statement: PermissionTypes.Statement = {\n  effect: PermissionTypes.Effect.EFFECT_ALLOW,\n  actions: [PermissionTypes.ActionType.ACTION_UPDATE_BUCKET_INFO],\n  resources: [GRNToString(newBucketGRN(bucketName))],\n};\nconst tx = await client.bucket.putBucketPolicy(bucketName, {\n  operator: address,\n  statements: [statement],\n  principal: {\n    type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,\n    value: '0x0000000000000000000000000000000000000001',\n  },\n});\n"})}),"\n",(0,s.jsx)(d.ZP,{}),"\n",(0,s.jsxs)(t.h2,{id:"updatebucketinfo-",children:["updateBucketInfo ",(0,s.jsx)(a.Z,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Update the bucket meta on chain, including read quota, payment address or visibility. It will send\nthe MsgUpdateBucketInfo msg to greenfield to update the meta."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"operator account address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"visibility"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/visibility",children:"VisibilityType"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"paymentAddress"}),(0,s.jsx)(t.td,{children:"payment address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"chargedReadQuota"}),(0,s.jsx)(t.td,{children:"defines the traffic quota that you read from primary sp"})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser | Nodejs"',children:"await client.bucket.updateBucketInfo({\n  bucketName: bucketName,\n  operator: address,\n  visibility: 1,\n  paymentAddress: address,\n  chargedReadQuota: '100',\n});\n"})}),"\n",(0,s.jsx)(d.ZP,{})]})}function j(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},7002:(e,t,n)=>{n.d(t,{Z:()=>r});n(79);var s=n(5250);const r=e=>{const{type:t}=e;return(0,s.jsx)("span",{style:{backgroundColor:"#25c2a0",borderRadius:"5px",color:"#FFF",fontSize:14,padding:2},children:t})}},7227:(e,t,n)=>{n.d(t,{Z:()=>c});n(79);var s=n(9577);const r={tabItem:"tabItem_bB9t"};var i=n(5250);function c(e){let{children:t,hidden:n,className:c}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,s.Z)(r.tabItem,c),hidden:n,children:t})}},918:(e,t,n)=>{n.d(t,{Z:()=>v});var s=n(79),r=n(9577),i=n(3780),c=n(7911),a=n(6419),d=n(4773),l=n(7795),h=n(7547);function o(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function u(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return o(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:r}}=e;return{value:t,label:n,attributes:s,default:r}}))}(n);return function(e){const t=(0,l.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function p(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function x(e){let{queryString:t=!1,groupId:n}=e;const r=(0,c.k6)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,d._X)(i),(0,s.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(r.location.search);t.set(i,e),r.replace({...r.location,search:t.toString()})}),[i,r])]}function j(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,i=u(e),[c,d]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:i}))),[l,o]=x({queryString:n,groupId:r}),[j,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,i]=(0,h.Nk)(n);return[r,(0,s.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:r}),m=(()=>{const e=l??j;return p({value:e,tabValues:i})?e:null})();(0,a.Z)((()=>{m&&d(m)}),[m]);return{selectedValue:c,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);d(e),o(e),b(e)}),[o,b,i]),tabValues:i}}var b=n(1743);const m={tabList:"tabList_Idnx",tabItem:"tabItem_fiZX"};var y=n(5250);function k(e){let{className:t,block:n,selectedValue:s,selectValue:c,tabValues:a}=e;const d=[],{blockElementScrollPositionUntilNextRender:l}=(0,i.o5)(),h=e=>{const t=e.currentTarget,n=d.indexOf(t),r=a[n].value;r!==s&&(l(t),c(r))},o=e=>{let t=null;switch(e.key){case"Enter":h(e);break;case"ArrowRight":{const n=d.indexOf(e.currentTarget)+1;t=d[n]??d[0];break}case"ArrowLeft":{const n=d.indexOf(e.currentTarget)-1;t=d[n]??d[d.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":n},t),children:a.map((e=>{let{value:t,label:n,attributes:i}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>d.push(e),onKeyDown:o,onClick:h,...i,className:(0,r.Z)("tabs__item",m.tabItem,i?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function g(e){let{lazy:t,children:n,selectedValue:r}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function f(e){const t=j(e);return(0,y.jsxs)("div",{className:(0,r.Z)("tabs-container",m.tabList),children:[(0,y.jsx)(k,{...e,...t}),(0,y.jsx)(g,{...e,...t})]})}function v(e){const t=(0,b.Z)();return(0,y.jsx)(f,{...e,children:o(e.children)},String(t))}},1340:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>c});var s=n(79);const r={},i=s.createContext(r);function c(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);
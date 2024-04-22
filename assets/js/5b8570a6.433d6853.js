"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[727],{6976:(e,t,n)=>{n.d(t,{Ay:()=>l,RM:()=>i});var s=n(9214),r=n(3159);const i=[];function c(e){const t={a:"a",admonition:"admonition",p:"p",...(0,r.R)(),...e.components};return(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["This is only ",(0,s.jsx)(t.a,{href:"/client/tx-client",children:"construct"})," tx, next need ",(0,s.jsx)(t.a,{href:"/client/tx-client#simulate",children:"simulate"})," and\n",(0,s.jsx)(t.a,{href:"/client/tx-client#broadcast",children:"broadcast"})]})})}function l(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},9048:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>j,contentTitle:()=>o,default:()=>b,frontMatter:()=>a,metadata:()=>h,toc:()=>x});var s=n(9214),r=n(3159),i=n(9322),c=n(6976),l=n(3428),d=n(7012);const a={id:"object",title:"Object"},o=void 0,h={id:"api/object",title:"Object",description:"cancelCreateObject",source:"@site/docs/api/object.mdx",sourceDirName:"api",slug:"/api/object",permalink:"/greenfield-js-sdk/api/object",draft:!1,unlisted:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/api/object.mdx",tags:[],version:"current",frontMatter:{id:"object",title:"Object"},sidebar:"GettingStartSidebar",previous:{title:"Group",permalink:"/greenfield-js-sdk/api/group"},next:{title:"Payment",permalink:"/greenfield-js-sdk/api/payment"}},j={},x=[{value:"cancelCreateObject <ApiTypes></ApiTypes>",id:"cancelcreateobject-",level:2},{value:"createFolder <ApiTypes></ApiTypes> <ApiTypes></ApiTypes>",id:"createfolder--",level:2},...c.RM,{value:"createObject <ApiTypes></ApiTypes> <ApiTypes></ApiTypes>",id:"createobject--",level:2},...c.RM,{value:"deleteObject <ApiTypes></ApiTypes>",id:"deleteobject-",level:2},...c.RM,{value:"deleteObjectPolicy <ApiTypes></ApiTypes>",id:"deleteobjectpolicy-",level:2},...c.RM,{value:"downloadFile <ApiTypes></ApiTypes>",id:"downloadfile-",level:2},{value:"getObjectPolicy <ApiTypes></ApiTypes>",id:"getobjectpolicy-",level:2},{value:"getObjectPreviewUrl <ApiTypes></ApiTypes>",id:"getobjectpreviewurl-",level:2},{value:"headObject <ApiTypes></ApiTypes>",id:"headobject-",level:2},{value:"headObjectById <ApiTypes></ApiTypes>",id:"headobjectbyid-",level:2},{value:"listObjects <ApiTypes></ApiTypes>",id:"listobjects-",level:2},{value:"listObjectsByIds <ApiTypes></ApiTypes>",id:"listobjectsbyids-",level:2},{value:"listObjectPolicies <ApiTypes></ApiTypes>",id:"listobjectpolicies-",level:2},{value:"putObjectPolicy <ApiTypes></ApiTypes>",id:"putobjectpolicy-",level:2},...c.RM,{value:"updateObjectInfo <ApiTypes></ApiTypes>",id:"updateobjectinfo-",level:2},...c.RM,{value:"uploadObject <ApiTypes></ApiTypes>",id:"uploadobject-",level:2}];function p(e){const t={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.h2,{id:"cancelcreateobject-",children:["cancelCreateObject ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsxs)(t.p,{children:["Send ",(0,s.jsx)(t.code,{children:"CancelCreateObject"})," txn to greenfield chain."]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"the account address of the operator"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"the name of the bucket"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"the name of the object"})]})]})]}),"\n",(0,s.jsxs)(t.h2,{id:"createfolder--",children:["createFolder ",(0,s.jsx)(i.A,{type:"Storage Provider"})," ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Send create empty object txn to greenfield chain."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"creator"}),(0,s.jsx)(t.td,{children:"the creator of object"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"tags"}),(0,s.jsx)(t.td,{children:"defines a list of tags which will be set to the object"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]})]})]}),"\n",(0,s.jsxs)(l.A,{groupId:"example",children:[(0,s.jsx)(d.A,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"const tx = await client.object.createFolder(\n  {\n    bucketName: createObjectInfo.bucketName,\n    objectName: createObjectInfo.objectName + '/',\n    creator: address,\n    tags: {\n      tags: [],\n    },\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(d.A,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"const tx = await client.object.createFolder(\n  {\n    bucketName: bucketName,\n    objectName: objectName + '/',\n    creator: ACCOUNT_ADDRESS,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"createobject--",children:["createObject ",(0,s.jsx)(i.A,{type:"Storage Provider"})," ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Get approval of creating object and send createObject txn to greenfield chain."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"creator"}),(0,s.jsx)(t.td,{children:"the creator of object"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"visibility"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/visibility",children:"VisibilityType"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"fileType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/File/type",children:"file type"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"redundancyType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/redundancy",children:"RedundancyType"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"contentLength"}),(0,s.jsx)(t.td,{children:"file content length"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"expectCheckSums"}),(0,s.jsx)(t.td,{children:"file's expectCheckSums"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"tags"}),(0,s.jsx)(t.td,{children:"defines a list of tags which will be set to the object"})]})]})]}),"\n",(0,s.jsxs)(l.A,{groupId:"example",children:[(0,s.jsx)(d.A,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"// https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nextjs/src/components/object/create/index.tsx#L76-L95\nconst tx = await client.object.createObject(\n  {\n    bucketName: 'bucket_name',\n    objectName: 'object_name',\n    creator: '0x...',\n    visibility: 'VISIBILITY_TYPE_PRIVATE',\n    fileType: 'json',\n    redundancyType: 'REDUNDANCY_EC_TYPE',\n    contentLength: 13311,\n    expectCheckSums: JSON.parse(expectCheckSums),\n    tags: {\n      tags: [],\n    },\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(d.A,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"// https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nodejs/cases/storage.js#L61-L76\nconst tx = await client.object.createObject(\n  {\n    bucketName: bucketName,\n    objectName: objectName,\n    creator: ACCOUNT_ADDRESS,\n    visibility: 'VISIBILITY_TYPE_PRIVATE',\n    fileType: fileType,\n    redundancyType: 'REDUNDANCY_EC_TYPE',\n    contentLength,\n    expectCheckSums: JSON.parse(expectCheckSums),\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"deleteobject-",children:["deleteObject ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Send DeleteObject msg to greenfield chain and return txn hash."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"the account address of the operator who has the DeleteObject permission of the object to be deleted"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"the name of the bucket where the object which to be deleted is stored"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"the name of the object which to be deleted"})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser / Nodejs Example"',children:"const tx = await client.object.deleteObject({\n  bucketName: 'bucket_name',\n  objectName: 'object_name',\n  operator: '0x000..',\n});\n"})}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"deleteobjectpolicy-",children:["deleteObjectPolicy ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Delete the object policy of the principal."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"the granter who grant the permission to another principal"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"the name of the bucket"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"the name of the object"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principalAddr"}),(0,s.jsx)(t.td,{children:"principal address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principal"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/principal",children:"PrincipalType"})})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser / Nodejs Example"',children:"const tx = await client.object.deleteObjectPolicy(\n  '0x000..', // operator\n  'bucket_name', // bucket name\n  'object_name', // object name\n  '0x000..', // principalAddr\n  'PRINCIPAL_TYPE_GNFD_GROUP', // PrincipalType\n);\n"})}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"downloadfile-",children:["downloadFile ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Download s3 object payload and return the related object info."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]})]})]}),"\n",(0,s.jsxs)(l.A,{groupId:"example",children:[(0,s.jsx)(d.A,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"await client.object.downloadFile(\n  {\n    bucketName,\n    objectName,\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    address,\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(d.A,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"await client.object.downloadFile(\n  {\n    bucketName,\n    objectName,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]}),"\n",(0,s.jsxs)(t.h2,{id:"getobjectpolicy-",children:["getObjectPolicy ",(0,s.jsx)(i.A,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"Get the object policy info of the user specified by principalAddr."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principalAddr"}),(0,s.jsx)(t.td,{children:"principal address"})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"const tx = await client.object.getObjectPolicy('bucket_name', 'object_name', '0x...');\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"getobjectpreviewurl-",children:["getObjectPreviewUrl ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Get the object preview url."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="Browser"',children:"const res = await client.object.getObjectPreviewUrl(\n  {\n    bucketName: 'bucket_name',\n    objectName: 'object_name',\n    queryMap: {\n      view: '1',\n      'X-Gnfd-User-Address': address,\n      'X-Gnfd-App-Domain': window.location.origin,\n      'X-Gnfd-Expiry-Timestamp': '2023-09-03T09%3A23%3A39Z',\n    },\n  },\n  {\n    type: 'EDDSA',\n    address,\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n  },\n);\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"headobject-",children:["headObject ",(0,s.jsx)(i.A,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"Query the objectInfo on chain to check the object id, return the object info if exists."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"await client.object.headObject(bucketName, objectName);\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"headobjectbyid-",children:["headObjectById ",(0,s.jsx)(i.A,{type:"Query"})]}),"\n",(0,s.jsx)(t.p,{children:"Query the objectInfo on chain by object id, return the object info if exists."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"await client.object.headObjectById('12');\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listobjects-",children:["listObjects ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Lists the object info of the bucket."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"const res = await client.object.listObjects({\n  bucketName,\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listobjectsbyids-",children:["listObjectsByIds ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"List objects by object ids."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"ids"}),(0,s.jsx)(t.td,{children:"object ids array"})]})})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"await client.object.listObjectsByIds({\n  ids: ['1', '2'],\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"listobjectpolicies-",children:["listObjectPolicies ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"List object policies by object info and action type."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"actionType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/action",children:"ActionType"})})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"const res = await client.object.listObjectPolicies({\n  bucketName: 'bucket_name',\n  objectName: 'object_name',\n  actionType: 'ACTION_GET_OBJECT',\n});\n"})}),"\n",(0,s.jsxs)(t.h2,{id:"putobjectpolicy-",children:["putObjectPolicy ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"operator address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"principal"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/principal",children:"Principal"})})]})]})]}),"\n",(0,s.jsx)(t.p,{children:"Apply object policy to the principal, return the txn hash."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"import { PermissionTypes } from '@bnb-chain/greenfield-js-sdk';\nconst statement: PermissionTypes.Statement = {\n  effect: PermissionTypes.Effect.EFFECT_ALLOW,\n  actions: [PermissionTypes.ActionType.ACTION_GET_OBJECT],\n  resources: [],\n};\nawait client.object.putObjectPolicy('bucket_name', 'object_name', {\n  operator: '0x...',\n  statements: [statement],\n  principal: {\n    type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,\n    value: '0x0000000000000000000000000000000000000001',\n  },\n});\n"})}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"updateobjectinfo-",children:["updateObjectInfo ",(0,s.jsx)(i.A,{type:"Tx"})]}),"\n",(0,s.jsx)(t.p,{children:"Update object info by sending message to greenfield."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"operator"}),(0,s.jsx)(t.td,{children:"operator address"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"visibility"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/types/visibility",children:"VisibilityType"})})]})]})]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",metastring:'title="example"',children:"const tx = await client.object.updateObjectInfo({\n  bucketName: 'bucket_name',\n  objectName: 'object_name',\n  operator: '0x...',\n  visibility: 'VISIBILITY_TYPE_PUBLIC_READ',\n});\n"})}),"\n",(0,s.jsx)(c.Ay,{}),"\n",(0,s.jsxs)(t.h2,{id:"uploadobject-",children:["uploadObject ",(0,s.jsx)(i.A,{type:"Storage Provider"})]}),"\n",(0,s.jsx)(t.p,{children:"Uploading the object to bucket."}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"params"}),(0,s.jsx)(t.th,{children:"description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"bucketName"}),(0,s.jsx)(t.td,{children:"bucket name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"objectName"}),(0,s.jsx)(t.td,{children:"object name"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"body"}),(0,s.jsx)(t.td,{children:"file"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"txnHash"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.a,{href:"#createobject",children:"createObject"})," 's hash"]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"authType"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.a,{href:"/client/sp-client#authtype",children:"AuthType"})})]})]})]}),"\n",(0,s.jsxs)(l.A,{groupId:"example",children:[(0,s.jsx)(d.A,{value:"Browser",label:"Browser",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-jsx",children:"const uploadRes = await client.object.uploadObject(\n  {\n    bucketName: createObjectInfo.bucketName,\n    objectName: createObjectInfo.objectName,\n    body: file,\n    txnHash: txHash,\n  },\n  // highlight-start\n  {\n    type: 'EDDSA',\n    domain: window.location.origin,\n    seed: offChainData.seedString,\n    address,\n  },\n  // highlight-end\n);\n"})})}),(0,s.jsx)(d.A,{value:"Nodejs",label:"Nodejs",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"const uploadRes = await client.object.uploadObject(\n  {\n    bucketName: bucketName,\n    objectName: objectName,\n    body: fileBuffer,\n    txnHash: createObjectTxRes.transactionHash,\n  },\n  // highlight-start\n  {\n    type: 'ECDSA',\n    privateKey: ACCOUNT_PRIVATEKEY,\n  },\n  // highlight-end\n);\n"})})})]})]})}function b(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},9322:(e,t,n)=>{n.d(t,{A:()=>r});n(8318);var s=n(9214);const r=e=>{const{type:t}=e;return(0,s.jsx)("span",{style:{backgroundColor:"#25c2a0",borderRadius:"5px",color:"#FFF",fontSize:14,padding:2},children:t})}},7012:(e,t,n)=>{n.d(t,{A:()=>c});n(8318);var s=n(6601);const r={tabItem:"tabItem_V9qR"};var i=n(9214);function c(e){let{children:t,hidden:n,className:c}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,s.A)(r.tabItem,c),hidden:n,children:t})}},3428:(e,t,n)=>{n.d(t,{A:()=>v});var s=n(8318),r=n(6601),i=n(2676),c=n(6325),l=n(9471),d=n(4081),a=n(4526),o=n(4110);function h(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function j(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return h(e).map((e=>{let{props:{value:t,label:n,attributes:s,default:r}}=e;return{value:t,label:n,attributes:s,default:r}}))}(n);return function(e){const t=(0,a.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function x(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const r=(0,c.W6)(),i=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,d.aZ)(i),(0,s.useCallback)((e=>{if(!i)return;const t=new URLSearchParams(r.location.search);t.set(i,e),r.replace({...r.location,search:t.toString()})}),[i,r])]}function b(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,i=j(e),[c,d]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!x({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=n.find((e=>e.default))??n[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:i}))),[a,h]=p({queryString:n,groupId:r}),[b,u]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,i]=(0,o.Dv)(n);return[r,(0,s.useCallback)((e=>{n&&i.set(e)}),[n,i])]}({groupId:r}),m=(()=>{const e=a??b;return x({value:e,tabValues:i})?e:null})();(0,l.A)((()=>{m&&d(m)}),[m]);return{selectedValue:c,selectValue:(0,s.useCallback)((e=>{if(!x({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);d(e),h(e),u(e)}),[h,u,i]),tabValues:i}}var u=n(1277);const m={tabList:"tabList_SOjC",tabItem:"tabItem_mOaW"};var y=n(9214);function g(e){let{className:t,block:n,selectedValue:s,selectValue:c,tabValues:l}=e;const d=[],{blockElementScrollPositionUntilNextRender:a}=(0,i.a_)(),o=e=>{const t=e.currentTarget,n=d.indexOf(t),r=l[n].value;r!==s&&(a(t),c(r))},h=e=>{let t=null;switch(e.key){case"Enter":o(e);break;case"ArrowRight":{const n=d.indexOf(e.currentTarget)+1;t=d[n]??d[0];break}case"ArrowLeft":{const n=d.indexOf(e.currentTarget)-1;t=d[n]??d[d.length-1];break}}t?.focus()};return(0,y.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.A)("tabs",{"tabs--block":n},t),children:l.map((e=>{let{value:t,label:n,attributes:i}=e;return(0,y.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>d.push(e),onKeyDown:h,onClick:o,...i,className:(0,r.A)("tabs__item",m.tabItem,i?.className,{"tabs__item--active":s===t}),children:n??t},t)}))})}function f(e){let{lazy:t,children:n,selectedValue:r}=e;const i=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=i.find((e=>e.props.value===r));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,y.jsx)("div",{className:"margin-top--md",children:i.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function A(e){const t=b(e);return(0,y.jsxs)("div",{className:(0,r.A)("tabs-container",m.tabList),children:[(0,y.jsx)(g,{...e,...t}),(0,y.jsx)(f,{...e,...t})]})}function v(e){const t=(0,u.A)();return(0,y.jsx)(A,{...e,children:h(e.children)},String(t))}},3159:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>l});var s=n(8318);const r={},i=s.createContext(r);function c(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);
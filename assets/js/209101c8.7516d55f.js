"use strict";(self.webpackChunkgreenfield_js_sdk_docs=self.webpackChunkgreenfield_js_sdk_docs||[]).push([[471],{18:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>f,frontMatter:()=>i,metadata:()=>c,toc:()=>d});var r=n(9214),l=n(3159),a=n(5303),s=n(1744);const i={id:"greenfield-client",title:"Greenfield Client",sidebar_position:1},o="Create Greenfield Client",c={id:"client/greenfield-client",title:"Greenfield Client",description:"| params         | description         |",source:"@site/docs/client/greenfield.mdx",sourceDirName:"client",slug:"/client/greenfield-client",permalink:"/greenfield-js-sdk/client/greenfield-client",draft:!1,unlisted:!1,editUrl:"https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/docs/client/greenfield.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"greenfield-client",title:"Greenfield Client",sidebar_position:1},sidebar:"GettingStartSidebar",previous:{title:"Client",permalink:"/greenfield-js-sdk/category/client"},next:{title:"Tx Client",permalink:"/greenfield-js-sdk/client/tx-client"}},u={},d=[];function h(e){const t={a:"a",code:"code",h1:"h1",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"create-greenfield-client",children:"Create Greenfield Client"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"params"}),(0,r.jsx)(t.th,{children:"description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"GRPC_URL"}),(0,r.jsx)(t.td,{children:"Greenfield grpc url"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"GREEN_CHAIN_ID"}),(0,r.jsx)(t.td,{children:"Greenfield chain id"})]})]})]}),"\n",(0,r.jsxs)(a.A,{groupId:"example",children:[(0,r.jsx)(s.A,{value:"Browser",label:"Browser",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"import { Client } from '@bnb-chain/greenfield-js-sdk';\nconst client = Client.create(GRPC_URL, GREEN_CHAIN_ID);\n"})})}),(0,r.jsx)(s.A,{value:"Nodejs",label:"Nodejs",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"const { Client } = require('@bnb-chain/greenfield-js-sdk');\nconst client = Client.create(GRPC_URL, GREEN_CHAIN_ID);\n"})})})]}),"\n",(0,r.jsx)(t.p,{children:"The JS SDK consists of two parts:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["Chain: ",(0,r.jsx)(t.a,{href:"https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest",children:"https://docs.bnbchain.org/greenfield-docs/docs/api/blockchain-rest"})]}),"\n",(0,r.jsxs)(t.li,{children:["Storage Provider: ",(0,r.jsx)(t.a,{href:"https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest",children:"https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest"})]}),"\n"]})]})}function f(e={}){const{wrapper:t}={...(0,l.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},1744:(e,t,n)=>{n.d(t,{A:()=>s});n(8318);var r=n(3372);const l={tabItem:"tabItem_SosH"};var a=n(9214);function s(e){let{children:t,hidden:n,className:s}=e;return(0,a.jsx)("div",{role:"tabpanel",className:(0,r.A)(l.tabItem,s),hidden:n,children:t})}},5303:(e,t,n)=>{n.d(t,{A:()=>C});var r=n(8318),l=n(3372),a=n(6888),s=n(6325),i=n(7503),o=n(8997),c=n(2554),u=n(3074);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:l}}=e;return{value:t,label:n,attributes:r,default:l}}))}(n);return function(e){const t=(0,c.X)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function f(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function p(e){let{queryString:t=!1,groupId:n}=e;const l=(0,s.W6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,o.aZ)(a),(0,r.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(l.location.search);t.set(a,e),l.replace({...l.location,search:t.toString()})}),[a,l])]}function b(e){const{defaultValue:t,queryString:n=!1,groupId:l}=e,a=h(e),[s,o]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!f({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[c,d]=p({queryString:n,groupId:l}),[b,m]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[l,a]=(0,u.Dv)(n);return[l,(0,r.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:l}),g=(()=>{const e=c??b;return f({value:e,tabValues:a})?e:null})();(0,i.A)((()=>{g&&o(g)}),[g]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!f({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),m(e)}),[d,m,a]),tabValues:a}}var m=n(269);const g={tabList:"tabList_u4OX",tabItem:"tabItem_nyVU"};var x=n(9214);function v(e){let{className:t,block:n,selectedValue:r,selectValue:s,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,a.a_)(),u=e=>{const t=e.currentTarget,n=o.indexOf(t),l=i[n].value;l!==r&&(c(t),s(l))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=o.indexOf(e.currentTarget)+1;t=o[n]??o[0];break}case"ArrowLeft":{const n=o.indexOf(e.currentTarget)-1;t=o[n]??o[o.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.A)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:a}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>o.push(e),onKeyDown:d,onClick:u,...a,className:(0,l.A)("tabs__item",g.tabItem,a?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function j(e){let{lazy:t,children:n,selectedValue:l}=e;const a=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=a.find((e=>e.props.value===l));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==l})))})}function y(e){const t=b(e);return(0,x.jsxs)("div",{className:(0,l.A)("tabs-container",g.tabList),children:[(0,x.jsx)(v,{...e,...t}),(0,x.jsx)(j,{...e,...t})]})}function C(e){const t=(0,m.A)();return(0,x.jsx)(y,{...e,children:d(e.children)},String(t))}},3159:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>i});var r=n(8318);const l={},a=r.createContext(l);function s(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:s(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);
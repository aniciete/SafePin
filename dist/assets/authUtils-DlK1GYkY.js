import"./firebase-D7X223rW.js";const Te={VALIDATION:"validation",AUTH:"authentication",UNKNOWN:"unknown"},_={LOW:"low",MEDIUM:"medium",HIGH:"high",CRITICAL:"critical"};class Mt extends Error{constructor(i,m=Te.UNKNOWN,S=_.MEDIUM){super(i),this.name=this.constructor.name,this.type=m,this.severity=S,this.timestamp=new Date().toISOString(),this.id=`${m}_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.stack=this.cleanStackTrace(this.stack)}cleanStackTrace(i){return i?i.split(`
`).filter(m=>!m.includes("node_modules")).join(`
`):""}}class xn extends Mt{constructor(i,m={}){super(i,Te.VALIDATION,_.MEDIUM),this.fields=m}}class Mn extends Mt{constructor(i,m=null){super(i,Te.AUTH,_.HIGH),this.code=m}}class Sn{constructor(){this.logs=[],this.maxLogs=100}log(i,m={}){const S={id:i.id||`err_${Date.now()}`,message:i.message,type:i.type||Te.UNKNOWN,severity:i.severity||_.MEDIUM,timestamp:i.timestamp||new Date().toISOString(),stack:i.stack,context:{...m,url:window.location.href,userAgent:navigator.userAgent,timestamp:new Date().toISOString()}};return this.logs.unshift(S),this.logs.length>this.maxLogs&&this.logs.pop(),this.logToConsole(S),S.severity===_.CRITICAL&&this.sendToExternalService(S),S}logToConsole(i){const m={[_.LOW]:"color: #666;",[_.MEDIUM]:"color: #f90;",[_.HIGH]:"color: #f00;",[_.CRITICAL]:"color: #f00; font-weight: bold;"},S={[_.LOW]:"ℹ️",[_.MEDIUM]:"⚠️",[_.HIGH]:"🚨",[_.CRITICAL]:"💀"};console.group(`${S[i.severity]} Error: ${i.type}`),console.log(`%c${i.message}`,m[i.severity]),console.log("Context:",i.context),i.stack&&console.log("Stack:",i.stack),console.groupEnd()}async sendToExternalService(i){console.warn("External error logging not implemented")}getRecentErrors(i=10){return this.logs.slice(0,i)}clearLogs(){this.logs=[]}}const yn=new Sn;function Nn(u,i="error-container",m=5e3){const S=u.message||"An unexpected error occurred",ie=u.severity||_.MEDIUM;yn.log(u);let p=document.getElementById(i);if(!p){p=document.createElement("div"),p.id=i,p.className="error-container";const $=document.querySelector("main")||document.body;$.insertBefore(p,$.firstChild)}const g=document.createElement("div");g.className=`error-message error-${ie}`,g.setAttribute("role","alert"),g.innerHTML=`
        <div class="error-content">
            <span class="error-icon">${bn(ie)}</span>
            <span class="error-text">${S}</span>
            <button class="error-close" 
                    onclick="this.parentElement.parentElement.remove()"
                    aria-label="Close error message">×</button>
        </div>
    `,p.appendChild(g),m>0&&setTimeout(()=>{g.parentNode&&g.remove()},m),Rn()}function bn(u){switch(u){case _.CRITICAL:return"💀";case _.HIGH:return"🚨";case _.MEDIUM:return"⚠️";case _.LOW:default:return"ℹ️"}}function Rn(){if(document.getElementById("error-handler-styles"))return;const u=`
        .error-container,
        .success-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .error-message,
        .success-message {
            margin-bottom: 10px;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        }

        .error-message {
            background: #fff;
            border-left: 4px solid #dc3545;
        }

        .success-message {
            background: #fff;
            border-left: 4px solid #28a745;
        }

        .error-content,
        .success-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .error-icon,
        .success-icon {
            font-size: 1.2em;
        }

        .error-text,
        .success-text {
            flex: 1;
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
        }

        .error-close,
        .success-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            opacity: 0.5;
            transition: opacity 0.2s;
        }

        .error-close:hover,
        .success-close:hover {
            opacity: 1;
        }

        .error-critical {
            background: #fff0f0;
            border-color: #dc3545;
        }

        .error-high {
            background: #fff3f3;
            border-color: #ff4444;
        }

        .error-medium {
            background: #fff9f0;
            border-color: #ffa500;
        }

        .error-low {
            background: #f8f9fa;
            border-color: #6c757d;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 480px) {
            .error-container,
            .success-container {
                top: auto;
                bottom: 0;
                left: 0;
                right: 0;
                max-width: 100%;
            }

            .error-message,
            .success-message {
                margin: 0;
                border-radius: 0;
                border-left: none;
                border-top: 4px solid;
            }
        }
    `,i=document.createElement("style");i.id="error-handler-styles",i.textContent=u,document.head.appendChild(i)}function On(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */var Ge,Lt;function Dt(){if(Lt)return Ge;Lt=1;const{entries:u,setPrototypeOf:i,isFrozen:m,getPrototypeOf:S,getOwnPropertyDescriptor:ie}=Object;let{freeze:p,seal:g,create:$}=Object,{apply:_e,construct:Ae}=typeof Reflect<"u"&&Reflect;p||(p=function(o){return o}),g||(g=function(o){return o}),_e||(_e=function(o,c,l){return o.apply(c,l)}),Ae||(Ae=function(o,c){return new o(...c)});const ae=I(Array.prototype.forEach),wt=I(Array.prototype.lastIndexOf),Ye=I(Array.prototype.pop),j=I(Array.prototype.push),Ct=I(Array.prototype.splice),se=I(String.prototype.toLowerCase),Se=I(String.prototype.toString),Xe=I(String.prototype.match),V=I(String.prototype.replace),kt=I(String.prototype.indexOf),vt=I(String.prototype.trim),M=I(Object.prototype.hasOwnProperty),O=I(RegExp.prototype.test),q=Pt(TypeError);function I(s){return function(o){o instanceof RegExp&&(o.lastIndex=0);for(var c=arguments.length,l=new Array(c>1?c-1:0),y=1;y<c;y++)l[y-1]=arguments[y];return _e(s,o,l)}}function Pt(s){return function(){for(var o=arguments.length,c=new Array(o),l=0;l<o;l++)c[l]=arguments[l];return Ae(s,c)}}function a(s,o){let c=arguments.length>2&&arguments[2]!==void 0?arguments[2]:se;i&&i(s,null);let l=o.length;for(;l--;){let y=o[l];if(typeof y=="string"){const C=c(y);C!==y&&(m(o)||(o[l]=C),y=C)}s[y]=!0}return s}function Ut(s){for(let o=0;o<s.length;o++)M(s,o)||(s[o]=null);return s}function w(s){const o=$(null);for(const[c,l]of u(s))M(s,c)&&(Array.isArray(l)?o[c]=Ut(l):l&&typeof l=="object"&&l.constructor===Object?o[c]=w(l):o[c]=l);return o}function K(s,o){for(;s!==null;){const l=ie(s,o);if(l){if(l.get)return I(l.get);if(typeof l.value=="function")return I(l.value)}s=S(s)}function c(){return null}return c}const $e=p(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ye=p(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),be=p(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ft=p(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Re=p(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ht=p(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),je=p(["#text"]),Ve=p(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Oe=p(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),qe=p(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),le=p(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),zt=g(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Wt=g(/<%[\w\W]*|[\w\W]*%>/gm),Gt=g(/\$\{[\w\W]*/gm),Bt=g(/^data-[\-\w.\u00B7-\uFFFF]+$/),Yt=g(/^aria-[\-\w]+$/),Ke=g(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Xt=g(/^(?:\w+script|data):/i),$t=g(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ze=g(/^html$/i),jt=g(/^[a-z][.\w]*(-[.\w]+)+$/i);var Je=Object.freeze({__proto__:null,ARIA_ATTR:Yt,ATTR_WHITESPACE:$t,CUSTOM_ELEMENT:jt,DATA_ATTR:Bt,DOCTYPE_NAME:Ze,ERB_EXPR:Wt,IS_ALLOWED_URI:Ke,IS_SCRIPT_OR_DATA:Xt,MUSTACHE_EXPR:zt,TMPLIT_EXPR:Gt});const Z={element:1,text:3,progressingInstruction:7,comment:8,document:9},Vt=function(){return typeof window>"u"?null:window},qt=function(o,c){if(typeof o!="object"||typeof o.createPolicy!="function")return null;let l=null;const y="data-tt-policy-suffix";c&&c.hasAttribute(y)&&(l=c.getAttribute(y));const C="dompurify"+(l?"#"+l:"");try{return o.createPolicy(C,{createHTML(F){return F},createScriptURL(F){return F}})}catch{return console.warn("TrustedTypes policy "+C+" could not be created."),null}},Qe=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function et(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Vt();const o=r=>et(r);if(o.version="3.2.6",o.removed=[],!s||!s.document||s.document.nodeType!==Z.document||!s.Element)return o.isSupported=!1,o;let{document:c}=s;const l=c,y=l.currentScript,{DocumentFragment:C,HTMLTemplateElement:F,Node:Ie,Element:tt,NodeFilter:J,NamedNodeMap:Zt=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:Jt,DOMParser:Qt,trustedTypes:ce}=s,Q=tt.prototype,en=K(Q,"cloneNode"),tn=K(Q,"remove"),nn=K(Q,"nextSibling"),on=K(Q,"childNodes"),fe=K(Q,"parentNode");if(typeof F=="function"){const r=c.createElement("template");r.content&&r.content.ownerDocument&&(c=r.content.ownerDocument)}let L,ee="";const{implementation:Le,createNodeIterator:rn,createDocumentFragment:an,getElementsByTagName:sn}=c,{importNode:ln}=l;let D=Qe();o.isSupported=typeof u=="function"&&typeof fe=="function"&&Le&&Le.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:De,ERB_EXPR:xe,TMPLIT_EXPR:Me,DATA_ATTR:cn,ARIA_ATTR:fn,IS_SCRIPT_OR_DATA:un,ATTR_WHITESPACE:nt,CUSTOM_ELEMENT:mn}=Je;let{IS_ALLOWED_URI:ot}=Je,E=null;const rt=a({},[...$e,...ye,...be,...Re,...je]);let A=null;const it=a({},[...Ve,...Oe,...qe,...le]);let d=Object.seal($(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),te=null,Ne=null,at=!0,we=!0,st=!1,lt=!0,H=!1,ue=!0,U=!1,Ce=!1,ke=!1,z=!1,me=!1,pe=!1,ct=!0,ft=!1;const pn="user-content-";let ve=!0,ne=!1,W={},G=null;const ut=a({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let mt=null;const pt=a({},["audio","video","img","source","image","track"]);let Pe=null;const dt=a({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),de="http://www.w3.org/1998/Math/MathML",ge="http://www.w3.org/2000/svg",k="http://www.w3.org/1999/xhtml";let B=k,Ue=!1,Fe=null;const dn=a({},[de,ge,k],Se);let he=a({},["mi","mo","mn","ms","mtext"]),Ee=a({},["annotation-xml"]);const gn=a({},["title","style","font","a","script"]);let oe=null;const hn=["application/xhtml+xml","text/html"],En="text/html";let T=null,Y=null;const Tn=c.createElement("form"),gt=function(e){return e instanceof RegExp||e instanceof Function},He=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Y&&Y===e)){if((!e||typeof e!="object")&&(e={}),e=w(e),oe=hn.indexOf(e.PARSER_MEDIA_TYPE)===-1?En:e.PARSER_MEDIA_TYPE,T=oe==="application/xhtml+xml"?Se:se,E=M(e,"ALLOWED_TAGS")?a({},e.ALLOWED_TAGS,T):rt,A=M(e,"ALLOWED_ATTR")?a({},e.ALLOWED_ATTR,T):it,Fe=M(e,"ALLOWED_NAMESPACES")?a({},e.ALLOWED_NAMESPACES,Se):dn,Pe=M(e,"ADD_URI_SAFE_ATTR")?a(w(dt),e.ADD_URI_SAFE_ATTR,T):dt,mt=M(e,"ADD_DATA_URI_TAGS")?a(w(pt),e.ADD_DATA_URI_TAGS,T):pt,G=M(e,"FORBID_CONTENTS")?a({},e.FORBID_CONTENTS,T):ut,te=M(e,"FORBID_TAGS")?a({},e.FORBID_TAGS,T):w({}),Ne=M(e,"FORBID_ATTR")?a({},e.FORBID_ATTR,T):w({}),W=M(e,"USE_PROFILES")?e.USE_PROFILES:!1,at=e.ALLOW_ARIA_ATTR!==!1,we=e.ALLOW_DATA_ATTR!==!1,st=e.ALLOW_UNKNOWN_PROTOCOLS||!1,lt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,H=e.SAFE_FOR_TEMPLATES||!1,ue=e.SAFE_FOR_XML!==!1,U=e.WHOLE_DOCUMENT||!1,z=e.RETURN_DOM||!1,me=e.RETURN_DOM_FRAGMENT||!1,pe=e.RETURN_TRUSTED_TYPE||!1,ke=e.FORCE_BODY||!1,ct=e.SANITIZE_DOM!==!1,ft=e.SANITIZE_NAMED_PROPS||!1,ve=e.KEEP_CONTENT!==!1,ne=e.IN_PLACE||!1,ot=e.ALLOWED_URI_REGEXP||Ke,B=e.NAMESPACE||k,he=e.MATHML_TEXT_INTEGRATION_POINTS||he,Ee=e.HTML_INTEGRATION_POINTS||Ee,d=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&gt(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(d.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&gt(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(d.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(d.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),H&&(we=!1),me&&(z=!0),W&&(E=a({},je),A=[],W.html===!0&&(a(E,$e),a(A,Ve)),W.svg===!0&&(a(E,ye),a(A,Oe),a(A,le)),W.svgFilters===!0&&(a(E,be),a(A,Oe),a(A,le)),W.mathMl===!0&&(a(E,Re),a(A,qe),a(A,le))),e.ADD_TAGS&&(E===rt&&(E=w(E)),a(E,e.ADD_TAGS,T)),e.ADD_ATTR&&(A===it&&(A=w(A)),a(A,e.ADD_ATTR,T)),e.ADD_URI_SAFE_ATTR&&a(Pe,e.ADD_URI_SAFE_ATTR,T),e.FORBID_CONTENTS&&(G===ut&&(G=w(G)),a(G,e.FORBID_CONTENTS,T)),ve&&(E["#text"]=!0),U&&a(E,["html","head","body"]),E.table&&(a(E,["tbody"]),delete te.tbody),e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!="function")throw q('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw q('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');L=e.TRUSTED_TYPES_POLICY,ee=L.createHTML("")}else L===void 0&&(L=qt(ce,y)),L!==null&&typeof ee=="string"&&(ee=L.createHTML(""));p&&p(e),Y=e}},ht=a({},[...ye,...be,...Ft]),Et=a({},[...Re,...Ht]),_n=function(e){let t=fe(e);(!t||!t.tagName)&&(t={namespaceURI:B,tagName:"template"});const n=se(e.tagName),f=se(t.tagName);return Fe[e.namespaceURI]?e.namespaceURI===ge?t.namespaceURI===k?n==="svg":t.namespaceURI===de?n==="svg"&&(f==="annotation-xml"||he[f]):!!ht[n]:e.namespaceURI===de?t.namespaceURI===k?n==="math":t.namespaceURI===ge?n==="math"&&Ee[f]:!!Et[n]:e.namespaceURI===k?t.namespaceURI===ge&&!Ee[f]||t.namespaceURI===de&&!he[f]?!1:!Et[n]&&(gn[n]||!ht[n]):!!(oe==="application/xhtml+xml"&&Fe[e.namespaceURI]):!1},N=function(e){j(o.removed,{element:e});try{fe(e).removeChild(e)}catch{tn(e)}},X=function(e,t){try{j(o.removed,{attribute:t.getAttributeNode(e),from:t})}catch{j(o.removed,{attribute:null,from:t})}if(t.removeAttribute(e),e==="is")if(z||me)try{N(t)}catch{}else try{t.setAttribute(e,"")}catch{}},Tt=function(e){let t=null,n=null;if(ke)e="<remove></remove>"+e;else{const h=Xe(e,/^[\r\n\t ]+/);n=h&&h[0]}oe==="application/xhtml+xml"&&B===k&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const f=L?L.createHTML(e):e;if(B===k)try{t=new Qt().parseFromString(f,oe)}catch{}if(!t||!t.documentElement){t=Le.createDocument(B,"template",null);try{t.documentElement.innerHTML=Ue?ee:f}catch{}}const b=t.body||t.documentElement;return e&&n&&b.insertBefore(c.createTextNode(n),b.childNodes[0]||null),B===k?sn.call(t,U?"html":"body")[0]:U?t.documentElement:b},_t=function(e){return rn.call(e.ownerDocument||e,e,J.SHOW_ELEMENT|J.SHOW_COMMENT|J.SHOW_TEXT|J.SHOW_PROCESSING_INSTRUCTION|J.SHOW_CDATA_SECTION,null)},ze=function(e){return e instanceof Jt&&(typeof e.nodeName!="string"||typeof e.textContent!="string"||typeof e.removeChild!="function"||!(e.attributes instanceof Zt)||typeof e.removeAttribute!="function"||typeof e.setAttribute!="function"||typeof e.namespaceURI!="string"||typeof e.insertBefore!="function"||typeof e.hasChildNodes!="function")},At=function(e){return typeof Ie=="function"&&e instanceof Ie};function v(r,e,t){ae(r,n=>{n.call(o,e,t,Y)})}const St=function(e){let t=null;if(v(D.beforeSanitizeElements,e,null),ze(e))return N(e),!0;const n=T(e.nodeName);if(v(D.uponSanitizeElement,e,{tagName:n,allowedTags:E}),ue&&e.hasChildNodes()&&!At(e.firstElementChild)&&O(/<[/\w!]/g,e.innerHTML)&&O(/<[/\w!]/g,e.textContent)||e.nodeType===Z.progressingInstruction||ue&&e.nodeType===Z.comment&&O(/<[/\w]/g,e.data))return N(e),!0;if(!E[n]||te[n]){if(!te[n]&&bt(n)&&(d.tagNameCheck instanceof RegExp&&O(d.tagNameCheck,n)||d.tagNameCheck instanceof Function&&d.tagNameCheck(n)))return!1;if(ve&&!G[n]){const f=fe(e)||e.parentNode,b=on(e)||e.childNodes;if(b&&f){const h=b.length;for(let x=h-1;x>=0;--x){const P=en(b[x],!0);P.__removalCount=(e.__removalCount||0)+1,f.insertBefore(P,nn(e))}}}return N(e),!0}return e instanceof tt&&!_n(e)||(n==="noscript"||n==="noembed"||n==="noframes")&&O(/<\/no(script|embed|frames)/i,e.innerHTML)?(N(e),!0):(H&&e.nodeType===Z.text&&(t=e.textContent,ae([De,xe,Me],f=>{t=V(t,f," ")}),e.textContent!==t&&(j(o.removed,{element:e.cloneNode()}),e.textContent=t)),v(D.afterSanitizeElements,e,null),!1)},yt=function(e,t,n){if(ct&&(t==="id"||t==="name")&&(n in c||n in Tn))return!1;if(!(we&&!Ne[t]&&O(cn,t))){if(!(at&&O(fn,t))){if(!A[t]||Ne[t]){if(!(bt(e)&&(d.tagNameCheck instanceof RegExp&&O(d.tagNameCheck,e)||d.tagNameCheck instanceof Function&&d.tagNameCheck(e))&&(d.attributeNameCheck instanceof RegExp&&O(d.attributeNameCheck,t)||d.attributeNameCheck instanceof Function&&d.attributeNameCheck(t))||t==="is"&&d.allowCustomizedBuiltInElements&&(d.tagNameCheck instanceof RegExp&&O(d.tagNameCheck,n)||d.tagNameCheck instanceof Function&&d.tagNameCheck(n))))return!1}else if(!Pe[t]){if(!O(ot,V(n,nt,""))){if(!((t==="src"||t==="xlink:href"||t==="href")&&e!=="script"&&kt(n,"data:")===0&&mt[e])){if(!(st&&!O(un,V(n,nt,"")))){if(n)return!1}}}}}}return!0},bt=function(e){return e!=="annotation-xml"&&Xe(e,mn)},Rt=function(e){v(D.beforeSanitizeAttributes,e,null);const{attributes:t}=e;if(!t||ze(e))return;const n={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:A,forceKeepAttr:void 0};let f=t.length;for(;f--;){const b=t[f],{name:h,namespaceURI:x,value:P}=b,re=T(h),We=P;let R=h==="value"?We:vt(We);if(n.attrName=re,n.attrValue=R,n.keepAttr=!0,n.forceKeepAttr=void 0,v(D.uponSanitizeAttribute,e,n),R=n.attrValue,ft&&(re==="id"||re==="name")&&(X(h,e),R=pn+R),ue&&O(/((--!?|])>)|<\/(style|title)/i,R)){X(h,e);continue}if(n.forceKeepAttr)continue;if(!n.keepAttr){X(h,e);continue}if(!lt&&O(/\/>/i,R)){X(h,e);continue}H&&ae([De,xe,Me],It=>{R=V(R,It," ")});const Ot=T(e.nodeName);if(!yt(Ot,re,R)){X(h,e);continue}if(L&&typeof ce=="object"&&typeof ce.getAttributeType=="function"&&!x)switch(ce.getAttributeType(Ot,re)){case"TrustedHTML":{R=L.createHTML(R);break}case"TrustedScriptURL":{R=L.createScriptURL(R);break}}if(R!==We)try{x?e.setAttributeNS(x,h,R):e.setAttribute(h,R),ze(e)?N(e):Ye(o.removed)}catch{X(h,e)}}v(D.afterSanitizeAttributes,e,null)},An=function r(e){let t=null;const n=_t(e);for(v(D.beforeSanitizeShadowDOM,e,null);t=n.nextNode();)v(D.uponSanitizeShadowNode,t,null),St(t),Rt(t),t.content instanceof C&&r(t.content);v(D.afterSanitizeShadowDOM,e,null)};return o.sanitize=function(r){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=null,n=null,f=null,b=null;if(Ue=!r,Ue&&(r="<!-->"),typeof r!="string"&&!At(r))if(typeof r.toString=="function"){if(r=r.toString(),typeof r!="string")throw q("dirty is not a string, aborting")}else throw q("toString is not a function");if(!o.isSupported)return r;if(Ce||He(e),o.removed=[],typeof r=="string"&&(ne=!1),ne){if(r.nodeName){const P=T(r.nodeName);if(!E[P]||te[P])throw q("root node is forbidden and cannot be sanitized in-place")}}else if(r instanceof Ie)t=Tt("<!---->"),n=t.ownerDocument.importNode(r,!0),n.nodeType===Z.element&&n.nodeName==="BODY"||n.nodeName==="HTML"?t=n:t.appendChild(n);else{if(!z&&!H&&!U&&r.indexOf("<")===-1)return L&&pe?L.createHTML(r):r;if(t=Tt(r),!t)return z?null:pe?ee:""}t&&ke&&N(t.firstChild);const h=_t(ne?r:t);for(;f=h.nextNode();)St(f),Rt(f),f.content instanceof C&&An(f.content);if(ne)return r;if(z){if(me)for(b=an.call(t.ownerDocument);t.firstChild;)b.appendChild(t.firstChild);else b=t;return(A.shadowroot||A.shadowrootmode)&&(b=ln.call(l,b,!0)),b}let x=U?t.outerHTML:t.innerHTML;return U&&E["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&O(Ze,t.ownerDocument.doctype.name)&&(x="<!DOCTYPE "+t.ownerDocument.doctype.name+`>
`+x),H&&ae([De,xe,Me],P=>{x=V(x,P," ")}),L&&pe?L.createHTML(x):x},o.setConfig=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};He(r),Ce=!0},o.clearConfig=function(){Y=null,Ce=!1},o.isValidAttribute=function(r,e,t){Y||He({});const n=T(r),f=T(e);return yt(n,f,t)},o.addHook=function(r,e){typeof e=="function"&&j(D[r],e)},o.removeHook=function(r,e){if(e!==void 0){const t=wt(D[r],e);return t===-1?void 0:Ct(D[r],t,1)[0]}return Ye(D[r])},o.removeHooks=function(r){D[r]=[]},o.removeAllHooks=function(){D=Qe()},o}var Kt=et();return Ge=Kt,Ge}var Be,xt;function In(){return xt||(xt=1,Be=window.DOMPurify||(window.DOMPurify=Dt().default||Dt())),Be}var Ln=In();const wn=On(Ln);function Cn(u,i="info"){const m=document.createElement("div");m.className=`auth-feedback ${i}`,m.textContent=u;const S=document.querySelector(".auth-feedback");S&&S.remove(),document.body.appendChild(m),setTimeout(()=>{m.remove()},5e3)}const Nt=document.createElement("style");Nt.textContent=`
    .auth-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 4px;
        z-index: 1000;
        animation: slidein 0.3s ease-in-out;
    }
    
    .auth-feedback.success {
        background: #4CAF50;
        color: white;
    }
    
    .auth-feedback.error {
        background: #f44336;
        color: white;
    }
    
    .auth-feedback.warning {
        background: #ff9800;
        color: white;
    }
    
    .auth-feedback.info {
        background: #2196F3;
        color: white;
    }
    
    .session-warning-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .session-warning-modal .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 4px;
        text-align: center;
    }
    
    @keyframes slidein {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;document.head.appendChild(Nt);export{Mn as A,wn as D,_ as E,xn as V,Cn as a,On as g,Nn as s};

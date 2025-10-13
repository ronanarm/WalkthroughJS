'use strict';function $(s){return s<.5?2*s*s:-1+(4-2*s)*s}function m(s,t){let e;return function(...o){e||(s.apply(this,o),e=true,setTimeout(()=>e=false,t));}}function g(s,t){let e=s[0]==="#",o=e?s.slice(1):s,i=parseInt(o,16),n=(i>>16)+t,r=(i>>8&255)+t,p=(i&255)+t;return n=n>255?255:n<0?0:n,r=r>255?255:r<0?0:r,p=p>255?255:p<0?0:p,(e?"#":"")+(n<<16|r<<8|p).toString(16).padStart(6,"0")}function f(s,t,e){let o=new Date;o.setDate(o.getDate()+e),document.cookie=`${s}=${t};expires=${o.toUTCString()};path=/`;}function w(s){let t=document.cookie.split(";");for(let e of t){let[o,i]=e.trim().split("=");if(o===s)return i}return null}function b(s){document.cookie=`${s}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;}function v(s,t,e,o){let i=s.getBoundingClientRect();if(i.top>=0&&i.bottom<=window.innerHeight){o();return}let n=window.pageYOffset+i.top-t,r=window.pageYOffset,p=n-r,a,h=u=>{a||(a=u);let d=u-a,c=Math.min(d/e,1);window.scrollTo(0,r+p*$(c)),d<e?requestAnimationFrame(h):o();};requestAnimationFrame(h);}function k(s){return `
    .wt-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: ${s.zIndex};
      opacity: 0;
      visibility: hidden;
      transition: opacity ${s.animationDuration}ms ease;
      pointer-events: none;
    }
    .wt-overlay.active {
      opacity: 1;
      visibility: visible;
      pointer-events: none;
    }
    .wt-highlight {
      position: absolute;
      border-radius: 8px;
      transition: all ${s.animationDuration}ms ease;
      box-shadow: 0 0 0 99999px ${s.overlayColor};
      background: transparent;
      pointer-events: none;
      z-index: ${s.zIndex};
    }
    .wt-popup {
      position: absolute;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: ${s.zIndex+1};
      max-width: ${s.popupWidth}px;
      opacity: 0;
      transform: scale(0.9);
      transition: all ${s.animationDuration}ms ease;
      pointer-events: auto;
    }
    .wt-popup.active {
      opacity: 1;
      transform: scale(1);
    }
    .wt-popup-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-color: transparent;
    }
    .wt-popup-arrow.top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 0 10px 10px 10px;
      border-bottom-color: white;
    }
    .wt-popup-arrow.bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px 10px 0 10px;
      border-top-color: white;
    }
    .wt-popup-arrow.left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-width: 10px 10px 10px 0;
      border-right-color: white;
    }
    .wt-popup-arrow.right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-width: 10px 0 10px 10px;
      border-left-color: white;
    }
    .wt-popup-content {
      padding: 24px;
    }
    .wt-popup-header {
      margin-bottom: 16px;
    }
    .wt-popup-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }
    .wt-popup-step-count {
      font-size: 12px;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .wt-popup-body {
      font-size: 15px;
      line-height: 1.6;
      color: #444;
      margin-bottom: 20px;
    }
    .wt-progress {
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .wt-progress-bar {
      height: 100%;
      background: ${s.progressColor};
      border-radius: 2px;
      transition: width ${s.animationDuration}ms ease;
    }
    .wt-popup-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .wt-btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }
    .wt-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .wt-btn:active {
      transform: translateY(0);
    }
    .wt-btn-skip {
      background: none;
      color: #666;
      padding: 10px;
    }
    .wt-btn-skip:hover {
      color: #333;
      background: rgba(0,0,0,0.05);
    }
    .wt-btn-prev {
      background: #f5f5f5;
      color: #666;
      border: 1px solid #ddd;
    }
    .wt-btn-prev:hover {
      background: #e8e8e8;
    }
    .wt-btn-next, .wt-btn-finish {
      background: ${s.progressColor};
      color: white;
    }
    .wt-btn-next:hover, .wt-btn-finish:hover {
      background: ${g(s.progressColor,-20)};
    }
    .wt-btn-group {
      display: flex;
      gap: 12px;
    }
  `}var E={overlayColor:"rgba(0, 0, 0, 0.5)",highlightPadding:10,animationDuration:300,scrollDuration:500,scrollOffset:100,zIndex:99999,popupWidth:380,popupOffset:15,popupClass:"wt-popup",showProgress:true,progressColor:"#4CAF50",showButtons:true,showSkip:true,skipText:"Skip",prevText:"\u2190 Previous",nextText:"Next \u2192",finishText:"Finish",keyboard:true,escapeToExit:true,arrowNavigation:true,cookieName:"walkthrough_progress",cookieExpiry:30,rememberProgress:false,closeOnOverlay:true,autoStart:false,startDelay:0,attributePrefix:"wt",stepAttribute:"step",titleAttribute:"title",textAttribute:"text",positionAttribute:"position"},l=class{constructor(t={}){this.steps=[];this.currentStep=0;this.isActive=false;this.callbacks={};this.templates={};this.options={...E,...t},this.init();}init(){this.createElements(),this.bindEvents(),this.options.autoStart&&setTimeout(()=>{this.scanForAttributeSteps(),this.steps.length>0&&this.start();},this.options.startDelay);}createElements(){let t=document.createElement("div");t.className="wt-overlay";let e=document.createElement("style");e.textContent=k(this.options),t.appendChild(e);let o=document.createElement("div");o.className="wt-highlight";let i=document.createElement("div");i.className=this.options.popupClass,t.appendChild(o),t.appendChild(i),document.body.appendChild(t),this.elements={overlay:t,highlight:o,popup:i};}bindEvents(){this.options.closeOnOverlay&&this.elements.overlay.addEventListener("click",t=>{t.target===this.elements.overlay&&this.end();}),this.options.keyboard&&(this.keyHandler=t=>{this.isActive&&(this.options.escapeToExit&&t.key==="Escape"?this.end():this.options.arrowNavigation&&(t.key==="ArrowRight"||t.key==="Enter"?this.next():t.key==="ArrowLeft"&&this.prev()));},document.addEventListener("keydown",this.keyHandler)),this.positionHandler=()=>{this.isActive&&this.currentStep<this.steps.length&&this.positionElements();},this.throttledPositionHandler=m(this.positionHandler,100),window.addEventListener("resize",this.throttledPositionHandler),window.addEventListener("scroll",this.throttledPositionHandler,true);}scanForAttributeSteps(){let t=this.options.attributePrefix,e=`data-${t}-${this.options.stepAttribute}`,o=document.querySelectorAll(`[${e}]`),i=Array.from(o).map(n=>{let r=parseInt(n.getAttribute(e)||"0",10),p=n.getAttribute(`data-${t}-${this.options.titleAttribute}`)||void 0,a=n.getAttribute(`data-${t}-${this.options.textAttribute}`)||void 0,h=n.getAttribute(`data-${t}-${this.options.positionAttribute}`)||void 0;return {element:n,step:r,title:p,text:a,position:h}});i.sort((n,r)=>(n.step||0)-(r.step||0)),this.steps=i;}configure(t){t.steps&&(this.steps=t.steps.map(e=>{if(typeof e.element=="string"){let o=document.querySelector(e.element);if(!o)throw new Error(`Element not found: ${e.element}`);return {...e,element:o}}return e})),t.options&&(this.options={...this.options,...t.options}),t.callbacks&&(this.callbacks={...this.callbacks,...t.callbacks}),t.templates&&(this.templates={...this.templates,...t.templates});}start(t){if(this.steps.length===0){console.warn("Walkthrough: No steps configured");return}this.elements.overlay.style.height=`${document.documentElement.scrollHeight}px`,t==null&&(this.options.rememberProgress?t=this.loadProgress():t=0),this.currentStep=t,this.isActive=true,this.triggerCallback("onStart"),this.elements.overlay.classList.add("active"),setTimeout(()=>{this.showStep(this.currentStep);},50);}showStep(t){if(t<0||t>=this.steps.length)return;this.elements.popup.classList.remove("active");let e=this.steps[t];this.currentStep=t,this.options.rememberProgress&&this.saveProgress(t),this.triggerCallback("onStep",e,t);let o=typeof e.element=="string"?document.querySelector(e.element):e.element;o&&v(o,this.options.scrollOffset,this.options.scrollDuration,()=>{this.positionElements(),this.updatePopup(e,t),setTimeout(()=>{this.elements.popup.classList.add("active");},50);});}positionElements(){let t=this.steps[this.currentStep];if(!t)return;let e=typeof t.element=="string"?document.querySelector(t.element):t.element;if(!e)return;this.elements.overlay.style.height=`${document.documentElement.scrollHeight}px`;let o=e.getBoundingClientRect(),i=this.options.highlightPadding,n=window.pageYOffset||document.documentElement.scrollTop,r=window.pageXOffset||document.documentElement.scrollLeft,p=this.elements.highlight;p.style.left=`${o.left+r-i}px`,p.style.top=`${o.top+n-i}px`,p.style.width=`${o.width+i*2}px`,p.style.height=`${o.height+i*2}px`,this.positionPopup(o,t.position);}positionPopup(t,e){let o=this.elements.popup;o.style.visibility="hidden",o.style.display="block";let i=o.getBoundingClientRect();o.style.visibility="",o.style.display="";let n=this.options.popupOffset,r=this.options.highlightPadding,p={width:window.innerWidth,height:window.innerHeight},a={bottom:{left:t.left+t.width/2-i.width/2,top:t.bottom+r+n,arrow:"top",fits:t.bottom+r+n+i.height<p.height},top:{left:t.left+t.width/2-i.width/2,top:t.top-r-n-i.height,arrow:"bottom",fits:t.top-r-n-i.height>0},right:{left:t.right+r+n,top:t.top+t.height/2-i.height/2,arrow:"left",fits:t.right+r+n+i.width<p.width},left:{left:t.left-r-n-i.width,top:t.top+t.height/2-i.height/2,arrow:"right",fits:t.left-r-n-i.width>0}},h=e&&a[e]?.fits?e:Object.keys(a).find(P=>a[P].fits)||"bottom",u=a[h],d=window.pageYOffset||document.documentElement.scrollTop,c=window.pageXOffset||document.documentElement.scrollLeft,x=Math.max(10,Math.min(u.left,p.width-i.width-10))+c,y=Math.max(10,Math.min(u.top,p.height-i.height-10))+d;o.style.left=`${x}px`,o.style.top=`${y}px`,this.updateArrow(u.arrow);}updateArrow(t){let e=this.elements.popup;e.querySelector(".wt-popup-arrow")?.remove();let i=document.createElement("div");i.className=`wt-popup-arrow ${t}`,e.appendChild(i);}updatePopup(t,e){let o=this.elements.popup,i=e===0,n=e===this.steps.length-1,r;this.templates.popup?r=this.templates.popup(t,e,this.steps.length):r=this.getDefaultPopupContent(t,e,i,n),o.innerHTML=r,this.bindPopupButtons();}getDefaultPopupContent(t,e,o,i){return `
      <div class="wt-popup-content">
        ${t.title||this.options.showProgress?`
          <div class="wt-popup-header">
            ${t.title?`<h3 class="wt-popup-title">${t.title}</h3>`:""}
            ${this.options.showProgress?`
              <div class="wt-popup-step-count">
                Step ${e+1} of ${this.steps.length}
              </div>
            `:""}
          </div>
        `:""}

        ${t.text?`
          <div class="wt-popup-body">
            ${t.text}
          </div>
        `:""}

        ${this.options.showProgress?`
          <div class="wt-progress">
            <div class="wt-progress-bar" style="width: ${(e+1)/this.steps.length*100}%"></div>
          </div>
        `:""}

        ${this.options.showButtons?`
          <div class="wt-popup-footer">
            ${this.options.showSkip?`
              <button class="wt-btn wt-btn-skip" data-wt-action="skip">
                ${t.skipText||this.options.skipText}
              </button>
            `:"<div></div>"}

            <div class="wt-btn-group">
              ${o?"":`
                <button class="wt-btn wt-btn-prev" data-wt-action="prev">
                  ${t.prevText||this.options.prevText}
                </button>
              `}

              <button class="wt-btn ${i?"wt-btn-finish":"wt-btn-next"}"
                      data-wt-action="${i?"finish":"next"}">
                ${i?t.finishText||this.options.finishText:t.nextText||this.options.nextText}
              </button>
            </div>
          </div>
        `:""}
      </div>
    `}bindPopupButtons(){this.elements.popup.querySelectorAll("[data-wt-action]").forEach(e=>{e.addEventListener("click",o=>{switch(o.currentTarget.getAttribute("data-wt-action")){case "skip":this.end();break;case "prev":this.prev();break;case "next":this.next();break;case "finish":this.finish();break}});});}next(){this.currentStep<this.steps.length-1?this.showStep(this.currentStep+1):this.finish();}prev(){this.currentStep>0&&this.showStep(this.currentStep-1);}finish(){this.triggerCallback("onFinish"),this.clearProgress(),this.end();}end(){this.isActive&&(this.isActive=false,this.triggerCallback("onEnd"),this.elements.popup.classList.remove("active"),setTimeout(()=>{this.elements.overlay.classList.remove("active");},this.options.animationDuration));}saveProgress(t){f(this.options.cookieName,t.toString(),this.options.cookieExpiry);}loadProgress(){let t=w(this.options.cookieName);return t&&parseInt(t,10)||0}clearProgress(){b(this.options.cookieName);}triggerCallback(t,...e){let o=this.callbacks[t];typeof o=="function"&&o(...e);}destroy(){this.keyHandler&&document.removeEventListener("keydown",this.keyHandler),this.throttledPositionHandler&&(window.removeEventListener("resize",this.throttledPositionHandler),window.removeEventListener("scroll",this.throttledPositionHandler,true)),this.elements.overlay?.remove(),this.steps=[],this.currentStep=0,this.isActive=false;}};var C={fromAttributes(s){let t=new l(s);return t.scanForAttributeSteps(),t},fromJSON(s){let t=new l(s.options);return t.configure(s),t},start(s,t){let e=new l(t);return e.configure({steps:s}),e.start(),e}};typeof window<"u"&&(window.Walkthrough=l,window.walkthrough=C);exports.Core=l;exports.walkthrough=C;//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
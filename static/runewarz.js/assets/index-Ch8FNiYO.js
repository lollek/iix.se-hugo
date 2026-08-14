(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[1,2,3,4,5,6];function t(e){return{cells:[...e.tiles.map(e=>({...e,ownerId:null})),...e.players.map(e=>({...e.start,color:null,ownerId:e.id}))],currentPlayerId:e.players[0].id,map:e,players:e.players.map(e=>({color:null,id:e.id}))}}function n(e,t,n){if(l(e,t,n))return[];let r=new Map(e.cells.map(e=>[d(e),e])),i=e.cells.filter(e=>e.ownerId===t),a=[],o=new Set;for(;i.length>0;){let e=i.shift();if(e!==void 0)for(let t of u(e,r)){let e=d(t);o.has(e)||(o.add(e),t.ownerId===null&&t.color===n&&(a.push(t),i.push(t)))}}return a}function r(t,r){return e.filter(e=>n(t,r,e).length>0)}function i(e){return e.currentPlayerId===1&&r(e,1).length>0&&e.players.filter(e=>e.id!==1).every(t=>r(e,t.id).length===0)}function a(e,t){let r=n(e,e.currentPlayerId,t);if(r.length===0)return e;let i=new Set(r.map(d));return{...e,cells:e.cells.map(t=>i.has(d(t))?{...t,ownerId:e.currentPlayerId}:t),players:e.players.map(n=>n.id===e.currentPlayerId?{...n,color:t}:n)}}function o(e){let t=e.players.findIndex(t=>t.id===e.currentPlayerId);for(let n=1;n<=e.players.length;n+=1){let i=e.players[(t+n)%e.players.length];if(r(e,i.id).length>0)return{...e,currentPlayerId:i.id}}return e}function s(e){return e.players.every(t=>r(e,t.id).length===0)}function c(e){return new Map(e.players.map(t=>[t.id,e.cells.filter(e=>e.ownerId===t.id).length]))}function l(e,t,n){return e.players.some(e=>e.id!==t&&e.color===n)}function u(e,t){return[t.get(d({x:e.x-1,y:e.y})),t.get(d({x:e.x+1,y:e.y})),t.get(d({x:e.x,y:e.y-1})),t.get(d({x:e.x,y:e.y+1}))].filter(e=>e!==void 0)}function d({x:e,y:t}){return`${e},${t}`}function f(t,r){let i=null,a=0;for(let o of e){let e=n(t,r,o).length;e>a&&(a=e,i=o)}return i}var p=class{listeners=new Set;map;snapshot;stuckEventId=0;constructor(e){this.map=e,this.snapshot={phase:`human`,previewColor:null,selectedColor:null,state:t(e),stuckEventId:0,stuckPlayerIds:[]}}getSnapshot(){return this.snapshot}subscribe(e){return this.listeners.add(e),e(this.snapshot),()=>this.listeners.delete(e)}selectColor(e){if(this.snapshot.phase!==`human`)return;let t=n(this.snapshot.state,1,e).length>0;this.update({...this.snapshot,previewColor:null,selectedColor:t?e:null})}previewColor(e){if(this.snapshot.phase!==`human`||e===this.snapshot.previewColor)return;let t=e!==null&&n(this.snapshot.state,1,e).length>0;this.update({...this.snapshot,previewColor:t?e:null})}captureSelectedColor(){let{selectedColor:e,state:t}=this.snapshot;if(this.snapshot.phase!==`human`||e===null)return;let n=a(t,e);n!==t&&(n=o(n),n=this.playComputerTurns(n),this.update(this.createTurnSnapshot(t,n,s(n)?`finished`:`human`)))}autoTake(){if(this.snapshot.phase!==`human`)return!1;let e=f(this.snapshot.state,1);if(e===null)return!1;let t=o(a(this.snapshot.state,e));return i(t)?(this.update(this.createTurnSnapshot(this.snapshot.state,t,`auto-taking`)),!0):(t=this.playComputerTurns(t),this.update(this.createTurnSnapshot(this.snapshot.state,t,s(t)?`finished`:`human`)),!1)}takeAutoStep(){if(this.snapshot.phase!==`human`&&this.snapshot.phase!==`auto-taking`||!i(this.snapshot.state))return!1;let e=f(this.snapshot.state,1);if(e===null)return!1;let t=o(a(this.snapshot.state,e));return i(t)?(this.update(this.createTurnSnapshot(this.snapshot.state,t,`auto-taking`)),!0):(t=this.playComputerTurns(t),this.update(this.createTurnSnapshot(this.snapshot.state,t,s(t)?`finished`:`human`)),!1)}restart(){this.update({phase:`human`,previewColor:null,selectedColor:null,state:t(this.map),stuckEventId:0,stuckPlayerIds:[]})}playComputerTurns(e){let t=e;for(;!s(t)&&t.currentPlayerId!==1;){let e=f(t,t.currentPlayerId);if(e===null)return o(t);t=o(a(t,e))}return t}createTurnSnapshot(e,t,n){let i=t.players.filter(n=>r(e,n.id).length>0&&r(t,n.id).length===0).map(e=>e.id);return i.length>0&&(this.stuckEventId+=1),{phase:n,previewColor:null,selectedColor:null,state:t,stuckEventId:this.stuckEventId,stuckPlayerIds:i}}update(e){this.snapshot=e;for(let t of this.listeners)t(e)}};function m(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function h(e){return Math.floor(e()*6+1)}var g=30,_=4,v=50;function ee(e,t,n){let r=[],i=[],a=t.replace(/\r/g,``).split(`
`),o=0;for(let[e,t]of a.entries())for(let[a,s]of[...t].entries())s===`#`?(i.push({color:h(n),x:a,y:e}),o=Math.max(o,a+1)):s===`@`&&(r.push({id:0,start:{x:a,y:e}}),o=Math.max(o,a+1));let s=a.reduce((e,t,n)=>/[#@]/.test(t)?n+1:e,0);if(o>v||s>g)throw Error(`Map "${e}" exceeds the ${v} x ${g} tile limit.`);if(r.length===0||r.length>_)throw Error(`Map "${e}" must contain between 1 and ${_} players.`);if(i.length===0)throw Error(`Map "${e}" must contain at least one tile.`);return{height:s,name:e,players:te(r,n).map((e,t)=>({id:t+1,start:e.start})),tiles:i,width:o}}function te(e,t){let n=[...e];for(let e=n.length-1;e>0;--e){let r=Math.floor(t()*(e+1));[n[e],n[r]]=[n[r],n[e]]}return n}var ne=[{name:`Square Duel`,source:`#################################################@
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
@#################################################`},{name:`Islands Duel`,source:`            #####   #####   #####
            #####   #####   #####
 @##########################################  
 #            #       #       #            #  
 #            #       #       #            #  
 #            #       #       #            #
#######    ####### ####### #######    #######
################## ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### ##################
#######    ####### ####### #######    #######
 #            #       #       #            #  
 #            #       #       #            #  
 #            #       #       #            #  
 ##########################################@  
            #####   #####   #####
            #####   #####   #####`},{name:`Square Four`,source:`@################################################@
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
##################################################
@################################################@`},{name:`Islands Four`,source:`            #####   #####   #####
            #####   #####   #####
 @#########################################@  
 #            #       #       #            #  
 #            #       #       #            #  
 #            #       #       #            #
#######    ####### ####### #######    #######
################## ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### #######    #######
#######    ####### ####### ##################
#######    ####### ####### #######    #######
 #            #       #       #            #  
 #            #       #       #            #  
 #            #       #       #            #  
 @#########################################@  
            #####   #####   #####
            #####   #####   #####`},{name:`Test Duel`,source:`################### ####################
################### ####################
################### ####################
################### ####################
###################################### #
################### #################  #
################### ################  ##
################### ###############  ###
################### ##############  ####
#######                         ## #####
####     ##########@##########     #####
#######  #####################  ########
#   ####################################
#######  #####################  ########
####     ##########@##########     #####
#######                         ## #####
################### ##############  ####
################### ###############  ###
################### ################  ##
################### #################  #
###################################### #
################### ####################
################### ####################
################### ####################
################### ####################`},{name:`World Map`,source:` # #############     #            ## 
    ### #### #########     #      #   ########  ##
##############  ######     ##### #################
########### ##  ##   ###  ########################
  ######### ###        ## ### ####################
   #####@#######       ###########################
    ##########         ####### ##### #############
    #########          ##      ## ############   #
     #######           ###################### ## #
      ###             #######################   ##
       ##             ############# ########      
        ###           #######@####  ### ###       
          #####       ###########    #   ##  #    
           #####      ### #######        @ ##     
           ############   ######         ######## 
           ########        ####           ##    ## 
            ######         ######            #### 
             #####         #### #           ######
             ####          ###  #           ######
             ###            ##              ######
            ###                                 ##
            ##                                    
            ##                                    
             #                                    
`},{name:`Bull's Eye `,source:`##############@##############
#############################
##            #            ##
##  #####################  ##
##  ##        #        ##  ##
##  ##  #############  ##  ##
##  ##  ##    #    ##  ##  ##
##  ##  ##  #####  ##  ##  ##
#############################
##  ##  ##  #####  ##  ##  ##
##  ##  ##    #    ##  ##  ##
##  ##  #############  ##  ##
##  ##        #        ##  ##
##  #####################  ##
##            #            ##
#############################
##############@##############`},{name:`Three Lanes Four`,source:`@#########   #########@
##########   ##########
##########   ##########
#####              #####
#####   ########## #####
#####   ########## #####
##########   ##########
##########   ##########
#####   ########## #####
#####   ########## #####
#####              #####
##########   ##########
##########   ##########
@#########   #########@`}];function y(e){let t=m(e);return ne.map(({name:e,source:n})=>ee(e,n,t))}var re={1:`#d9534f`,2:`#d89b32`,3:`#5e9d48`,4:`#278d9d`,5:`#3d6ca8`,6:`#9b5d78`};function b(e,t){let{state:i}=t,a=window.devicePixelRatio||1,o=(e.parentElement?.getBoundingClientRect().width??0)/i.map.width,s=o*i.map.width,l=o*i.map.height,u=e.getContext(`2d`);if(u===null||s===0)return;e.style.height=`${l}px`,e.style.width=`${s}px`,e.width=Math.round(s*a),e.height=Math.round(l*a),u.setTransform(a,0,0,a,0,0),u.fillStyle=`#162323`,u.fillRect(0,0,s,l);let d=new Set((t.previewColor??t.selectedColor)===null?[]:n(i,i.currentPlayerId,t.previewColor??t.selectedColor).map(k)),f=new Set(r(i,i.currentPlayerId).flatMap(e=>n(i,i.currentPlayerId,e).map(k))),p=c(i),m=(Math.sin(performance.now()/380)+1)/2;for(let e of i.cells){let t=e.x*o,n=e.y*o,r=d.has(k(e)),a=f.has(k(e)),s=e.ownerId===null?null:i.players.find(t=>t.id===e.ownerId)?.color??null;s===null?e.color===null?ie(u,t,n,o):C(u,t,n,o,e.color,a,r,m):C(u,t,n,o,s,a,r,m),e.ownerId!==null&&ae(u,t,n,o,e.ownerId)}let h=[...p.values()].reduce((e,t)=>e+t,0);e.setAttribute(`aria-label`,`${i.map.name} board with ${h} claimed runes`)}function x(e,t,n){let r=e.getBoundingClientRect(),i=Math.floor((n.x-r.left)/(r.width/t.map.width)),a=Math.floor((n.y-r.top)/(r.width/t.map.width));return t.cells.find(e=>e.x===i&&e.y===a)?.color??null}function S(e,t){let n=e.getContext(`2d`);if(n===null)return;let r=Math.min(e.width,e.height);n.clearRect(0,0,e.width,e.height),n.strokeStyle=`#fffbe9`,n.lineWidth=Math.max(1.5,r/12),n.beginPath(),T(n,0,0,r,t),n.stroke()}function C(e,t,n,r,i,a,o,s){if(a){let i=t+r/2,a=n+r/2,o=1.02+s*.08;e.save(),e.translate(i,a),e.scale(o,o),e.translate(-i,-a),e.filter=`saturate(${1.08+s*.42})`}w(e,t,n,r,re[i]),e.strokeStyle=a?`#fffbe9`:`rgba(255, 255, 255, 0.45)`,e.lineWidth=Math.max(1,r/18)*(a?1.2:1),e.beginPath(),T(e,t,n,r,i),e.stroke(),a&&e.restore(),o&&(e.strokeStyle=`#fff7c2`,e.lineWidth=Math.max(2,r/10),D(e,t+2,n+2,r-4,r-4,r*.1))}function ie(e,t,n,r){w(e,t,n,r,`#d6d2bd`)}function w(e,t,n,r,i){let a=Math.max(1,r*.055),o=r-a*2,s=Math.max(1,r*.13);e.fillStyle=i,E(e,t+a,n+a,o,o,s);let c=e.createLinearGradient(t,n,t,n+r);c.addColorStop(0,`rgba(255, 255, 255, 0.18)`),c.addColorStop(.46,`rgba(255, 255, 255, 0)`),c.addColorStop(1,`rgba(0, 0, 0, 0.16)`),e.fillStyle=c,E(e,t+a,n+a,o,o,s),e.strokeStyle=`rgba(0, 0, 0, 0.22)`,e.lineWidth=Math.max(1,r/24),D(e,t+a,n+a,o,o,s)}function T(e,t,n,r,i){let a=t+r*.25,o=t+r*.5,s=t+r*.75,c=n+r*.18,l=n+r*.5,u=n+r*.82;switch(i){case 1:e.moveTo(a,c),e.lineTo(a,u),e.moveTo(a,c+r*.1),e.lineTo(s,l-r*.12),e.moveTo(a,l),e.lineTo(s,l+r*.12);break;case 2:e.moveTo(a,c),e.lineTo(a,u),e.lineTo(s,c),e.lineTo(s,u);break;case 3:e.moveTo(a,c),e.lineTo(a,u),e.moveTo(a,c),e.lineTo(s,l),e.lineTo(a,l);break;case 4:e.moveTo(a,c),e.lineTo(a,u),e.moveTo(a,c+r*.12),e.lineTo(s,l-r*.12),e.moveTo(a,l-r*.05),e.lineTo(s,u-r*.08);break;case 5:e.moveTo(a,c),e.lineTo(a,u),e.moveTo(a,c),e.lineTo(s,l),e.lineTo(a,l),e.moveTo(o,l),e.lineTo(s,u);break;case 6:e.moveTo(o,c),e.lineTo(o,u),e.moveTo(o,l),e.lineTo(a,c+r*.2),e.moveTo(o,l),e.lineTo(s,c+r*.2),e.moveTo(o,l+r*.12),e.lineTo(a,u-r*.04),e.moveTo(o,l+r*.12),e.lineTo(s,u-r*.04)}}function ae(e,t,n,r,i){if(i===1){e.strokeStyle=`rgba(255, 251, 233, 0.72)`,e.lineWidth=Math.max(2,r/7),D(e,t+2,n+2,r-4,r-4,r*.1);return}e.strokeStyle=[`#f5f0dc`,`#4a5053`,`#686d6f`,`#7c7c78`][i-1]??`#ffffff`,e.lineWidth=Math.max(2,r/7),D(e,t+2,n+2,r-4,r-4,r*.1)}function E(e,t,n,r,i,a){O(e,t,n,r,i,a),e.fill()}function D(e,t,n,r,i,a){O(e,t,n,r,i,a),e.stroke()}function O(e,t,n,r,i,a){let o=Math.min(a,r/2,i/2);e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+r-o,n),e.quadraticCurveTo(t+r,n,t+r,n+o),e.lineTo(t+r,n+i-o),e.quadraticCurveTo(t+r,n+i,t+r-o,n+i),e.lineTo(t+o,n+i),e.quadraticCurveTo(t,n+i,t,n+i-o),e.lineTo(t,n+o),e.quadraticCurveTo(t,n,t+o,n),e.closePath()}function k({x:e,y:t}){return`${e},${t}`}var A=y(Q()),j=0,M=new p(A[j]);document.querySelector(`#app`).innerHTML=`
  <main class="game-shell">
    <header class="masthead">
      <p class="eyebrow">A rune-capture game</p>
      <h1>RuneWarz</h1>
      <div class="map-picker" aria-label="Choose a map">
        ${A.map((e,t)=>`<button class="map-button${t===0?` is-active`:``}" data-map="${t}" type="button">${e.name}</button>`).join(``)}
      </div>
    </header>
    <section class="game-layout" aria-label="RuneWarz game">
      <aside class="scoreboard" aria-label="Scores" id="scores"></aside>
      <div class="board-wrap">
        <canvas id="board" role="img"></canvas>
        <p class="player-intro" id="player-intro" aria-live="polite" hidden>You</p>
        <p class="turn-event" id="turn-event" aria-live="polite" hidden></p>
        <div class="victory-overlay" id="victory" aria-live="assertive" hidden></div>
      </div>
      <section class="command-deck" aria-label="Game controls">
        <p class="turn-status" id="status" aria-live="polite"></p>
        <div class="color-grid" id="colors" aria-label="Choose a rune color"></div>
        <div class="actions">
          <button class="auto-take-button" id="auto-take" type="button">Auto-take <kbd class="shortcut-key shortcut-key-wide">Space</kbd></button>
          <button class="capture-button" id="capture" type="button">Capture</button>
          <button class="icon-button" id="restart" type="button" aria-label="Restart game" title="Restart game">↻</button>
        </div>
      </section>
    </section>
  </main>
`;var N=document.querySelector(`#board`),P=document.querySelector(`#capture`),F=document.querySelector(`#auto-take`),I=document.querySelector(`#restart`),L=document.querySelector(`#colors`),R=document.querySelector(`#scores`),z=document.querySelector(`#status`),B=document.querySelector(`#player-intro`),V=document.querySelector(`#turn-event`),H=document.querySelector(`#victory`),U=[...document.querySelectorAll(`[data-map]`)],W=0,G,K;function q(t){let n=r(t.state,1);b(N,t),L.innerHTML=e.map(e=>oe(e,n.includes(e),t.selectedColor===e)).join(``),L.querySelectorAll(`[data-rune]`).forEach(e=>{S(e,Number(e.dataset.rune))}),P.disabled=t.selectedColor===null||t.phase!==`human`,F.disabled=t.phase!==`human`||n.length===0,I.disabled=t.phase===`auto-taking`,U.forEach(e=>{e.disabled=t.phase===`auto-taking`}),z.textContent=t.phase===`finished`?J(t):t.phase===`auto-taking`?`Taking runes...`:t.selectedColor===null?`Choose a rune color`:`Capture the highlighted runes`,R.innerHTML=t.state.players.map(e=>{let n=c(t.state).get(e.id)??0,i=r(t.state,e.id).length>0,a=t.stuckEventId!==W&&t.stuckPlayerIds.includes(e.id);return`<div class="score ${e.id===t.state.currentPlayerId?`is-current`:``}${a?` just-stuck`:``}"><div class="score-name"><span>${Y(e.id)}</span><small class="score-state ${i?`can-take`:`is-stuck`}">${i?`Can take`:`Stuck`}</small></div><strong>${n}</strong></div>`}).join(``),H.hidden=t.phase!==`finished`,t.phase===`finished`&&(H.innerHTML=`<p class="victory-kicker">The realm is settled</p><h2>${J(t)}</h2><div class="victory-scores">${se(t)}</div>`),ce(t)}function oe(e,t,n){return`<button class="color-button color-${e}${n?` is-selected`:``}" data-color="${e}" type="button" ${t?``:`disabled`} aria-label="Capture color ${e} with key ${e}"><canvas data-rune="${e}" width="28" height="28" aria-hidden="true"></canvas><span class="shortcut-key" aria-hidden="true">${e}</span></button>`}function J(e){let t=[...c(e.state).entries()].sort(([,e],[,t])=>t-e);return t[0][1]===t[1]?.[1]?`The runes are evenly divided`:t[0][0]===1?`You claim the realm`:`${Y(t[0][0])} claims the realm`}function se(e){return e.state.players.map(t=>{let n=c(e.state).get(t.id)??0;return`<span>${Y(t.id)} <strong>${n}</strong></span>`}).join(``)}function Y(e){return e===1?`You`:`Computer ${e-1}`}if(M.subscribe(q),$(M.getSnapshot()),!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){let e=()=>{b(N,M.getSnapshot()),window.requestAnimationFrame(e)};window.requestAnimationFrame(e)}L.addEventListener(`click`,e=>{let t=e.target.closest(`[data-color]`);t!==null&&M.selectColor(Number(t.dataset.color))}),P.addEventListener(`click`,()=>M.captureSelectedColor()),F.addEventListener(`click`,()=>{X()}),I.addEventListener(`click`,()=>Z(j)),U.forEach(e=>{e.addEventListener(`click`,()=>{j=Number(e.dataset.map),Z(j),document.querySelector(`.map-button.is-active`)?.classList.remove(`is-active`),e.classList.add(`is-active`)})}),N.addEventListener(`click`,e=>{let t=x(N,M.getSnapshot().state,{x:e.clientX,y:e.clientY});t!==null&&(M.selectColor(t),M.captureSelectedColor())}),N.addEventListener(`pointermove`,e=>{let t=x(N,M.getSnapshot().state,{x:e.clientX,y:e.clientY});M.previewColor(t)}),N.addEventListener(`pointerleave`,()=>M.previewColor(null)),window.addEventListener(`keydown`,t=>{let n=Number(t.key);e.includes(n)?(M.selectColor(n),M.captureSelectedColor()):t.key===`Enter`?M.captureSelectedColor():t.key===` `&&(t.preventDefault(),X())}),window.addEventListener(`resize`,()=>q(M.getSnapshot()));async function X(){let e=M,t=e.autoTake();for(;t&&M===e;)await new Promise(e=>window.setTimeout(e,180)),t=e.takeAutoStep()}function Z(e){A=y(Q()),M=new p(A[e]),M.subscribe(q),$(M.getSnapshot())}function Q(){let e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]}function $(e){let t=e.state.map.players.find(e=>e.id===1)?.start,n=N.getBoundingClientRect();if(t===void 0||n.width===0||n.height===0)return;let r=n.width/e.state.map.width,i=n.height/e.state.map.height,a=Math.min(Math.max(r*1.25,(t.x+.5)*r),n.width-r*1.25),o=t.y<2;B.style.left=`${a}px`,B.style.top=`${o?(t.y+1.15)*i:(t.y+.05)*i}px`,B.classList.toggle(`points-up`,o),B.hidden=!1,B.classList.remove(`is-visible`),B.offsetWidth,B.classList.add(`is-visible`),window.clearTimeout(G),G=window.setTimeout(()=>{B.hidden=!0},1800)}function ce(e){e.stuckEventId!==W&&e.stuckPlayerIds.length!==0&&(W=e.stuckEventId,V.textContent=`${e.stuckPlayerIds.map(Y).join(` and `)} stuck - turn skipped`,V.hidden=!1,V.classList.remove(`is-visible`),V.offsetWidth,V.classList.add(`is-visible`),window.clearTimeout(K),K=window.setTimeout(()=>{V.hidden=!0},1400))}
// 답변 카드: 자료를 받아 id가 k인 자리에 고르기 · 승인 카드를 그린다.
// 확정을 누르면 고른 내용을 글로 만들어 그 화면의 sendPrompt 함수에 넘긴다. 다른 곳으로 보내거나 저장하지 않는다.
// 자료: {tag, blocks}는 고르기 · 승인 카드, {tag, q, a}는 하나만 고르는 간단한 카드.
(()=>{
const CARD={css:`
.k{font-size:13.5px;line-height:1.4;color:var(--text-primary)}
.k .c{border:.5px solid var(--border);border-radius:14px;overflow:hidden}
.k .i{padding:9px 14px;border-bottom:.5px solid var(--border);display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:6px 8px}.k .i>.h,.k .o,.k details{grid-column:1/-1}.k .l{padding:16px 16px 18px;row-gap:14px}
.k .h{font-size:14.5px;font-weight:600}.k b{font-weight:600}.k .s{color:var(--text-secondary);font-size:12px;line-height:1.35}.k b,.k .h,.k .s,.k .n{overflow-wrap:anywhere}
.k .o{display:flex;gap:14px;align-items:center}.k .o>:first-child{flex:1;min-width:0}.k .o .s{margin-top:4px;font-size:12.5px}.k .g{display:flex;gap:8px}
.k [tabindex]{cursor:pointer;user-select:none}.k [tabindex]:focus-visible{outline:2px solid var(--text-accent);outline-offset:2px}
.k .x{display:flex;align-items:center;border:1px solid var(--border)}
.k .t{gap:6px;padding:5px 13px 5px 8px;font-size:13px;border-radius:99px;width:max-content}.k .p{gap:8px;padding:6px 10px;border-radius:10px}.k .p>:last-child{min-width:0}
.k .m{flex:none;width:17px;height:17px;border-radius:50%;border:1.5px solid var(--text-secondary);display:grid;place-items:center;font-size:11px;line-height:1;box-sizing:border-box;color:transparent}.k .many .m{border-radius:5px}
.k .on{background:var(--text-accent);border-color:var(--text-accent);color:var(--surface-1);font-weight:600}.k .on .m{background:var(--surface-1);border-color:var(--surface-1);color:var(--text-accent)}.k .on .s{color:var(--surface-1);font-weight:400}
.k.lock .x{cursor:default}.k.lock .x:not(.on){opacity:.5}
.k .q{font-size:12px;border:1px solid currentColor;border-radius:99px;padding:0 8px;margin-left:8px;font-weight:400;word-break:keep-all;overflow-wrap:anywhere}
.k details{margin-top:-6px}.k summary{cursor:pointer;font-size:12.5px;color:var(--text-accent);width:fit-content;overflow-wrap:anywhere}
.k .n{border-radius:10px;padding:8px 12px;margin-top:6px;font-size:13px;background:color-mix(in srgb,var(--text-primary) 6%,transparent)}.k .n.a{background:color-mix(in srgb,var(--text-danger) 8%,transparent)}.k .n.b{background:color-mix(in srgb,var(--text-success) 11%,transparent)}.k .n span{display:block;font-size:12px;color:var(--text-secondary)}
.k .z{padding:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}.k .z input{flex:1;min-width:160px;font:inherit;font-size:13px;box-sizing:border-box}
.k .go,.k .re{padding:8px 18px;border:1px solid var(--text-accent);border-radius:8px;font-weight:600}.k .go{background:var(--text-accent);color:var(--surface-1)}.k .go.ok{background:var(--text-success);border-color:var(--text-success);cursor:default}.k .re{color:var(--text-accent)}
.k .e{flex-basis:100%;font-weight:600}.k .e:empty{display:none}.k .bad{color:var(--text-danger)}.k .done{color:var(--text-success)}
@media(max-width:480px){.k .i{grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}.k .one,.k .w>.p{grid-column:1/-1}.k .o.w{flex-direction:column;align-items:stretch;gap:8px}.k .o .g{gap:5px}}
`,html:`<div class="c"><div id="L"></div><div class="z"><input id="memo" aria-label="의견" placeholder="의견 (없어도 됩니다)"><div class="go" id="go" role="button">확정</div><div class="re" id="re" role="button" hidden>다시 고르기</div><div class="e" id="msg" role="status"></div></div></div>`,draw(D){
const $=i=>document.getElementById(i),E=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n},Y=["승인","보류"],R=[];let lock=false,again=false;
const key=(e,f)=>{e.tabIndex=0;e.onclick=f;e.onkeydown=v=>{if(v.key==="Enter"||v.key===" "){v.preventDefault();f()}};return e};
const say=(t,c)=>{$("msg").textContent=t||"";$("msg").className="e "+(c||"")},hold=v=>{lock=v;$("k").classList.toggle("lock",v);$("memo").disabled=v;$("re").hidden=!v;$("go").textContent=v?"✓ 확정했습니다":"확정";$("go").classList.toggle("ok",v)};
const btn=(c,x,f,on)=>{const b=key(E("div","x "+c),()=>{if(lock)return say("확정한 카드입니다. 바꾸려면 다시 고르기를 눌러 주세요.","bad");f();say();R.forEach(g=>g())});b.setAttribute("role","button");b.append(E("div","m","✓"),typeof x==="string"?E("div","",x):x);const r=()=>{b.classList.toggle("on",on());b.setAttribute("aria-pressed",String(on()))};R.push(r);r();return b};
const fold=(t,list)=>{const d=E("details");d.append(E("summary","",t),...list);return d};
const far=(...a)=>a.join("").length>60;
const A=D.blocks.map(d=>{const r=E("div",d.t==="approve"?"i l":d.o.some(o=>far(o[0],o[2]))?"i w":"i"),st={d,v:d.t==="approve"?d.items.map(()=>""):[]},head=E("div","h",d.h);
if(d.t==="approve"){const all=()=>st.v.every(v=>v===Y[0]),top=E("div","o"),l=E("div");l.append(head,E("div","s",d.s));top.append(l,btn("t","모두 승인",()=>st.v.fill(all()?"":Y[0]),all));r.append(top);
d.items.forEach((x,i)=>{const o=E("div",far(x[0],x[1])?"o w":"o"),l=E("div"),g=E("div","g");l.append(E("b","",(i+1)+". "+x[0]),E("div","s",x[1]));g.append(...Y.map(k=>btn("t",k,()=>st.v[i]=st.v[i]===k?"":k,()=>st.v[i]===k)));o.append(l,g);r.append(o);
if(x[2])r.append(fold("문장 보기",x[2].flatMap(p=>[["지금 · "+p[0],p[1],"a"],["바꾼 뒤",p[2],"b"]].map(([n,t,c])=>{const e=E("div","n "+c);e.append(E("span","",n),document.createTextNode(t));return e}))))})}
else{r.append(head);d.o.forEach((o,k)=>{const c=E("div"),n=E("div");n.append(E("b","",o[0]));if(o[1])n.append(E("span","q",o[1]));c.append(n);if(o[2])c.append(E("div","s",o[2]));r.append(btn("p "+d.t,c,()=>{st.v=st.v.includes(k)?st.v.filter(z=>z!==k):d.t==="many"?[...st.v,k].sort((a,b)=>a-b):[k]},()=>st.v.includes(k)))})}
if(d.more)r.append(fold(d.more[0],d.more[1].map(t=>E("div","n",t))));$("L").append(r);return st});
$("memo").oninput=()=>say();
key($("re"),()=>{again=true;hold(false);say("입력 칸에 들어간 앞의 답을 지운 뒤, 다시 고르고 확정해 주세요.")});
key($("go"),()=>{if(lock)return;const m=$("memo").value.trim();if(!m&&!A.some(({v})=>v.some(z=>z!=="")))return say("아직 고른 것이 없습니다. 고르거나 의견을 적어 주세요.","bad");
const P=A.flatMap(({d,v})=>d.t==="approve"?[...Y,""].map(k=>[k||"안 고름",v.map((z,i)=>z===k?i+1:0).filter(Boolean).join(", ")]).filter(p=>p[1]).map(p=>d.id+" "+p[0]+": "+p[1]):[d.id+": "+(v.map(k=>d.o[k][0]).join(", ")||"안 고름")]);
if(m)P.push("의견: "+m);const t="["+D.tag+"] "+P.join(" / ");
if(typeof window.sendPrompt!=="function")return say("복사해서 답해 주세요: "+t);window.sendPrompt(t);hold(true);say(again?"입력 칸이 앞의 답 그대로면 입력 칸에서 직접 고쳐 주세요.":"입력 칸에 답이 들어갔습니다. 입력 칸에서 보내 주세요.","done")})
}};
const QUICK={css:`
.k{font-size:13.5px;line-height:1.4;color:var(--text-primary)}.k .h{font-size:14.5px;font-weight:600;margin-bottom:7px}
.k .g{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch}
.k .x{flex:1 1 130px;min-width:0;padding:6px 12px;border:1px solid var(--text-secondary);border-radius:10px;text-align:center}
.k [tabindex]{cursor:pointer;user-select:none}.k [tabindex]:focus-visible{outline:2px solid var(--text-accent);outline-offset:2px}
.k b{font-weight:600;font-size:14px}.k .s{font-size:12px;line-height:1.35;color:var(--text-secondary)}.k b,.k .h,.k .s{overflow-wrap:anywhere}
.k .on{background:var(--text-accent);border-color:var(--text-accent);color:var(--surface-1)}.k .on .s{color:var(--surface-1)}
.k.lock .x{cursor:default}.k.lock .x:not(.on){opacity:.5}
.k .z{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}
.k .go,.k .re{padding:8px 20px;border:1px solid var(--text-accent);border-radius:8px;font-weight:600}.k .go{background:var(--text-accent);color:var(--surface-1)}.k .go.ok{background:var(--text-success);border-color:var(--text-success);cursor:default}.k .re{color:var(--text-accent)}
.k .e{font-size:13px;font-weight:600}.k .bad{color:var(--text-danger)}.k .done{color:var(--text-success)}
`,html:`<div class="h" id="q"></div><div class="g" id="g"></div><div class="z"><div class="go" id="go" role="button">확정</div><div class="re" id="re" role="button" hidden>다시 고르기</div><div class="e" id="e" role="status"></div></div>`,draw(D){
const $=i=>document.getElementById(i);let on=-1,lock=false,again=false;$("q").textContent=D.q;
const key=(e,f)=>{e.tabIndex=0;e.onclick=f;e.onkeydown=v=>{if(v.key==="Enter"||v.key===" "){v.preventDefault();f()}}};
const say=(t,c)=>{$("e").textContent=t||"";$("e").className="e "+(c||"")},hold=v=>{lock=v;$("k").classList.toggle("lock",v);$("re").hidden=!v;$("go").textContent=v?"✓ 확정했습니다":"확정";$("go").classList.toggle("ok",v)};
const bs=D.a.map((a,k)=>{const b=document.createElement("div"),n=document.createElement("b"),s=document.createElement("div");b.className="x";b.setAttribute("role","button");s.className="s";s.textContent=a[1]||"";b.append(n,s);
key(b,()=>{if(lock)return say("확정했습니다. 바꾸려면 다시 고르기를 눌러 주세요.","bad");on=on===k?-1:k;say();draw()});$("g").append(b);return b});
const draw=()=>bs.forEach((b,k)=>{b.classList.toggle("on",k===on);b.setAttribute("aria-pressed",String(k===on));b.firstChild.textContent=(k===on?"✓ ":"")+D.a[k][0]});draw();
key($("re"),()=>{again=true;hold(false);say("입력 칸에 들어간 앞의 답을 지운 뒤, 다시 고르고 확정해 주세요.")});
key($("go"),()=>{if(lock)return;if(on<0)return say("먼저 하나를 골라 주세요.","bad");const t="["+D.tag+"] "+D.a[on][0];
if(typeof window.sendPrompt!=="function")return say("복사해서 답해 주세요: "+t);window.sendPrompt(t);hold(true);say(again?"입력 칸이 앞의 답 그대로면 입력 칸에서 직접 고쳐 주세요.":"입력 칸에 답이 들어갔습니다. 입력 칸에서 보내 주세요.","done")})
}};
window.answerCard=D=>{const k=document.getElementById("k"),T=D.blocks?CARD:QUICK,s=document.createElement("style");
s.textContent=T.css;k.before(s);k.className="k";k.innerHTML=T.html;
try{T.draw(D)}catch{s.remove();k.className="";k.textContent="카드를 그리지 못했습니다. 글로 답해 주세요."}};
})();

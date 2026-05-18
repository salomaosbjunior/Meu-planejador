import { useState, useRef, useEffect, useCallback } from "react";

// ─── Templates ────────────────────────────────────────────────────────────────
const consultoriaBase = [
  { time:"06:00",end:"06:30",label:"Acordar",icon:"🌅",category:"pessoal" },
  { time:"06:30",end:"07:00",label:"Higiene pessoal",icon:"🚿",category:"pessoal" },
  { time:"06:30",end:"07:00",label:"Leitura / Treino",icon:"📖",category:"pessoal" },
  { time:"07:00",end:"07:20",label:"Café da manhã em família",icon:"☕",category:"família" },
  { time:"07:30",end:"10:00",label:"1ª Reunião de consultoria",icon:"💼",category:"trabalho" },
  { time:"10:00",end:"12:30",label:"2ª Reunião de consultoria",icon:"💼",category:"trabalho" },
  { time:"12:30",end:"13:30",label:"Almoço + WhatsApp",icon:"🍽️",category:"pausa" },
  { time:"13:30",end:"16:00",label:"3ª Reunião de consultoria",icon:"💼",category:"trabalho" },
  { time:"16:00",end:"18:30",label:"4ª Reunião de consultoria",icon:"💼",category:"trabalho" },
  { time:"18:30",end:"19:00",label:"Finalizar demandas do dia",icon:"✅",category:"trabalho" },
  { time:"19:00",end:"21:00",label:"Chegar em casa · família",icon:"🏠",category:"família" },
  { time:"21:00",end:"21:30",label:"Revisar o dia",icon:"📓",category:"pessoal" },
  { time:"21:30",end:"22:00",label:"Tempo com a esposa",icon:"❤️",category:"família" },
  { time:"22:00",end:"22:30",label:"Dormir",icon:"🌙",category:"pessoal" },
];
const encontroBase = [
  { time:"06:00",end:"06:30",label:"Acordar",icon:"🌅",category:"pessoal" },
  { time:"06:30",end:"07:00",label:"Higiene pessoal + Café",icon:"🚿",category:"pessoal" },
  { time:"07:00",end:"12:00",label:"Encontro em grupo",icon:"👥",category:"trabalho" },
  { time:"12:00",end:"13:00",label:"Almoço",icon:"🍽️",category:"pausa" },
  { time:"13:00",end:"18:30",label:"Reuniões de consultoria",icon:"💼",category:"trabalho" },
  { time:"18:30",end:"19:00",label:"Finalizar demandas",icon:"✅",category:"trabalho" },
  { time:"19:00",end:"21:00",label:"Chegar em casa · família",icon:"🏠",category:"família" },
  { time:"21:00",end:"21:30",label:"Revisar o dia",icon:"📓",category:"pessoal" },
  { time:"21:30",end:"22:00",label:"Tempo com a esposa",icon:"❤️",category:"família" },
  { time:"22:00",end:"22:30",label:"Dormir",icon:"🌙",category:"pessoal" },
];
const sextaBase = [
  { time:"06:00",end:"06:30",label:"Acordar",icon:"🌅",category:"pessoal" },
  { time:"06:30",end:"07:30",label:"Treino / Exercício",icon:"🏃",category:"pessoal" },
  { time:"07:30",end:"08:00",label:"Café da manhã em família",icon:"☕",category:"família" },
  { time:"08:00",end:"12:00",label:"Desenvolvimento pessoal",icon:"📚",category:"pessoal" },
  { time:"12:00",end:"13:00",label:"Almoço",icon:"🍽️",category:"pausa" },
  { time:"13:00",end:"17:00",label:"Atividades pessoais",icon:"🌿",category:"pessoal" },
  { time:"17:00",end:"19:00",label:"Família / Lazer",icon:"🏠",category:"família" },
  { time:"21:00",end:"21:30",label:"Revisar a semana",icon:"📓",category:"pessoal" },
  { time:"21:30",end:"22:00",label:"Tempo com a esposa",icon:"❤️",category:"família" },
  { time:"22:00",end:"22:30",label:"Dormir",icon:"🌙",category:"pessoal" },
];
const fimSemanaBase = [
  { time:"07:00",end:"08:00",label:"Acordar com calma",icon:"🌅",category:"pessoal" },
  { time:"08:00",end:"09:00",label:"Café da manhã em família",icon:"☕",category:"família" },
  { time:"09:00",end:"12:00",label:"Tempo livre / família",icon:"🏠",category:"família" },
  { time:"12:00",end:"13:00",label:"Almoço em família",icon:"🍽️",category:"família" },
  { time:"13:00",end:"18:00",label:"Lazer / atividades pessoais",icon:"🌿",category:"pessoal" },
  { time:"22:00",end:"22:30",label:"Dormir",icon:"🌙",category:"pessoal" },
];

const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const CAT_DARK = {
  pessoal:  { bg:"#1a2f4a", accent:"#5b9bd5", label:"Pessoal" },
  trabalho: { bg:"#152a20", accent:"#4caf82", label:"Trabalho" },
  família:  { bg:"#35162e", accent:"#c97fc7", label:"Família" },
  pausa:    { bg:"#2e2210", accent:"#d4a843", label:"Pausa" },
};
const CAT_LIGHT = {
  pessoal:  { bg:"#ddeeff", accent:"#1565c0", label:"Pessoal" },
  trabalho: { bg:"#e8f5e9", accent:"#2e7d32", label:"Trabalho" },
  família:  { bg:"#fce4ec", accent:"#880e4f", label:"Família" },
  pausa:    { bg:"#fff8e1", accent:"#e65100", label:"Pausa" },
};

const CATS = ["pessoal","trabalho","família","pausa"];
const ICONS = ["🌅","🚿","📖","☕","💼","🍽️","✅","🏠","📓","❤️","🌙","👥","🏃","📚","🌿","🎯","📞","🏋️","🎵","🙏","💡","🗂️","📊","🤝","⭐","🔔"];
const DEFAULT_GOALS = [
  { id:"g1", label:"Reuniões de consultoria", target:16, current:0, unit:"reuniões", icon:"💼", color:"#4caf82" },
  { id:"g2", label:"Faturamento mensal", target:15000, current:0, unit:"R$", icon:"💰", color:"#d4a843" },
  { id:"g3", label:"Dias de treino", target:12, current:0, unit:"dias", icon:"🏃", color:"#5b9bd5" },
  { id:"g4", label:"Momentos em família", target:20, current:0, unit:"noites", icon:"❤️", color:"#c97fc7" },
];

const ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE";

function makeId(){ return Math.random().toString(36).slice(2,9); }
function timeToMin(t){ if(!t)return 0; const[h,m]=t.split(":").map(Number); return h*60+(m||0); }
function getNowMin(){ const n=new Date(); return n.getHours()*60+n.getMinutes(); }
function toDateKey(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function todayKey(){ const n=new Date(); return toDateKey(n.getFullYear(),n.getMonth(),n.getDate()); }
function getDayType(dow){ return dow>=1&&dow<=4?"consultoria":dow===5?"sexta":"fimSemana"; }
function seedTasks(tpl){ return tpl.map(t=>({...t,id:makeId(),done:false})); }
function getTemplateTasks(type){
  if(type==="consultoria") return seedTasks(consultoriaBase);
  if(type==="encontro")    return seedTasks(encontroBase);
  if(type==="sexta")       return seedTasks(sextaBase);
  return seedTasks(fimSemanaBase);
}
function loadLS(key,fb){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fb; }catch{ return fb; } }
function saveLS(key,v){ try{ localStorage.setItem(key,JSON.stringify(v)); }catch{} }

// ─── Notifications ────────────────────────────────────────────────────────────
async function requestNotifPermission(){
  if(!("Notification" in window)) return false;
  if(Notification.permission==="granted") return true;
  const p = await Notification.requestPermission();
  return p==="granted";
}

function scheduleNotifications(tasks, dateKey){
  if(!("Notification" in window)||Notification.permission!=="granted") return;
  const now = new Date();
  const tk = todayKey();
  if(dateKey!==tk) return;
  tasks.forEach(task=>{
    if(task.done) return;
    const [h,m] = task.time.split(":").map(Number);
    const taskDate = new Date();
    taskDate.setHours(h,m,0,0);
    const alertTime = new Date(taskDate.getTime()-15*60*1000);
    const diff = alertTime.getTime()-now.getTime();
    if(diff>0&&diff<12*60*60*1000){
      setTimeout(()=>{
        new Notification(`⏰ Em 15 min: ${task.label}`,{
          body:`${task.time} – ${task.end}`,
          icon:"/icon.png",
          tag:`task-${task.id}`
        });
      },diff);
    }
  });
}

function scheduleNightReview(){
  if(!("Notification" in window)||Notification.permission!=="granted") return;
  const now = new Date();
  const review = new Date();
  review.setHours(21,0,0,0);
  if(review<=now) review.setDate(review.getDate()+1);
  const diff = review.getTime()-now.getTime();
  setTimeout(()=>{
    new Notification("📓 Hora de revisar o dia!",{
      body:"Como foi seu dia? Marque suas tarefas concluídas.",
      icon:"/icon.png",
      tag:"night-review"
    });
  },diff);
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
function exportWeekPDF(weekDates, getTasksForDate, goals){
  const lines = [];
  lines.push("MEU PLANEJADOR — RESUMO SEMANAL");
  lines.push(`Semana: ${weekDates[0]} a ${weekDates[6]}`);
  lines.push("─".repeat(50));
  weekDates.forEach(dk=>{
    const [,mo,dy] = dk.split("-").map(Number);
    const tasks = getTasksForDate(dk);
    const done = tasks.filter(t=>t.done).length;
    lines.push(`\n${WEEKDAYS[new Date(dk+"T12:00:00").getDay()]} ${dy}/${mo} — ${done}/${tasks.length} tarefas`);
    [...tasks].sort((a,b)=>timeToMin(a.time)-timeToMin(b.time)).forEach(t=>{
      lines.push(`  ${t.done?"✓":"○"} ${t.time}-${t.end}  ${t.icon} ${t.label}`);
    });
  });
  lines.push("\n"+"─".repeat(50));
  lines.push("METAS DO MÊS:");
  goals.forEach(g=>{
    const pct=Math.min(100,Math.round(g.current/g.target*100));
    lines.push(`  ${g.icon} ${g.label}: ${g.current}/${g.target} ${g.unit} (${pct}%)`);
  });
  const blob = new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="planejador-semana.txt"; a.click();
  URL.revokeObjectURL(url);
}

// ─── Styles factory ───────────────────────────────────────────────────────────
function makeS(dark){
  const bg = dark?"#0a0a0f":"#f5f5f0";
  const card = dark?"#0d0d14":"#ffffff";
  const border = dark?"#2a2a3a":"#e0e0e0";
  const text = dark?"#f0ede8":"#1a1a1a";
  const sub = dark?"#666":"#888";
  const inp2 = dark?"#0d0d14":"#fafafa";
  return {
    bg, card, border, text, sub,
    inp:{ width:"100%",background:inp2,border:`1px solid ${border}`,borderRadius:10,padding:"10px 12px",color:text,fontFamily:"'Epilogue',sans-serif",fontSize:14,outline:"none",boxSizing:"border-box" },
    lbl:{ display:"block",color:sub,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:5,marginTop:12 },
    btnP:{ background:"linear-gradient(90deg,#4caf82,#5b9bd5)",border:"none",borderRadius:10,color:"#fff",fontFamily:"'Epilogue',sans-serif",fontWeight:700,fontSize:14,padding:"10px 20px",cursor:"pointer" },
    btnG:{ background:"transparent",border:`1px solid ${border}`,borderRadius:10,color:sub,fontFamily:"'Epilogue',sans-serif",fontSize:14,padding:"10px 16px",cursor:"pointer" },
    btnD:{ background:"#3a1515",border:"1px solid #7a2020",borderRadius:10,color:"#e57373",fontFamily:"'Epilogue',sans-serif",fontSize:14,padding:"10px 16px",cursor:"pointer" },
  };
}

function Modal({ onClose, children, dark }){
  const bg2 = dark?"#13131a":"#ffffff";
  const border = dark?"#2a2a3a":"#e0e0e0";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:bg2,border:`1px solid ${border}`,borderRadius:20,padding:24,width:"100%",maxWidth:420,maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function TaskForm({ initial, onSave, onDelete, onClose, S, dark }){
  const [f,setF]=useState(initial||{time:"08:00",end:"09:00",label:"",icon:"📌",category:"trabalho"});
  const cats = dark?CAT_DARK:CAT_LIGHT;
  return (
    <div>
      <h3 style={{fontFamily:"'Syne',sans-serif",color:S.text,marginBottom:16,fontSize:17}}>{initial?"Editar tarefa":"Nova tarefa"}</h3>
      <label style={S.lbl}>Título</label>
      <input style={S.inp} value={f.label} onChange={e=>setF({...f,label:e.target.value})} placeholder="Nome do compromisso"/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><label style={S.lbl}>Início</label><input style={S.inp} type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})}/></div>
        <div style={{flex:1}}><label style={S.lbl}>Fim</label><input style={S.inp} type="time" value={f.end} onChange={e=>setF({...f,end:e.target.value})}/></div>
      </div>
      <label style={S.lbl}>Categoria</label>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setF({...f,category:c})}
            style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${f.category===c?cats[c].accent:S.border}`,
              background:f.category===c?cats[c].bg:"transparent",color:f.category===c?cats[c].accent:S.sub,fontSize:12,cursor:"pointer",fontFamily:"'Epilogue',sans-serif"}}>
            {cats[c].label}
          </button>
        ))}
      </div>
      <label style={S.lbl}>Ícone</label>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
        {ICONS.map(ic=>(
          <button key={ic} onClick={()=>setF({...f,icon:ic})}
            style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${f.icon===ic?"#5b9bd5":S.border}`,background:f.icon===ic?cats.pessoal.bg:"transparent",fontSize:15,cursor:"pointer"}}>
            {ic}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{if(f.label.trim())onSave(f);}} style={{...S.btnP,flex:1}}>Salvar</button>
        {onDelete&&<button onClick={onDelete} style={S.btnD}>Excluir</button>}
        <button onClick={onClose} style={S.btnG}>Cancelar</button>
      </div>
    </div>
  );
}

function GoalForm({ initial, onSave, onDelete, onClose, S }){
  const [f,setF]=useState(initial||{label:"",target:10,current:0,unit:"",icon:"⭐",color:"#4caf82"});
  const colors=["#4caf82","#5b9bd5","#d4a843","#c97fc7","#e57373","#80cbc4"];
  return (
    <div>
      <h3 style={{fontFamily:"'Syne',sans-serif",color:S.text,marginBottom:16,fontSize:17}}>{initial?"Editar meta":"Nova meta"}</h3>
      <label style={S.lbl}>Nome da meta</label>
      <input style={S.inp} value={f.label} onChange={e=>setF({...f,label:e.target.value})} placeholder="Ex: Reuniões de consultoria"/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><label style={S.lbl}>Meta</label><input style={S.inp} type="number" value={f.target} onChange={e=>setF({...f,target:Number(e.target.value)})}/></div>
        <div style={{flex:1}}><label style={S.lbl}>Atual</label><input style={S.inp} type="number" value={f.current} onChange={e=>setF({...f,current:Number(e.target.value)})}/></div>
      </div>
      <label style={S.lbl}>Unidade</label>
      <input style={S.inp} value={f.unit} onChange={e=>setF({...f,unit:e.target.value})} placeholder="reuniões"/>
      <label style={S.lbl}>Ícone</label>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
        {ICONS.slice(0,16).map(ic=>(
          <button key={ic} onClick={()=>setF({...f,icon:ic})}
            style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${f.icon===ic?"#5b9bd5":S.border}`,background:"transparent",fontSize:15,cursor:"pointer"}}>
            {ic}
          </button>
        ))}
      </div>
      <label style={S.lbl}>Cor</label>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {colors.map(c=>(
          <button key={c} onClick={()=>setF({...f,color:c})}
            style={{width:28,height:28,borderRadius:"50%",background:c,border:`3px solid ${f.color===c?"#333":"transparent"}`,cursor:"pointer"}}/>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{if(f.label.trim())onSave(f);}} style={{...S.btnP,flex:1}}>Salvar</button>
        {onDelete&&<button onClick={onDelete} style={S.btnD}>Excluir</button>}
        <button onClick={onClose} style={S.btnG}>Cancelar</button>
      </div>
    </div>
  );
}

function AiChat({ onAddTask, onClose, activeDateKey, S }){
  const [msgs,setMsgs]=useState([{role:"assistant",text:'Olá! Me diga o que quer adicionar. Ex: "Reunião com cliente quinta às 15h até 16h30".'}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const ref=useRef();
  useEffect(()=>{ ref.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const txt=input.trim(); setInput(""); setLoading(true);
    setMsgs(m=>[...m,{role:"user",text:txt}]);
    const sys=`Assistente de agenda. Data ativa: ${activeDateKey}. Ano: ${new Date().getFullYear()}.
Responda SOMENTE com JSON: {"action":"add","dateKey":"YYYY-MM-DD","task":{"time":"HH:MM","end":"HH:MM","label":"...","icon":"...","category":"trabalho"},"message":"Confirmação"}
Categorias: pessoal, trabalho, família, pausa. Se não entender: {"action":"none","message":"Não entendi."}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:sys,messages:[{role:"user",content:txt}]})});
      const data=await res.json();
      const parsed=JSON.parse((data.content?.map(b=>b.text||"").join("")||"{}").replace(/```json|```/g,"").trim());
      if(parsed.action==="add"&&parsed.task&&parsed.dateKey) onAddTask(parsed.dateKey,{...parsed.task,id:makeId(),done:false});
      setMsgs(m=>[...m,{role:"assistant",text:parsed.message||"Feito!"}]);
    }catch{ setMsgs(m=>[...m,{role:"assistant",text:"Erro. Verifique a chave de API."}]); }
    finally{ setLoading(false); }
  };
  return (
    <div>
      <h3 style={{fontFamily:"'Syne',sans-serif",color:S.text,marginBottom:14,fontSize:17}}>✨ Adicionar via IA</h3>
      <div style={{height:200,overflowY:"auto",marginBottom:12,display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:14,background:m.role==="user"?"#1a2f4a":"#1a1a26",color:m.role==="user"?"#a8c8e8":"#ccc",fontSize:13,lineHeight:1.5}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{padding:"8px",display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#5b9bd5",display:"inline-block",animation:`bounce 1s ease ${i*0.15}s infinite`}}/>)}</div>}
        <div ref={ref}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input style={{...S.inp,flex:1,margin:0}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Descreva o compromisso..."/>
        <button onClick={send} style={{...S.btnP,padding:"10px 14px"}}>→</button>
      </div>
      <button onClick={onClose} style={{...S.btnG,marginTop:10,width:"100%"}}>Fechar</button>
    </div>
  );
}

// ─── History Modal ────────────────────────────────────────────────────────────
function HistoryModal({ dayTasks, onClose, S, dark }){
  const cats = dark?CAT_DARK:CAT_LIGHT;
  const entries = Object.entries(dayTasks)
    .filter(([,tasks])=>tasks.some(t=>t.done))
    .sort((a,b)=>b[0].localeCompare(a[0]))
    .slice(0,30);
  return (
    <div>
      <h3 style={{fontFamily:"'Syne',sans-serif",color:S.text,marginBottom:16,fontSize:17}}>📊 Histórico</h3>
      {entries.length===0&&<p style={{color:S.sub,fontSize:13}}>Nenhum dia concluído ainda.</p>}
      {entries.map(([dk,tasks])=>{
        const done=tasks.filter(t=>t.done).length;
        const pct=Math.round(done/tasks.length*100);
        const [,mo,dy]=dk.split("-").map(Number);
        return(
          <div key={dk} style={{marginBottom:12,background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{color:S.text,fontSize:14,fontWeight:600}}>{dy}/{mo} · {WEEKDAYS[new Date(dk+"T12:00:00").getDay()]}</span>
              <span style={{color:pct>=80?"#4caf82":"#d4a843",fontSize:13,fontWeight:700}}>{pct}%</span>
            </div>
            <div style={{height:4,background:S.border,borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:pct>=80?"#4caf82":"#d4a843"}}/>
            </div>
            <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
              {tasks.filter(t=>t.done).map(t=>(
                <span key={t.id} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:cats[t.category]?.bg||"#1a1a26",color:cats[t.category]?.accent||"#aaa"}}>{t.icon} {t.label}</span>
              ))}
            </div>
          </div>
        );
      })}
      <button onClick={onClose} style={{...S.btnG,width:"100%",marginTop:8}}>Fechar</button>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ weekDates, getTasksForDate, onClose, S }){
  const [copied,setCopied]=useState(false);
  const text = weekDates.map(dk=>{
    const [,mo,dy]=dk.split("-").map(Number);
    const tasks=getTasksForDate(dk);
    const done=tasks.filter(t=>t.done).length;
    return `${WEEKDAYS[new Date(dk+"T12:00:00").getDay()]} ${dy}/${mo}: ${done}/${tasks.length} tarefas`;
  }).join("\n");
  const full = `📅 Meu Planejador — Semana\n\n${text}\n\nEnviado via Meu Planejador`;

  const copy=()=>{ navigator.clipboard.writeText(full); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const share=()=>{ if(navigator.share) navigator.share({title:"Meu Planejador",text:full}); else copy(); };

  return (
    <div>
      <h3 style={{fontFamily:"'Syne',sans-serif",color:S.text,marginBottom:16,fontSize:17}}>📤 Compartilhar semana</h3>
      <div style={{background:S.bg,borderRadius:12,padding:"12px 14px",marginBottom:16,fontFamily:"monospace",fontSize:12,color:S.sub,whiteSpace:"pre-wrap",lineHeight:1.7}}>{full}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={share} style={{...S.btnP,flex:1}}>📤 Compartilhar</button>
        <button onClick={copy} style={{...S.btnG}}>{copied?"✓ Copiado!":"Copiar"}</button>
      </div>
      <button onClick={onClose} style={{...S.btnG,width:"100%",marginTop:8}}>Fechar</button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App(){
  const today=new Date();
  const [dark,setDark]=useState(()=>loadLS("planner_dark",true));
  const [view,setView]=useState("month");
  const [curYear,setCurYear]=useState(today.getFullYear());
  const [curMonth,setCurMonth]=useState(today.getMonth());
  const [dayTasks,setDayTasksRaw]=useState(()=>loadLS("planner_tasks_v2",{}));
  const [goals,setGoalsRaw]=useState(()=>loadLS("planner_goals_v2",DEFAULT_GOALS));
  const [selectedDate,setSelectedDate]=useState(null);
  const [editTask,setEditTask]=useState(null);
  const [showTaskForm,setShowTaskForm]=useState(false);
  const [showGoalForm,setShowGoalForm]=useState(false);
  const [editGoal,setEditGoal]=useState(null);
  const [showAI,setShowAI]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [showNotifBanner,setShowNotifBanner]=useState(false);
  const [nowMin,setNowMin]=useState(getNowMin());
  const [saveStatus,setSaveStatus]=useState("");
  const [goalAlerts,setGoalAlerts]=useState([]);
  const saveTimer=useRef(null);

  const S = makeS(dark);
  const cats = dark?CAT_DARK:CAT_LIGHT;

  // Init notifications
  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default") setShowNotifBanner(true);
    if("Notification" in window && Notification.permission==="granted") scheduleNightReview();
    const t=setInterval(()=>setNowMin(getNowMin()),30000);
    return()=>clearInterval(t);
  },[]);

  // Goal alerts (< 20% remaining)
  useEffect(()=>{
    const alerts=goals.filter(g=>{
      const pct=g.current/g.target;
      return pct>=0.8&&pct<1;
    });
    setGoalAlerts(alerts);
  },[goals]);

  const enableNotifs=async()=>{
    const ok=await requestNotifPermission();
    if(ok){ scheduleNightReview(); setShowNotifBanner(false); }
  };

  const setDayTasks=useCallback((updated)=>{
    setDayTasksRaw(updated); setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{ saveLS("planner_tasks_v2",updated); setSaveStatus("saved"); setTimeout(()=>setSaveStatus(""),2000); },500);
  },[]);
  const setGoals=useCallback((updated)=>{ setGoalsRaw(updated); saveLS("planner_goals_v2",updated); },[]);

  const tk=todayKey();
  const getTasksForDate=useCallback((dk)=>{
    if(dayTasks[dk])return dayTasks[dk];
    const dow=new Date(dk+"T12:00:00").getDay();
    return getTemplateTasks(getDayType(dow));
  },[dayTasks]);

  const setTasksForDate=(dk,tasks)=>{ setDayTasks({...dayTasks,[dk]:tasks}); if(dk===tk) scheduleNotifications(tasks,dk); };
  const toggleTask=(dk,id)=>setTasksForDate(dk,getTasksForDate(dk).map(t=>t.id===id?{...t,done:!t.done}:t));
  const saveTask=(dk,form,eid)=>{ const tasks=getTasksForDate(dk); setTasksForDate(dk,eid?tasks.map(t=>t.id===eid?{...t,...form}:t):[...tasks,{...form,id:makeId(),done:false}]); setShowTaskForm(false); setEditTask(null); };
  const deleteTask=(dk,id)=>{ setTasksForDate(dk,getTasksForDate(dk).filter(t=>t.id!==id)); setShowTaskForm(false); setEditTask(null); };
  const addFromAI=(dk,task)=>setTasksForDate(dk,[...getTasksForDate(dk),task]);
  const saveGoal=(form,id)=>{ setGoals(id?goals.map(x=>x.id===id?{...x,...form}:x):[...goals,{...form,id:makeId()}]); setShowGoalForm(false); setEditGoal(null); };
  const deleteGoal=(id)=>{ setGoals(goals.filter(x=>x.id!==id)); setShowGoalForm(false); setEditGoal(null); };
  const toggleDark=()=>{ const v=!dark; setDark(v); saveLS("planner_dark",v); };

  const firstDay=new Date(curYear,curMonth,1).getDay();
  const daysInMonth=new Date(curYear,curMonth+1,0).getDate();
  const grid=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const prevMonth=()=>{ if(curMonth===0){setCurMonth(11);setCurYear(y=>y-1);}else setCurMonth(m=>m-1); };
  const nextMonth=()=>{ if(curMonth===11){setCurMonth(0);setCurYear(y=>y+1);}else setCurMonth(m=>m+1); };
  const getWeekDates=()=>{ const base=selectedDate?new Date(selectedDate+"T12:00:00"):today; const dow=base.getDay(); return Array.from({length:7},(_,i)=>{ const d=new Date(base); d.setDate(base.getDate()-dow+i); return toDateKey(d.getFullYear(),d.getMonth(),d.getDate()); }); };

  const selDay=selectedDate||tk;
  const weekDates=getWeekDates();
  const monthGoalsDone=goals.reduce((s,g)=>s+(g.current>=g.target?1:0),0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Epilogue:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${S.bg};font-family:'Epilogue',sans-serif;transition:background 0.3s;-webkit-tap-highlight-color:transparent;}
        @keyframes bounce{0%,80%,100%{transform:scale(0.7);opacity:0.4}40%{transform:scale(1.2);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${S.border};border-radius:4px}
        input[type=time]::-webkit-calendar-picker-indicator{filter:${dark?"invert(0.4)":"none"}}
      `}</style>

      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 14px 80px",animation:"fadeIn 0.3s ease"}}>

        {/* Notif banner */}
        {showNotifBanner&&(
          <div style={{background:"linear-gradient(90deg,#1a2f4a,#152a20)",border:"1px solid #2a3a4a",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,animation:"slideDown 0.3s ease"}}>
            <span style={{fontSize:20}}>🔔</span>
            <div style={{flex:1}}>
              <div style={{color:"#f0ede8",fontSize:13,fontWeight:600}}>Ativar notificações?</div>
              <div style={{color:"#666",fontSize:11,marginTop:2}}>Lembretes 15min antes dos compromissos</div>
            </div>
            <button onClick={enableNotifs} style={{...S.btnP,padding:"6px 12px",fontSize:12}}>Ativar</button>
            <button onClick={()=>setShowNotifBanner(false)} style={{color:"#555",background:"none",border:"none",cursor:"pointer",fontSize:18}}>✕</button>
          </div>
        )}

        {/* Goal alerts */}
        {goalAlerts.map(g=>(
          <div key={g.id} style={{background:"#2e2210",border:"1px solid #d4a843",borderRadius:14,padding:"10px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:10,animation:"slideDown 0.3s ease"}}>
            <span style={{fontSize:18}}>{g.icon}</span>
            <div style={{flex:1}}>
              <div style={{color:"#d4a843",fontSize:13,fontWeight:600}}>Meta quase lá! {g.label}</div>
              <div style={{color:"#888",fontSize:11}}>{g.current}/{g.target} {g.unit} — {Math.round(g.current/g.target*100)}%</div>
            </div>
          </div>
        ))}

        {/* Header */}
        <div style={{marginBottom:18,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",color:S.text,fontSize:22,letterSpacing:-0.5}}>Meu Planejador</h1>
            <p style={{color:S.sub,fontSize:12,marginTop:3}}>{MONTHS[curMonth]} {curYear}</p>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4}}>
            {saveStatus&&<span style={{fontSize:11,color:saveStatus==="saved"?"#4caf82":"#d4a843"}}>{saveStatus==="saving"?"⏳":"✓"}</span>}
            <button onClick={()=>setShowHistory(true)} style={{...S.btnG,padding:"7px 10px",fontSize:14}} title="Histórico">📊</button>
            <button onClick={toggleDark} style={{...S.btnG,padding:"7px 10px",fontSize:14}} title="Tema">{dark?"☀️":"🌙"}</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:18,background:dark?"#0d0d14":"#e8e8e4",borderRadius:14,padding:4}}>
          {[{k:"month",l:"📅 Mês"},{k:"week",l:"📋 Semana"},{k:"goals",l:"🎯 Metas"}].map(tab=>(
            <button key={tab.k} onClick={()=>setView(tab.k)}
              style={{flex:1,padding:"9px 0",borderRadius:11,border:"none",cursor:"pointer",fontFamily:"'Epilogue',sans-serif",fontSize:13,fontWeight:600,
                background:view===tab.k?dark?"#1a2f4a":"#ffffff":"transparent",
                color:view===tab.k?"#5b9bd5":S.sub,transition:"all 0.2s",
                boxShadow:view===tab.k?"0 1px 4px rgba(0,0,0,0.15)":"none"}}>
              {tab.l}
            </button>
          ))}
        </div>

        {/* ── MONTH ── */}
        {view==="month"&&(
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <button onClick={prevMonth} style={{...S.btnG,padding:"6px 14px"}}>‹</button>
              <span style={{fontFamily:"'Syne',sans-serif",color:S.text,fontSize:16}}>{MONTHS[curMonth]} {curYear}</span>
              <button onClick={nextMonth} style={{...S.btnG,padding:"6px 14px"}}>›</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
              {WEEKDAYS.map(w=><div key={w} style={{textAlign:"center",fontSize:10,color:S.sub,padding:"4px 0",fontWeight:600}}>{w}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
              {grid.map((day,i)=>{
                if(!day)return<div key={`e${i}`}/>;
                const dk=toDateKey(curYear,curMonth,day);
                const tasks=getTasksForDate(dk); const done=tasks.filter(t=>t.done).length;
                const pct=tasks.length?done/tasks.length:0;
                const isToday=dk===tk; const isSel=dk===selectedDate;
                const dow=new Date(dk+"T12:00:00").getDay();
                const isSex=dow===5; const isWknd=dow===0||dow===6;
                return(
                  <button key={dk} onClick={()=>setSelectedDate(dk)}
                    style={{aspectRatio:"1",borderRadius:11,
                      border:`1.5px solid ${isSel?"#5b9bd5":isToday?"#2a3a4a":S.border}`,
                      background:isSel?cats.pessoal.bg:isToday?dark?"#111820":"#e8f0fb":isWknd?dark?"#0f0f18":"#fafafa":isSex?dark?"#120f1e":"#fdf4ff":S.card,
                      cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:4,position:"relative"}}>
                    <span style={{fontSize:12,fontFamily:"'Syne',sans-serif",color:isToday?"#5b9bd5":isSex?"#c97fc7":isWknd?S.sub:S.text,fontWeight:isToday?700:400}}>{day}</span>
                    <div style={{width:"65%",height:3,borderRadius:3,background:S.border,overflow:"hidden"}}>
                      <div style={{width:`${pct*100}%`,height:"100%",background:pct===1?"#4caf82":"#5b9bd5",transition:"width 0.4s"}}/>
                    </div>
                    {dayTasks[dk]&&<div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:"#d4a843"}}/>}
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
              {[{c:"#5b9bd5",l:"Hoje"},{c:"#c97fc7",l:"Sexta"},{c:"#d4a843",l:"Personalizado"}].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:S.sub}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:x.c}}/>{x.l}
                </div>
              ))}
            </div>
            <button onClick={()=>setShowAI(true)} style={{...S.btnP,width:"100%",marginTop:14,padding:"12px 0",fontSize:14}}>✨ Adicionar via IA</button>

            {selectedDate&&(()=>{
              const tasks=getTasksForDate(selectedDate); const done=tasks.filter(t=>t.done).length;
              const [,mo,dy]=selectedDate.split("-").map(Number);
              return(
                <div style={{marginTop:14,background:S.card,border:`1px solid ${S.border}`,borderRadius:16,overflow:"hidden",animation:"fadeIn 0.25s ease"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <span style={{fontFamily:"'Syne',sans-serif",color:S.text,fontSize:15}}>{dy} de {MONTHS[mo-1]}</span>
                      <span style={{color:S.sub,fontSize:12,marginLeft:8}}>{done}/{tasks.length}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setView("week")} style={{...S.btnG,padding:"5px 10px",fontSize:11}}>Semana</button>
                      <button onClick={()=>{setEditTask(null);setShowTaskForm(true);}} style={{...S.btnP,padding:"5px 10px",fontSize:11}}>+ Tarefa</button>
                    </div>
                  </div>
                  <div style={{maxHeight:240,overflowY:"auto"}}>
                    {[...tasks].sort((a,b)=>timeToMin(a.time)-timeToMin(b.time)).map(t=>{
                      const col=cats[t.category]||cats.pessoal;
                      return(
                        <div key={t.id} onClick={()=>{setEditTask(t);setShowTaskForm(true);}}
                          style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",opacity:t.done?0.4:1,borderBottom:`1px solid ${S.border}`}}>
                          <div onClick={e=>{e.stopPropagation();toggleTask(selectedDate,t.id);}}
                            style={{width:17,height:17,borderRadius:"50%",border:`2px solid ${t.done?col.accent:S.border}`,flexShrink:0,
                              background:t.done?col.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9}}>
                            {t.done&&"✓"}
                          </div>
                          <span style={{fontSize:15}}>{t.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,color:t.done?S.sub:S.text,textDecoration:t.done?"line-through":"none"}}>{t.label}</div>
                            <div style={{fontSize:10,color:S.sub}}>{t.time}–{t.end}</div>
                          </div>
                          <div style={{width:4,height:4,borderRadius:"50%",background:col.accent,flexShrink:0}}/>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* ── WEEK ── */}
        {view==="week"&&(()=>{
          const tasks=getTasksForDate(selDay);
          const sorted=[...tasks].sort((a,b)=>timeToMin(a.time)-timeToMin(b.time));
          const done=tasks.filter(t=>t.done).length;
          const pct=tasks.length?Math.round(done/tasks.length*100):0;
          const [,mo,dy]=selDay.split("-").map(Number);
          const isToday=selDay===tk;
          const curTask=isToday?sorted.find(t=>timeToMin(t.time)<=nowMin&&nowMin<timeToMin(t.end)):null;
          const sections=[{l:"Manhã",min:0,max:720},{l:"Tarde",min:720,max:1080},{l:"Noite",min:1080,max:1440}];
          return(
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <button onClick={()=>{const b=new Date(weekDates[0]+"T12:00:00");b.setDate(b.getDate()-7);setSelectedDate(toDateKey(b.getFullYear(),b.getMonth(),b.getDate()));}} style={{...S.btnG,padding:"6px 12px"}}>‹</button>
                <span style={{color:S.sub,fontSize:12}}>{weekDates[0].slice(8)}/{weekDates[0].slice(5,7)} – {weekDates[6].slice(8)}/{weekDates[6].slice(5,7)}</span>
                <button onClick={()=>{const b=new Date(weekDates[0]+"T12:00:00");b.setDate(b.getDate()+7);setSelectedDate(toDateKey(b.getFullYear(),b.getMonth(),b.getDate()));}} style={{...S.btnG,padding:"6px 12px"}}>›</button>
              </div>
              <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
                {weekDates.map((dk,i)=>{
                  const t=getTasksForDate(dk); const d=t.filter(x=>x.done).length;
                  const p=t.length?Math.round(d/t.length*100):0;
                  const isT=dk===tk; const isS=dk===selDay;
                  return(
                    <button key={dk} onClick={()=>setSelectedDate(dk)}
                      style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"9px 8px",borderRadius:13,
                        border:`1.5px solid ${isS?"#5b9bd5":isT?dark?"#2a3a4a":"#c8d8f0":S.border}`,
                        background:isS?cats.pessoal.bg:isT?dark?"#111820":"#e8f0fb":S.card,cursor:"pointer",minWidth:52}}>
                      <span style={{fontSize:9,color:isS?"#5b9bd5":S.sub,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{WEEKDAYS[i]}</span>
                      <span style={{fontSize:14,fontFamily:"'Syne',sans-serif",color:isS?"#5b9bd5":S.text}}>{dk.slice(8)}</span>
                      <div style={{width:26,height:3,borderRadius:3,background:S.border,overflow:"hidden"}}>
                        <div style={{width:`${p}%`,height:"100%",background:isS?"#5b9bd5":"#4caf82"}}/>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action row */}
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <button onClick={()=>setShowAI(true)} style={{...S.btnP,flex:1,padding:"10px 0",fontSize:13}}>✨ IA</button>
                <button onClick={()=>setShowShare(true)} style={{...S.btnG,padding:"10px 12px",fontSize:13}}>📤</button>
                <button onClick={()=>exportWeekPDF(weekDates,getTasksForDate,goals)} style={{...S.btnG,padding:"10px 12px",fontSize:13}}>📄</button>
              </div>

              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <span style={{fontFamily:"'Syne',sans-serif",color:S.text,fontSize:17}}>{dy} de {MONTHS[mo-1]}</span>
                  {isToday&&<span style={{marginLeft:8,fontSize:10,color:"#4caf82",background:"#152a20",padding:"2px 8px",borderRadius:20}}>hoje</span>}
                  <p style={{color:S.sub,fontSize:12,marginTop:2}}>{done}/{tasks.length} · {pct}%</p>
                </div>
                <button onClick={()=>{setEditTask(null);setShowTaskForm(true);}} style={{...S.btnP,padding:"8px 14px",fontSize:13}}>+ Tarefa</button>
              </div>
              <div style={{height:4,background:S.border,borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#4caf82,#5b9bd5)",transition:"width 0.5s"}}/>
              </div>

              {curTask&&(
                <div style={{background:dark?"#16140e":"#fff8e1",border:`1px solid ${dark?"#3a3010":"#f9a825"}`,borderLeft:"3px solid #d4a843",borderRadius:13,padding:"11px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{curTask.icon}</span>
                  <div>
                    <div style={{fontSize:10,color:"#d4a843",textTransform:"uppercase",letterSpacing:1}}>⚡ Agora</div>
                    <div style={{fontSize:14,color:S.text,fontWeight:600,marginTop:1}}>{curTask.label}</div>
                    <div style={{fontSize:11,color:S.sub,marginTop:1}}>{curTask.time}–{curTask.end}</div>
                  </div>
                </div>
              )}

              {sections.map(sec=>{
                const st=sorted.filter(t=>{const m=timeToMin(t.time);return m>=sec.min&&m<sec.max;});
                if(!st.length)return null;
                return(
                  <div key={sec.l}>
                    <div style={{fontSize:10,color:S.sub,textTransform:"uppercase",letterSpacing:2,margin:"14px 0 8px 2px"}}>{sec.l}</div>
                    {st.map(task=>{
                      const col=cats[task.category]||cats.pessoal;
                      return(
                        <div key={task.id} onClick={()=>{setEditTask(task);setShowTaskForm(true);}}
                          style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 13px",borderRadius:13,marginBottom:5,cursor:"pointer",
                            border:`1px solid ${task===curTask?dark?"#3a3010":"#f9a825":task.done?S.border:"transparent"}`,
                            background:task.done?S.bg:task===curTask?dark?"#1a1810":"#fff8e1":col.bg+(dark?"44":"99"),
                            opacity:task.done?0.45:1,transition:"opacity 0.2s"}}>
                          <div onClick={e=>{e.stopPropagation();toggleTask(selDay,task.id);}}
                            style={{width:18,height:18,borderRadius:"50%",flexShrink:0,marginTop:2,border:`2px solid ${task.done?col.accent:S.border}`,
                              display:"flex",alignItems:"center",justifyContent:"center",background:task.done?col.accent:"transparent",color:"#fff",fontSize:8}}>
                            {task.done&&"✓"}
                          </div>
                          <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{task.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:S.sub,marginBottom:1}}>{task.time}–{task.end}</div>
                            <div style={{fontSize:13,color:task.done?S.sub:S.text,textDecoration:task.done?"line-through":"none"}}>{task.label}</div>
                          </div>
                          <div style={{width:4,height:4,borderRadius:"50%",background:col.accent,marginTop:7,flexShrink:0}}/>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          );
        })()}

        {/* ── GOALS ── */}
        {view==="goals"&&(
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <h2 style={{fontFamily:"'Syne',sans-serif",color:S.text,fontSize:18}}>Metas de {MONTHS[curMonth]}</h2>
                <p style={{color:S.sub,fontSize:12,marginTop:2}}>{monthGoalsDone}/{goals.length} metas atingidas</p>
              </div>
              <button onClick={()=>{setEditGoal(null);setShowGoalForm(true);}} style={{...S.btnP,padding:"8px 14px",fontSize:13}}>+ Meta</button>
            </div>
            {goals.map(g=>{
              const pct=Math.min(100,Math.round(g.current/g.target*100));
              const nearDone=pct>=80&&pct<100;
              return(
                <div key={g.id} onClick={()=>{setEditGoal(g);setShowGoalForm(true);}}
                  style={{background:S.card,border:`1px solid ${nearDone?"#d4a843":S.border}`,borderRadius:16,padding:"15px 17px",marginBottom:10,cursor:"pointer",transition:"border-color 0.2s"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>{g.icon}</span>
                      <div>
                        <div style={{color:S.text,fontSize:14,fontWeight:600}}>{g.label}</div>
                        <div style={{color:S.sub,fontSize:12,marginTop:1}}>{g.unit==="R$"?`R$ ${Number(g.current).toLocaleString("pt-BR")} / R$ ${Number(g.target).toLocaleString("pt-BR")}`:`${g.current} / ${g.target} ${g.unit}`}</div>
                      </div>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,color:pct>=100?"#4caf82":nearDone?"#d4a843":g.color}}>{pct}%</div>
                  </div>
                  <div style={{height:5,background:S.border,borderRadius:5,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:pct>=100?"#4caf82":nearDone?"#d4a843":g.color,borderRadius:5,transition:"width 0.5s"}}/>
                  </div>
                  {pct>=100&&<div style={{marginTop:8,fontSize:12,color:"#4caf82"}}>✓ Meta atingida! 🎉</div>}
                  {nearDone&&<div style={{marginTop:8,fontSize:12,color:"#d4a843"}}>🔥 Quase lá! Continue assim.</div>}
                </div>
              );
            })}
            {goals.length>0&&(
              <div style={{background:dark?"linear-gradient(135deg,#152a20,#1a2f4a)":"linear-gradient(135deg,#e8f5e9,#e3f2fd)",border:`1px solid ${S.border}`,borderRadius:16,padding:"15px 18px",marginTop:6}}>
                <div style={{color:S.sub,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Resumo do mês</div>
                <div style={{display:"flex",gap:8}}>
                  {[{v:monthGoalsDone,l:"Atingidas",c:"#4caf82"},{v:goals.length-monthGoalsDone,l:"Em andamento",c:"#d4a843"},{v:goals.length,l:"Total",c:"#5b9bd5"}].map(x=>(
                    <div key={x.l} style={{flex:1,textAlign:"center"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,color:x.c}}>{x.v}</div>
                      <div style={{fontSize:10,color:S.sub,marginTop:2}}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showTaskForm&&<Modal onClose={()=>{setShowTaskForm(false);setEditTask(null);}} dark={dark}><TaskForm initial={editTask} onSave={(form)=>saveTask(selDay,form,editTask?.id)} onDelete={editTask?()=>deleteTask(selDay,editTask.id):null} onClose={()=>{setShowTaskForm(false);setEditTask(null);}} S={S} dark={dark}/></Modal>}
      {showGoalForm&&<Modal onClose={()=>{setShowGoalForm(false);setEditGoal(null);}} dark={dark}><GoalForm initial={editGoal} onSave={(form)=>saveGoal(form,editGoal?.id)} onDelete={editGoal?()=>deleteGoal(editGoal.id):null} onClose={()=>{setShowGoalForm(false);setEditGoal(null);}} S={S}/></Modal>}
      {showAI&&<Modal onClose={()=>setShowAI(false)} dark={dark}><AiChat onAddTask={addFromAI} onClose={()=>setShowAI(false)} activeDateKey={selDay} S={S}/></Modal>}
      {showHistory&&<Modal onClose={()=>setShowHistory(false)} dark={dark}><HistoryModal dayTasks={dayTasks} onClose={()=>setShowHistory(false)} S={S} dark={dark}/></Modal>}
      {showShare&&<Modal onClose={()=>setShowShare(false)} dark={dark}><ShareModal weekDates={weekDates} getTasksForDate={getTasksForDate} onClose={()=>setShowShare(false)} S={S}/></Modal>}
    </>
  );
}

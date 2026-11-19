import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DATA_KEY as STORAGE_KEY, PUBLIC_KEY, loadSchool as readStored, schoolTransition as transition, publicProjection } from './school';
import { schoolDate } from './model';
const Context=createContext(null);
export const useSchool=()=>useContext(Context);
export function SchoolProvider({children}) {
  const [initial]=useState(()=>{try{return {data:readStored(localStorage)}}catch(e){return {error:e.message}}});
  const [data,setData]=useState(initial.data), [error,setError]=useState(initial.error||''), [toast,setToast]=useState('');
  const [actor,setActor]=useState({role:'principal',teacherId:'t1',studentId:'s1'});
  const timer=useRef();
  const notify=message=>{setToast(message);clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),4200)};
  useEffect(()=>{const sync=e=>{if(e.key===STORAGE_KEY) {try{setData(readStored(localStorage));setError('')}catch(e){setError(e.message)}}};window.addEventListener('storage',sync); return()=>{window.removeEventListener('storage',sync);clearTimeout(timer.current)}},[]);
  useEffect(()=>{if(initial.data)try{localStorage.setItem(STORAGE_KEY,JSON.stringify(initial.data))}catch(e){setError('Browser storage is unavailable. Changes cannot be saved.')}},[initial]);
  const [clock,setClock]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setClock(Date.now()),15000);return()=>clearInterval(timer)},[]);
  useEffect(()=>{if(data)try{localStorage.setItem(PUBLIC_KEY,JSON.stringify(publicProjection(data,clock)))}catch(e){setError('The public display could not be synchronized. Device storage may be full.')}},[data,clock]);
  const act=(type,payload,message)=>{
    try {
      // Read the latest persisted state before writing to avoid stale-tab overwrites.
      const current=readStored(localStorage); const next=transition(current,actor,{type,payload},schoolDate());
      localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setData(next);setError('');if(message)notify(message);return true;
    } catch(e) {throw new Error(e.name==='QuotaExceededError'?'Device storage is full. Your change was not saved.':e.message)}
  };
  if(!data) return <main className="fatal"><h1>We couldn’t open your saved school</h1><p role="alert">{error}</p><p>Your saved data has not been overwritten. Please check your browser’s storage settings and reload.</p><button onClick={()=>location.reload()}>Try again</button></main>;
  return <Context.Provider value={{data,actor,setActor,act,notify,storageError:error,clock,today:schoolDate(clock)}}>{error&&<div className="storage-error" role="alert">{error}</div>}{children}{toast&&<div className="toast" role="status"><span>✓</span>{toast}</div>}</Context.Provider>;
}

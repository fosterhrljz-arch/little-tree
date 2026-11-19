import { useEffect, useId, useRef, useState } from 'react';
import { X, ArrowRight, Search, Sprout, Flower2, Leaf, Inbox } from 'lucide-react';
export function Button({children,variant='',className='',...props}) {return <button className={`button ${variant} ${className}`} {...props}>{children}</button>}
export function LinkButton({children,onClick}) {return <button className="text-button" onClick={onClick}>{children}<ArrowRight size={17}/></button>}
export function Badge({status,children}) {return <span className={`badge ${status||''}`}>{children||status}</span>}
export function Avatar({name,large=false}) {return <span className={`avatar ${large?'large':''}`} aria-hidden="true">{name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span>}
export function ClassIcon({color='sage'}) {const Icon=color==='yellow'?Flower2:color==='blue'?Leaf:Sprout;return <span className={`class-icon ${color}`}><Icon size={25}/></span>}
export function Empty({title='Nothing here just yet',children}) {return <div className="empty"><Inbox size={30}/><h3>{title}</h3><p>{children}</p></div>}
export function PageHeader({title,description,children}) {return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{children&&<div className="heading-actions">{children}</div>}</div>}
export function SearchBox({value,onChange,placeholder='Search students…'}) {return <div className="search"><Search size={18}/><input type="search" aria-label={placeholder.replace('…','')} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></div>}
export function Field({label,children,hint}) {return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Modal({title,children,onClose,wide=false}) {
  const ref=useRef(), titleId=useId();
  useEffect(()=>{const dialog=ref.current, previous=document.activeElement;dialog.showModal();dialog.querySelector('input,textarea,select')?.focus();return()=>{dialog.close();previous?.focus()}},[]);
  return <dialog ref={ref} aria-labelledby={titleId} className={wide?'wide':''} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={21}/></button></div>{children}</dialog>
}
export function EditForm({onSubmit,onClose,children,submitLabel='Save changes',danger=false,draft=false,readOnly=false}) {
  const [error,setError]=useState(''),[busy,setBusy]=useState(false);
  return <form onSubmit={async e=>{e.preventDefault();if(readOnly)return;setError('');if(e.currentTarget.querySelector('input[type=file]:disabled')){setError('Please wait for the file to finish saving.');return;}const fields=Object.fromEntries(new FormData(e.currentTarget));fields.intent=e.nativeEvent.submitter?.value||'save';setBusy(true);try{await onSubmit(fields)}catch(err){setError(err.message)}finally{setBusy(false)}}}><div className="form-content">{children}{error&&<p className="form-error" role="alert">{error}</p>}</div><div className="modal-footer"><Button type="button" variant="secondary" onClick={onClose} disabled={busy}>{readOnly?'Close':'Cancel'}</Button>{!readOnly&&<>{draft&&<Button variant="secondary" type="submit" value="draft" disabled={busy}>Save Draft</Button>}<Button variant={danger?'danger':''} type="submit" value="save" disabled={busy}>{busy?'Saving…':submitLabel}</Button></>}</div></form>
}
export function Confirm({title,children,onConfirm,onClose,label='Confirm'}) {return <Modal title={title} onClose={onClose}><EditForm onSubmit={onConfirm} onClose={onClose} submitLabel={label} danger><p>{children}</p></EditForm></Modal>}
export function downloadFile(name,text,type='text/plain') {const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export function csv(rows) {return rows.map(row=>row.map(cell=>`"${String(cell??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')}"`).join(',')).join('\r\n')}

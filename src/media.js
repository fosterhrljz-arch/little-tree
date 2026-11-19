let connection;
function db(){if(!connection)connection=new Promise((resolve,reject)=>{const req=indexedDB.open('little-tree.media',1);req.onupgradeneeded=()=>req.result.createObjectStore('files',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Photo storage is unavailable in this browser.'));});return connection;}
export async function saveFile(file,{imageOnly=false}={}) {
  if(!file||!file.size)return null;
  const images=['image/jpeg','image/png','image/webp'];
  if(!images.includes(file.type)&&(!(!imageOnly&&file.type==='application/pdf')))throw new Error(imageOnly?'Choose a JPEG, PNG, or WebP image.':'Choose a JPEG, PNG, WebP, or PDF file.');
  if(file.size>8*1024*1024)throw new Error('Choose a file smaller than 8 MB.');
  let blob=file;
  if(images.includes(file.type)){
    let bitmap;try{bitmap=await createImageBitmap(file)}catch{throw new Error('This image could not be read. Please choose another file.')}
    const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.85));if(!blob)throw new Error('The photo could not be prepared.');
  } else {const signature=await file.slice(0,5).text();if(signature!=='%PDF-')throw new Error('This file is not a valid PDF.');}
  const id=crypto.randomUUID(),database=await db();await new Promise((resolve,reject)=>{const tx=database.transaction('files','readwrite');tx.objectStore('files').put({id,blob,name:file.name,type:blob.type});tx.oncomplete=resolve;tx.onerror=()=>reject(new Error('Not enough device storage to save this file.'));});
  return {id,name:file.name,type:blob.type,size:blob.size};
}
export async function loadFile(ref){if(!ref?.id)return null;const database=await db();return new Promise((resolve,reject)=>{const r=database.transaction('files').objectStore('files').get(ref.id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(new Error('The saved file could not be opened.'));});}

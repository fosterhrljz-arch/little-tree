export const STORAGE_KEY = 'little-tree.data.v1';
export const schoolDate = (now=Date.now()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
export const TODAY = schoolDate();
export const teachers = [{ id: 't1', name: 'Emma Wilson' }, { id: 't2', name: 'James Chen' }, { id: 't3', name: 'Sophia Reed' }];
export const roles = ['principal', 'teacher', 'parent'];
export const titleCase = s => s[0].toUpperCase() + s.slice(1);
export const dateLabel = (date, options = { month: 'short', day: 'numeric' }) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', options);
export function offsetDate(date, amount) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + amount); return d.toISOString().slice(0, 10); }
export function schoolDay(date) { return ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay()); }
const names = ['Ava Bennett', 'Liam Carter', 'Olivia Davis', 'Ethan Garcia', 'Mia Johnson', 'Lucas Miller', 'Amelia Patel', 'Oliver Wilson', 'Noah Williams', 'Charlotte Brown', 'Elijah Anderson', 'Sophia Martinez', 'James Taylor', 'Isabella Moore', 'Benjamin Lee', 'Harper Thomas', 'Ella Thompson', 'Henry Jackson', 'Evelyn White', 'Alexander Harris', 'Sofia Clark', 'William Lewis', 'Aria Robinson', 'Jack Walker'];
export function createDemo(today = TODAY) {
  const classes = [
    { id: 'c1', name: 'Seedlings', ages: '3–4', teacherId: 't1', capacity: 12, room: 'Garden Room', color: 'sage' },
    { id: 'c2', name: 'Sunflowers', ages: '4–5', teacherId: 't2', capacity: 14, room: 'Sunshine Room', color: 'yellow' },
    { id: 'c3', name: 'Oak Leaves', ages: '5–6', teacherId: 't3', capacity: 16, room: 'Woodland Room', color: 'blue' }
  ];
  const students = names.map((name, i) => ({ id: `s${i+1}`, name, classId: `c${Math.floor(i/8)+1}`, parentName: i === 0 ? 'Sarah Bennett' : `${['Alex','Jordan','Sam','Taylor'][i%4]} ${name.split(' ')[1]}`, email: `${name.split(' ')[1].toLowerCase()}@example.com`, phone: `202-555-${String(100+i).padStart(4,'0')}`, dob: `${Number(today.slice(0,4))-4-Math.floor(i/8)}-${String(i%9+1).padStart(2,'0')}-${String(i%20+1).padStart(2,'0')}`, allergies: i===0 ? 'Peanuts. Keep snacks nut-free.' : i===12 ? 'Dairy sensitivity.' : 'None reported', notes: i===0 ? 'Loves painting, nature walks, and story time.' : 'Enjoys hands-on learning and time with friends.', active: true, enrolled: offsetDate(today,-60) }));
  const attendance = {};
  for (let d=-14; d<=0; d++) { const day=offsetDate(today,d); if(!schoolDay(day)) continue; students.forEach((s,i)=> { attendance[`${day}:${s.id}`] = i%8===7 && d===0 ? 'absent' : 'present'; }); }
  return { version: 1, classes, students, attendance, leaves: [
    { id:'l1', studentId:'s1', start:offsetDate(today,1), end:offsetDate(today,1), reason:'Family appointment', type:'Personal', status:'pending', createdAt: new Date().toISOString() },
    { id:'l2', studentId:'s9', start:offsetDate(today,3), end:offsetDate(today,3), reason:'Family trip', type:'Family', status:'pending', createdAt: new Date().toISOString() },
    { id:'l3', studentId:'s17', start:offsetDate(today,4), end:offsetDate(today,4), reason:'Medical appointment', type:'Medical', status:'pending', createdAt: new Date().toISOString() }
  ], announcements: [
    {id:'a1',title:'A week of little discoveries',body:'This week, our Seedlings are exploring autumn leaves, mixing warm colors, and counting treasures from the garden. Please bring a labeled water bottle and a light jacket for our daily nature walk.',classId:'c1',authorId:'t1',author:'Emma Wilson',createdAt:`${today}T08:00:00`,category:'Class update'},
    {id:'a2',title:'Autumn family picnic',body:'Join us this Friday at 3:30 PM in the kindergarten garden for an afternoon of stories, games, and community. Bring a picnic blanket and your favorite nut-free snack. Families from every class are welcome!',classId:'all',authorId:'principal',author:'Olivia Parker',createdAt:`${offsetDate(today,-1)}T15:30:00`,category:'School event'},
    {id:'a3',title:'Growing our reading garden',body:'Our new reading corner is ready! Children can choose a picture book to bring home each Thursday. Please return it the following Monday so another little reader can enjoy it.',classId:'all',authorId:'principal',author:'Olivia Parker',createdAt:`${offsetDate(today,-3)}T10:00:00`,category:'Reminder'}
  ], readIds: {}, updatedAt: new Date().toISOString() };
}
export function allowedClasses(data, actor) { return data.classes.filter(c => actor.role==='principal' || (actor.role==='teacher' ? c.teacherId===actor.teacherId : data.students.some(s=>s.id===actor.studentId && s.classId===c.id))); }
export function visibleStudents(data, actor) { const ids=new Set(allowedClasses(data,actor).map(c=>c.id)); return data.students.filter(s=>s.active && (actor.role==='parent' ? s.id===actor.studentId : ids.has(s.classId))); }
export function visibleLeaves(data,actor) { const ids=new Set(visibleStudents(data,actor).map(s=>s.id)); return data.leaves.filter(l=>ids.has(l.studentId)); }
export function visibleAnnouncements(data,actor) { const ids=new Set(allowedClasses(data,actor).map(c=>c.id)); return data.announcements.filter(a=>actor.role==='principal'||a.classId==='all'||ids.has(a.classId)); }
export function attendanceStatus(data,studentId,date) { if(!schoolDay(date)) return 'closed'; if(data.leaves.some(l=>l.studentId===studentId&&l.status==='approved'&&l.start<=date&&l.end>=date)) return 'leave'; return data.attendance[`${date}:${studentId}`] || 'unmarked'; }
const requireThat=(value,message)=>{ if(!value) throw new Error(message); };
const clean=(v,max=200)=>String(v||'').trim().slice(0,max);
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(`${v}T12:00:00Z`).toISOString().slice(0,10)===v;
export function transition(data,actor,action,today=TODAY) {
  requireThat(roles.includes(actor.role),'Choose a valid role.');
  const next=structuredClone(data), p=action.payload||{};
  const manageable=id=>visibleStudents(data,actor).some(s=>s.id===id);
  const principal=()=>requireThat(actor.role==='principal','Only the principal can make this change.');
  const uid=()=>crypto.randomUUID();
  if(action.type==='saveClass') {
    principal(); const existing=data.classes.find(c=>c.id===p.id), name=clean(p.name,60), capacity=Number(p.capacity);
    requireThat(name,'Enter a class name.');
    requireThat(!data.classes.some(c=>c.id!==p.id&&c.name.toLowerCase()===name.toLowerCase()),'A class with this name already exists.');
    requireThat(teachers.some(t=>t.id===p.teacherId),'Choose a teacher.');
    requireThat(Number.isInteger(capacity)&&capacity>0&&capacity<=40,'Capacity must be between 1 and 40.');
    requireThat(data.students.filter(s=>s.active&&s.classId===p.id).length<=capacity,'Capacity cannot be below current enrollment.');
    const item={id:existing?.id||uid(),name,ages:clean(p.ages,20),teacherId:p.teacherId,capacity,room:clean(p.room,60),color:existing?.color||'sage'};
    if(existing) next.classes=next.classes.map(c=>c.id===existing.id?item:c); else next.classes.push(item);
  } else if(action.type==='deleteClass') {
    principal(); requireThat(!data.students.some(s=>s.classId===p.id),'Move all students, including archived students, before removing this class.');
    requireThat(!data.announcements.some(a=>a.classId===p.id),'Remove this class’s announcements before removing the class.');
    next.classes=next.classes.filter(c=>c.id!==p.id);
  } else if(action.type==='saveStudent') {
    principal(); const existing=data.students.find(s=>s.id===p.id), c=data.classes.find(c=>c.id===p.classId);
    requireThat(clean(p.name)&&clean(p.parentName),'Enter the student and parent names.');
    requireThat(c,'Choose a class.');
    requireThat(data.students.filter(s=>s.active&&s.classId===c.id&&s.id!==p.id).length<c.capacity,'This class is full. Please choose another class.');
    requireThat(validDate(p.dob)&&p.dob<today,'Enter a valid date of birth in the past.');
    requireThat(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email),'Enter a valid parent email.');
    requireThat(clean(p.phone),'Enter a contact number.');
    const item={...existing,id:existing?.id||uid(),name:clean(p.name,70),classId:p.classId,parentName:clean(p.parentName,70),email:clean(p.email,120),phone:clean(p.phone,30),dob:p.dob,allergies:clean(p.allergies,500)||'None reported',notes:clean(p.notes,1000),active:true,enrolled:existing?.enrolled||today};
    if(existing) next.students=next.students.map(s=>s.id===p.id?item:s); else next.students.push(item);
  } else if(action.type==='archiveStudent') {
    principal(); requireThat(data.students.some(s=>s.id===p.id),'Student not found.');
    next.students=next.students.map(s=>s.id===p.id?{...s,active:false}:s);
    next.leaves=next.leaves.map(l=>l.studentId===p.id&&l.status==='pending'?{...l,status:'cancelled',reviewNote:'Student archived.'}:l);
  } else if(action.type==='attendance') {
    requireThat(actor.role!=='parent','Parents cannot change attendance.');
    requireThat(validDate(p.date)&&p.date<=today&&schoolDay(p.date),'Attendance can only be recorded for school days up to today.');
    requireThat(['present','absent','late','unmarked'].includes(p.status),'Choose a valid attendance status.');
    requireThat(Array.isArray(p.ids)&&p.ids.length&&p.ids.every(manageable),'These students are not in your class.');
    for(const id of p.ids) { if(attendanceStatus(data,id,p.date)==='leave') continue; if(p.status==='unmarked') delete next.attendance[`${p.date}:${id}`]; else next.attendance[`${p.date}:${id}`]=p.status; }
  } else if(action.type==='requestLeave') {
    requireThat(actor.role==='parent'&&p.studentId===actor.studentId&&manageable(p.studentId),'You can request leave only for your child.');
    requireThat(validDate(p.start)&&validDate(p.end)&&p.start>=today&&p.end>=p.start,'Choose an end date on or after the start date. Leave must start today or later.');
    requireThat((Date.parse(p.end)-Date.parse(p.start))/86400000<=30,'Request up to 31 days at a time.');
    requireThat(Array.from({length:Math.round((Date.parse(p.end)-Date.parse(p.start))/86400000)+1},(_,i)=>offsetDate(p.start,i)).some(schoolDay),'Choose a range that includes a school day.');
    requireThat(clean(p.reason,1000).length>=5,'Please give a reason of at least 5 characters.');
    requireThat(['Medical','Family','Personal'].includes(p.type),'Choose a leave type.');
    requireThat(!data.leaves.some(l=>l.studentId===p.studentId&&['pending','approved'].includes(l.status)&&l.start<=p.end&&l.end>=p.start),'This request overlaps an existing pending or approved leave.');
    next.leaves.unshift({id:uid(),studentId:p.studentId,start:p.start,end:p.end,type:p.type,reason:clean(p.reason,1000),status:'pending',createdAt:new Date().toISOString()});
  } else if(action.type==='reviewLeave') {
    const leave=data.leaves.find(l=>l.id===p.id);
    requireThat(actor.role!=='parent'&&leave&&manageable(leave.studentId),'You can only review leave for students in your classes.');
    requireThat(leave.status==='pending','This request has already been reviewed.');
    requireThat(['approved','rejected'].includes(p.status),'Choose an approval decision.');
    requireThat(p.status!=='rejected'||clean(p.note).length>=5,'Add a short explanation for the parent.');
    next.leaves=next.leaves.map(l=>l.id===p.id?{...l,status:p.status,reviewNote:clean(p.note,500),reviewedBy:actor.role==='principal'?'Olivia Parker':teachers.find(t=>t.id===actor.teacherId)?.name,reviewedAt:new Date().toISOString()}:l);
  } else if(action.type==='cancelLeave') {
    const l=data.leaves.find(l=>l.id===p.id); requireThat(actor.role==='parent'&&l?.studentId===actor.studentId&&l.status==='pending','Only your pending requests can be cancelled.');
    next.leaves=next.leaves.map(l=>l.id===p.id?{...l,status:'cancelled'}:l);
  } else if(action.type==='saveAnnouncement') {
    requireThat(actor.role!=='parent','Only staff can publish announcements.');
    requireThat(clean(p.title,100)&&clean(p.body,5000),'Add a title and message.');
    const existing=data.announcements.find(a=>a.id===p.id);
    requireThat(!existing||actor.role==='principal'||existing.authorId===actor.teacherId,'You can only edit your own announcements.');
    requireThat(p.classId==='all'?actor.role==='principal':allowedClasses(data,actor).some(c=>c.id===p.classId),'Choose one of your classes.');
    const item={id:existing?.id||uid(),title:clean(p.title,100),body:clean(p.body,5000),classId:p.classId,category:clean(p.category,30)||'Class update',authorId:existing?.authorId||(actor.role==='principal'?'principal':actor.teacherId),author:existing?.author||(actor.role==='principal'?'Olivia Parker':teachers.find(t=>t.id===actor.teacherId)?.name),createdAt:existing?.createdAt||new Date().toISOString()};
    if(existing) {next.announcements=next.announcements.map(a=>a.id===p.id?item:a); for(const key of Object.keys(next.readIds)) next.readIds[key]=next.readIds[key].filter(id=>id!==p.id); } else next.announcements.unshift(item);
  } else if(action.type==='deleteAnnouncement') {
    const a=data.announcements.find(a=>a.id===p.id); requireThat(a&&(actor.role==='principal'||actor.role==='teacher'&&a.authorId===actor.teacherId),'You can only remove your own announcements.'); next.announcements=next.announcements.filter(a=>a.id!==p.id);
  } else if(action.type==='readAnnouncement') {
    requireThat(visibleAnnouncements(data,actor).some(a=>a.id===p.id),'Announcement not available.'); const key=actorKey(actor); next.readIds[key]=[...new Set([...(next.readIds[key]||[]),p.id])];
  } else { throw new Error('Unknown action.'); }
  next.updatedAt=new Date().toISOString(); return next;
}
export const actorKey=a=>a.role==='parent'?`parent:${a.studentId}`:a.role==='teacher'?`teacher:${a.teacherId}`:'principal';
export function readStored(storage) { const raw=storage.getItem(STORAGE_KEY); if(!raw) return createDemo(); const data=JSON.parse(raw); requireThat(data?.version===1&&['classes','students','leaves','announcements'].every(k=>Array.isArray(data[k]))&&data.attendance&&data.readIds,'Saved data is not compatible. Download or clear it in your browser settings before restarting.'); return data; }

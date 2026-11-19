import { ArrowRight } from 'lucide-react';
import { useSchool } from './store';
import { dateLabel } from './model';
import { announcementsFor, activitiesFor, isPublished } from './school';
export default function Today({navigate}) {
 const {data,actor,clock,today:TODAY}=useSchool();const menu=data.menus.find(m=>m.date===TODAY)?.published;const activity=activitiesFor(data,actor).find(a=>a.date===TODAY&&a.status==='published');const notices=announcementsFor(data,actor,clock).filter(a=>isPublished(a,clock));const notice=notices.find(a=>a.urgent)||notices[0];
 const rows=[['On the menu',menu?.find(d=>d.meal==='Lunch')?.name||'Today’s menu is coming soon','View menu','Daily Menu'],['Class activity',activity?.title||'A little space for new discoveries','See activities','Class Activities'],['School update',notice?.title||'A quiet day. You’re all caught up.','Read updates','School Announcements']];
 return <div className="today-page"><div className="today-intro"><p className="today-date">{dateLabel(TODAY,{weekday:'long',month:'long',day:'numeric'})}</p><h1>A little care, every day.</h1><p>A calm start to a day full of discovery.</p></div><img className="quiet-visual" src="./assets/quiet-morning.png" alt="A delicate green branch beside a pebble on a sunlit windowsill"/><section className="today-list"><h2>Today at Little Tree</h2>{rows.map(([title,detail,action,page])=><button className="today-row" key={title} onClick={()=>navigate(page)}><strong>{title}</strong><span>{detail}</span><b>{action}<ArrowRight size={17}/></b></button>)}</section><p className="today-closing">Everything you need, one little moment at a time.</p></div>;
}

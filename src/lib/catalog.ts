import { parse } from 'yaml';
import { publications } from '../../data/publications';
import { talks } from '../../data/talks';
import { works, type WorkId } from '../../data/works';
import { workDestinations } from '../../data/legacy-routes.mjs';
export { publications, talks };
export const featuredSlug = '2026-07-05-time-integration-as-filtering';
// Read raw MDX to avoid a circular import through article components.
const sources = import.meta.glob<string>('../content/20*.mdx', { query: '?raw', import: 'default', eager: true });
export const posts = Object.entries(sources).map(([path, raw])=>{
  const slug = path.split('/').pop()!.replace(/\.mdx$/,'');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = parse(frontmatter?.[1] || '') as { title: string; date: string; description: string; draft?: boolean; artwork?: string; image?: string; work?: WorkId };
  if (!fm?.title || !/^\d{4}-\d{2}-\d{2}$/.test(fm.date) || !fm.description) throw new Error(`Missing title, date or description in ${path}`);
  const body=raw.slice(frontmatter![0].length).replace(/^import .+;?$/gm,'');
  const image=fm.image ? `/posts/${fm.image}` : fm.work ? works[fm.work].image : '/logo.png';
  return {title:fm.title,date:fm.date,description:fm.description,slug,interactive:/client:(?:visible|load|idle)/.test(body),draft:fm.draft===true,artwork:fm.artwork,image,href:`/posts/${slug}`,readingMinutes:Math.max(1,Math.round(body.split(/\s+/).length/220))};
}).sort((a,b)=>b.date.localeCompare(a.date)||b.slug.localeCompare(a.slug));
export const searchItems = [
  ...posts.map(p=>({title:p.title,description:p.description,kind:p.draft?'Writing · draft':'Writing',url:p.href})),
  ...publications.map(p=>({title:p.title,description:`${p.authors} ${p.venue} ${p.year}`,kind:'Publication',url:'/publications'})),
  ...talks.map(t=>({title:t.title,description:`${t.venue} ${t.date}`,kind:t.invited?'Invited talk':'Talk',url:t.slidesUrl||'/talks'})),
  {title:'IncompressibleNavierStokes.jl',description:'Differentiable GPU-accelerated fluid simulation in Julia',kind:'Software',url:'/software'},
  {title:'About & CV',description:'Employment, education, teaching and research',kind:'About',url:'/about'},
];
export function dateLabel(date:string) { return new Date(date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}); }
export function localLink(url:string) { return workDestinations[url.replace(/\/$/,'')] || url; }

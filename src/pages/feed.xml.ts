import type { APIRoute } from 'astro';
import { posts } from '../lib/catalog';
import { xml } from '../lib/xml';
export const GET: APIRoute = ({site}) => {
  const absolute=(path:string)=>xml(new URL(path,site).href);
  const items=posts.map(post=>`<item><title>${xml(post.title)}</title><link>${absolute(post.href)}</link><guid isPermaLink="true">${absolute(post.href)}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.date+'T12:00:00Z').toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Syver Døving Agdestein — blog</title><link>${absolute('/posts/')}</link><description>Blog posts on turbulence, closure models, and scientific computing in Julia.</description><language>en</language><copyright>Syver Døving Agdestein</copyright><atom:link href="${absolute('/feed.xml')}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
};

import type { APIRoute } from 'astro';
import { posts } from '../lib/catalog';
import { xml } from '../lib/xml';
export const GET: APIRoute = ({site}) => {
  const paths=['/','/posts/','/publications','/talks','/software','/about',...posts.map(p=>p.href)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${xml(new URL(path,site).href)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};

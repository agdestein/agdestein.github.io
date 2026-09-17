"""Check the deployable site, including legacy entry points, without a server."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'
ORIGIN = 'https://agdestein.github.io'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.references, self.ids, self.meta, self.links = [], set(), {}, {}
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name', attrs.get('http-equiv', '')))] = attrs.get('content', '')
        if tag == 'link':
            self.links[attrs.get('rel')] = attrs.get('href', '')
        for attr in ('href', 'src', 'poster'):
            value = attrs.get(attr)
            if value and not value.startswith(('data:', 'mailto:', 'tel:', 'javascript:')):
                self.references.append(value)

pages = {p: Page(p.read_text()) for p in OUT.rglob('*.html')}
def resolve_url(url):
    path = OUT / unquote(urlparse(url).path).lstrip('/')
    if path.is_file(): return path
    if Path(str(path)+'.html').is_file(): return Path(str(path)+'.html')
    if (path / 'index.html').is_file(): return path / 'index.html'
    return None

errors = []
for file, page in pages.items():
    relative = str(file.relative_to(OUT))
    url = ORIGIN + '/' + relative.removesuffix('index.html')
    for reference in page.references:
        parsed = urlparse(urljoin(url, reference))
        if parsed.netloc != 'agdestein.github.io': continue
        # Separate GitHub Pages project, not part of this repository.
        if parsed.path.startswith('/OpenDay/'): continue
        target = resolve_url(parsed.geturl())
        if not target:
            errors.append(f'{relative}: missing {reference}')
        elif parsed.fragment and target in pages and 'refresh' not in pages[target].meta and 'slides' not in target.relative_to(OUT).parts:
            if unquote(parsed.fragment) not in pages[target].ids:
                errors.append(f'{relative}: missing anchor {reference}')
    if '/slides/' not in url and 'refresh' not in page.meta and relative != '404.html':
        assert page.links.get('canonical'), f'{relative}: no canonical'
        assert page.meta.get('description'), f'{relative}: no description'
        assert resolve_url(page.meta['og:image']), f'{relative}: missing social image'

# Every old top-level route, hub, and date-only post remains a valid entry point.
legacy = json.loads((ROOT / 'tests/legacy-urls.json').read_text())
for source, target in legacy.items():
    file = resolve_url(ORIGIN + source)
    assert file in pages, f'Lost historical URL: {source}'
    assert pages[file].links.get('canonical') == ORIGIN + target, source
    if 'refresh' in pages[file].meta:
        assert pages[file].meta['refresh'] == f'0;url={target}', source
    else:
        assert pages[file].meta.get('description'), f'Empty compatibility page: {source}'
    assert resolve_url(ORIGIN + target), f'Redirect target missing: {target}'

rss = ET.parse(OUT / 'feed.xml').getroot()
items = rss.findall('./channel/item')
post_count = len(list((ROOT / 'src/content').glob('20*.mdx')))
assert len(items) == post_count
for item in items:
    assert all(item.findtext(k) for k in ['title', 'description', 'pubDate', 'link', 'guid'])
    assert resolve_url(item.findtext('link'))
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap = ET.parse(OUT / 'sitemap.xml').getroot()
locations = [node.text for node in sitemap.findall('s:url/s:loc', ns)]
assert len(locations) == len(set(locations)) == 6 + post_count
for url in locations:
    file = resolve_url(url)
    assert file in pages and 'refresh' not in pages[file].meta, url
    assert pages[file].links['canonical'] == url, url

# Keep original scientific assets and every slide URL byte-for-byte intact.
import hashlib
assets = json.loads((ROOT / 'tests/media-baseline.json').read_text())
for path, expected in assets.items():
    assert hashlib.sha256((OUT / path).read_bytes()).hexdigest() == expected, path
assert not errors, '\n'.join(sorted(set(errors)))
print(f'PASS {len(pages)} HTML files: local links, anchors, media, and social images resolve')
print(f'PASS {len(legacy)} legacy URLs, {len(items)} RSS entries, {len(locations)} sitemap pages, and {len(assets)} unchanged research/slide assets')

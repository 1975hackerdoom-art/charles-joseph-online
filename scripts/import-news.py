"""Import the published Catch the Beat archive without rewriting article text."""
import concurrent.futures
import argparse
import hashlib
import html
import json
import pathlib
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
arguments = argparse.ArgumentParser()
arguments.add_argument('--new-posts', help='WordPress JSON containing newly fetched posts; preserve existing articles')
args = arguments.parse_args()
existing = []
if args.new_posts:
    existing = json.loads((ROOT / 'content/news.json').read_text(encoding='utf-8'))
    known_ids = {post['id'] for post in existing}
    known_slugs = {post['slug'] for post in existing}
    posts = [post for post in json.loads((ROOT / args.new_posts).read_text(encoding='utf-8-sig'))
             if post['id'] not in known_ids and post['slug'] not in known_slugs]
else:
    posts = []
    for page in (1, 2):
        posts.extend(json.loads((ROOT / f'tmp/news-posts-{page}.json').read_text(encoding='utf-8-sig')))
assert len(posts) == len({post['id'] for post in posts})
local_links = {post['originalUrl'].rstrip('/'): '/news/' + post['slug'] for post in existing}
local_links.update({post['link'].rstrip('/'): '/news/' + post['slug'] for post in posts})

class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)
    def handle_endtag(self, tag):
        self.parts.append(' ')

def plain(value):
    parser = Text()
    parser.feed(value)
    return re.sub(r'\s+', ' ', ''.join(parser.parts)).strip()

class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img' and attrs.get('src'):
            self.urls.append(urllib.parse.urljoin('https://catchthebeat.ca/', attrs['src']))

media_urls = set()
for post in posts:
    parser = Images()
    parser.feed(post['content']['rendered'])
    media_urls.update(parser.urls)
    featured = post.get('_embedded', {}).get('wp:featuredmedia', [])
    cover = ''
    if featured and featured[0].get('source_url'):
        sizes = featured[0].get('media_details', {}).get('sizes', {})
        cover = (sizes.get('large') or sizes.get('medium_large') or {}).get('source_url') or featured[0]['source_url']
    elif parser.urls:
        cover = parser.urls[0]
    post['_cover'] = cover
    if cover:
        media_urls.add(cover)

asset_dir = ROOT / 'public/images/news'
asset_dir.mkdir(parents=True, exist_ok=True)

def download(url):
    extension = pathlib.Path(urllib.parse.urlparse(url).path).suffix.lower()
    if extension not in ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'):
        extension = '.jpg'
    filename = hashlib.sha256(url.encode()).hexdigest()[:20] + extension
    dest = asset_dir / filename
    try:
        if not dest.exists():
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=45) as response:
                if not response.headers.get('Content-Type', '').startswith('image/'):
                    raise ValueError('Not an image')
                dest.write_bytes(response.read())
        return url, '/images/news/' + filename, None
    except Exception as error:
        return url, '', str(error)

assets = {}
failures = []
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for index, (url, local, error) in enumerate(pool.map(download, sorted(media_urls))):
        assets[url] = local
        if error:
            failures.append({'url': url, 'error': error})
        if (index + 1) % 25 == 0:
            print(f'Processed {index + 1}/{len(media_urls)} images', flush=True)

def safe_url(value):
    value = value.strip()
    parsed = urllib.parse.urlsplit(value)
    if parsed.scheme.lower() not in ('', 'http', 'https', 'mailto', 'tel'):
        return ''
    if value.startswith('#'):
        return value
    return urllib.parse.urljoin('https://catchthebeat.ca/', value)

class CleanHTML(HTMLParser):
    allowed = {'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'sup', 'sub', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'hr', 'div', 'span', 'section', 'article', 'video', 'source', 'iframe', 'pre', 'code'}
    void = {'img', 'br', 'hr', 'source'}
    def __init__(self):
        super().__init__()
        self.output = []
        self.blocked = 0
    def handle_starttag(self, tag, attributes):
        if tag in ('script', 'style', 'object', 'form'):
            self.blocked += 1
            return
        if self.blocked or tag not in self.allowed:
            return
        attrs = dict(attributes)
        clean = {}
        if attrs.get('id'):
            clean['id'] = attrs['id']
        if tag == 'a':
            url = safe_url(attrs.get('href', ''))
            clean['href'] = local_links.get(url.rstrip('/'), url)
        if tag in ('img', 'source', 'iframe'):
            url = safe_url(attrs.get('src', ''))
            if tag == 'img' and url in assets and not assets[url]:
                return
            if tag == 'iframe' and urllib.parse.urlparse(url).hostname not in ('www.youtube.com', 'www.youtube-nocookie.com'):
                return
            clean['src'] = assets.get(url, url)
        if tag == 'img':
            clean.update(alt=attrs.get('alt', ''), loading='lazy', decoding='async')
        if tag == 'iframe':
            clean.update(title=attrs.get('title', 'Embedded video'), loading='lazy', allowfullscreen='', referrerpolicy='strict-origin-when-cross-origin')
        if tag == 'video':
            clean.update(controls='', preload='metadata')
            if attrs.get('src'):
                clean['src'] = safe_url(attrs['src'])
        if tag == 'source' and attrs.get('type'):
            clean['type'] = attrs['type']
        if tag in ('td', 'th'):
            for attr in ('colspan', 'rowspan'):
                if attrs.get(attr, '').isdigit():
                    clean[attr] = attrs[attr]
        if tag == 'table':
            self.output.append('<div class="article-table" tabindex="0" role="region" aria-label="Article table">')
        output_tag = 'h2' if tag == 'h1' else tag
        serialized = ''.join(f' {key}="{html.escape(value, quote=True)}"' for key, value in clean.items())
        self.output.append(f'<{output_tag}{serialized}>')
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'object', 'form'):
            self.blocked = max(0, self.blocked - 1)
            return
        if self.blocked or tag not in self.allowed or tag in self.void:
            return
        self.output.append('</' + ('h2' if tag == 'h1' else tag) + '>')
        if tag == 'table':
            self.output.append('</div>')
    def handle_data(self, data):
        if not self.blocked:
            self.output.append(html.escape(data))

archive = []
if args.new_posts and failures:
    raise RuntimeError(f'New article images could not be downloaded: {failures}')
for post in posts:
    parser = CleanHTML()
    parser.feed(post['content']['rendered'])
    content = ''.join(parser.output)
    assert re.sub(r'\s+', '', plain(content)) == re.sub(r'\s+', '', plain(post['content']['rendered'])), post['slug']
    categories = [html.unescape(term['name']) for group in post.get('_embedded', {}).get('wp:term', []) for term in group if term.get('taxonomy') == 'category']
    author = post.get('_embedded', {}).get('author', [{}])[0].get('name', '')
    archive.append(dict(id=post['id'], slug=post['slug'], title=plain(post['title']['rendered']), date=post['date'][:10], modified=post['modified'][:10], author=author, categories=categories, excerpt=plain(post['excerpt']['rendered']), image=assets.get(post['_cover'], post['_cover']), originalUrl=post['link'], content=content))

imported_count = len(archive)
archive = sorted(archive + existing, key=lambda post: post['date'], reverse=True)
(ROOT / 'content/news.json').write_text(json.dumps(archive, ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'content/news-index.json').write_text(json.dumps([{k: v for k, v in post.items() if k != 'content'} for post in archive], ensure_ascii=False, indent=2), encoding='utf-8')
(ROOT / 'tmp/news-import-report.json').write_text(json.dumps({'articles': len(archive), 'images': len(assets), 'failedImages': failures}, indent=2), encoding='utf-8')
print(f'Imported {imported_count} complete articles; archive now has {len(archive)} articles; {len(assets) - len(failures)}/{len(assets)} images downloaded; article text verified unchanged.', flush=True)
if failures:
    print(json.dumps(failures, indent=2), flush=True)

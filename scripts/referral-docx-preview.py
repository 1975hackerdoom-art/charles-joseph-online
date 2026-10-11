"""Build a faithful-content HTML preview when native Word rendering is unavailable."""
from pathlib import Path
from zipfile import ZipFile
from html import escape
import base64
import xml.etree.ElementTree as ET

source = Path('public/referrals/castlegar-recommendation-letter-daphne-thomson.docx')
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
with ZipFile(source) as doc:
    root = ET.fromstring(doc.read('word/document.xml'))
    paragraphs = []
    for paragraph in root.findall('./w:body/w:p', ns):
        text = ''.join(escape(node.text or '') if node.tag == f"{{{ns['w']}}}t" else '<br>'
                       for node in paragraph.iter() if node.tag in [f"{{{ns['w']}}}t", f"{{{ns['w']}}}br"])
        paragraphs.append(f'<p>{text}</p>')
    logo = base64.b64encode(doc.read('word/media/image4.png')).decode()
    signature = base64.b64encode(doc.read('word/media/image1.JPG')).decode()
    paragraphs.insert(5, f'<img class="signature" src="data:image/jpeg;base64,{signature}" alt="">')
html = '''<!doctype html><meta charset="utf-8"><style>
* { box-sizing: border-box } body { margin: 0; background: white; color: #111; font: 16px/1.3 Arial, sans-serif }
article { width: 850px; min-height: 1100px; padding: 62px 105px 65px 110px }
header { margin-bottom: 38px } header img { width: 300px; height: auto }
.contact { margin-top: 18px; font-size: 11px; line-height: 1.5; color: #444 }
p { margin: 0 0 16px } p:nth-last-child(-n+3) { margin-bottom: 0 }
.signature { width: 125px; height: auto; display: block; margin: 0 0 6px }
</style><article><header><img src="data:image/png;base64,''' + logo + '''" alt="Castlegar">
<div class="contact">460 Columbia Avenue · Castlegar, BC V1N 1G7<br>T 250 365 7227 · info@castlegar.ca · castlegar.ca</div></header>''' + ''.join(paragraphs) + '</article>'
Path('tmp/referral-previews/castlegar.html').write_text(html, encoding='utf-8')

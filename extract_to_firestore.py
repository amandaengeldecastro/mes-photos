#!/usr/bin/env python3
"""
Lê os metadados de fotos de cada HTML de cidade e salva no Firestore.

Uso:
  python3 extract_to_firestore.py [--dry-run]

Com --dry-run mostra o que seria salvo sem gravar nada.
"""

import re, glob, sys
import firebase_admin
from firebase_admin import credentials, firestore
from bs4 import BeautifulSoup

KEY_FILE = 'maps-1464e-firebase-adminsdk-fbsvc-a4bfecd584.json'
DRY_RUN  = '--dry-run' in sys.argv

NON_CITY = {'index.html', 'maps.html', 'music.html', 'pets.html'}

MONTH_MAP = {
    'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4,
    'Maio': 5, 'Junho': 6, 'Julho': 7, 'Agosto': 8,
    'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12,
}

def parse_h3(text):
    """'[Setembro] Museu Oscar Niemeyer' → (9, 'Museu Oscar Niemeyer')"""
    m = re.match(r'\[([^\]]+)\](.*)', text.strip())
    if not m:
        return None, text.strip()
    month = MONTH_MAP.get(m.group(1).strip())
    event_title = m.group(2).strip()
    return month, event_title

def extract_photos(html_file):
    with open(html_file, encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    h1 = soup.find('h1')
    city_name = h1.get_text(strip=True) if h1 else ''

    # Cor personalizada do border-left (se houver)
    style_tag = soup.find('style')
    color = '#8b7355'
    if style_tag:
        m = re.search(r'border-left[^#]*?(#[0-9a-fA-F]{3,6})', style_tag.string or '')
        if m:
            color = m.group(1)

    photos = []

    for year_div in soup.select('.timeline-year'):
        year_id = year_div.get('id', '')
        m = re.match(r'year-(\d{4})', year_id)
        if not m:
            continue
        year = int(m.group(1))

        for event in year_div.select('.timeline-event'):
            h3 = event.find('h3')
            if not h3:
                continue
            month, event_title = parse_h3(h3.get_text(strip=True))
            if not month:
                continue

            for order, img in enumerate(event.select('img.location-image')):
                url = img.get('src', '')
                if 'firebasestorage.googleapis.com' not in url:
                    continue
                photos.append({
                    'year':       year,
                    'month':      month,
                    'eventTitle': event_title,
                    'title':      img.get('title', ''),
                    'url':        url,
                    'order':      order,
                })

    return city_name, color, photos


def main():
    if not DRY_RUN:
        cred = credentials.Certificate(KEY_FILE)
        firebase_admin.initialize_app(cred)
        db = firestore.client()

    html_files = sorted(
        f for f in glob.glob('*.html')
        if f not in NON_CITY
    )

    total_photos = 0

    for html_file in html_files:
        slug = html_file.replace('.html', '')
        city_name, color, photos = extract_photos(html_file)

        if not photos:
            print(f'  {html_file}: sem fotos do Storage, ignorado')
            continue

        print(f'  {html_file}: {len(photos)} fotos  ({city_name})')
        total_photos += len(photos)

        if DRY_RUN:
            for p in photos[:2]:
                print(f'    {p["year"]}/{p["month"]:02d} — {p["eventTitle"] or "(sem título)"} — {p["title"] or ""}')
            if len(photos) > 2:
                print(f'    ... + {len(photos)-2} mais')
            continue

        # Salva metadados da cidade
        db.collection('cities').document(slug).set({
            'name':  city_name,
            'color': color,
            'slug':  slug,
        }, merge=True)

        # Salva fotos
        col = db.collection('photos').document(slug).collection('entries')
        batch = db.batch()
        batch_count = 0

        for photo in photos:
            ref = col.document()
            batch.set(ref, {**photo, 'citySlug': slug})
            batch_count += 1

            if batch_count == 500:
                batch.commit()
                batch = db.batch()
                batch_count = 0

        if batch_count:
            batch.commit()

    mode = ' [DRY RUN]' if DRY_RUN else ''
    print(f'\nTotal: {total_photos} fotos processadas{mode}')
    if DRY_RUN:
        print('Execute sem --dry-run para salvar no Firestore.')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
import json
import re
import sys
import firebase_admin
from firebase_admin import credentials, firestore


def parse_locations(filepath='locations-data.js'):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'^\s*const locations\s*=\s*', '', content.strip())
    content = content.rstrip(';').strip()
    content = re.sub(r'(\b[a-zA-Z_][a-zA-Z0-9_]*\b)\s*:', r'"\1":', content)
    content = re.sub(r',\s*([\]}])', r'\1', content)
    return json.loads(content)


def slug_from_link(link):
    return link.split('cidade=')[-1]


def year_months_from_years(years):
    return [f"{year}-{month}" for year, month in years]


def main():
    dry_run = '--dry-run' in sys.argv
    key_args = [a for a in sys.argv[1:] if not a.startswith('--')]

    if not key_args:
        print("Usage: seed_cities.py <service-account.json> [--dry-run]")
        sys.exit(1)

    if not dry_run:
        cred = credentials.Certificate(key_args[0])
        firebase_admin.initialize_app(cred)
        db = firestore.client()

    locations = parse_locations()
    count = 0

    if not dry_run:
        batch = db.batch()

    for loc in locations:
        slug = slug_from_link(loc['link'])
        data = {
            'name':       loc['title'],
            'slug':       slug,
            'country':    loc['country'],
            'coords':     loc['coords'],
            'yearMonths': year_months_from_years(loc.get('years', [])),
        }
        if loc.get('pinOnly'):
            data['pinOnly'] = True

        print(f"  {'[dry] ' if dry_run else ''}{slug}: {loc['title']} — {len(data['yearMonths'])} visit(s)")

        if not dry_run:
            doc_ref = db.collection('cities').document(slug)
            batch.set(doc_ref, data, merge=True)

        count += 1

        if not dry_run and count % 499 == 0:
            batch.commit()
            batch = db.batch()

    if not dry_run:
        batch.commit()

    print(f"\n{'[dry-run] ' if dry_run else ''}Seeded {count} cities.")


if __name__ == '__main__':
    main()

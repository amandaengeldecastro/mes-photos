#!/usr/bin/env python3
"""
Substitui caminhos locais de imagens pelos URLs do Firebase Storage
em todos os arquivos HTML do projeto.

Requer: storage_urls.json (gerado por upload_photos.py)

Uso:
  python3 update_html_paths.py [--dry-run]

Com --dry-run mostra o que seria alterado sem gravar nada.
"""

import json, glob, sys

MAPPING_FILE = 'storage_urls.json'
DRY_RUN      = '--dry-run' in sys.argv


def main():
    try:
        with open(MAPPING_FILE, encoding='utf-8') as f:
            mapping = json.load(f)
    except FileNotFoundError:
        print(f'Arquivo {MAPPING_FILE} não encontrado.')
        print('Execute upload_photos.py primeiro.')
        sys.exit(1)

    # Ordena do caminho mais longo para o mais curto para evitar
    # substituições parciais quando um nome é prefixo de outro.
    pairs = sorted(mapping.items(), key=lambda x: -len(x[0]))

    html_files = sorted(glob.glob('*.html'))
    total_subs = 0

    for html_file in html_files:
        with open(html_file, encoding='utf-8') as f:
            original = f.read()

        updated = original
        count   = 0
        for local_path, url in pairs:
            if local_path in updated:
                new = updated.replace(local_path, url)
                count += updated.count(local_path)
                updated = new

        if count:
            total_subs += count
            tag = '[dry-run] ' if DRY_RUN else ''
            print(f'  {tag}{html_file}: {count} substituição(ões)')
            if not DRY_RUN:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(updated)
        else:
            print(f'  {html_file}: sem alterações')

    mode = ' [DRY RUN — nada gravado]' if DRY_RUN else ''
    print(f'\nTotal: {total_subs} caminhos atualizados{mode}')
    if DRY_RUN:
        print('Execute sem --dry-run para aplicar.')


if __name__ == '__main__':
    main()

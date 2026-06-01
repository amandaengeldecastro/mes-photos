#!/usr/bin/env python3
"""
Faz upload de todas as fotos em images/ para o Firebase Storage.
Salva o mapeamento de caminhos locais → URLs em storage_urls.json.

Pré-requisitos:
  pip install firebase-admin

Como obter o service-account.json:
  Firebase Console → Configurações do projeto → Contas de serviço
  → Gerar nova chave privada → salvar como service-account.json

Uso:
  python3 upload_photos.py [service-account.json]
"""

import sys, os, json, urllib.parse
import firebase_admin
from firebase_admin import credentials, storage

BUCKET     = 'maps-1464e.firebasestorage.app'
IMAGES_DIR = 'images'
OUTPUT     = 'storage_urls.json'


def make_url(storage_path):
    encoded = urllib.parse.quote(storage_path, safe='')
    return f'https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o/{encoded}?alt=media'


def main():
    key_file = sys.argv[1] if len(sys.argv) > 1 else 'service-account.json'
    if not os.path.exists(key_file):
        print(f'Arquivo não encontrado: {key_file}')
        print('Veja as instruções no cabeçalho deste script.')
        sys.exit(1)

    cred = credentials.Certificate(key_file)
    firebase_admin.initialize_app(cred, {'storageBucket': BUCKET})
    bucket = storage.bucket()

    mapping  = {}
    uploaded = 0
    skipped  = 0
    errors   = []

    for root, dirs, files in os.walk(IMAGES_DIR):
        dirs[:] = sorted(d for d in dirs if not d.startswith('.'))
        for filename in sorted(files):
            if filename.startswith('.'):
                continue

            local_path   = os.path.join(root, filename)
            storage_path = local_path.replace(os.sep, '/')
            url          = make_url(storage_path)

            # Guarda as duas variantes usadas nos HTMLs
            mapping['./' + storage_path] = url
            mapping[storage_path]        = url

            blob = bucket.blob(storage_path)
            try:
                if blob.exists():
                    print(f'  ✓ já existe  {storage_path}')
                    skipped += 1
                else:
                    blob.upload_from_filename(local_path)
                    print(f'  ↑ enviado    {storage_path}')
                    uploaded += 1
            except Exception as e:
                print(f'  ✗ erro       {storage_path} — {e}')
                errors.append(storage_path)

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    print(f'\n{uploaded} enviados  {skipped} já existiam  {len(errors)} erros')
    print(f'Mapeamento salvo em {OUTPUT}')
    if errors:
        print('\nArquivos com erro:')
        for e in errors:
            print(f'  {e}')


if __name__ == '__main__':
    main()

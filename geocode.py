#!/usr/bin/env python3
"""
Preenche automaticamente coordenadas faltando no map.js usando Nominatim (OpenStreetMap).
Uso: python3 geocode.py

Para adicionar uma nova cidade, inclua a entrada em map.js SEM o campo coords:
  { title: "Nova Cidade — PR", country: "Brasil", link: "novacidade.html", years: [[2026,5]] },

Depois rode este script uma vez. Ele busca as coordenadas e atualiza map.js.
"""

import re, json, time, urllib.request, urllib.parse, sys

COUNTRY_MAP = {
    'Brasil':    'Brazil',
    'Paraguai':  'Paraguay',
    'Argentina': 'Argentina',
    'Uruguai':   'Uruguay',
    'Colômbia':  'Colombia',
    'Venezuela': 'Venezuela',
}

STATE_MAP = {
    'PR': 'Paraná', 'SC': 'Santa Catarina', 'RS': 'Rio Grande do Sul',
    'SP': 'São Paulo', 'RJ': 'Rio de Janeiro', 'MG': 'Minas Gerais',
    'BA': 'Bahia', 'DF': 'Distrito Federal', 'MS': 'Mato Grosso do Sul',
    'AM': 'Amazonas', 'GO': 'Goiás', 'PE': 'Pernambuco',
}

def parse_title(title):
    """'Curitiba — PR' → ('Curitiba', 'PR')"""
    parts = title.split(' — ')
    city = parts[0].strip()
    state = parts[1].strip() if len(parts) > 1 else None
    return city, state

def nominatim_search(title, country):
    city, state = parse_title(title)
    country_en = COUNTRY_MAP.get(country, country)

    parts = [city]
    if state and state in STATE_MAP:
        parts.append(STATE_MAP[state])
    parts.append(country_en)

    query = ', '.join(parts)
    params = urllib.parse.urlencode({'q': query, 'format': 'json', 'limit': 1})
    url = f'https://nominatim.openstreetmap.org/search?{params}'

    req = urllib.request.Request(url, headers={
        'User-Agent': 'mes-photos-geocoder/1.0 (personal portfolio)'
    })

    with urllib.request.urlopen(req, timeout=10) as resp:
        results = json.loads(resp.read())

    if results:
        lat = round(float(results[0]['lat']), 4)
        lon = round(float(results[0]['lon']), 4)
        return [lat, lon]
    return None

def main():
    with open('map.js', encoding='utf-8') as f:
        content = f.read()

    entries = list(re.finditer(r'\{([^{}]+)\}', content))
    missing = [m for m in entries if 'coords:' not in m.group(0)]

    if not missing:
        print('Todas as entradas já têm coordenadas.')
        return

    print(f'{len(missing)} entrada(s) sem coordenadas encontradas.\n')

    updated = content
    ok = 0
    fail = []

    for match in missing:
        entry_str = match.group(0)
        title_m   = re.search(r'title:\s*"([^"]+)"', entry_str)
        country_m = re.search(r'country:\s*"([^"]+)"', entry_str)

        if not title_m or not country_m:
            continue

        title   = title_m.group(1)
        country = country_m.group(1)

        print(f'  Buscando: {title} ({country}) ...', end=' ', flush=True)

        try:
            coords = nominatim_search(title, country)
        except Exception as e:
            print(f'erro ({e})')
            fail.append(title)
            time.sleep(1.1)
            continue

        if coords:
            new_entry = entry_str.replace('{', f'{{ coords: {coords},', 1)
            updated = updated.replace(entry_str, new_entry, 1)
            print(f'✓  {coords}')
            ok += 1
        else:
            print('✗  não encontrado')
            fail.append(title)

        time.sleep(1.1)  # respeita limite de 1 req/s do Nominatim

    if ok:
        with open('map.js', 'w', encoding='utf-8') as f:
            f.write(updated)
        print(f'\n✓ {ok} coordenada(s) adicionada(s) ao map.js')

    if fail:
        print(f'\n✗ Não encontradas ({len(fail)}):')
        for t in fail:
            print(f'   {t}  ← adicione as coords manualmente')

if __name__ == '__main__':
    main()

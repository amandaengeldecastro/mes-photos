# mes-photos

Personal photo portfolio and travel journal hosted on GitHub Pages. Authentication is required to view content. All photos are stored in Firebase Storage and metadata in Firestore.

---

## Architecture

The project is a static site (HTML, CSS, vanilla JavaScript) with no build step or framework. Firebase provides authentication, database, and file storage. All pages are served directly by GitHub Pages.

```
Browser
  └── GitHub Pages (static files)
        ├── Firebase Auth       (Google Sign-In)
        ├── Firebase Firestore  (photo metadata, likes, comments)
        └── Firebase Storage    (photo files)
```

Authentication is enforced client-side via an overlay injected by `auth.js`. Firebase security rules enforce it server-side on every Firestore and Storage request.

---

## Project Structure

```
mes-photos/
├── index.html              Landing page
├── maps.html               Interactive map with timeline
├── city.html               Dynamic city page (single template for all cities)
├── music.html              Music page
├── pets.html               Pets page
│
├── locations-data.js       Array of all locations (coords, title, country, link, years)
├── map.js                  Leaflet map initialization and timeline rendering
├── gallery.js              Photo modal, lazy loading, keyboard navigation
├── auth.js                 Google Sign-In, auth state, login notification
├── social.js               Likes and comments (Firestore real-time)
├── upload.js               Admin photo upload interface (owner only)
├── firebase-loader.js      Async loader for all Firebase and third-party scripts
├── firebase-config.js      Firebase initialization (credentials — not committed to git)
│
├── styles.css              Map page styles
├── city-styles.css         City page styles and timeline layout
├── auth-social.css         Auth overlay, likes, comments, upload panel
│
├── manifest.json           PWA manifest
├── service-worker.js       Service worker (offline cache)
│
├── firestore.rules         Firestore security rules
├── storage.rules           Firebase Storage security rules
│
├── icons/
│   └── icon-512.png        PWA icon (used for both 192px and 512px)
│
├── geocode.py              Utility: fetch coordinates from Nominatim for new cities
├── upload_photos.py        Migration: batch upload local images to Firebase Storage
├── update_html_paths.py    Migration: replace local image paths with Storage URLs in HTML
├── extract_to_firestore.py Migration: extract photo metadata from HTML into Firestore
│
├── .gitignore
└── README.md
```

---

## Pages

| File | Description |
|---|---|
| `index.html` | Landing page with name, links and map entry point |
| `maps.html` | World map (Leaflet) with collapsible timeline sidebar |
| `city.html?cidade={slug}` | City page — loads photos dynamically from Firestore |
| `music.html` | Music references |
| `pets.html` | Pet photos |

City pages are no longer individual HTML files. A single `city.html` template receives the city slug via query string and loads all data from Firestore.

---

## Adding a New City

1. Add an entry to `locations-data.js`:
```js
{ coords: [-25.00, -49.00], title: "Nova Cidade — PR", country: "Brasil",
  link: "city.html?cidade=novacidade", years: [[2026, 6]] }
```

2. If coordinates are unknown, run the geocoder:
```bash
python3 geocode.py
```

3. Open `city.html?cidade=novacidade` in the browser, log in, and use the upload button to add photos.

No HTML file needs to be created.

---

## External APIs and Services

### Leaflet (map rendering)
- Version: 1.9.4
- CDN: `unpkg.com/leaflet`
- Tile layer: CartoDB Light (`basemaps.cartocdn.com/light_all`)
- No API key required

### Firebase (Google)
- Plan: Blaze (pay-as-you-go, free tier applies)
- Services used: Authentication, Firestore, Storage
- SDK: Firebase Compat v10.14.1 via `gstatic.com`
- Credentials stored in `firebase-config.js` — this file is not committed to git

### EmailJS
- Used to send an email notification on each new login
- SDK: `@emailjs/browser` v4 via jsDelivr CDN
- Credentials stored in `firebase-config.js`

### Nominatim (OpenStreetMap)
- Used by `geocode.py` to resolve city coordinates
- Free, no API key required
- Rate limit: 1 request per second (enforced in script)

---

## Firestore Data Model

```
likes/{photoId}
  count:  number
  users:  { [uid]: true }

comments/{photoId}/entries/{autoId}
  userId:       string
  userName:     string
  userPhotoURL: string
  text:         string (max 300 chars)
  createdAt:    timestamp

logins/{uid}
  email:       string
  name:        string
  photoURL:    string
  firstLoginAt: timestamp
  lastLoginAt:  timestamp
  loginCount:   number

cities/{citySlug}
  name:  string
  color: string (hex, timeline accent color)
  slug:  string

photos/{citySlug}/entries/{autoId}
  citySlug:   string
  year:       number
  month:      number (1–12)
  eventTitle: string
  title:      string (caption)
  url:        string (Firebase Storage URL)
  order:      number (position within the month event)
  createdAt:  timestamp
```

`photoId` used in `likes` and `comments` is the Storage path of the image, sanitized to use underscores instead of slashes and dots.

---

## Firebase Storage Structure

```
images/
  locations/
    {COUNTRY_CODE}/
      {STATE_CODE}/
        {filename}        Migrated photos (read-only, public)

uploads/
  {citySlug}/
    {year}_{month}_{timestamp}_{filename}   Photos uploaded via the app
```

---

## Security Rules Summary

### Firestore

| Collection | Read | Write |
|---|---|---|
| `likes` | Authenticated | Authenticated |
| `comments/*/entries` | Authenticated | Owner (create), Owner or admin (delete) |
| `logins` | Own document | Own document |
| `cities` | Authenticated | Admin only |
| `photos/*/entries` | Authenticated | Admin only |

### Storage

| Path | Read | Write |
|---|---|---|
| `images/**` | Public | Disabled |
| `uploads/**` | Public | Admin only, image files, max 20 MB |

---

## Authentication Flow

1. Page loads with `body.auth-loading` (content hidden)
2. `firebase-loader.js` loads Firebase SDK asynchronously
3. `auth.js` calls `firebase.auth().onAuthStateChanged()`
4. If no user: auth overlay is injected with Google Sign-In button
5. On sign-in: overlay is removed, `userLoggedIn` event is dispatched
6. Listeners in `gallery.js`, `city.html`, and `social.js` react to `userLoggedIn`
7. On first login or after 24 hours: login record is written to Firestore and email notification is sent via EmailJS

---

## Migration Scripts

These scripts were used to migrate from a static HTML photo archive to the current Firebase-backed architecture. They may be used again for bulk operations.

| Script | Purpose |
|---|---|
| `upload_photos.py` | Uploads all files from `images/` to Firebase Storage |
| `update_html_paths.py` | Replaces local image paths with Storage URLs in HTML files |
| `extract_to_firestore.py` | Reads photo metadata from HTML files and writes to Firestore |

All three require a Firebase Admin SDK service account key (`*-firebase-adminsdk-*.json`), which must be placed in the project root and is excluded from version control.

```bash
python3 -m venv .venv
.venv/bin/pip install firebase-admin beautifulsoup4
.venv/bin/python3 upload_photos.py service-account.json
.venv/bin/python3 update_html_paths.py
.venv/bin/python3 extract_to_firestore.py
```

---

## PWA

The app is installable as a Progressive Web App on Android and iOS.

- Manifest: `manifest.json`
- Icon: `icons/icon-512.png` (used for all sizes)
- Splash screen: full-screen photo shown on launch in standalone mode
- Service worker: `service-worker.js` (basic offline cache)
- Start URL: `maps.html`

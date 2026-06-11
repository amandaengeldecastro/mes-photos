# mes-photos

Personal photo portfolio and travel journal hosted on GitHub Pages. Authentication is required to view content. All photos are stored in Firebase Storage and metadata in Firestore.

---

## Architecture

Static site (HTML, CSS, vanilla JavaScript) with no build step or framework. Firebase provides authentication, database, and file storage. All pages are served directly by GitHub Pages.

```
Browser
  └── GitHub Pages (static files)
        ├── Firebase Auth       (Google Sign-In)
        ├── Firebase Firestore  (photo metadata, likes, comments, logins, cities)
        └── Firebase Storage    (photo and video files)
```

Authentication is enforced client-side via an overlay injected by `auth.js`. Firebase security rules enforce it server-side on every Firestore and Storage request. Sessions expire after 24 hours — the user is automatically signed out and must re-authenticate.

---

## Project Structure

```
mes-photos/
├── index.html              Landing page with editable profile
├── maps.html               Interactive map with timeline sidebar
├── city.html               Dynamic city page (single template for all cities)
├── music.html              Music timeline (static + Firestore entries)
├── pets.html               Pets gallery (static + Firestore entries)
│
├── map.js                  Leaflet map, timeline rendering, city overrides
├── gallery.js              Photo modal, lazy loading, keyboard navigation, inline edit
├── auth.js                 Google Sign-In, session management (24h), email notification
├── social.js               Likes and comments (Firestore real-time)
├── upload.js               Admin photo/city upload interface
├── profile.js              Editable profile (reads/writes logins/{uid})
├── pets.js                 Pets Firestore loader and admin upload
├── music.js                Music Firestore loader and admin upload
├── firebase-loader.js      Async loader for Firebase, EmailJS, and page scripts
├── firebase-config.js      Firebase init + ADMIN_EMAIL constant (not committed)
│
├── styles.css              Map page styles
├── city-styles.css         City page styles, timeline, photo cells
├── auth-social.css         Auth overlay, social bar, upload panel, FAB
│
├── manifest.json           PWA manifest
├── service-worker.js       Service worker (offline cache, v2)
│
├── firestore.rules         Firestore security rules
├── storage.rules           Firebase Storage security rules
│
├── ROADMAP.md              Social network evolution plan
│
├── icons/
│   └── icon-512.png        PWA icon
│
├── geocode.py              Utility: fetch coordinates from Nominatim
├── upload_photos.py        Migration: batch upload local images to Firebase Storage
├── update_html_paths.py    Migration: replace local paths with Storage URLs
├── extract_to_firestore.py Migration: extract photo metadata from HTML into Firestore
│
└── .gitignore
```

---

## Pages

| File | Description |
|---|---|
| `index.html` | Landing page — editable profile (name, role, location, bio, links) |
| `maps.html` | World map (Leaflet) with collapsible timeline sidebar |
| `city.html?cidade={slug}` | City page — loads photos from Firestore, supports inline caption edit |
| `music.html` | Music timeline — static entries + Firestore, admin can add YouTube/video |
| `pets.html` | Pets gallery — static entries + Firestore, admin can add/remove/rename |

---

## Admin Features

All admin features are gated by `ADMIN_EMAIL` in `firebase-config.js`.

| Page | Feature |
|---|---|
| `index.html` | Edit name, role, location, bio inline (✎). Add/remove links with auto-detected icons |
| `maps.html` | Add new cities (geocoded via Nominatim) |
| `city.html` | Upload photos, edit captions (✎), delete photos |
| `music.html` | Add YouTube URLs or upload video files, remove entries |
| `pets.html` | Add pets (photo + name), rename, remove |

---

## Adding a New City

1. Log in as admin on `maps.html`
2. Click the `+` FAB button → fill in city name, state, country
3. Coordinates are resolved automatically via Nominatim
4. Navigate to the new city page and upload photos

No HTML file or code change needed.

---

## Firestore Data Model

```
logins/{uid}
  email:           string
  name:            string
  photoURL:        string
  firstLoginAt:    timestamp
  lastLoginAt:     timestamp
  lastNotifiedAt:  timestamp
  loginCount:      number
  role:            string        (editable profile field)
  location:        string        (editable profile field)
  bio:             string        (editable profile field)
  links:           array         (editable links with type, label, url)

cities/{citySlug}
  name:       string
  slug:       string
  country:    string
  coords:     [lat, lng]
  yearMonths: string[]  (e.g. ["2026-5", "2025-9"])
  liveFrom:   number    (optional — hides years >= this from timeline)
  subtitle:   string    (optional — shown in map popup)
  pinOnly:    boolean   (optional — pin on map, excluded from timeline)

photos/{citySlug}/entries/{autoId}
  citySlug:   string
  year:       number
  month:      number (1–12)
  eventTitle: string
  title:      string (caption)
  url:        string (Firebase Storage URL)
  order:      number
  uploadedBy: string (uid)
  createdAt:  timestamp
  source:     string ("manual" | "instagram" | "telegram")

likes/{photoId}
  count:  number
  users:  { [uid]: true }

comments/{photoId}/entries/{autoId}
  userId:    string
  userName:  string
  userPhoto: string
  text:      string (max 300 chars)
  createdAt: timestamp

pets/{autoId}
  name:   string
  url:    string (Firebase Storage URL)
  order:  number

music/{autoId}
  title:  string
  year:   number
  type:   string ("youtube" | "video")
  url:    string
  order:  number
```

`photoId` in `likes` and `comments` is derived from the Storage path of the image (last 80 chars, non-alphanumeric replaced with `_`).

---

## Firebase Storage Structure

```
images/
  locations/{COUNTRY}/{STATE}/{filename}   Migrated photos (public read)
  pets/{filename}                          Pet photos
  music/{filename}                         Music videos

uploads/
  {citySlug}/{year}_{month}_{timestamp}_{filename}   Photos uploaded via app
```

---

## Security Rules Summary

### Firestore

| Collection | Read | Write |
|---|---|---|
| `likes` | Authenticated | Authenticated |
| `comments/*/entries` | Authenticated | Owner (create), Owner or admin (delete) |
| `logins/{uid}` | Own document | Own document |
| `cities` | Authenticated | Admin only |
| `photos/*/entries` | Authenticated | Admin only (create, update, delete) |
| `pets` | Authenticated | Admin only |
| `music` | Authenticated | Admin only |

### Storage

| Path | Read | Write |
|---|---|---|
| `images/**` | Public | Disabled |
| `uploads/**` | Public | Admin only, image files, max 20 MB |

---

## Authentication Flow

1. Page loads with `body.auth-loading` (content hidden)
2. `firebase-loader.js` loads Firebase SDK + page-specific scripts (profile, music, pets) asynchronously
3. `auth.js` calls `firebase.auth().onAuthStateChanged()`
4. If no user: auth overlay injected with Google Sign-In button
5. On sign-in: overlay removed, `userLoggedIn` custom event dispatched
6. All page scripts listen to `userLoggedIn` to initialize
7. Session stored in `localStorage` — expires after 24h, `auth.signOut()` called automatically
8. On new session: login record written to Firestore and email notification sent via EmailJS

---

## Profile Editing

The landing page (`index.html`) loads profile data from `logins/{uid}` in Firestore. When logged in as admin:

- Click ✎ next to name, role, location, or bio to edit inline
- Links section shows `+` to add and `✕` to remove (map link is protected)
- Adding a link: paste the URL — icon is auto-detected from domain (X, YouTube, TikTok, Spotify, GitHub, etc.); favicon fallback for unknown services
- On mobile with 4+ links: labels are hidden, only icons shown to save space

---

## City Overrides

`map.js` contains a `CITY_OVERRIDES` object for client-side overrides without Firestore changes:

```js
const CITY_OVERRIDES = {
    curitiba:    { liveFrom: 2024, subtitle: '[2024 ~]' },
    fozdoiguacu: { subtitle: '[1993 – 2024]' },
};
```

`liveFrom` hides years >= that value from the timeline (city of residence). `subtitle` appears in the map popup.

---

## PWA

Installable as a Progressive Web App on Android and iOS.

- Manifest: `manifest.json`
- Start URL: `index.html`
- Icon: `icons/icon-512.png`
- Splash screen: full-screen photo on standalone launch
- Service worker: `service-worker.js` (cache version: `maps-v2`)

---

## External Services

| Service | Purpose | Cost |
|---|---|---|
| Firebase Auth | Google Sign-In | Free |
| Firestore | Database | Free tier |
| Firebase Storage | Photos and videos | Free tier (5 GB) |
| GitHub Pages | Hosting | Free |
| Leaflet 1.9.4 | Map rendering | Free / open source |
| CartoDB Light | Map tiles | Free |
| EmailJS | Login notification emails | Free tier |
| Nominatim | City geocoding | Free |
| Google Favicon API | Link icons fallback | Free |

---

## Migration Scripts

Used to migrate from a static HTML archive to the current Firebase architecture.

| Script | Purpose |
|---|---|
| `upload_photos.py` | Uploads files from `images/` to Firebase Storage |
| `update_html_paths.py` | Replaces local paths with Storage URLs in HTML |
| `extract_to_firestore.py` | Writes photo metadata from HTML into Firestore |

Require a Firebase Admin SDK service account key (`*-firebase-adminsdk-*.json`) in the project root.

```bash
python3 -m venv .venv
.venv/bin/pip install firebase-admin beautifulsoup4
.venv/bin/python3 upload_photos.py
.venv/bin/python3 update_html_paths.py
.venv/bin/python3 extract_to_firestore.py
```

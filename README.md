# Echoes of Life — V2.5.1

## Weapon Archive Update
- Added DEFAULT / RIFLES / M4.
- Added DEFAULT / SNIPER RIFLES / M40.
- Added dedicated detail pages for M4 and M40.
- Added new DEFAULT weapon artwork for both records.
- Updated weapon type counts and archive lists.
- Kept the existing DEFAULT/CUSTOM hierarchy and current audio/UI systems unchanged.

Echoes of Life — V2.5.1

## Audio pass (this version)
- UI sounds (hover/click/open/toggle) are now synthesized with the Web Audio API instead of played from .wav files — crisp square/triangle-wave chiptune blips instead of soft sampled clicks. The four .wav files were removed since nothing loads them anymore.
- Added a small tactile "press" animation (scale down slightly on :active) to buttons and cards, paired with the new click sound.
- Hardened the music autoplay fallback: browsers block audio-with-sound before any page interaction, full stop — no site code can override that, it's a platform policy. What changed: music now starts on the very first click/tap/keypress anywhere on the page (not only via the dedicated music button), using a cleaner one-shot listener instead of the previous retry loop.
- Removed two leftover `data-sound="open.wav"` attributes on the rifle/pistol category pages — they referenced the old file-based system and didn't do anything.


- Added a subtle drifting dust/ash layer sitewide (css/effects/enhancements.css + js/modules/ambientDust.js), off automatically under prefers-reduced-motion.
- Added a soft, irregular light-flicker animation to the hero background on every page (old-wiring feel, not a strobe).
- Added a "section stamp" label (FIELD REPORT, PERSONNEL FILE, INVENTORY LOG, SITE SURVEY, CONTAINMENT LOG, FIELD MANUAL, OPERATIONS LOG, COMMS LOG) to each standalone page's header.
- Added a worn-edge vignette plus a brief amber scan-line sweep on hover for .image-frame and .category-card.
- Added a small console easter egg (js/modules/consoleLog.js) for anyone who opens devtools.
- Added a static "DAY 601 SINCE THE OUTBREAK" line to the footer, next to the version tag — kept as a fixed number (not a real-time ticking clock), since the in-world date shouldn't drift with a visitor's calendar.
- The pixel-map version of the Locations page (click points on a small world map instead of a card grid) was discussed and liked, but deliberately deferred to v2 — noted here so it isn't lost.


- Removed unused files left over from earlier iterations: js/main.js, dataRender.js, filters.js, boot.js, clock.js, sound.js, modal.js, navigation.js, scrollReveal.js, and js/data/*.js — none of these were loaded by any page (every page had already moved to hand-authored static HTML), so they were dead weight rather than working code.
- Removed the now-unused css/components/modal.css and its @import.
- Fixed --pixel-font so headings actually render in Pixelify Sans instead of silently falling back to Courier New (the Google Fonts request was loading the font but nothing referenced it).
- Replaced the public "ENGINE / UNITY / C#" hero badge with "STATUS / IN DEVELOPMENT" to match the original site brief; the CTAs still link straight to content (no dev-in-progress modal).
- Fixed the footer version string, which was stuck at "V2.3.1 AUDIO HOTFIX" on every page — now reads V2.5.1 consistently.
- Left assets/images/bg-bunker.png untouched (including the S.T.A.L.K.E.R. poster) — a replacement background is coming separately.

If the weapon/location catalog grows past a handful of entries, it's worth reviving a data-driven approach (a single source array + generated pages) instead of hand-authoring each page — the deleted files were a first attempt at that and are a reasonable starting point to rebuild from later.

# Echoes of Life — V2.5.1

В этой версии оружейный архив полностью перестроен.

## Weapons hierarchy

WEAPONS → DEFAULT / CUSTOM → weapon type → weapon records

Types:
- Pistols
- Rifles
- SMGs
- Sniper Rifles
- Machine Guns
- Special

Current records:
- DEFAULT / PISTOLS / GLOCK 17
- DEFAULT / RIFLES / AKM
- DEFAULT / RIFLES / M4
- DEFAULT / SNIPER RIFLES / M40

CUSTOM пока содержит только подготовленные пустые категории.

## New sections
- Devlog
- Contacts
- Login

Login сейчас работает как локальный профиль устройства через localStorage. Серверной авторизации нет.

## Audio
Текущая музыка сайта остаётся одной дорожкой. Система random playlist пока намеренно не добавлена — она появится после загрузки дополнительных треков.


V2.5.1 changes:
- Weapon type pages are selection pages only.
- Added AKM and GLOCK 17 detail pages with images + descriptions.
- Removed background music from all Weapons pages.
- Added site-wide UI click/hover/open sounds under assets/audio/ui/.
- Added more pronounced pixel interactions and weapon-choice animations.

### V2.5.1
- Global UI sound system is enabled across the whole multi-page site.
- Hover/focus sounds are used for navigation, cards and interactive controls.
- Click/open/toggle sounds are used according to the UI element.
- Weapon pages keep music disabled; UI effects remain active.
- Added `css/components/ui-interactions.css` for unified pixel-style interactions and micro-animations.


## V2.5.1
- Expanded weapon showcase frame so the full metal frame remains visible on desktop and mobile.
- Fixed weapon image cropping by preserving each asset's native aspect ratio.
- Updated the AKM and GLOCK 17 descriptions and basic identifying details.
- Replaced the UI sound set with softer, lower-volume interaction sounds.
- Moved the UI interaction import into the main CSS import section so the micro-animations apply consistently.
- Kept music disabled on weapon pages; only UI interaction audio is used there.

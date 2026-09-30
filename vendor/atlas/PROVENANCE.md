# Atlas assets: provenance and integrity

These files were fetched unchanged on 2026-09-30 and are served from
`/assets/atlas/` so that the Legal Data maps do not require a runtime CDN.

| Local file | Exact upstream | Version / licence | Integrity |
| --- | --- | --- | --- |
| `leaflet.css` | `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` | Leaflet 1.9.4 / BSD-2-Clause (`LICENSE.leaflet`) | `sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=` |
| `leaflet.js` | `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` | Leaflet 1.9.4 / BSD-2-Clause (`LICENSE.leaflet`) | `sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=` |
| `topojson-client.min.js` | `https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js` | topojson-client 3.1.0 / ISC (`LICENSE.topojson-client`) | `sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67` |
| `countries-110m.json` | `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json` | world-atlas 2.0.2 / ISC (`LICENSE.world-atlas`); Natural Earth source data is public domain | `sha384-yOCJ+8ShBm8UDqtAVtAvxTDDf4gXo5edxl/YG0FmVC5OTmqVLl7utuVGBDEeZWHf` |

Leaflet's distribution images were copied from the same immutable 1.9.4
release because `leaflet.css` references them. Their SHA-256 digests are:

- `images/layers-2x.png`: `066daca850d8ffbef007af00b06eac0015728dee279c51f3cb6c716df7c42edf`
- `images/layers.png`: `1dbbe9d028e292f36fcba8f8b3a28d5e8932754fc2215b9ac69e4cdecf5107c6`
- `images/marker-icon-2x.png`: `00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528`
- `images/marker-icon.png`: `574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437`
- `images/marker-shadow.png`: `264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da`

For an additional byte-level check, the SHA-256 digests of the four main
assets are respectively `a7837102824184820dfa198d1ebcd109ff6d0ff9a2672a074b9a1b4d147d04c6`,
`db49d009c841f5ca34a888c96511ae936fd9f5533e90d8b2c4d57596f4e5641a`,
`25cd02ae486cc5063e0215a4e4cfb15de83700c87ac48bac4d57dc6aaf3ebb89`,
and `2516c915867c7baf18ddec727aec46c315541a07cfb3d79a6559b05d5e94eee8`.

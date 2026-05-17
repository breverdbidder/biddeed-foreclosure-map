# BidDeed.AI — Florida Foreclosure & Tax Deed Map

Live multi-county Florida foreclosure & tax deed auction map with Drive-for-Dollars (D4D) route builder.

![Version](https://img.shields.io/badge/version-16.0.0-blue)
![License](https://img.shields.io/badge/license-PROPRIETARY-red)
![Coverage](https://img.shields.io/badge/coverage-67%20FL%20counties-orange)

## 🌐 Live URLs
- **Main:** https://brevard-bidder-landing.pages.dev/map
- **Standalone:** https://biddeed-foreclosure-map.pages.dev

---

## 🎯 Features

### Live Multi-County Data
- 🟢 Runtime fetch from `v_investable_foreclosures` Supabase view
- 67 FL counties (RealAuction + RealForeclose scraped feed)
- ~400 upcoming auctions statewide at any time
- Graceful fallback to Jan 2025 baked sample on fetch failure

### Map Visualization
- Leaflet.js dark-themed map (statewide FL view by default)
- Color-coded circle markers by ML recommendation
- Click-to-zoom from property sidebar
- Popup details with photos and deep links

### Drive-for-Dollars (D4D) Route Builder
- 🎯 D4D mode toggle (top-right of map)
- `+ Route` button on every property card + popup
- Floating route panel: ordered stops, total miles, optimize, navigate
- ⚡ Nearest-neighbor TSP from `navigator.geolocation`
- 🧭 Open in Google Maps: free multi-stop directions URL
- Live dashed polyline overlay on map
- Phase 2 hook: Street View Insights pre-scoring placeholder

### ML Recommendations
| Color | Recommendation | Bid/Judgment Ratio |
|-------|---------------|-------------------|
| 🟢 Green | **BID** | ≥70% |
| 🟡 Yellow | **REVIEW** | 60-69% |
| 🔴 Red | **SKIP** | <60% |
| ⚠️ Red+Border | **HOA RISK** | Do Not Bid |

### Property Intelligence
- Case number, county, auction date
- Judgment amount & max bid (derived)
- Shapira ML score (derived from equity_band)
- Property details: beds, baths, sqft, year, photo
- HOA/condo heuristic detection
- Decision rationale

### Third Sword Target Zips
- **32937** Satellite Beach ($82K income)
- **32940** Viera/Melbourne ($78K income)
- **32903** Indialantic ($79K income)
- **32953** Merritt Island ($68K income)

---

## 📊 Max Bid Formula
```
MAX_BID = ARV × 70% − $10K − min($25K, 15% × ARV)
```
ARV = market_value OR avm_value from Supabase pipeline.

### Recommendation Thresholds
- **BID:** ratio ≥70% AND NOT hoa_likely
- **REVIEW:** ratio 60-69% AND NOT hoa_likely
- **SKIP:** ratio <60% OR hoa_likely

### HOA Heuristic
Foreclosure flagged HOA-likely when **judgment < $50K** AND **judgment/market ratio < 10%**.

---

## ⚠️ HOA/Condo Warning
**Critical:** HOA foreclosures do NOT extinguish senior mortgages! Always verify liens via AcclaimWeb before bidding.

---

## 🚀 Deployment
```bash
# Deploy to Cloudflare Pages
npm run deploy

# Local development
npm run dev
```

---

## 🏗️ Stack
- **Frontend:** Leaflet 1.9.4 + vanilla JS (no framework, no build step)
- **Data:** Supabase REST + publishable key (RLS-safe anon access)
- **Hosting:** Cloudflare Pages
- **Live source:** `public.v_investable_foreclosures` (69,585 rows, 67 counties)
- **D4D routing:** client-side Haversine + greedy nearest-neighbor TSP
- **Navigation handoff:** free `/maps/dir/?api=1` URL (no Maps Platform billing)

---

## 🛣️ Roadmap
- ✅ Phase 1: Multi-county branding + live scraper data + D4D route builder
- ⏳ Phase 2: Street View Insights pre-route distress scoring (BigQuery)
- ⏳ Phase 3: Routing Grounding Preview for AI-optimized routes
- ⏳ Phase 4: Combined Shapira V2 score (location + property + owner + field)

---

## 👨‍💻 Credits
**Ariel Shapira** — Solo Founder, Everest Capital USA

---

*BidDeed.AI V16.0 — Agentic AI Ecosystem*

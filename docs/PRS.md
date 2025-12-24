# Product Requirements Specification (PRS)
## BidDeed.AI Foreclosure Map - Technical Specification

**Version:** 1.0.0  
**Date:** December 24, 2025  
**Author:** Ariel Shapira / Claude AI Architect  
**Status:** ✅ PRODUCTION

---

## 1. System Overview

### 1.1 Purpose
This specification defines the technical implementation of the BidDeed.AI Foreclosure Map, an interactive geographic visualization tool for Brevard County foreclosure auctions.

### 1.2 Scope
- Single-page web application
- Brevard County, Florida coverage only
- January 2026 auction data (64 cases)
- Read-only display (no user input)

### 1.3 Definitions
| Term | Definition |
|------|------------|
| BECA | Brevard Electronic Court Access |
| BCPAO | Brevard County Property Appraiser's Office |
| Foreclosure | Legal process to recover loan balance |
| Judgment | Court-ordered amount owed |
| Third-party | Non-plaintiff auction winner |

---

## 2. Architecture

### 2.1 System Architecture Diagram
```
┌──────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE PAGES                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      index.html                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │   SIDEBAR    │  │     MAP      │  │    HARDCODED     │  │  │
│  │  │  - Stats     │  │  - Leaflet   │  │      DATA        │  │  │
│  │  │  - Filter    │  │  - Markers   │  │  - 64 cases      │  │  │
│  │  │  - List      │  │  - Popups    │  │  - Metadata      │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  OPENSTREETMAP  │
                    │   TILE SERVER   │
                    └─────────────────┘
```

### 2.2 Component Architecture
```
BidDeedForeclosureMap
├── Header
│   ├── Logo
│   └── Navigation
├── Sidebar
│   ├── AuctionLocationCard
│   ├── StatsGrid
│   │   ├── StatCard (Total)
│   │   ├── StatCard (Active)
│   │   ├── StatCard (Cancelled)
│   │   └── StatCard (Dates)
│   ├── DateFilter
│   ├── CaseList
│   │   ├── DateHeader
│   │   └── CaseItem[]
│   └── DataSourceFooter
├── MapContainer
│   ├── LeafletMap
│   │   ├── TileLayer (OSM)
│   │   ├── CourthouseMarker
│   │   └── ForeclosureMarker[]
│   └── MapLegend
└── Popup (template)
```

---

## 3. Data Structures

### 3.1 Foreclosure Record
```typescript
interface ForeclosureRecord {
  case_number: string;        // Format: "05-YYYY-CA-NNNNNN-XXXX-XX"
  plaintiff: string;          // Foreclosing party (bank, HOA, etc.)
  defendant: string;          // Property owner
  auction_date: string;       // ISO date "YYYY-MM-DD"
  status: "ACTIVE" | "CANCELLED";
}
```

### 3.2 Auction Metadata
```typescript
interface AuctionMetadata {
  source: string;             // "Brevard County Clerk of Court"
  sourceUrl: string;          // Clerk website URL
  courtRecordsUrl: string;    // BECA URL
  retrieved: string;          // Date data was scraped
  location: {
    name: string;             // Venue name
    room: string;             // Specific room
    address: string;          // Street address
    city: string;
    state: string;
    zip: string;
    coordinates: {
      lat: number;            // Latitude
      lng: number;            // Longitude
    }
  };
  time: string;               // "11:00 AM"
  type: string;               // "IN-PERSON ONLY"
  phone: string;              // Contact number
}
```

### 3.3 County Bounds
```typescript
interface CountyBounds {
  north: number;  // 28.75
  south: number;  // 27.85
  east: number;   // -80.45
  west: number;   // -80.90
  center: {
    lat: number;  // 28.35
    lng: number;  // -80.65
  }
}
```

---

## 4. API Specifications

### 4.1 External Dependencies

#### 4.1.1 Leaflet.js
- **Version**: 1.9.4
- **CDN**: https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
- **Integrity**: sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=
- **License**: BSD-2-Clause

#### 4.1.2 OpenStreetMap Tiles
- **URL Pattern**: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
- **Subdomains**: a, b, c
- **Max Zoom**: 19
- **Attribution Required**: Yes

### 4.2 External Links

| Resource | URL | Purpose |
|----------|-----|---------|
| BECA | https://vmatrix1.brevardclerk.us/beca/beca_splash.cfm | Court records lookup |
| Clerk Foreclosure List | http://vweb2.brevardclerk.us/Foreclosures/foreclosure_sales.html | Data source |
| BidDeed Dashboard | https://brevard-bidder-landing.pages.dev | Main app |
| AI Chat | https://brevard-bidder-landing.pages.dev/chat | Support interface |

---

## 5. User Interface Specifications

### 5.1 Layout Grid

```
┌────────────────────────────────────────────────────────────────┐
│                         HEADER (60px)                          │
├────────────────────┬───────────────────────────────────────────┤
│                    │                                           │
│     SIDEBAR        │                  MAP                      │
│     (380px)        │               (flexible)                  │
│                    │                                           │
│  ┌──────────────┐  │                                           │
│  │   LOCATION   │  │                                           │
│  └──────────────┘  │                                           │
│                    │                                           │
│  ┌──┐ ┌──┐ ┌──┐   │                                           │
│  └──┘ └──┘ └──┘   │                  ┌─────────┐              │
│  ┌──┐             │                  │ LEGEND  │              │
│  └──┘             │                  └─────────┘              │
│                    │                                           │
│  ┌──────────────┐  │                                           │
│  │    FILTER    │  │                                           │
│  └──────────────┘  │                                           │
│                    │                                           │
│  ┌──────────────┐  │                                           │
│  │  CASE LIST   │  │                                           │
│  │  (scroll)    │  │                                           │
│  └──────────────┘  │                                           │
│                    │                                           │
└────────────────────┴───────────────────────────────────────────┘
```

### 5.2 Color Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Navy Primary | #1E3A5F | 30, 58, 95 | Header, logo, courthouse |
| Navy Secondary | #2C5282 | 44, 82, 130 | Gradients |
| Green Accent | #68D391 | 104, 211, 145 | Logo accent |
| Active Green | #22c55e | 34, 197, 94 | Active markers |
| Cancelled Red | #ef4444 | 239, 68, 68 | Cancelled markers |
| Background | #f8fafc | 248, 250, 252 | Page background |
| Card Background | #ffffff | 255, 255, 255 | Cards, sidebar |
| Border | #e2e8f0 | 226, 232, 240 | Borders, dividers |
| Text Primary | #1e293b | 30, 41, 59 | Main text |
| Text Secondary | #64748b | 100, 116, 139 | Labels, meta |

### 5.3 Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Logo | System | 1.5rem | 700 | white |
| Page Title | System | - | - | - |
| Section Header | System | 0.8rem | 600 | #475569 |
| Card Title | System | 0.9rem | 600 | #1E3A5F |
| Stat Value | System | 1.75rem | 700 | varies |
| Stat Label | System | 0.7rem | 400 | #64748b |
| Case Number | Monospace | 0.7rem | 400 | #64748b |
| Case Parties | System | 0.875rem | 600 | #1e293b |
| Status Badge | System | 0.625rem | 700 | varies |

### 5.4 Responsive Breakpoints

| Breakpoint | Layout | Sidebar | Map |
|------------|--------|---------|-----|
| > 768px | Side-by-side | 380px fixed | Flexible |
| ≤ 768px | Stacked | 45vh | 55vh |

---

## 6. Functional Specifications

### 6.1 Map Initialization
```javascript
// Pseudocode
function initMap() {
  const map = L.map('map')
    .setView([28.35, -80.65], 10);  // Brevard center, zoom 10
  
  L.tileLayer(OSM_TILES, {
    attribution: COPYRIGHT,
    maxZoom: 18
  }).addTo(map);
  
  addCourthouseMarker(map);
  renderForeclosures(map, 'all');
  setupFilterListener();
}
```

### 6.2 Coordinate Generation
Properties don't have exact coordinates, so we distribute markers evenly:
```javascript
function generateCoordinates(index, total) {
  const rows = Math.ceil(Math.sqrt(total));
  const cols = Math.ceil(total / rows);
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  // Add jitter to avoid perfect grid
  const jitter = () => (Math.random() - 0.5) * 0.08;
  
  return {
    lat: BOUNDS.south + ((row + 0.5) / rows) * (BOUNDS.north - BOUNDS.south) + jitter(),
    lng: BOUNDS.west + ((col + 0.5) / cols) * (BOUNDS.east - BOUNDS.west) + jitter()
  };
}
```

### 6.3 Filter Logic
```javascript
function renderForeclosures(filter = 'all') {
  // Clear existing markers
  clearMarkers();
  
  // Filter data
  const filtered = filter === 'all' 
    ? FORECLOSURES 
    : FORECLOSURES.filter(f => f.auction_date === filter);
  
  // Group by date
  const byDate = groupBy(filtered, 'auction_date');
  
  // Render each group
  Object.keys(byDate).sort().forEach(date => {
    renderDateHeader(date);
    byDate[date].forEach(renderForeclosure);
  });
  
  // Update stats
  updateStats(filtered);
}
```

### 6.4 Popup Template
```html
<div class="popup-content">
  <h4>${plaintiff} vs ${defendant}</h4>
  <p class="detail"><strong>Case:</strong> ${case_number}</p>
  <p class="detail"><strong>Auction:</strong> ${formatted_date}</p>
  <p class="detail">
    <strong>Status:</strong> 
    <span style="color: ${status_color}; font-weight: 600;">
      ${status}
    </span>
  </p>
  <a href="${BECA_URL}" target="_blank" class="btn">
    View Court Records →
  </a>
</div>
```

---

## 7. Performance Requirements

### 7.1 Load Time Budget
| Phase | Target | Measurement |
|-------|--------|-------------|
| DNS Lookup | < 20ms | Chrome DevTools |
| Connection | < 50ms | Chrome DevTools |
| TTFB | < 200ms | Lighthouse |
| First Paint | < 500ms | Lighthouse |
| DOM Content | < 1000ms | Lighthouse |
| Full Load | < 2000ms | Lighthouse |

### 7.2 Bundle Size
| Asset | Size | Compressed |
|-------|------|------------|
| index.html | ~25KB | ~7KB gzip |
| Leaflet JS | 144KB | 42KB gzip |
| Leaflet CSS | 14KB | 4KB gzip |
| **Total** | **~183KB** | **~53KB** |

### 7.3 Memory Usage
- Initial: < 50MB
- With all 64 markers: < 75MB
- Peak (with popups): < 100MB

---

## 8. Security Considerations

### 8.1 Content Security
- No user input accepted
- No dynamic script loading
- All external resources use SRI
- HTTPS only (Cloudflare enforced)

### 8.2 Data Privacy
- No PII collected
- No cookies or tracking
- No analytics (future: Cloudflare Analytics)
- Public court data only

### 8.3 External Links
- Court records link opens in new tab
- Prevents clickjacking via CSP
- No sensitive data in URLs

---

## 9. Testing Requirements

### 9.1 Unit Tests
| Function | Test Cases |
|----------|------------|
| generateCoordinates | Valid index, edge cases, bounds |
| formatDate | Various date formats |
| renderForeclosures | Filter all, filter single date |
| updateStats | Correct counts |

### 9.2 Integration Tests
| Scenario | Expected Result |
|----------|-----------------|
| Page load | Map renders with 64 markers |
| Filter change | Markers update, stats update |
| Marker click | Popup displays correct data |
| Sidebar click | Map zooms to location |

### 9.3 Visual Tests
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### 9.4 Performance Tests
- Lighthouse score > 90
- No layout shifts
- No long tasks > 50ms

---

## 10. Deployment Specification

### 10.1 Cloudflare Pages Configuration
```yaml
# wrangler.toml (if needed)
name = "biddeed-foreclosure-map"
compatibility_date = "2025-12-24"

[site]
bucket = "./"
```

### 10.2 Deployment Commands
```bash
# Deploy via CLI
CLOUDFLARE_API_TOKEN="xxx" npx wrangler pages deploy . --project-name=biddeed-foreclosure-map

# Or via GitHub (auto-deploy on push)
git push origin main
```

### 10.3 Environment
| Setting | Value |
|---------|-------|
| Build command | (none - static) |
| Output directory | / |
| Root directory | / |
| Framework preset | None |

### 10.4 URLs
| Environment | URL |
|-------------|-----|
| Production | https://biddeed-foreclosure-map.pages.dev |
| Preview | https://{commit}.biddeed-foreclosure-map.pages.dev |
| Custom (future) | https://map.biddeed.ai |

---

## 11. Maintenance Procedures

### 11.1 Data Updates
**Frequency**: Weekly (before Wednesday auctions)

**Procedure**:
1. Visit http://vweb2.brevardclerk.us/Foreclosures/foreclosure_sales.html
2. Copy table data
3. Update FORECLOSURES array in index.html
4. Update dropdown options if dates change
5. Commit and push to GitHub
6. Verify deployment at production URL

### 11.2 Dependency Updates
**Frequency**: Monthly

**Leaflet.js**:
1. Check https://leafletjs.com for updates
2. Update CDN URL and SRI hash
3. Test all map functionality

### 11.3 Monitoring
- Cloudflare Analytics (page views, errors)
- Manual testing before each auction

---

## 12. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-24 | Initial release with Jan 2026 data |

---

## 13. Appendices

### A. Full Data Listing
See `/src/foreclosure-data.js` for complete hardcoded dataset.

### B. Leaflet API Reference
https://leafletjs.com/reference.html

### C. Brevard Clerk FAQ
https://www.brevardclerk.us/index.cfm/foreclosures#faqs

---

**Document Approved**: ✅  
**Implementation Complete**: ✅  
**Deployed**: https://biddeed-foreclosure-map.pages.dev

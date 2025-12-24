# Product Requirements Document (PRD)
## BidDeed.AI Foreclosure Map

**Version:** 1.0.0  
**Date:** December 24, 2025  
**Author:** Ariel Shapira / Claude AI Architect  
**Status:** ✅ DEPLOYED

---

## 1. Executive Summary

The BidDeed.AI Foreclosure Map provides Brevard County foreclosure investors with an interactive geographic visualization of upcoming auction properties. Unlike national housing data platforms (Reventure.app, Zillow, etc.), this map focuses exclusively on **actionable foreclosure auction data** for professional investors.

### Key Differentiator
> **"We don't show you where homes are expensive. We show you where deals are happening."**

---

## 2. Problem Statement

### Current Pain Points
1. **No Geographic Context**: Brevard Clerk's foreclosure list shows case numbers without map locations
2. **Manual Research Required**: Investors must cross-reference BCPAO, AcclaimWeb, and other sources
3. **Time-Sensitive Data**: Auctions happen weekly; delays cost deals
4. **Scattered Information**: Property data, liens, judgments spread across multiple systems

### Why Not Reventure.app?
| Reventure.app | BidDeed.AI |
|---------------|------------|
| National housing trends | Brevard County auctions only |
| Consumer audience | Professional investors |
| 30,000 ZIP codes | ~40 Brevard ZIPs |
| Generic home values | Specific judgment amounts |
| Subscription model | Internal alpha tool |

---

## 3. Product Goals

### Primary Objectives
1. **Visualize** all upcoming foreclosure auctions on an interactive map
2. **Filter** by auction date, status, plaintiff type
3. **Link** directly to court records (BECA) for due diligence
4. **Display** key auction metadata (case number, parties, status)

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Load Time | < 2s | Lighthouse audit |
| Data Accuracy | 100% | Match Clerk source |
| Mobile Usability | 90+ | Lighthouse score |
| User Engagement | 5+ min | Session duration |

---

## 4. User Stories

### US-1: View Upcoming Auctions
**As** a foreclosure investor  
**I want** to see all January 2026 auctions on a map  
**So that** I can identify geographic clusters and plan due diligence

**Acceptance Criteria:**
- [ ] Map displays all 64 January 2026 cases
- [ ] Each marker shows case summary on click
- [ ] Courthouse location prominently marked

### US-2: Filter by Auction Date
**As** a foreclosure investor  
**I want** to filter auctions by specific dates  
**So that** I can focus on auctions I plan to attend

**Acceptance Criteria:**
- [ ] Dropdown shows all 4 January dates
- [ ] Selecting date filters both map and sidebar
- [ ] Stats update to reflect filtered count

### US-3: Access Court Records
**As** a foreclosure investor  
**I want** to click through to BECA court records  
**So that** I can review judgment details and lien information

**Acceptance Criteria:**
- [ ] Each popup includes "View Court Records" link
- [ ] Link opens BECA in new tab
- [ ] Case number displayed for manual lookup

### US-4: Identify Cancelled Auctions
**As** a foreclosure investor  
**I want** to quickly identify cancelled cases  
**So that** I don't waste time researching unavailable properties

**Acceptance Criteria:**
- [ ] Cancelled cases show red markers
- [ ] Cancelled cases dimmed in sidebar
- [ ] Stats show active vs cancelled counts

---

## 5. Features Specification

### 5.1 Interactive Map
- **Technology**: Leaflet.js with OpenStreetMap tiles
- **Bounds**: Brevard County (27.85°N to 28.75°N, 80.45°W to 80.90°W)
- **Default Zoom**: Level 10 (county overview)
- **Max Zoom**: Level 18 (street level)

### 5.2 Marker System
| Type | Color | Size | Purpose |
|------|-------|------|---------|
| Active Case | #22c55e (green) | 18px | Available for bidding |
| Cancelled Case | #ef4444 (red) | 18px | No longer available |
| Courthouse | #1E3A5F (navy) | 32px | Auction location |

### 5.3 Sidebar Panel
- **Width**: 380px (collapsible on mobile)
- **Sections**:
  1. Auction Location info
  2. Statistics grid (4 cards)
  3. Date filter dropdown
  4. Scrollable case list
  5. Data source attribution

### 5.4 Popup Content
```
┌─────────────────────────────────┐
│ PLAINTIFF vs DEFENDANT          │
├─────────────────────────────────┤
│ Case: 05-2024-CA-XXXXX-XXCA-BC │
│ Auction: Wednesday, Jan 7, 2026 │
│ Status: ACTIVE                  │
├─────────────────────────────────┤
│ [View Court Records →]          │
└─────────────────────────────────┘
```

---

## 6. Technical Architecture

### 6.1 Stack
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Vanilla JS + HTML | No build step, fast load |
| Map | Leaflet.js 1.9.4 | Free, lightweight, mobile-ready |
| Tiles | OpenStreetMap | Free, no API key required |
| Hosting | Cloudflare Pages | Free, global CDN, auto-deploy |
| Source Control | GitHub | Version control, CI/CD |

### 6.2 Data Flow
```
Brevard Clerk Website → Manual Scrape → JSON Data → index.html → Cloudflare Pages
     (weekly)              (Claude)       (hardcoded)   (deployed)    (live)
```

### 6.3 File Structure
```
biddeed-foreclosure-map/
├── index.html           # Main app (self-contained)
├── src/
│   ├── foreclosure-data.js  # Hardcoded January 2026 data
│   ├── map.js               # Leaflet map logic
│   └── styles.css           # BidDeed.AI branding
├── data/
│   └── january_2026_foreclosures.json
├── docs/
│   ├── PRD.md               # This document
│   └── PRS.md               # Product Requirements Spec
├── README.md
└── package.json
```

---

## 7. Data Specification

### 7.1 Source
- **URL**: http://vweb2.brevardclerk.us/Foreclosures/foreclosure_sales.html
- **Format**: HTML table
- **Update Frequency**: Weekly (before Wednesday auctions)
- **Authority**: Official Brevard County Clerk of Court

### 7.2 Data Schema
```javascript
{
  case_number: string,      // "05-2024-CA-012193-XXCA-BC"
  plaintiff: string,        // "US BANK NA"
  defendant: string,        // "JOHN DOE"
  auction_date: string,     // "2026-01-07" (ISO date)
  status: "ACTIVE" | "CANCELLED"
}
```

### 7.3 January 2026 Summary
| Auction Date | Day | Total | Active | Cancelled |
|--------------|-----|-------|--------|-----------|
| 2026-01-07 | Wednesday | 20 | 19 | 1 |
| 2026-01-14 | Wednesday | 24 | 20 | 4 |
| 2026-01-26 | Monday | 1 | 1 | 0 |
| 2026-01-28 | Wednesday | 19 | 17 | 2 |
| **Total** | | **64** | **57** | **7** |

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Initial load: < 2 seconds
- Map render: < 500ms
- Filter response: < 100ms

### 8.2 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatible popups

### 8.3 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 8.4 Mobile Responsiveness
- Breakpoint: 768px
- Mobile layout: stacked (sidebar above map)
- Touch-friendly markers: 44px tap target

---

## 9. Future Roadmap

### Phase 2: Dynamic Data (Q1 2026)
- [ ] Auto-scrape Brevard Clerk weekly
- [ ] GitHub Actions workflow
- [ ] Historical auction results

### Phase 3: Property Details (Q2 2026)
- [ ] BCPAO integration (parcel data)
- [ ] Property photos
- [ ] Assessed values

### Phase 4: ML Integration (Q3 2026)
- [ ] XGBoost recommendation scores
- [ ] Max bid calculations
- [ ] Third-party probability predictions

---

## 10. Appendix

### A. Competitive Analysis

| Feature | BidDeed.AI | PropertyOnion | Reventure |
|---------|------------|---------------|-----------|
| Brevard Foreclosures | ✅ | ✅ | ❌ |
| Interactive Map | ✅ | ✅ | ✅ |
| Court Record Links | ✅ | ✅ | ❌ |
| ML Predictions | 🔜 | ❌ | ❌ |
| Lien Analysis | 🔜 | ❌ | ❌ |
| Price | FREE | $49/mo | $49/mo |

### B. Related Documents
- [BidDeed.AI Landing Page](https://brevard-bidder-landing.pages.dev)
- [AI Chat Interface](https://brevard-bidder-landing.pages.dev/chat)
- [GitHub Repository](https://github.com/breverdbidder/biddeed-foreclosure-map)

### C. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-24 | Claude AI | Initial release |

---

**Document Status**: ✅ APPROVED  
**Deployment URL**: https://biddeed-foreclosure-map.pages.dev

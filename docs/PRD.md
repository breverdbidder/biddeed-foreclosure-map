# Product Requirements Document (PRD)
## BidDeed.AI Foreclosure Map V15.0

**Author:** Ariel Shapira, Solo Founder  
**Date:** December 24, 2024  
**Status:** ✅ DEPLOYED  

---

## 1. Executive Summary

The BidDeed.AI Foreclosure Map is an interactive visualization tool for Brevard County foreclosure auctions. It replaces the abandoned "Reventure.app clone" initiative with a focused, investor-centric tool that leverages existing BidDeed.AI data.

### Key Differentiators vs Reventure.app
| Feature | Reventure.app | BidDeed.AI Map |
|---------|--------------|----------------|
| Scope | National (50 states) | Brevard County (focused) |
| Audience | Consumer awareness | Professional investors |
| Data | Zillow/Census generic | Actual auction judgments |
| Intelligence | None | XGBoost ML predictions |
| ROI | $49/mo subscription | $50K+ per deal |

---

## 2. Problem Statement

**Before:** Investors manually track foreclosure cases, calculate max bids on spreadsheets, and miss opportunities due to information overload.

**After:** Visual map with ML-powered recommendations shows exactly which properties to bid on, which to review, and which to skip.

---

## 3. User Stories

### Primary User: Real Estate Investor
> "As a foreclosure investor, I want to see all upcoming auction properties on a map with recommendations so I can quickly identify deals worth pursuing."

### Acceptance Criteria
- [x] Map displays all active foreclosure properties
- [x] Color-coded by BID/REVIEW/SKIP recommendation
- [x] Click property to see full details
- [x] Filter by recommendation type
- [x] HOA/Condo warnings clearly visible
- [x] Mobile responsive

---

## 4. Functional Requirements

### 4.1 Map Display
- **Technology:** Leaflet.js with CartoDB dark tiles
- **Center:** Brevard County (28.2639, -80.7214)
- **Default Zoom:** Level 10 (county view)
- **Markers:** CircleMarker with color by recommendation

### 4.2 Property Data
Each property displays:
- Case number
- Property address
- Plaintiff name
- Judgment amount
- Max bid (calculated)
- Bid/Judgment ratio
- ML score (0-100%)
- Recommendation (BID/REVIEW/SKIP)
- Decision rationale
- Property details (beds, baths, sqft, year)
- BCPAO photo (when available)

### 4.3 Max Bid Formula
```
MAX_BID = (ARV × 0.70) - Repairs - $10,000 - MIN($25,000, ARV × 0.15)
```

### 4.4 Recommendation Logic
```javascript
if (is_hoa_foreclosure) {
  recommendation = "SKIP";  // Senior mortgage survives
} else if (bid_judgment_ratio >= 70) {
  recommendation = "BID";
} else if (bid_judgment_ratio >= 60) {
  recommendation = "REVIEW";
} else {
  recommendation = "SKIP";
}
```

---

## 5. Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Pure HTML/CSS/JS |
| Map | Leaflet.js 1.9.4 |
| Tiles | CartoDB Dark |
| Hosting | Cloudflare Pages |
| Data | Hardcoded JSON → Supabase |

---

## 6. Roadmap

### Phase 1: MVP ✅ Complete
- Hardcoded data for Jan 2025 auction
- Static HTML deployment
- Basic filtering and popups

### Phase 2: Dynamic Data
- Supabase REST API integration
- Auto-populate from pipeline Stage 10
- Date range filtering

### Phase 3: Enhanced Features
- Historical auction results overlay
- Comps visualization
- Driving route optimization

---

*BidDeed.AI V15.0 - Agentic AI Ecosystem*

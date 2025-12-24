# BidDeed.AI Foreclosure Map

Interactive ML-powered foreclosure auction map for Brevard County, Florida.

![Version](https://img.shields.io/badge/version-15.0.0-blue)
![License](https://img.shields.io/badge/license-PROPRIETARY-red)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Pages-orange)

## 🌐 Live URLs

- **Main:** https://brevard-bidder-landing.pages.dev/map
- **Standalone:** https://biddeed-foreclosure-map.pages.dev

---

## 🎯 Features

### Map Visualization
- **Leaflet.js** dark-themed interactive map
- **Color-coded markers** by ML recommendation
- **Click-to-zoom** from property sidebar
- **Popup details** with BCPAO photos

### ML Recommendations
| Color | Recommendation | Bid/Judgment Ratio |
|-------|---------------|-------------------|
| 🟢 Green | **BID** | ≥70% |
| 🟡 Yellow | **REVIEW** | 60-69% |
| 🔴 Red | **SKIP** | <60% |
| ⚠️ Red+Border | **HOA RISK** | Do Not Bid |

### Property Intelligence
- Case number & plaintiff identification
- Judgment amount & max bid calculation
- XGBoost ML score (third-party probability)
- Property details (beds, baths, sqft, year)
- Decision rationale from AI analysis

### Third Sword Target Zips
- **32937** Satellite Beach ($82K income)
- **32940** Viera/Melbourne ($78K income)
- **32903** Indialantic ($79K income)
- **32953** Merritt Island ($68K income)

---

## 📊 Max Bid Formula

```
MAX_BID = (ARV × 70%) - Repairs - $10,000 - MIN($25,000, 15% × ARV)
```

### Recommendation Thresholds
- **BID:** ratio ≥70% AND NOT hoa_foreclosure
- **REVIEW:** ratio 60-69% AND NOT hoa_foreclosure  
- **SKIP:** ratio <60% OR hoa_foreclosure

---

## ⚠️ HOA/Condo Warning

**Critical:** HOA foreclosures do NOT extinguish senior mortgages!

Always verify liens via AcclaimWeb before bidding.

---

## 🚀 Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy

# Local development
npm run dev
```

---

## 👨‍💻 Credits

**Ariel Shapira** - Solo Founder, Everest Capital USA

---

*BidDeed.AI V15.0 - Agentic AI Ecosystem*

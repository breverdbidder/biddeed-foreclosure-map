#!/usr/bin/env node
/**
 * BidDeed.AI - Fetch Foreclosure Data from Supabase
 * Updates hardcoded data in public/index.html
 * 
 * Usage: node scripts/fetch-supabase.js
 * 
 * Requires: SUPABASE_URL and SUPABASE_KEY environment variables
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mocerqjnksmhcjzxrewo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function fetchForeclosures() {
  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_KEY environment variable required');
    process.exit(1);
  }

  console.log('🔍 Fetching foreclosure data from Supabase...');

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/auction_results?select=*&auction_date=gte.${new Date().toISOString().split('T')[0]}&order=auction_date.asc`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    console.error(`❌ API Error: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.length} properties`);

  // Transform to map format
  const foreclosures = data.map((row, index) => ({
    id: index + 1,
    case_number: row.case_number,
    property_address: row.property_address,
    city: row.city || 'Unknown',
    zipcode: row.zipcode || '00000',
    latitude: row.latitude || 28.2639,
    longitude: row.longitude || -80.7214,
    plaintiff: row.plaintiff,
    defendant: row.defendant,
    judgment_amount: row.judgment_amount || 0,
    max_bid: row.max_bid || 0,
    bid_judgment_ratio: row.bid_judgment_ratio || 0,
    ml_score: row.third_party_probability || 0.5,
    recommendation: row.recommendation || 'REVIEW',
    decision_rationale: row.decision_rationale || 'Pending analysis',
    bedrooms: row.bedrooms || 0,
    bathrooms: row.bathrooms || 0,
    sqft: row.sqft || 0,
    year_built: row.year_built || 0,
    bcpao_photo_url: row.bcpao_photo_url,
    is_hoa_foreclosure: row.is_hoa_foreclosure || false,
    senior_lien: row.senior_liens
  }));

  // Save to JSON file
  const jsonPath = path.join(__dirname, '..', 'data', 'foreclosures.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    auction_date: foreclosures[0]?.auction_date || new Date().toISOString().split('T')[0],
    generated_at: new Date().toISOString(),
    properties: foreclosures,
    summary: {
      total: foreclosures.length,
      bid: foreclosures.filter(p => p.recommendation === 'BID').length,
      review: foreclosures.filter(p => p.recommendation === 'REVIEW').length,
      skip: foreclosures.filter(p => p.recommendation === 'SKIP').length
    }
  }, null, 2));

  console.log(`💾 Saved to ${jsonPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total: ${foreclosures.length}`);
  console.log(`   BID: ${foreclosures.filter(p => p.recommendation === 'BID').length}`);
  console.log(`   REVIEW: ${foreclosures.filter(p => p.recommendation === 'REVIEW').length}`);
  console.log(`   SKIP: ${foreclosures.filter(p => p.recommendation === 'SKIP').length}`);
}

fetchForeclosures().catch(console.error);

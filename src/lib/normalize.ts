/**
 * Data Normalization Engine (Phase 4)
 * Standardizes companies, levels, and currencies for structured intelligence.
 */

// 1. Company Normalization
export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|corp|corporation|ltd|limited|platforms|technologies|systems)\b/gi, '')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 2. Level Normalization Heuristics
// Maps common level patterns to a 1-10 rank
export function getNormalizedRank(levelName: string, companyName: string): number {
  const name = levelName.toUpperCase();
  const company = companyName.toLowerCase();

  // Tier 1: FAANG Specific Mappings
  if (company.includes('google')) {
    if (name.includes('L3')) return 3;
    if (name.includes('L4')) return 4;
    if (name.includes('L5')) return 5;
    if (name.includes('L6')) return 6;
    if (name.includes('L7')) return 7;
    if (name.includes('L8')) return 8;
  }

  if (company.includes('meta') || company.includes('facebook')) {
    if (name.includes('E3')) return 3;
    if (name.includes('E4')) return 4;
    if (name.includes('E5')) return 5;
    if (name.includes('E6')) return 6;
    if (name.includes('E7')) return 7;
    if (name.includes('E8')) return 8;
  }

  if (company.includes('amazon')) {
    if (name.includes('SDE1') || name.includes('L4')) return 3;
    if (name.includes('SDE2') || name.includes('L5')) return 4;
    if (name.includes('SDE3') || name.includes('L6')) return 6;
    if (name.includes('PRINCIPAL') || name.includes('L7')) return 7;
  }

  // Tier 2: Generic Keyword Matching
  if (name.includes('JUNIOR') || name.includes('ENTRY') || name.includes('ASSOCIATE')) return 3;
  if (name.includes('SENIOR')) {
    if (name.includes('STAFF')) return 6;
    if (name.includes('PRINCIPAL')) return 7;
    return 5;
  }
  if (name.includes('STAFF')) return 6;
  if (name.includes('PRINCIPAL')) return 7;
  if (name.includes('DISTINGUISHED') || name.includes('FELLOW')) return 9;

  // Default: Mid-level
  return 4;
}

// 3. Currency Normalization (Mock rates for prototype)
const MOCK_USD_RATES: Record<string, number> = {
  'USD': 1.0,
  'INR': 0.012,
  'EUR': 1.08,
  'GBP': 1.27,
  'CAD': 0.73,
};

export function convertToUSD(amount: number, currency: string): number {
  const rate = MOCK_USD_RATES[currency.toUpperCase()] || 1.0;
  return amount * rate;
}

// 4. TC Calculation (Phase 2)
export function calculateTC(base: number, bonus: number = 0, stock: number = 0, other: number = 0): number {
  return (base || 0) + (bonus || 0) + (stock || 0) + (other || 0);
}

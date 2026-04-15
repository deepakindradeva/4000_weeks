/**
 * Life expectancy data by country and gender.
 * Source: WHO Global Health Observatory, 2024 estimates.
 * Values are life expectancy at birth in years.
 *
 * Format: { countryCode: { name, male, female, average } }
 */

const LIFE_EXPECTANCY = {
  AF: { name: "Afghanistan", male: 61, female: 64, average: 62 },
  AL: { name: "Albania", male: 76, female: 80, average: 78 },
  DZ: { name: "Algeria", male: 75, female: 78, average: 77 },
  AD: { name: "Andorra", male: 81, female: 86, average: 84 },
  AO: { name: "Angola", male: 59, female: 64, average: 62 },
  AG: { name: "Antigua and Barbuda", male: 74, female: 78, average: 76 },
  AR: { name: "Argentina", male: 74, female: 80, average: 77 },
  AM: { name: "Armenia", male: 72, female: 79, average: 75 },
  AU: { name: "Australia", male: 82, female: 85, average: 84 },
  AT: { name: "Austria", male: 80, female: 84, average: 82 },
  AZ: { name: "Azerbaijan", male: 71, female: 76, average: 74 },
  BS: { name: "Bahamas", male: 71, female: 77, average: 74 },
  BH: { name: "Bahrain", male: 77, female: 79, average: 78 },
  BD: { name: "Bangladesh", male: 72, female: 75, average: 73 },
  BB: { name: "Barbados", male: 76, female: 80, average: 78 },
  BY: { name: "Belarus", male: 69, female: 79, average: 74 },
  BE: { name: "Belgium", male: 80, female: 84, average: 82 },
  BZ: { name: "Belize", male: 71, female: 77, average: 74 },
  BJ: { name: "Benin", male: 60, female: 63, average: 62 },
  BT: { name: "Bhutan", male: 72, female: 74, average: 73 },
  BO: { name: "Bolivia", male: 67, female: 73, average: 70 },
  BA: { name: "Bosnia and Herzegovina", male: 75, female: 80, average: 77 },
  BW: { name: "Botswana", male: 63, female: 70, average: 66 },
  BR: { name: "Brazil", male: 72, female: 80, average: 76 },
  BN: { name: "Brunei", male: 74, female: 77, average: 76 },
  BG: { name: "Bulgaria", male: 72, female: 79, average: 75 },
  BF: { name: "Burkina Faso", male: 60, female: 62, average: 61 },
  BI: { name: "Burundi", male: 60, female: 64, average: 62 },
  KH: { name: "Cambodia", male: 67, female: 72, average: 70 },
  CM: { name: "Cameroon", male: 58, female: 62, average: 60 },
  CA: { name: "Canada", male: 80, female: 84, average: 82 },
  CV: { name: "Cape Verde", male: 71, female: 77, average: 74 },
  CF: { name: "Central African Republic", male: 52, female: 56, average: 54 },
  TD: { name: "Chad", male: 53, female: 56, average: 54 },
  CL: { name: "Chile", male: 78, female: 83, average: 80 },
  CN: { name: "China", male: 75, female: 80, average: 78 },
  CO: { name: "Colombia", male: 73, female: 80, average: 77 },
  KM: { name: "Comoros", male: 63, female: 67, average: 65 },
  CG: { name: "Congo", male: 62, female: 66, average: 64 },
  CD: { name: "Congo (DRC)", male: 59, female: 63, average: 61 },
  CR: { name: "Costa Rica", male: 78, female: 83, average: 80 },
  CI: { name: "Côte d'Ivoire", male: 57, female: 60, average: 58 },
  HR: { name: "Croatia", male: 76, female: 82, average: 79 },
  CU: { name: "Cuba", male: 76, female: 80, average: 78 },
  CY: { name: "Cyprus", male: 80, female: 84, average: 82 },
  CZ: { name: "Czech Republic", male: 77, female: 82, average: 79 },
  DK: { name: "Denmark", male: 80, female: 83, average: 81 },
  DJ: { name: "Djibouti", male: 62, female: 66, average: 64 },
  DO: { name: "Dominican Republic", male: 71, female: 77, average: 74 },
  EC: { name: "Ecuador", male: 74, female: 79, average: 77 },
  EG: { name: "Egypt", male: 69, female: 74, average: 72 },
  SV: { name: "El Salvador", male: 69, female: 78, average: 73 },
  GQ: { name: "Equatorial Guinea", male: 57, female: 61, average: 59 },
  ER: { name: "Eritrea", male: 64, female: 69, average: 66 },
  EE: { name: "Estonia", male: 75, female: 83, average: 79 },
  SZ: { name: "Eswatini", male: 55, female: 63, average: 59 },
  ET: { name: "Ethiopia", male: 64, female: 68, average: 66 },
  FJ: { name: "Fiji", male: 65, female: 69, average: 67 },
  FI: { name: "Finland", male: 79, female: 84, average: 82 },
  FR: { name: "France", male: 80, female: 86, average: 83 },
  GA: { name: "Gabon", male: 64, female: 68, average: 66 },
  GM: { name: "Gambia", male: 61, female: 64, average: 63 },
  GE: { name: "Georgia", male: 71, female: 79, average: 75 },
  DE: { name: "Germany", male: 79, female: 83, average: 81 },
  GH: { name: "Ghana", male: 63, female: 66, average: 64 },
  GR: { name: "Greece", male: 79, female: 84, average: 81 },
  GT: { name: "Guatemala", male: 71, female: 77, average: 74 },
  GN: { name: "Guinea", male: 59, female: 62, average: 61 },
  GW: { name: "Guinea-Bissau", male: 56, female: 60, average: 58 },
  GY: { name: "Guyana", male: 65, female: 70, average: 67 },
  HT: { name: "Haiti", male: 62, female: 67, average: 64 },
  HN: { name: "Honduras", male: 72, female: 77, average: 75 },
  HU: { name: "Hungary", male: 74, female: 80, average: 77 },
  IS: { name: "Iceland", male: 81, female: 84, average: 83 },
  IN: { name: "India", male: 69, female: 72, average: 71 },
  ID: { name: "Indonesia", male: 69, female: 73, average: 71 },
  IR: { name: "Iran", male: 75, female: 78, average: 77 },
  IQ: { name: "Iraq", male: 68, female: 73, average: 70 },
  IE: { name: "Ireland", male: 81, female: 84, average: 83 },
  IL: { name: "Israel", male: 81, female: 85, average: 83 },
  IT: { name: "Italy", male: 81, female: 85, average: 83 },
  JM: { name: "Jamaica", male: 72, female: 76, average: 74 },
  JP: { name: "Japan", male: 82, female: 88, average: 85 },
  JO: { name: "Jordan", male: 73, female: 77, average: 75 },
  KZ: { name: "Kazakhstan", male: 69, female: 78, average: 73 },
  KE: { name: "Kenya", male: 62, female: 67, average: 64 },
  KR: { name: "South Korea", male: 80, female: 86, average: 83 },
  KW: { name: "Kuwait", male: 76, female: 79, average: 78 },
  KG: { name: "Kyrgyzstan", male: 68, female: 76, average: 72 },
  LA: { name: "Laos", male: 65, female: 69, average: 67 },
  LV: { name: "Latvia", male: 71, female: 80, average: 76 },
  LB: { name: "Lebanon", male: 77, female: 80, average: 79 },
  LS: { name: "Lesotho", male: 50, female: 56, average: 53 },
  LR: { name: "Liberia", male: 62, female: 65, average: 63 },
  LY: { name: "Libya", male: 70, female: 76, average: 73 },
  LT: { name: "Lithuania", male: 72, female: 81, average: 76 },
  LU: { name: "Luxembourg", male: 81, female: 85, average: 83 },
  MG: { name: "Madagascar", male: 65, female: 68, average: 67 },
  MW: { name: "Malawi", male: 62, female: 68, average: 65 },
  MY: { name: "Malaysia", male: 74, female: 79, average: 76 },
  MV: { name: "Maldives", male: 78, female: 81, average: 79 },
  ML: { name: "Mali", male: 58, female: 60, average: 59 },
  MT: { name: "Malta", male: 81, female: 84, average: 83 },
  MR: { name: "Mauritania", male: 63, female: 67, average: 65 },
  MU: { name: "Mauritius", male: 72, female: 78, average: 75 },
  MX: { name: "Mexico", male: 72, female: 78, average: 75 },
  MD: { name: "Moldova", male: 67, female: 76, average: 72 },
  MN: { name: "Mongolia", male: 66, female: 75, average: 70 },
  ME: { name: "Montenegro", male: 75, female: 80, average: 77 },
  MA: { name: "Morocco", male: 75, female: 78, average: 77 },
  MZ: { name: "Mozambique", male: 56, female: 62, average: 59 },
  MM: { name: "Myanmar", male: 63, female: 69, average: 66 },
  NA: { name: "Namibia", male: 60, female: 66, average: 63 },
  NP: { name: "Nepal", male: 69, female: 72, average: 71 },
  NL: { name: "Netherlands", male: 80, female: 84, average: 82 },
  NZ: { name: "New Zealand", male: 81, female: 84, average: 82 },
  NI: { name: "Nicaragua", male: 73, female: 79, average: 76 },
  NE: { name: "Niger", male: 61, female: 63, average: 62 },
  NG: { name: "Nigeria", male: 53, female: 56, average: 55 },
  MK: { name: "North Macedonia", male: 74, female: 78, average: 76 },
  NO: { name: "Norway", male: 82, female: 85, average: 83 },
  OM: { name: "Oman", male: 76, female: 80, average: 78 },
  PK: { name: "Pakistan", male: 66, female: 68, average: 67 },
  PA: { name: "Panama", male: 76, female: 82, average: 79 },
  PG: { name: "Papua New Guinea", male: 63, female: 67, average: 65 },
  PY: { name: "Paraguay", male: 72, female: 77, average: 74 },
  PE: { name: "Peru", male: 74, female: 79, average: 77 },
  PH: { name: "Philippines", male: 67, female: 74, average: 71 },
  PL: { name: "Poland", male: 74, female: 82, average: 78 },
  PT: { name: "Portugal", male: 79, female: 85, average: 82 },
  QA: { name: "Qatar", male: 78, female: 81, average: 80 },
  RO: { name: "Romania", male: 73, female: 80, average: 76 },
  RU: { name: "Russia", male: 67, female: 78, average: 73 },
  RW: { name: "Rwanda", male: 66, female: 70, average: 68 },
  SA: { name: "Saudi Arabia", male: 75, female: 78, average: 77 },
  SN: { name: "Senegal", male: 66, female: 69, average: 68 },
  RS: { name: "Serbia", male: 74, female: 79, average: 76 },
  SL: { name: "Sierra Leone", male: 53, female: 56, average: 55 },
  SG: { name: "Singapore", male: 81, female: 86, average: 84 },
  SK: { name: "Slovakia", male: 74, female: 81, average: 78 },
  SI: { name: "Slovenia", male: 79, female: 84, average: 81 },
  SO: { name: "Somalia", male: 55, female: 59, average: 57 },
  ZA: { name: "South Africa", male: 61, female: 68, average: 65 },
  SS: { name: "South Sudan", male: 55, female: 58, average: 57 },
  ES: { name: "Spain", male: 81, female: 86, average: 83 },
  LK: { name: "Sri Lanka", male: 73, female: 80, average: 77 },
  SD: { name: "Sudan", male: 64, female: 68, average: 66 },
  SR: { name: "Suriname", male: 69, female: 75, average: 72 },
  SE: { name: "Sweden", male: 82, female: 85, average: 83 },
  CH: { name: "Switzerland", male: 82, female: 86, average: 84 },
  SY: { name: "Syria", male: 68, female: 78, average: 73 },
  TW: { name: "Taiwan", male: 78, female: 84, average: 81 },
  TJ: { name: "Tajikistan", male: 69, female: 74, average: 72 },
  TZ: { name: "Tanzania", male: 64, female: 68, average: 66 },
  TH: { name: "Thailand", male: 74, female: 81, average: 77 },
  TL: { name: "Timor-Leste", male: 67, female: 70, average: 69 },
  TG: { name: "Togo", male: 60, female: 63, average: 62 },
  TT: { name: "Trinidad and Tobago", male: 70, female: 76, average: 73 },
  TN: { name: "Tunisia", male: 75, female: 79, average: 77 },
  TR: { name: "Turkey", male: 75, female: 81, average: 78 },
  TM: { name: "Turkmenistan", male: 65, female: 72, average: 68 },
  UG: { name: "Uganda", male: 62, female: 66, average: 64 },
  UA: { name: "Ukraine", male: 67, female: 77, average: 72 },
  AE: { name: "United Arab Emirates", male: 77, female: 80, average: 78 },
  GB: { name: "United Kingdom", male: 80, female: 83, average: 81 },
  US: { name: "United States", male: 76, female: 81, average: 79 },
  UY: { name: "Uruguay", male: 74, female: 81, average: 78 },
  UZ: { name: "Uzbekistan", male: 70, female: 75, average: 73 },
  VE: { name: "Venezuela", male: 70, female: 78, average: 74 },
  VN: { name: "Vietnam", male: 71, female: 79, average: 75 },
  YE: { name: "Yemen", male: 64, female: 67, average: 66 },
  ZM: { name: "Zambia", male: 60, female: 66, average: 63 },
  ZW: { name: "Zimbabwe", male: 59, female: 63, average: 61 },
};

/**
 * Get the list of countries sorted by name.
 */
export function getCountryList() {
  return Object.entries(LIFE_EXPECTANCY)
    .map(([code, data]) => ({
      code,
      name: data.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get life expectancy for a country + gender.
 * @param {string} countryCode - ISO country code
 * @param {'male'|'female'|'average'} gender
 * @returns {number} life expectancy in years
 */
export function getLifeExpectancy(countryCode, gender = "average") {
  const country = LIFE_EXPECTANCY[countryCode];
  if (!country) return 80; // fallback
  return country[gender] || country.average;
}

/**
 * Calculate expected total weeks for a person.
 * @param {string} countryCode
 * @param {'male'|'female'|'average'} gender
 * @returns {number} total expected weeks
 */
export function getExpectedWeeks(countryCode, gender = "average") {
  return Math.round(getLifeExpectancy(countryCode, gender) * 52.1429);
}

/**
 * Full calculation from user profile.
 */
export function calculateLifeData({
  birthYear,
  birthMonth = 1,
  countryCode = null,
  gender = "average",
}) {
  const year = parseInt(birthYear);
  if (!year || year < 1900 || year > new Date().getFullYear()) return null;

  const now = new Date();
  const birth = new Date(year, (parseInt(birthMonth) || 1) - 1, 1);
  const ageMs = now - birth;
  const ageWeeks = Math.floor(ageMs / (7 * 24 * 60 * 60 * 1000));
  const ageYears = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));

  const lifeExpYears = countryCode
    ? getLifeExpectancy(countryCode, gender)
    : 80;
  const totalWeeks = Math.round(lifeExpYears * 52.1429);
  const remaining = Math.max(0, totalWeeks - ageWeeks);
  const remainingYears = Math.max(0, lifeExpYears - ageYears);
  const percentLived = Math.min(100, ((ageWeeks / totalWeeks) * 100)).toFixed(1);

  return {
    ageWeeks,
    ageYears,
    remaining,
    remainingYears,
    totalWeeks,
    lifeExpYears,
    percentLived,
    countryName: countryCode
      ? LIFE_EXPECTANCY[countryCode]?.name
      : null,
    // Perspective stats
    summersLeft: remainingYears,
    sunrisesLeft: remaining * 7,
    booksLeft: Math.floor(remaining / 2),
    mealsLeft: remaining * 21,
    fullMoonsLeft: Math.floor(remaining / 4.3),
    birthdaysLeft: remainingYears,
    conversationsWithParents: Math.floor(remainingYears * 10),
    weekendsLeft: remaining,
  };
}

export default LIFE_EXPECTANCY;

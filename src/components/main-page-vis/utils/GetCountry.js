export const countryCodeMapping = {
  AL: "Albania",
  AR: "Argentina",
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  BO: "Bolivia",
  BR: "Brazil",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  EC: "Ecuador",
  EE: "Estonia",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GR: "Greece",
  HR: "Croatia",
  HU: "Hungary",
  IE: "Ireland",
  IS: "Iceland",
  IT: "Italy",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MX: "Mexico",
  NL: "Netherlands",
  NO: "Norway",
  PE: "Peru",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  RS: "Serbia",
  SE: "Sweden",
  SI: "Slovenia",
  SK: "Slovakia",
  TR: "Turkey",
  UA: "Ukraine",
  US: "United States",
  UY: "Uruguay",
  VE: "Venezuela",
};

export function getCountryFromMusicId(musicId) {
  if (!musicId) return null;

  const code = musicId.split("-")[0]?.toUpperCase();

  return countryCodeMapping[code] || null;
}


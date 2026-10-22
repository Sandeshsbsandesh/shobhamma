/**
 * Public facts supplied by the foundation.
 * Telephone, portraits, bank account, and 80G/12A certificates
 * are omitted until the office provides them.
 */
export const site = {
  name: "SHOBHAAMMA CHARITABLE FOUNDATION",
  nameTitle: "Shobhaamma Charitable Foundation",
  devanagari: "शोभाअम्मा",
  alsoKnownAs: [
    "Shobhaamma Charitable Foundation",
    "Shobhamma",
    "Shobhamma Foundation",
    "Shobhamma Charitable Foundation",
    "SCF",
    "Shobbhamma",
    "Shobbhamma Charitable Foundation",
    "Shobbhamma Chairtable Foundation",
    "शोभाअम्मा",
    "शोभाअम्मा चैरिटेबल फाउंडेशन",
  ],
  email: "shobhaammacharitablefoundation@gmail.com",
  url: "https://shobhaamma.com",
  registration: "ABNCS7300JE20241",
  foundedISO: "2024-06-21",
  foundedYear: 2024,
  founded: {
    en: "21 June 2024",
    hi: "21 जून 2024",
  },
  address: {
    en: [
      "C/O Sri Amit Kumar",
      "Gagan Apartment, Flat No. 607",
      "Patna G.P.O., Exhibition Road Chauraha",
      "Patna 800001, Bihar, India",
    ],
    hi: [
      "सी/ओ श्री अमित कुमार",
      "गगन अपार्टमेंट, फ्लैट नं. 607",
      "पटना जी.पी.ओ., एग्जिबिशन रोड चौराहा",
      "पटना 800001, बिहार, भारत",
    ],
  },
  postal: {
    streetAddress:
      "C/O Sri Amit Kumar, Gagan Apartment, Flat No. 607, Patna G.P.O., Exhibition Road Chauraha",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800001",
    addressCountry: "IN",
  },
  maps: "https://www.google.com/maps/search/?api=1&query=Exhibition+Road+Chauraha,+Patna+800001",
} as const;

export const officers = [
  { id: "amit", name: "Amit Kumar", initials: "AK", jobTitle: "Chairman", image: "/images/amit-kumar.jpg", portrait: "top" },
  { id: "kamlesh", name: "Kamlesh Thakur", initials: "KT", jobTitle: "Secretary", image: "/images/kamlesh-thakur.jpg", portrait: "center" },
  { id: "ranjeet", name: "Ranjeet Kumar", initials: "RK", jobTitle: "Treasurer", image: "/images/ranjeet-kumar.jpg", portrait: "center" },
] as const;

export type OfficerId = (typeof officers)[number]["id"];

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.name,
  legalName: site.name,
  alternateName: site.alsoKnownAs,
  url: site.url,
  email: site.email,
  foundingDate: site.foundedISO,
  foundingLocation: {
    "@type": "Place",
    name: "Patna, Bihar, India",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    ...site.postal,
  },
  identifier: site.registration,
  knowsLanguage: ["en", "hi"],
  knowsAbout: [
    "Support for students without the means to study",
    "Care for older women",
  ],
  member: officers.map((officer) => ({
    "@type": "Person",
    name: officer.name,
    jobTitle: officer.jobTitle,
    ...(officer.image ? { image: `${site.url}${officer.image}` } : {}),
  })),
};

/**
 * Seed/mock data — matches the shape of prototype/app/data.js.
 * In production, replace with API calls to the database (Prisma).
 * This file is the single source of truth for the data shape.
 */

import type {
  Project,
  DashboardProject,
  Advisor,
  Buyer,
  Question,
  Phase,
  Payment,
  Budget,
  KragDocument,
  PhotoAlbum,
  Message,
  ChoiceGroup,
  Meeting,
  Inspection,
  Notification,
  ActivityItem,
  Update,
  Floor,
  ProjectUnit,
} from "@/types";

// ─── Projects (inventory) ─────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "justnes",
    name: "Justneshalvøya",
    place: { no: "Justvik, Kristiansand", en: "Justvik, Kristiansand" },
    type: { no: "Enebolig", en: "Detached house" },
    typeKey: "house",
    priceFrom: 7390000,
    sizeFrom: 124,
    sizeTo: 168,
    bedrooms: "3–4",
    status: { no: "Salgsstart", en: "Sales started" },
    match: 96,
    tone: "fjord",
    tags: {
      no: ["Sjøutsikt", "Barnevennlig", "Stor tomt"],
      en: ["Sea view", "Family-friendly", "Large plot"],
    },
    blurb: {
      no: "Solrike eneboliger på en av Kristiansands flotteste halvøyer, få minutter fra sentrum og sjøen.",
      en: "Sunlit detached homes on one of Kristiansand's finest peninsulas, minutes from the centre and the sea.",
    },
    why: {
      no: [
        "Plass til hele familien med 3–4 soverom",
        "Rolig, barnevennlig nabolag nær skole",
        "Stor tomt med sør-/vestvendt hage",
      ],
      en: [
        "Room for the whole family with 3–4 bedrooms",
        "Quiet, family-friendly area near school",
        "Large plot with south/west-facing garden",
      ],
    },
  },
  {
    id: "solfjell",
    name: "Solfjell Hyttegrend",
    place: { no: "Solfjell, Birkenes", en: "Solfjell, Birkenes" },
    type: { no: "Hytte", en: "Cabin" },
    typeKey: "cabin",
    priceFrom: 3950000,
    sizeFrom: 78,
    sizeTo: 96,
    bedrooms: "2–3",
    status: { no: "Få igjen", en: "Few left" },
    match: 82,
    tone: "forest",
    tags: {
      no: ["Naturtomt", "Ski inn/ut", "Lavt vedlikehold"],
      en: ["Nature plot", "Ski in/out", "Low upkeep"],
    },
    blurb: {
      no: "Moderne hytter i naturskjønne omgivelser — perfekt for friluftsfamilien som vil bygge minner.",
      en: "Modern cabins in scenic surroundings — perfect for the outdoor family building memories.",
    },
    why: {
      no: [
        "Naturnær beliggenhet med tursti og vann",
        "Lite vedlikehold — mer tid til fritid",
        "Romslig nok for familie og gjester",
      ],
      en: [
        "Close to nature with trails and water",
        "Low maintenance — more leisure time",
        "Spacious enough for family and guests",
      ],
    },
  },
  {
    id: "soleieveien",
    name: "Soleieveien 63",
    place: { no: "Lund, Kristiansand", en: "Lund, Kristiansand" },
    type: { no: "Rekkehus", en: "Townhouse" },
    typeKey: "town",
    priceFrom: 5290000,
    sizeFrom: 98,
    sizeTo: 118,
    bedrooms: "3",
    status: { no: "Til salgs", en: "For sale" },
    match: 88,
    tone: "sand",
    tags: {
      no: ["Sentrumsnært", "Carport", "Felles hage"],
      en: ["Near centre", "Carport", "Shared garden"],
    },
    blurb: {
      no: "Lyse, moderne rekkehus i et etablert og populært nabolag — gå- og sykkelavstand til alt.",
      en: "Bright, modern townhouses in an established, popular area — walk or cycle to everything.",
    },
    why: {
      no: [
        "Lett å vedlikeholde — flott førstehjem",
        "Sentralt på Lund nær skole og buss",
        "Smart planløsning med 3 soverom",
      ],
      en: [
        "Easy to maintain — a great first home",
        "Central in Lund near school and bus",
        "Smart layout with 3 bedrooms",
      ],
    },
  },
  {
    id: "trollbaer",
    name: "Trollbærveien 17–21",
    place: { no: "Hånes, Kristiansand", en: "Hånes, Kristiansand" },
    type: { no: "Tomannsbolig", en: "Semi-detached" },
    typeKey: "duplex",
    priceFrom: 6190000,
    sizeFrom: 112,
    sizeTo: 132,
    bedrooms: "3–4",
    status: { no: "Til salgs", en: "For sale" },
    match: 79,
    tone: "forest",
    tags: {
      no: ["Solrik hage", "Garasje", "Turterreng"],
      en: ["Sunny garden", "Garage", "Hiking nearby"],
    },
    blurb: {
      no: "Romslige tomannsboliger på Hånes med solrike hager og kort vei til marka og sjøen.",
      en: "Roomy semi-detached homes at Hånes with sunny gardens, close to trails and the sea.",
    },
    why: {
      no: [
        "God plass både inne og ute",
        "Etablert nabolag med mange barnefamilier",
        "Garasje og praktisk planløsning",
      ],
      en: [
        "Good space inside and out",
        "Established area with many families",
        "Garage and practical layout",
      ],
    },
  },
];

export const PROJECT_UNITS: Record<string, ProjectUnit[]> = {
  justnes: [
    {
      id: "B7",
      label: "B7",
      size: 148,
      bedrooms: 4,
      feature: { no: "Havutsikt", en: "Sea view" },
      price: 7388000,
      reserved: false,
    },
    {
      id: "B8",
      label: "B8",
      size: 124,
      bedrooms: 3,
      feature: { no: "Hjørnetomt", en: "Corner plot" },
      price: 7190000,
      reserved: true,
    },
    {
      id: "B9",
      label: "B9",
      size: 168,
      bedrooms: 4,
      feature: { no: "Stor hage", en: "Large garden" },
      price: 7890000,
      reserved: false,
    },
  ],
};

// ─── Dashboard (buyer's active project) ──────────────────────────────────────

export const DASHBOARD_PROJECT: DashboardProject = {
  id: "justnes",
  name: "Justneshalvøya",
  unit: "Bolig B7",
  place: { no: "Justvik, Kristiansand", en: "Justvik, Kristiansand" },
  address: {
    no: "Justnesveien 142, 4634 Kristiansand",
    en: "Justnesveien 142, 4634 Kristiansand",
  },
  progress: 62,
  handover: { no: "Mars 2026", en: "March 2026" },
  type: { no: "Enebolig · 148 m²", en: "Detached · 148 m²" },
  bedrooms: 4,
};

export const ADVISOR: Advisor = {
  id: "sine",
  name: "Sine Kragh",
  role: { no: "Boligrådgiver, Krag Gruppen", en: "Home advisor, Krag Gruppen" },
  phone: "94 23 75 47",
  email: "sine@kraggruppen.no",
  initials: "SK",
};

export const BUYER: Buyer = {
  id: "ingrid",
  name: "Ingrid",
  fullName: "Ingrid Haugen",
  initials: "IH",
  email: "ingrid.haugen@example.com",
  locale: "nb",
};

// ─── Questionnaire ────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: "situation",
    icon: "people",
    q: { no: "Hvem skal flytte inn?", en: "Who's moving in?" },
    help: {
      no: "Hjelper oss å forstå plassbehovet ditt.",
      en: "Helps us understand your space needs.",
    },
    options: [
      {
        id: "single",
        label: { no: "Meg selv", en: "Just me" },
        sub: { no: "1 person", en: "1 person" },
      },
      {
        id: "couple",
        label: { no: "Par uten barn", en: "Couple, no kids" },
        sub: { no: "2 personer", en: "2 people" },
      },
      {
        id: "family",
        label: { no: "Familie med barn", en: "Family with kids" },
        sub: { no: "3+ personer", en: "3+ people" },
      },
      {
        id: "senior",
        label: { no: "Senior / nedsize", en: "Senior / downsizing" },
        sub: {
          no: "Mindre å vedlikeholde",
          en: "Less to maintain",
        },
      },
    ],
  },
  {
    id: "type",
    icon: "home",
    q: {
      no: "Hva slags bolig drømmer du om?",
      en: "What kind of home do you dream of?",
    },
    help: { no: "Velg én eller flere.", en: "Pick one or more." },
    multi: true,
    options: [
      {
        id: "house",
        label: { no: "Enebolig", en: "Detached house" },
        sub: { no: "Egen tomt og hage", en: "Own plot and garden" },
      },
      {
        id: "town",
        label: { no: "Rekkehus", en: "Townhouse" },
        sub: { no: "Praktisk og sentralt", en: "Practical, central" },
      },
      {
        id: "duplex",
        label: { no: "Tomannsbolig", en: "Semi-detached" },
        sub: { no: "Plass og nærhet", en: "Space and closeness" },
      },
      {
        id: "cabin",
        label: { no: "Hytte / fritidsbolig", en: "Cabin / holiday home" },
        sub: { no: "For fri og helg", en: "For leisure" },
      },
    ],
  },
  {
    id: "area",
    icon: "pin",
    q: { no: "Hvor vil du bo?", en: "Where do you want to live?" },
    help: {
      no: "Områder på Sørlandet.",
      en: "Areas in Southern Norway.",
    },
    multi: true,
    options: [
      {
        id: "kristiansand",
        label: { no: "Kristiansand sentrum", en: "Kristiansand centre" },
        sub: { no: "Byliv og nærhet", en: "City life" },
      },
      {
        id: "justvik",
        label: { no: "Justvik / Justnes", en: "Justvik / Justnes" },
        sub: { no: "Sjø og natur", en: "Sea and nature" },
      },
      {
        id: "lund",
        label: { no: "Lund / Hånes", en: "Lund / Hånes" },
        sub: { no: "Etablert og barnevennlig", en: "Family-friendly" },
      },
      {
        id: "birkenes",
        label: { no: "Birkenes / innland", en: "Birkenes / inland" },
        sub: { no: "Ro og natur", en: "Calm and nature" },
      },
    ],
  },
  {
    id: "bedrooms",
    icon: "bed",
    q: {
      no: "Hvor mange soverom trenger dere?",
      en: "How many bedrooms do you need?",
    },
    help: {
      no: "Tenk litt fremover i tid også.",
      en: "Think a little into the future too.",
    },
    options: [
      {
        id: "1-2",
        label: { no: "1–2", en: "1–2" },
        sub: { no: "Kompakt", en: "Compact" },
      },
      {
        id: "3",
        label: { no: "3", en: "3" },
        sub: { no: "Vanligst", en: "Most common" },
      },
      {
        id: "4",
        label: { no: "4", en: "4" },
        sub: { no: "God plass", en: "Spacious" },
      },
      {
        id: "5+",
        label: { no: "5+", en: "5+" },
        sub: { no: "Stor familie", en: "Large family" },
      },
    ],
  },
  {
    id: "budget",
    icon: "wallet",
    q: { no: "Hva er budsjettet ditt?", en: "What's your budget?" },
    help: {
      no: "Omtrentlig — vi finner gode løsninger sammen.",
      en: "Approximate — we'll find good solutions together.",
    },
    options: [
      {
        id: "u4",
        label: { no: "Under 4 mill", en: "Under 4M" },
        sub: { no: "kr", en: "NOK" },
      },
      {
        id: "4-6",
        label: { no: "4–6 mill", en: "4–6M" },
        sub: { no: "kr", en: "NOK" },
      },
      {
        id: "6-8",
        label: { no: "6–8 mill", en: "6–8M" },
        sub: { no: "kr", en: "NOK" },
      },
      {
        id: "8+",
        label: { no: "Over 8 mill", en: "Over 8M" },
        sub: { no: "kr", en: "NOK" },
      },
    ],
  },
  {
    id: "priorities",
    icon: "star",
    q: { no: "Hva er viktigst for deg?", en: "What matters most to you?" },
    help: { no: "Velg inntil tre.", en: "Pick up to three." },
    multi: true,
    max: 3,
    options: [
      {
        id: "view",
        label: { no: "Utsikt", en: "A view" },
        sub: { no: "Sjø eller natur", en: "Sea or nature" },
      },
      {
        id: "garden",
        label: { no: "Egen hage", en: "Own garden" },
        sub: { no: "Ute med barna", en: "Outdoor space" },
      },
      {
        id: "central",
        label: { no: "Sentralt", en: "Central" },
        sub: { no: "Nær alt", en: "Near everything" },
      },
      {
        id: "lowmaint",
        label: { no: "Lite vedlikehold", en: "Low maintenance" },
        sub: { no: "Mer fritid", en: "More leisure" },
      },
      {
        id: "sustain",
        label: { no: "Bærekraft", en: "Sustainability" },
        sub: { no: "Miljøvennlig", en: "Eco-friendly" },
      },
      {
        id: "schools",
        label: { no: "Nær skole", en: "Near schools" },
        sub: { no: "Barnevennlig", en: "Family-friendly" },
      },
    ],
  },
  {
    id: "timing",
    icon: "clock",
    q: {
      no: "Når ønsker du å flytte?",
      en: "When do you want to move?",
    },
    help: {
      no: "Ingen forpliktelse — bare for å planlegge.",
      en: "No commitment — just for planning.",
    },
    options: [
      {
        id: "asap",
        label: { no: "Så snart som mulig", en: "As soon as possible" },
        sub: { no: "Innflyttingsklart", en: "Move-in ready" },
      },
      {
        id: "6-12",
        label: { no: "6–12 måneder", en: "6–12 months" },
        sub: { no: "Litt å vente på", en: "Some waiting" },
      },
      {
        id: "1-2y",
        label: { no: "1–2 år", en: "1–2 years" },
        sub: { no: "Bygge nytt", en: "Build new" },
      },
      {
        id: "explore",
        label: {
          no: "Bare utforsker",
          en: "Just exploring",
        },
        sub: { no: "Ingen hast", en: "No rush" },
      },
    ],
  },
];

// ─── Dashboard data ────────────────────────────────────────────────────────────

export const PHASES: Phase[] = [
  {
    id: "plot",
    name: { no: "Tomt og grunnarbeid", en: "Plot & groundwork" },
    pct: 100,
    status: "done",
    date: { no: "Sept 2025", en: "Sep 2025" },
  },
  {
    id: "foundation",
    name: { no: "Fundament og plate", en: "Foundation & slab" },
    pct: 100,
    status: "done",
    date: { no: "Okt 2025", en: "Oct 2025" },
  },
  {
    id: "frame",
    name: { no: "Reisverk og råbygg", en: "Framing & shell" },
    pct: 100,
    status: "done",
    date: { no: "Nov 2025", en: "Nov 2025" },
  },
  {
    id: "tett",
    name: {
      no: "Tett bygg (tak, vinduer)",
      en: "Weather-tight (roof, windows)",
    },
    pct: 100,
    status: "done",
    date: { no: "Des 2025", en: "Dec 2025" },
  },
  {
    id: "indoor",
    name: { no: "Innvendige arbeider", en: "Interior works" },
    pct: 55,
    status: "active",
    date: { no: "Pågår nå", en: "In progress" },
  },
  {
    id: "finish",
    name: { no: "Overflater og finish", en: "Surfaces & finish" },
    pct: 0,
    status: "upcoming",
    date: { no: "Feb 2026", en: "Feb 2026" },
  },
  {
    id: "handover",
    name: {
      no: "Befaring og overtakelse",
      en: "Inspection & handover",
    },
    pct: 0,
    status: "upcoming",
    date: { no: "Mars 2026", en: "Mar 2026" },
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: 1,
    label: { no: "Forskudd ved kontrakt", en: "Deposit at contract" },
    amount: 738000,
    pct: "10%",
    status: "paid",
    date: { no: "15.08.2025", en: "15 Aug 2025" },
  },
  {
    id: 2,
    label: {
      no: "Ved oppstart grunnarbeid",
      en: "At groundwork start",
    },
    amount: 1476000,
    pct: "20%",
    status: "paid",
    date: { no: "20.09.2025", en: "20 Sep 2025" },
  },
  {
    id: 3,
    label: { no: "Ved tett bygg", en: "At weather-tight" },
    amount: 1476000,
    pct: "20%",
    status: "paid",
    date: { no: "18.12.2025", en: "18 Dec 2025" },
  },
  {
    id: 4,
    label: {
      no: "Ved innvendig ferdig",
      en: "At interior complete",
    },
    amount: 1845000,
    pct: "25%",
    status: "upcoming",
    date: { no: "15.02.2026", en: "15 Feb 2026" },
  },
  {
    id: 5,
    label: { no: "Ved overtakelse", en: "At handover" },
    amount: 1845000,
    pct: "25%",
    status: "upcoming",
    date: { no: "15.03.2026", en: "15 Mar 2026" },
  },
];

export const BUDGET: Budget = {
  base: 7170000,
  addons: 218000,
  total: 7388000,
  paid: 3690000,
};

export const DOCUMENTS: KragDocument[] = [
  {
    id: 1,
    name: { no: "Kjøpekontrakt", en: "Purchase contract" },
    cat: "contract",
    date: { no: "15.08.2025", en: "15 Aug 2025" },
    size: "1.2 MB",
    signed: true,
  },
  {
    id: 2,
    name: { no: "Leveransebeskrivelse", en: "Delivery description" },
    cat: "spec",
    date: { no: "15.08.2025", en: "15 Aug 2025" },
    size: "3.4 MB",
    signed: true,
  },
  {
    id: 3,
    name: { no: "Plantegninger B7", en: "Floor plans B7" },
    cat: "drawing",
    date: { no: "02.09.2025", en: "2 Sep 2025" },
    size: "5.1 MB",
    signed: null,
  },
  {
    id: 4,
    name: {
      no: "Tilvalgsavtale — kjøkken",
      en: "Options agreement — kitchen",
    },
    cat: "contract",
    date: { no: "12.11.2025", en: "12 Nov 2025" },
    size: "0.8 MB",
    signed: false,
  },
  {
    id: 5,
    name: {
      no: "Prospekt Justneshalvøya",
      en: "Prospectus Justneshalvøya",
    },
    cat: "spec",
    date: { no: "01.07.2025", en: "1 Jul 2025" },
    size: "8.9 MB",
    signed: null,
  },
  {
    id: 6,
    name: { no: "FDV-dokumentasjon", en: "FDV documentation" },
    cat: "spec",
    date: { no: "—", en: "—" },
    size: "—",
    signed: null,
    soon: true,
  },
  {
    id: 7,
    name: { no: "Energiattest", en: "Energy certificate" },
    cat: "spec",
    date: { no: "—", en: "—" },
    size: "—",
    signed: null,
    soon: true,
  },
];

export const PHOTO_ALBUMS: PhotoAlbum[] = [
  {
    phase: { no: "Innvendige arbeider", en: "Interior works" },
    date: { no: "Mai 2026", en: "May 2026" },
    count: 8,
    tone: "indoor",
  },
  {
    phase: { no: "Tett bygg", en: "Weather-tight" },
    date: { no: "Des 2025", en: "Dec 2025" },
    count: 12,
    tone: "frame",
  },
  {
    phase: { no: "Råbygg og reisverk", en: "Framing" },
    date: { no: "Nov 2025", en: "Nov 2025" },
    count: 10,
    tone: "wood",
  },
  {
    phase: { no: "Grunnarbeid", en: "Groundwork" },
    date: { no: "Sept 2025", en: "Sep 2025" },
    count: 6,
    tone: "ground",
  },
];

export const MESSAGES: Message[] = [
  {
    from: "advisor",
    text: {
      no: "Hei Ingrid! Da er taket på plass og bygget er tett. 🎉 Jeg har lagt ut nye bilder under Bilder-fanen.",
      en: "Hi Ingrid! The roof is on and the building is weather-tight. 🎉 I've posted new photos under the Photos tab.",
    },
    time: "08:42",
    date: { no: "18. des", en: "18 Dec" },
  },
  {
    from: "me",
    text: {
      no: "Så fint! Det ser virkelig ut som et hjem nå. Når må vi bestemme oss for kjøkkenløsning?",
      en: "Lovely! It really looks like a home now. When do we need to decide on the kitchen?",
    },
    time: "09:15",
    date: { no: "18. des", en: "18 Dec" },
  },
  {
    from: "advisor",
    text: {
      no: "Fristen for kjøkken-tilvalg er 20. januar. Jeg har lagt forslagene under Tilvalg — ta en titt, så tar vi en prat 🙂",
      en: "The kitchen options deadline is 20 January. I've added the choices under Choices — take a look and we'll chat 🙂",
    },
    time: "09:20",
    date: { no: "18. des", en: "18 Dec" },
  },
  {
    from: "me",
    text: {
      no: "Supert, tusen takk! Vi ser på det i helgen.",
      en: "Great, thank you! We'll look this weekend.",
    },
    time: "09:24",
    date: { no: "18. des", en: "18 Dec" },
  },
];

export const CHOICE_GROUPS: ChoiceGroup[] = [
  {
    id: "kitchen",
    name: { no: "Kjøkken", en: "Kitchen" },
    deadline: { no: "20. jan 2026", en: "20 Jan 2026" },
    options: [
      {
        id: "k1",
        name: { no: "Standard — hvit matt", en: "Standard — matte white" },
        price: 0,
        selected: false,
        tone: "indoor",
      },
      {
        id: "k2",
        name: {
          no: "Eik finer m/ integrerte hvitevarer",
          en: "Oak veneer w/ integrated appliances",
        },
        price: 86000,
        selected: true,
        tone: "wood",
      },
      {
        id: "k3",
        name: {
          no: "Mørk grå m/ kvarts benkeplate",
          en: "Dark grey w/ quartz worktop",
        },
        price: 64000,
        selected: false,
        tone: "render",
      },
    ],
  },
  {
    id: "floor",
    name: { no: "Gulv", en: "Flooring" },
    deadline: { no: "01. feb 2026", en: "1 Feb 2026" },
    options: [
      {
        id: "f1",
        name: { no: "Standard — 1-stavs eik", en: "Standard — 1-strip oak" },
        price: 0,
        selected: false,
        tone: "sand",
      },
      {
        id: "f2",
        name: {
          no: "Hvitoljet eik bredplank",
          en: "White-oiled wide oak plank",
        },
        price: 42000,
        selected: true,
        tone: "wood",
      },
      {
        id: "f3",
        name: { no: "Røkt eik bredplank", en: "Smoked oak wide plank" },
        price: 48000,
        selected: false,
        tone: "render",
      },
    ],
  },
  {
    id: "bath",
    name: { no: "Bad — fliser", en: "Bathroom — tiles" },
    deadline: { no: "01. feb 2026", en: "1 Feb 2026" },
    options: [
      {
        id: "b1",
        name: {
          no: "Standard — lys grå 30×60",
          en: "Standard — light grey 30×60",
        },
        price: 0,
        selected: true,
        tone: "indoor",
      },
      {
        id: "b2",
        name: { no: "Naturstein-look 60×60", en: "Natural stone look 60×60" },
        price: 28000,
        selected: false,
        tone: "render",
      },
      {
        id: "b3",
        name: {
          no: "Mørk matt m/ varmekabel oppgradering",
          en: "Dark matte w/ heating upgrade",
        },
        price: 34000,
        selected: false,
        tone: "frame",
      },
    ],
  },
  {
    id: "extra",
    name: { no: "Tillegg", en: "Extras" },
    deadline: { no: "01. feb 2026", en: "1 Feb 2026" },
    options: [
      {
        id: "e1",
        name: { no: "Peisovn i stue", en: "Wood stove in living room" },
        price: 38000,
        selected: true,
        tone: "indoor",
      },
      {
        id: "e2",
        name: { no: "Solceller på tak (4 kWp)", en: "Solar panels (4 kWp)" },
        price: 92000,
        selected: false,
        tone: "frame",
      },
      {
        id: "e3",
        name: { no: "Ladeboks for elbil", en: "EV charger" },
        price: 22000,
        selected: true,
        tone: "ground",
      },
    ],
  },
];

export const MEETINGS_DATA = {
  upcoming: [
    {
      id: 1,
      title: {
        no: "Tilvalgsmøte — kjøkken og bad",
        en: "Choices meeting — kitchen & bath",
      },
      type: { no: "På kontoret", en: "At the office" },
      date: { no: "14. jan 2026", en: "14 Jan 2026" },
      time: "10:00",
      with: "Sine Kragh",
      online: false,
    },
    {
      id: 2,
      title: {
        no: "Statusmøte byggefremdrift",
        en: "Build status meeting",
      },
      type: { no: "Digitalt møte", en: "Online" },
      date: { no: "03. feb 2026", en: "3 Feb 2026" },
      time: "13:30",
      with: "Sine Kragh",
      online: true,
    },
  ] as Meeting[],
  past: [
    {
      id: 3,
      title: { no: "Kontraktsmøte", en: "Contract meeting" },
      type: { no: "På kontoret", en: "At the office" },
      date: { no: "15. aug 2025", en: "15 Aug 2025" },
      time: "11:00",
      with: "Sine Kragh",
    },
    {
      id: 4,
      title: { no: "Første boligprat", en: "First home chat" },
      type: { no: "Digitalt møte", en: "Online" },
      date: { no: "28. jun 2025", en: "28 Jun 2025" },
      time: "09:00",
      with: "Sine Kragh",
    },
  ] as Meeting[],
};

export const UPDATES: Update[] = [
  {
    icon: "camera",
    text: {
      no: "8 nye bilder fra innvendige arbeider",
      en: "8 new photos from interior works",
    },
    time: { no: "2 dager siden", en: "2 days ago" },
    tab: "photos",
  },
  {
    icon: "doc",
    text: {
      no: "Tilvalgsavtale kjøkken klar for signering",
      en: "Kitchen options agreement ready to sign",
    },
    time: { no: "5 dager siden", en: "5 days ago" },
    tab: "documents",
  },
  {
    icon: "check",
    text: {
      no: "Milepæl nådd: Bygget er tett",
      en: "Milestone reached: building weather-tight",
    },
    time: { no: "1 uke siden", en: "1 week ago" },
    tab: "progress",
  },
  {
    icon: "chat",
    text: {
      no: "Ny melding fra Sine Kragh",
      en: "New message from Sine Kragh",
    },
    time: { no: "1 uke siden", en: "1 week ago" },
    tab: "messages",
  },
];

export const ACTIVITY_TODAY: ActivityItem[] = [
  { time: "07:30", text: { no: "Tømrere på plass", en: "Carpenters on site" } },
  {
    time: "09:15",
    text: {
      no: "Innvendige vegger reises i 1. etasje",
      en: "Interior walls going up, ground floor",
    },
  },
  {
    time: "11:30",
    text: {
      no: "Elektriker trekker kabler",
      en: "Electrician pulling cables",
    },
  },
  {
    time: "14:30",
    text: {
      no: "Dagens fremdrift dokumentert med bilder",
      en: "Today's progress documented with photos",
    },
  },
];

export const FLOORS: Floor[] = [
  { id: "loft", name: { no: "Loft", en: "Loft" } },
  { id: "1etg", name: { no: "1. etasje", en: "Ground floor" } },
  { id: "kjeller", name: { no: "Kjeller", en: "Basement" } },
];

export const INSPECTIONS: Inspection[] = [
  {
    id: 1,
    title: { no: "Forhåndsbefaring", en: "Pre-inspection" },
    date: { no: "12. jun 2026", en: "12 Jun 2026" },
    time: "10:00",
    status: "upcoming",
    note: {
      no: "Gjennomgang av tilvalg på plassen",
      en: "Walkthrough of choices on site",
    },
  },
  {
    id: 2,
    title: {
      no: "Ferdigbefaring / overtakelse",
      en: "Final inspection / handover",
    },
    date: { no: "10. mar 2026", en: "10 Mar 2026" },
    time: "12:00",
    status: "upcoming",
    note: {
      no: "Overtakelsesprotokoll signeres",
      en: "Handover protocol signed",
    },
  },
  {
    id: 3,
    title: { no: "Befaring tett bygg", en: "Weather-tight inspection" },
    date: { no: "16. des 2025", en: "16 Dec 2025" },
    time: "13:00",
    status: "done",
    note: {
      no: "Ingen avvik registrert",
      en: "No deviations recorded",
    },
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: "doc",
    text: {
      no: "Tilvalgsavtale kjøkken venter på din signatur",
      en: "Kitchen options agreement awaits your signature",
    },
    time: { no: "2t", en: "2h" },
    unread: true,
  },
  {
    id: 2,
    icon: "camera",
    text: {
      no: "8 nye bilder lagt ut i Bildelogg",
      en: "8 new photos added to gallery",
    },
    time: { no: "2d", en: "2d" },
    unread: true,
  },
  {
    id: 3,
    icon: "chat",
    text: {
      no: "Sine Kragh sendte deg en melding",
      en: "Sine Kragh sent you a message",
    },
    time: { no: "1u", en: "1w" },
    unread: false,
  },
];

export const AI_SEED = {
  nb: `Du er Krag sin AI-byggeassistent for boligkjøper Ingrid Haugen som bygger enebolig B7 på Justneshalvøya (148 m², 4 soverom). Byggefremdrift: 62% ferdig, bygget er tett, innvendige arbeider pågår (55%). Forventet overtakelse mars 2026. Neste milepæl: innvendige arbeider ferdig 15. feb. Total kjøpesum 7 388 000 kr inkl. tilvalg på 218 000 kr; 3 690 000 kr er innbetalt, neste betaling 15. feb (1 845 000 kr). Frist for kjøkken-tilvalg er 20. januar. Rådgiver er Sine Kragh (sine@kraggruppen.no, 94 23 75 47). Svar kort, varmt og hjelpsomt på norsk. Ikke finn på fakta utover dette; henvis til Sine ved usikkerhet.`,
  en: `You are Krag's AI build assistant for home buyer Ingrid Haugen, building detached house B7 at Justneshalvøya (148 m², 4 bedrooms). Build progress: 62% complete, weather-tight, interior works ongoing (55%). Expected handover March 2026. Next milestone: interior works done 15 Feb. Total price 7,388,000 NOK incl. 218,000 in options; 3,690,000 paid, next payment 15 Feb (1,845,000). Kitchen options deadline is 20 January. Advisor is Sine Kragh (sine@kraggruppen.no, +47 94 23 75 47). Answer briefly, warmly and helpfully in English. Don't invent facts beyond this; refer to Sine when unsure.`,
};

export const AI_SUGGESTIONS = {
  nb: [
    "Hva skjer denne uken?",
    "Når er neste betaling?",
    "Når må jeg velge kjøkken?",
    "Hva gjenstår av innendørs arbeid?",
  ],
  en: [
    "What's happening this week?",
    "When is my next payment?",
    "When do I choose the kitchen?",
    "What interior work remains?",
  ],
};

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
  RenovationProject,
  Avvik,
  RenovationRoom,
  MaterialGroup,
  RenovationBudget,
  OnSiteToday,
  RenovationService,
  IntakeQuestion,
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

// ═══════════════════════════════════════════════════════════════════════════════
// RENOVATION TRACK — "Min oppussing"
// Demo household: Kari & Anders Tvedt, Vesterveien 8, Lund, Kristiansand
// ═══════════════════════════════════════════════════════════════════════════════

export const RENO_PM = {
  name: "Tom Eide",
  role: { no: "Prosjektleder, Krag Gruppen", en: "Project manager, Krag Gruppen" },
  phone: "94 18 52 30",
  email: "tom@kraggruppen.no",
  initials: "TE",
};

export const RENO_BUYER = {
  name: "Kari",
  fullName: "Kari & Anders Tvedt",
  initials: "KT",
};

export const RENO_PROJECT: RenovationProject = {
  id: "vesterveien",
  name: { no: "Totalrenovering", en: "Full renovation" },
  addressShort: "Vesterveien 8",
  place: { no: "Lund, Kristiansand", en: "Lund, Kristiansand" },
  address: { no: "Vesterveien 8, 4630 Kristiansand", en: "Vesterveien 8, 4630 Kristiansand" },
  built: 1973,
  area: 162,
  addArea: 28,
  type: { no: "Enebolig · totalrenovering + tilbygg", en: "Detached · full renovation + extension" },
  scope: { no: "Ny planløsning, tilbygg, 2 bad, ny fasade & tak", en: "New layout, extension, 2 baths, new façade & roof" },
  progress: 48,
  start: { no: "Januar 2026", en: "January 2026" },
  handover: { no: "November 2026", en: "November 2026" },
};

export const RENO_PHASES = [
  { id: "befaring", name: { no: "Befaring & tilbud", en: "Inspection & quote" }, pct: 100, status: "done" as const, date: { no: "Des 2025", en: "Dec 2025" } },
  { id: "kontrakt", name: { no: "Kontrakt & oppstart", en: "Contract & kickoff" }, pct: 100, status: "done" as const, date: { no: "Jan 2026", en: "Jan 2026" } },
  { id: "riving", name: { no: "Riving & demontering", en: "Demolition & strip-out" }, pct: 100, status: "done" as const, date: { no: "Feb 2026", en: "Feb 2026" } },
  { id: "tilbygg", name: { no: "Tilbygg — råbygg & tett", en: "Extension — shell & weather-tight" }, pct: 100, status: "done" as const, date: { no: "Mars 2026", en: "Mar 2026" } },
  { id: "teknisk", name: { no: "Rør, el & ventilasjon", en: "Plumbing, electrical & ventilation" }, pct: 55, status: "active" as const, date: { no: "Pågår nå", en: "In progress" } },
  { id: "vatrom", name: { no: "Membran & flislegging (våtrom)", en: "Membrane & tiling (wet rooms)" }, pct: 0, status: "upcoming" as const, date: { no: "Juni 2026", en: "Jun 2026" } },
  { id: "innredning", name: { no: "Innredning & overflater", en: "Fit-out & surfaces" }, pct: 0, status: "upcoming" as const, date: { no: "Aug 2026", en: "Aug 2026" } },
  { id: "overtakelse", name: { no: "Sluttkontroll & overtakelse", en: "Final check & handover" }, pct: 0, status: "upcoming" as const, date: { no: "Nov 2026", en: "Nov 2026" } },
];

export const RENO_AVVIK: Avvik[] = [
  {
    id: "av1", room: { no: "Hovedbad", en: "Main bath" }, cat: "rate", tone: "ground",
    title: { no: "Råteskader i bjelkelaget", en: "Rot in the floor joists" },
    found: { no: "14. feb", en: "14 Feb" },
    desc: { no: "Da vi rev gulvet i hovedbadet fant vi råte i bjelkelaget etter langvarig lekkasje rundt sluket.", en: "When we removed the bathroom floor we found rot in the joists from a long-standing leak around the drain." },
    solution: { no: "Skifte berørte bjelker og bygge nytt, fuktsikkert undergulv før membran legges.", en: "Replace affected joists and build a new, moisture-safe subfloor before the membrane goes down." },
    cost: 38000, days: 4, status: "pending", urgent: true,
  },
  {
    id: "av2", room: { no: "1. etasje", en: "Ground floor" }, cat: "el", tone: "frame",
    title: { no: "El-anlegg uten jording", en: "Wiring without earthing" },
    found: { no: "9. feb", en: "9 Feb" },
    desc: { no: "Eksisterende kursopplegg er fra 70-tallet, uten jording, og tåler ikke nytt forbruk.", en: "The existing wiring is from the 1970s, without earthing, and can't carry the new load." },
    solution: { no: "Trekke nye kurser og montere nytt sikringsskap i hele 1. etasje. Samsvarserklæring utstedes.", en: "Run new circuits and fit a new fuse board across the ground floor. Compliance certificate issued." },
    cost: 52000, days: 3, status: "approved",
  },
  {
    id: "av3", room: { no: "Tak", en: "Roof" }, cat: "miljo", tone: "ground",
    title: { no: "Asbest i gammel taktekking", en: "Asbestos in old roofing" },
    found: { no: "2. feb", en: "2 Feb" },
    desc: { no: "Prøve bekreftet asbest i undertaket. Må saneres av sertifisert firma før nytt tak legges.", en: "A sample confirmed asbestos in the underroof. It must be removed by a certified firm before the new roof." },
    solution: { no: "Sanering etter forskrift, trygg avhending og dokumentasjon på utført arbeid.", en: "Removal to regulation, safe disposal and documentation of the work." },
    cost: 24500, days: 2, status: "approved",
  },
  {
    id: "av4", room: { no: "Tilbygg", en: "Extension" }, cat: "konstruksjon", tone: "frame",
    title: { no: "Manglende bæring ved stueåpning", en: "Insufficient support at living-room opening" },
    found: { no: "20. feb", en: "20 Feb" },
    desc: { no: "Åpningen mot tilbygget krever større spennvidde enn opprinnelig antatt i tilbudet.", en: "The opening to the extension needs a longer span than first assumed in the quote." },
    solution: { no: "Montere limtre-/stålbjelke dimensjonert av konstruktør, med ny søyle.", en: "Fit a glulam/steel beam sized by the structural engineer, with a new post." },
    cost: 41000, days: 5, status: "pending", urgent: true,
  },
  {
    id: "av5", room: { no: "Kjeller", en: "Basement" }, cat: "rate", tone: "ground",
    title: { no: "Fukt i grunnmur", en: "Damp in the foundation wall" },
    found: { no: "18. feb", en: "18 Feb" },
    desc: { no: "Fuktmålinger i kjeller viser behov for utvendig drenering for å sikre de nye flatene over tid.", en: "Moisture readings in the basement show outside drainage is needed to protect the new surfaces over time." },
    solution: { no: "Grave ut, drenere og fuktsikre grunnmur. Anbefalt tiltak — kan utsettes til neste sesong.", en: "Excavate, drain and damp-proof the foundation. Recommended — can be deferred to next season." },
    cost: 68000, days: 6, status: "pending", optional: true,
  },
  {
    id: "av6", room: { no: "Hele boligen", en: "Whole home" }, cat: "info", tone: "indoor",
    title: { no: "Oppgradert brannsikring", en: "Upgraded fire safety" },
    found: { no: "9. feb", en: "9 Feb" },
    desc: { no: "Røykvarslere og slokkeutstyr oppgraderes til dagens krav.", en: "Smoke alarms and extinguishing equipment are upgraded to current code." },
    solution: { no: "Inkludert i kontrakten — ingen ekstra kostnad. Kun til informasjon.", en: "Included in the contract — no extra cost. For your information only." },
    cost: 0, days: 0, status: "info",
  },
];

export const RENO_ROOMS: RenovationRoom[] = [
  { id: "kjokken", name: { no: "Kjøkken (tilbygg)", en: "Kitchen (extension)" }, tone: "indoor", pct: 35, status: "active",
    scope: { no: "Åpen løsning mot stue, ny innredning og hvitevarer", en: "Open-plan to living room, new units and appliances" },
    mats: { no: ["Eik finer", "Kvarts benkeplate"], en: ["Oak veneer", "Quartz worktop"] } },
  { id: "stue", name: { no: "Stue (tilbygg)", en: "Living room (extension)" }, tone: "frame", pct: 45, status: "active",
    scope: { no: "28 m² tilbygg, store vindusfelt mot hagen", en: "28 m² extension, large windows to the garden" },
    mats: { no: ["Eik bredplank", "Peisovn"], en: ["Wide oak plank", "Wood stove"] } },
  { id: "hovedbad", name: { no: "Hovedbad", en: "Main bathroom" }, tone: "ground", pct: 20, status: "active",
    scope: { no: "Komplett nytt bad, gulvvarme og dusjnisje", en: "Complete new bath, floor heating and shower niche" },
    mats: { no: ["Naturstein-look", "Innfelt belysning"], en: ["Natural-stone look", "Recessed lighting"] } },
  { id: "gjestebad", name: { no: "Gjestebad", en: "Guest bath" }, tone: "indoor", pct: 0, status: "upcoming",
    scope: { no: "Nytt gjeste-wc med dusj i 1. etasje", en: "New guest WC with shower on the ground floor" },
    mats: { no: ["Lys matt flis"], en: ["Light matte tile"] } },
  { id: "fasade", name: { no: "Fasade", en: "Façade" }, tone: "ground", pct: 10, status: "upcoming",
    scope: { no: "Etterisolering og ny liggende kledning", en: "Added insulation and new horizontal cladding" },
    mats: { no: ["Royalimpregnert kledning"], en: ["Treated timber cladding"] } },
  { id: "tak", name: { no: "Tak", en: "Roof" }, tone: "frame", pct: 60, status: "active",
    scope: { no: "Nytt tak etter asbestsanering, nye takrenner", en: "New roof after asbestos removal, new gutters" },
    mats: { no: ["Betongtakstein"], en: ["Concrete roof tiles"] } },
];

export const RENO_MATERIAL_GROUPS: MaterialGroup[] = [
  { id: "kjokken", name: { no: "Kjøkkeninnredning", en: "Kitchen units" }, deadline: { no: "15. mai 2026", en: "15 May 2026" },
    options: [
      { id: "m1", name: { no: "Standard — hvit matt", en: "Standard — matte white" }, price: 0, selected: false },
      { id: "m2", name: { no: "Eik finer m/ integrerte hvitevarer", en: "Oak veneer w/ integrated appliances" }, price: 78000, selected: true },
      { id: "m3", name: { no: "Mørk grøn m/ kvarts", en: "Dark green w/ quartz" }, price: 64000, selected: false },
    ] },
  { id: "badflis", name: { no: "Bad — fliser", en: "Bath — tiles" }, deadline: { no: "01. juni 2026", en: "1 Jun 2026" },
    options: [
      { id: "b1", name: { no: "Standard — lys grå 30×60", en: "Standard — light grey 30×60" }, price: 0, selected: false },
      { id: "b2", name: { no: "Naturstein-look 60×60", en: "Natural-stone look 60×60" }, price: 26000, selected: true },
      { id: "b3", name: { no: "Mørk matt storformat", en: "Dark matte large-format" }, price: 31000, selected: false },
    ] },
  { id: "gulv", name: { no: "Gulv (hele boligen)", en: "Flooring (whole home)" }, deadline: { no: "01. juni 2026", en: "1 Jun 2026" },
    options: [
      { id: "g1", name: { no: "1-stavs eikeparkett", en: "1-strip oak parquet" }, price: 0, selected: false },
      { id: "g2", name: { no: "Hvitoljet eik bredplank", en: "White-oiled wide oak plank" }, price: 41000, selected: true },
      { id: "g3", name: { no: "Røkt eik bredplank", en: "Smoked oak wide plank" }, price: 47000, selected: false },
    ] },
  { id: "kledning", name: { no: "Utvendig kledning", en: "Exterior cladding" }, deadline: { no: "15. juli 2026", en: "15 Jul 2026" },
    options: [
      { id: "k1", name: { no: "Royalimpregnert furu — natur", en: "Treated pine — natural" }, price: 0, selected: true },
      { id: "k2", name: { no: "Royal — mørk grå", en: "Treated — dark grey" }, price: 18000, selected: false },
      { id: "k3", name: { no: "Liggende panel — malt hvit", en: "Horizontal panel — painted white" }, price: 12000, selected: false },
    ] },
];

export const RENO_BUDGET: RenovationBudget = {
  contract: 2980000,
  materials: 145000,
  changes: 76500,
  paid: 894000,
};

export const RENO_PAYMENTS = [
  { id: 1, label: { no: "Forskudd ved kontrakt", en: "Deposit at contract" }, amount: 298000, pct: "10%", status: "paid" as const, date: { no: "12.01.2026", en: "12 Jan 2026" } },
  { id: 2, label: { no: "Ved riving ferdig", en: "At demolition complete" }, amount: 596000, pct: "20%", status: "paid" as const, date: { no: "28.02.2026", en: "28 Feb 2026" } },
  { id: 3, label: { no: "Ved tett tilbygg", en: "At weather-tight extension" }, amount: 596000, pct: "20%", status: "upcoming" as const, date: { no: "30.04.2026", en: "30 Apr 2026" } },
  { id: 4, label: { no: "Ved membran & flis", en: "At membrane & tiling" }, amount: 745000, pct: "25%", status: "upcoming" as const, date: { no: "30.06.2026", en: "30 Jun 2026" } },
  { id: 5, label: { no: "Sluttoppgjør ved overtakelse", en: "Final settlement at handover" }, amount: 745000, pct: "25%", status: "upcoming" as const, date: { no: "15.11.2026", en: "15 Nov 2026" } },
];

export const RENO_DOCUMENTS = [
  { id: 1, name: { no: "Tilbud — totalrenovering", en: "Quote — full renovation" }, cat: "contract" as const, date: { no: "18.12.2025", en: "18 Dec 2025" }, size: "1.4 MB", signed: true },
  { id: 2, name: { no: "Entreprisekontrakt (NS 8406)", en: "Construction contract (NS 8406)" }, cat: "contract" as const, date: { no: "10.01.2026", en: "10 Jan 2026" }, size: "2.1 MB", signed: true },
  { id: 3, name: { no: "Fremdriftsplan", en: "Progress schedule" }, cat: "drawing" as const, date: { no: "12.01.2026", en: "12 Jan 2026" }, size: "0.6 MB", signed: null },
  { id: 4, name: { no: "Endringsavtale — el-anlegg", en: "Change order — wiring" }, cat: "contract" as const, date: { no: "11.02.2026", en: "11 Feb 2026" }, size: "0.4 MB", signed: false },
  { id: 5, name: { no: "Asbestrapport & saneringsbevis", en: "Asbestos report & clearance" }, cat: "spec" as const, date: { no: "05.02.2026", en: "5 Feb 2026" }, size: "1.1 MB", signed: null },
  { id: 6, name: { no: "Våtromsdokumentasjon / membrankontroll", en: "Wet-room documentation / membrane control" }, cat: "spec" as const, date: { no: "—", en: "—" }, size: "—", signed: null, soon: true },
  { id: 7, name: { no: "Samsvarserklæring elektro", en: "Electrical compliance certificate" }, cat: "spec" as const, date: { no: "—", en: "—" }, size: "—", signed: null, soon: true },
  { id: 8, name: { no: "FDV & garantidokumenter", en: "FDV & warranty documents" }, cat: "spec" as const, date: { no: "—", en: "—" }, size: "—", signed: null, soon: true },
];

export const RENO_PHOTO_ALBUMS = [
  { phase: { no: "Rør & elektro", en: "Plumbing & electrical" }, date: { no: "Mai 2026", en: "May 2026" }, count: 9, tone: "frame" as const, tag: { no: "Underveis", en: "In progress" } },
  { phase: { no: "Tilbygg — råbygg", en: "Extension — shell" }, date: { no: "Mars 2026", en: "Mar 2026" }, count: 14, tone: "wood" as const, tag: { no: "Underveis", en: "In progress" } },
  { phase: { no: "Riving & demontering", en: "Demolition" }, date: { no: "Feb 2026", en: "Feb 2026" }, count: 11, tone: "ground" as const, tag: { no: "Underveis", en: "In progress" } },
  { phase: { no: "Slik var det før", en: "How it looked before" }, date: { no: "Des 2025", en: "Dec 2025" }, count: 16, tone: "indoor" as const, tag: { no: "Før", en: "Before" } },
];

export const RENO_MESSAGES = [
  { id: "rm1", from: "advisor" as const, text: { no: "Hei Kari! Tilbygget er tett og vi er godt i gang med rør og elektro. Jeg har lagt ut nye bilder i bildeloggen. 🙂", en: "Hi Kari! The extension is weather-tight and we're well underway with plumbing and electrical. New photos are in the gallery. 🙂" }, time: "08:30", date: { no: "5. mai", en: "5 May" } },
  { id: "rm2", from: "me" as const, text: { no: "Så bra! Jeg så avviket om bjelkelaget i hovedbadet — kan vi ta en prat om det?", en: "Great! I saw the change order about the bathroom joists — can we talk it through?" }, time: "09:02", date: { no: "5. mai", en: "5 May" } },
  { id: "rm3", from: "advisor" as const, text: { no: "Selvsagt. Det er viktig at vi tar det nå mens gulvet er åpent. Jeg har lagt forslag og pris under Avvik & endringer — godkjenner du der, så bestiller vi materialene i dag.", en: "Of course. It's important we do it now while the floor is open. I've put the proposal and price under Changes — approve it there and we'll order the materials today." }, time: "09:08", date: { no: "5. mai", en: "5 May" } },
  { id: "rm4", from: "me" as const, text: { no: "Tusen takk for god forklaring. Jeg ser på det i kveld.", en: "Thanks for explaining it so well. I'll look tonight." }, time: "09:15", date: { no: "5. mai", en: "5 May" } },
];

export const RENO_MEETINGS_DATA = {
  upcoming: [
    { id: 1, title: { no: "Byggemøte underveis", en: "Site progress meeting" }, type: { no: "På byggeplass", en: "On site" }, date: { no: "22. mai 2026", en: "22 May 2026" }, time: "09:00", with: "Tom Eide", online: false },
    { id: 2, title: { no: "Gjennomgang av tilvalg", en: "Material selections review" }, type: { no: "Digitalt møte", en: "Online" }, date: { no: "04. juni 2026", en: "4 Jun 2026" }, time: "14:00", with: "Tom Eide", online: true },
  ],
  past: [
    { id: 3, title: { no: "Oppstartsmøte", en: "Kickoff meeting" }, type: { no: "På byggeplass", en: "On site" }, date: { no: "14. jan 2026", en: "14 Jan 2026" }, time: "10:00", with: "Tom Eide", online: false },
  ],
};

export const RENO_INSPECTIONS = [
  { id: 1, title: { no: "Befaring (tilstandsvurdering)", en: "Site inspection (condition survey)" }, date: { no: "08. des 2025", en: "8 Dec 2025" }, time: "11:00", status: "done" as const, note: { no: "Grunnlag for tilbud", en: "Basis for the quote" } },
  { id: 2, title: { no: "Membrankontroll våtrom", en: "Wet-room membrane control" }, date: { no: "18. juni 2026", en: "18 Jun 2026" }, time: "13:00", status: "upcoming" as const, note: { no: "Uavhengig kontroll før flislegging", en: "Independent check before tiling" } },
  { id: 3, title: { no: "Ferdigbefaring / overtakelse", en: "Final inspection / handover" }, date: { no: "10. nov 2026", en: "10 Nov 2026" }, time: "12:00", status: "upcoming" as const, note: { no: "Overtakelsesprotokoll signeres", en: "Handover protocol signed" } },
];

export const RENO_ON_SITE_TODAY: OnSiteToday = {
  crew: { no: "Rørlegger + elektriker", en: "Plumber + electrician" },
  hours: "07:30–15:30",
  waterOff: { no: "Vann avstengt 09:00–14:00", en: "Water off 09:00–14:00" },
  note: { no: "Vi legger rør-i-rør og trekker nye kurser i 1. etasje i dag. Det blir noe støy fra boring.", en: "We're laying pipe-in-pipe and pulling new circuits on the ground floor today. Expect some drilling noise." },
  access: { no: "Nøkkel i nøkkelboks — kode sendt på SMS", en: "Key in lockbox — code sent by SMS" },
};

export const RENO_ACTIVITY_TODAY = [
  { time: "07:30", text: { no: "Rørlegger og elektriker på plass", en: "Plumber and electrician on site" } },
  { time: "09:00", text: { no: "Vannet stenges av for omlegging", en: "Water shut off for re-routing" } },
  { time: "11:00", text: { no: "Nye kurser trekkes i stue og kjøkken", en: "New circuits pulled in living room and kitchen" } },
  { time: "14:30", text: { no: "Vannet på igjen — dagens arbeid dokumentert", en: "Water back on — today's work documented" } },
];

export const RENO_NOTIFICATIONS = [
  { icon: "alert", text: { no: "2 avvik venter på din godkjenning", en: "2 change orders await your approval" }, time: { no: "1t", en: "1h" }, unread: true },
  { icon: "camera", text: { no: "9 nye bilder fra rør & elektro", en: "9 new photos from plumbing & electrical" }, time: { no: "1d", en: "1d" }, unread: true },
  { icon: "chat", text: { no: "Tom Eide sendte deg en melding", en: "Tom Eide sent you a message" }, time: { no: "2d", en: "2d" }, unread: false },
];

export const RENO_SERVICES: RenovationService[] = [
  { id: "total", icon: "home", label: { no: "Totaloppussing", en: "Full renovation" }, sub: { no: "Hele boligen", en: "The whole home" } },
  { id: "tilbygg", icon: "building", label: { no: "Tilbygg / påbygg", en: "Extension / addition" }, sub: { no: "Mer plass", en: "More space" } },
  { id: "fasade", icon: "roof", label: { no: "Fasade & tak", en: "Façade & roof" }, sub: { no: "Utvendig", en: "Exterior" } },
  { id: "kjeller", icon: "layers", label: { no: "Kjeller / loft", en: "Basement / loft" }, sub: { no: "Ny boareal", en: "New living space" } },
  { id: "bad", icon: "droplet", label: { no: "Bad", en: "Bathroom" }, sub: { no: "Våtrom", en: "Wet room" } },
  { id: "kjokken", icon: "swatch", label: { no: "Kjøkken", en: "Kitchen" }, sub: { no: "Nytt kjøkken", en: "New kitchen" } },
];

export const RENO_INTAKE_QUESTIONS: IntakeQuestion[] = [
  { id: "ambition", icon: "star", q: { no: "Hvor omfattende er prosjektet?", en: "How extensive is the project?" },
    help: { no: "Et grovt anslag — vi finpusser på befaringen.", en: "A rough idea — we refine it at the inspection." },
    options: [
      { id: "refresh", label: { no: "Oppfriskning", en: "Refresh" }, sub: { no: "Overflater og kosmetikk", en: "Surfaces and cosmetics" } },
      { id: "upgrade", label: { no: "Standardheving", en: "Upgrade" }, sub: { no: "Nye rom og funksjoner", en: "New rooms and functions" } },
      { id: "total", label: { no: "Totalrenovering", en: "Full renovation" }, sub: { no: "Strip til reisverk", en: "Down to the studs" } },
    ] },
  { id: "homeType", icon: "home", q: { no: "Hva slags bolig er det?", en: "What kind of home is it?" },
    help: { no: "Hjelper oss å forstå konstruksjonen.", en: "Helps us understand the structure." },
    options: [
      { id: "enebolig", label: { no: "Enebolig", en: "Detached house" } },
      { id: "rekkehus", label: { no: "Rekkehus", en: "Townhouse" } },
      { id: "leilighet", label: { no: "Leilighet", en: "Apartment" } },
      { id: "hytte", label: { no: "Hytte", en: "Cabin" } },
    ] },
  { id: "built", icon: "clock", q: { no: "Når ble boligen bygget?", en: "When was the home built?" },
    help: { no: "Eldre hus skjuler ofte overraskelser — det planlegger vi for.", en: "Older homes often hide surprises — we plan for that." },
    options: [
      { id: "pre60", label: { no: "Før 1960", en: "Before 1960" } },
      { id: "60-80", label: { no: "1960–1980", en: "1960–1980" } },
      { id: "80-00", label: { no: "1980–2000", en: "1980–2000" } },
      { id: "post00", label: { no: "Etter 2000", en: "After 2000" } },
    ] },
  { id: "style", icon: "swatch", q: { no: "Hvilken stil drømmer du om?", en: "What style do you dream of?" },
    help: { no: "Velg én eller flere.", en: "Pick one or more." }, multi: true,
    options: [
      { id: "scandi", label: { no: "Skandinavisk", en: "Scandinavian" } },
      { id: "modern", label: { no: "Moderne", en: "Modern" } },
      { id: "classic", label: { no: "Klassisk", en: "Classic" } },
      { id: "warm", label: { no: "Varm minimalisme", en: "Warm minimalism" } },
    ] },
  { id: "budget", icon: "wallet", q: { no: "Omtrentlig budsjett?", en: "Approximate budget?" },
    help: { no: "Bare et utgangspunkt — vi finner gode løsninger sammen.", en: "Just a starting point — we'll find good solutions together." },
    options: [
      { id: "u1", label: { no: "Under 1 mill", en: "Under 1M" }, sub: { no: "kr", en: "NOK" } },
      { id: "1-2", label: { no: "1–2,5 mill", en: "1–2.5M" }, sub: { no: "kr", en: "NOK" } },
      { id: "2-4", label: { no: "2,5–4 mill", en: "2.5–4M" }, sub: { no: "kr", en: "NOK" } },
      { id: "4+", label: { no: "Over 4 mill", en: "Over 4M" }, sub: { no: "kr", en: "NOK" } },
    ] },
  { id: "timing", icon: "calendar", q: { no: "Når ønsker du å starte?", en: "When would you like to start?" },
    help: { no: "Ingen forpliktelse — bare for å planlegge.", en: "No commitment — just for planning." },
    options: [
      { id: "asap", label: { no: "Så snart som mulig", en: "As soon as possible" } },
      { id: "3-6", label: { no: "Om 3–6 måneder", en: "In 3–6 months" } },
      { id: "6-12", label: { no: "Om 6–12 måneder", en: "In 6–12 months" } },
      { id: "explore", label: { no: "Bare utforsker", en: "Just exploring" } },
    ] },
];

export const RENO_ESTIMATE_BASE: Record<string, [number, number]> = {
  refresh: [350000, 900000],
  upgrade: [900000, 2200000],
  total: [2200000, 4500000],
};

export const RENO_AI_SEED = {
  nb: `Du er Krag sin AI-renoveringsassistent for Kari & Anders Tvedt, som totalrenoverer en enebolig fra 1973 i Vesterveien 8 på Lund, Kristiansand (162 m² + 28 m² tilbygg). Fremdrift: 48% ferdig — tilbygget er tett, rør/el/ventilasjon pågår (55%). Forventet overtakelse november 2026. Det er registrert avvik/endringer: råte i bjelkelag på hovedbad (+38 000 kr, venter på svar), manglende bæring i tilbygg (+41 000 kr, venter), fukt i grunnmur (+68 000 kr, anbefalt/valgfritt), mens el-anlegg uten jording (+52 000 kr) og asbestsanering tak (+24 500 kr) er godkjent. Kontraktsum 2 980 000 kr, valgte tilvalg 145 000 kr, godkjente endringer 76 500 kr. Neste betaling er ved tett tilbygg (596 000 kr, 30.04). Prosjektleder er Tom Eide. Svar kort, varmt og tydelig på norsk. Forklar gjerne hvorfor noe må gjøres i et eldre hus. Ikke finn på fakta — henvis til Tom ved usikkerhet.`,
  en: `You are Krag's AI renovation assistant for Kari & Anders Tvedt, fully renovating a 1973 detached house at Vesterveien 8, Lund, Kristiansand (162 m² + 28 m² extension). Progress: 48% — the extension is weather-tight, plumbing/electrical/ventilation underway (55%). Expected handover November 2026. Logged change orders: rot in main-bath joists (+38,000 NOK, awaiting reply), insufficient support in extension (+41,000, awaiting), foundation damp (+68,000, recommended/optional), while wiring without earthing (+52,000) and roof asbestos removal (+24,500) are approved. Contract sum 2,980,000 NOK, selected options 145,000, approved changes 76,500. Next payment at weather-tight extension (596,000, 30 Apr). Project manager is Tom Eide. Answer briefly, warmly and clearly. Explain why something is needed in an older house. Don't invent facts — refer to Tom when unsure.`,
};

export const RENO_AI_SUGGESTIONS = {
  nb: ["Hvorfor må bjelkelaget skiftes?", "Hva venter på min godkjenning?", "Når er neste betaling?"],
  en: ["Why must the joists be replaced?", "What awaits my approval?", "When is my next payment?"],
};

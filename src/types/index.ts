// ─── Shared bilingual string type ────────────────────────────────────────────
export type BiString = { no: string; en: string };

// ─── Entities ─────────────────────────────────────────────────────────────────

export type Buyer = {
  id: string;
  name: string;
  fullName: string;
  initials: string;
  email: string;
  phone?: string;
  locale: "nb" | "en";
};

export type Advisor = {
  id: string;
  name: string;
  role: BiString;
  phone: string;
  email: string;
  initials: string;
};

export type ProjectTone =
  | "fjord"
  | "forest"
  | "sand"
  | "indoor"
  | "frame"
  | "wood"
  | "ground"
  | "render";

export type ProjectType = "house" | "cabin" | "town" | "duplex";

export type Project = {
  id: string;
  name: string;
  place: BiString;
  type: BiString;
  typeKey: ProjectType;
  priceFrom: number;
  sizeFrom: number;
  sizeTo: number;
  bedrooms: string;
  status: BiString;
  match?: number;
  tone: ProjectTone;
  tags: { no: string[]; en: string[] };
  blurb: BiString;
  why?: { no: string[]; en: string[] };
};

export type ProjectUnit = {
  id: string;
  label: string;
  size: number;
  bedrooms: number;
  feature?: BiString;
  price: number;
  reserved: boolean;
};

export type DashboardProject = {
  id: string;
  name: string;
  unit: string;
  place: BiString;
  address: BiString;
  progress: number;
  handover: BiString;
  type: BiString;
  bedrooms: number;
};

// ─── Questionnaire ────────────────────────────────────────────────────────────

export type QuestionOption = {
  id: string;
  label: BiString;
  sub: BiString;
};

export type Question = {
  id: string;
  icon: string;
  q: BiString;
  help: BiString;
  multi?: boolean;
  max?: number;
  options: QuestionOption[];
};

export type QuestionAnswers = Record<string, string | string[]>;

export type QuestionnaireStyle = "stepper" | "chat" | "cards";

// ─── Dashboard data ────────────────────────────────────────────────────────────

export type PhaseStatus = "done" | "active" | "upcoming";

export type Phase = {
  id: string;
  name: BiString;
  pct: number;
  status: PhaseStatus;
  date: BiString;
};

export type PaymentStatus = "paid" | "upcoming";

export type Payment = {
  id: number;
  label: BiString;
  amount: number;
  pct: string;
  status: PaymentStatus;
  date: BiString;
};

export type Budget = {
  base: number;
  addons: number;
  total: number;
  paid: number;
};

export type DocumentSignStatus = "signed" | "needs-signature" | "n-a";

export type DocumentCategory = "contract" | "drawing" | "spec";

export type KragDocument = {
  id: number;
  name: BiString;
  cat: DocumentCategory;
  date: BiString;
  size: string;
  signed: boolean | null; // true=signed, false=needs-signature, null=n-a
  soon?: boolean;
};

export type PhotoAlbum = {
  phase: BiString;
  date: BiString;
  count: number;
  tone: ProjectTone;
};

export type Message = {
  id?: string;
  from: "advisor" | "me";
  text: BiString;
  time: string;
  date: BiString;
};

export type ChoiceOption = {
  id: string;
  name: BiString;
  price: number;
  selected: boolean;
  tone?: ProjectTone;
};

export type ChoiceGroup = {
  id: string;
  name: BiString;
  deadline: BiString;
  options: ChoiceOption[];
  deadlinePassed?: boolean;
};

export type Meeting = {
  id: number;
  title: BiString;
  type: BiString;
  date: BiString;
  time: string;
  with: string;
  online?: boolean;
};

export type Inspection = {
  id: number;
  title: BiString;
  date: BiString;
  time: string;
  status: "upcoming" | "done";
  note: BiString;
};

export type Notification = {
  id?: number;
  icon: string;
  text: BiString;
  time: BiString;
  unread: boolean;
};

export type ActivityItem = {
  time: string;
  text: BiString;
};

export type Update = {
  icon: string;
  text: BiString;
  time: BiString;
  tab: string;
};

export type Floor = {
  id: string;
  name: BiString;
};

// ─── Recommendations ──────────────────────────────────────────────────────────

export type RecommendationResult = Project & {
  matchScore: number;
  reasons: BiString[];
};

// ─── Meeting booking ──────────────────────────────────────────────────────────

export type MeetingType = "office" | "digital" | "site" | "phone";

export type BookingSlot = {
  date: string; // ISO date
  dayLabel: BiString;
  dayName: BiString;
  month: BiString;
  times: string[];
};

export type BookingRequest = {
  type: MeetingType;
  date: string;
  time: string;
  note?: string;
  projectId?: string;
  unitId?: string;
};

// ─── Renovation track ─────────────────────────────────────────────────────────

export type RenovationProject = {
  id: string;
  name: BiString;
  addressShort: string;
  place: BiString;
  address: BiString;
  built: number;
  area: number;
  addArea?: number;
  type: BiString;
  scope: BiString;
  progress: number;
  start: BiString;
  handover: BiString;
};

export type AvvikStatus = "pending" | "approved" | "declined" | "info";
export type AvvikCategory = "rate" | "el" | "ror" | "konstruksjon" | "miljo" | "info";

export type Avvik = {
  id: string;
  room: BiString;
  cat: AvvikCategory;
  tone: string;
  title: BiString;
  found: BiString;
  desc: BiString;
  solution: BiString;
  cost: number;
  days: number;
  status: AvvikStatus;
  urgent?: boolean;
  optional?: boolean;
};

export type RenovationRoom = {
  id: string;
  name: BiString;
  tone: string;
  pct: number;
  status: "active" | "upcoming" | "done";
  scope: BiString;
  mats: { no: string[]; en: string[] };
};

export type MaterialOption = {
  id: string;
  name: BiString;
  price: number;
  selected: boolean;
};

export type MaterialGroup = {
  id: string;
  name: BiString;
  deadline: BiString;
  options: MaterialOption[];
};

export type RenovationBudget = {
  contract: number;
  materials: number;
  changes: number;
  paid: number;
};

export type OnSiteToday = {
  crew: BiString;
  hours: string;
  waterOff: BiString;
  note: BiString;
  access: BiString;
};

export type RenovationService = {
  id: string;
  icon: string;
  label: BiString;
  sub: BiString;
};

export type IntakeQuestion = {
  id: string;
  icon: string;
  q: BiString;
  help: BiString;
  multi?: boolean;
  options: { id: string; label: BiString; sub?: BiString }[];
};

// ─── AI ───────────────────────────────────────────────────────────────────────

export type AiMessage = {
  role: "user" | "assistant";
  content: string;
};

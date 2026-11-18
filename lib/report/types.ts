export interface PeriodRange {
  start: string;
  end: string;
  label: string;
  shortLabel: string;
  weeks: number;
  periodsBack: number;
}

export interface MetricPair {
  current: number;
  previous: number;
}

export interface TrendPoint {
  start: string;
  label: string;
  sessions: number;
  clicks: number;
  impressions: number;
}

export interface NamedRow {
  label: string;
  value: number;
  share: number;
}

export interface PageRow {
  path: string;
  views: number;
  sessions: number;
}

export interface LanguageRow {
  code: string;
  label: string;
  views: number;
  sessions: number;
  share: number;
}

export interface LanguagesSection {
  versions: LanguageRow[];
  visitors: NamedRow[];
  note: string | null;
}

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface Opportunity {
  query: string;
  impressions: number;
  clicks: number;
  position: number;
  ctr: number;
  potentialClicks: number;
  reason: string;
  action: string;
}

export interface UpsellSignal {
  service: string;
  href: string;
  impressions: number;
  clicks: number;
  position: number;
  queries: QueryRow[];
  pitch: string;
  solution: string[];
  needed: string[];
  goal: string;
  prompt: string;
}

export interface DemandGap {
  impressions: number;
  clicks: number;
  position: number;
  topic: string;
  queries: QueryRow[];
}

export interface TrafficSection {
  sessions: MetricPair;
  users: MetricPair;
  newUsers: MetricPair;
  pageViews: MetricPair;
  engagementRate: MetricPair;
  averageSessionSeconds: MetricPair;
  channels: NamedRow[];
  devices: NamedRow[];
  topPages: PageRow[];
}

export interface SearchSection {
  clicks: MetricPair;
  impressions: MetricPair;
  ctr: MetricPair;
  position: MetricPair;
  topQueries: QueryRow[];
  topPages: PageRow[];
  brandedClicks: number;
  nonBrandedClicks: number;
  visibleImpressions: number;
  freshUntil: string | null;
}

export interface LeadsSection {
  total: MetricPair;
  byEvent: NamedRow[];
  tracked: boolean;
}

export type SourceStatus = "live" | "demo" | "error";

export interface SourceState {
  status: SourceStatus;
  message: string | null;
}

export interface SiteReport {
  period: PeriodRange;
  previousPeriod: PeriodRange;
  generatedAt: string;
  leads: LeadsSection;
  traffic: TrafficSection;
  languages: LanguagesSection;
  search: SearchSection;
  trend: TrendPoint[];
  demandGap: DemandGap | null;
  opportunities: Opportunity[];
  portfolioOpportunities: Opportunity[];
  invisible: Opportunity[];
  upsell: UpsellSignal[];
  headline: string;
  analyticsSource: SourceState;
  searchSource: SourceState;
}

export interface SupportEntry {
  date: string;
  hours: number;
  description: string;
  inPeriod: boolean;
}

export interface SupportSection {
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  usedThisPeriod: number;
  startedOn: string;
  entries: SupportEntry[];
}

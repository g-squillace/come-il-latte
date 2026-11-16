import { BRAND_TERMS } from './config.ts';
import { formatDecimal, formatNumber } from './format.ts';
import type { DemandGap, Opportunity, QueryRow, UpsellSignal } from './types.ts';

const CTR_BY_POSITION = [0.27, 0.15, 0.11, 0.08, 0.06, 0.05, 0.04, 0.033, 0.028, 0.025];

interface ServiceSignal {
  service: string;
  href: string;
  terms: string[];
  pitch: string;
  solution: string[];
  needed: string[];
  goal: string;
}

export const SERVICE_SIGNALS: ServiceSignal[] = [
  {
    service: 'Chi cerca una gelateria in zona',
    href: '/',
    terms: [
      'gelateria roma', 'gelaterie roma', 'gelateria a roma', 'migliore gelateria roma',
      'gelateria artigianale roma', 'dove mangiare il gelato a roma', 'gelato roma centro',
      'gelateria vicino', 'gelateria aperta',
    ],
    pitch:
      "È la ricerca di chi vuole un gelato adesso e non ha in mente un nome: il bacino più grande e il più contendibile. Oggi risponde una pagina sola, che racconta la gelateria a chi la conosce già invece di farsi trovare da chi la sta cercando.",
    solution: [
      'Una pagina dedicata al quartiere, che dica dove siete rispetto ai punti di riferimento che la gente cerca davvero: Repubblica, Termini, Castro Pretorio.',
      "Gli orari di apertura pubblicati in una forma che Google sappia leggere, così compaiono nel risultato di ricerca senza che nessuno debba aprire il sito.",
      "La scheda Google dell'attività curata e collegata al sito: su queste ricerche pesa quanto il sito, spesso di più.",
    ],
    needed: [
      'Gli orari veri, inclusi i giorni di chiusura e le variazioni stagionali.',
      'Una mezz\'ora per raccontarmi come vi descrivereste a un vicino di casa che non vi ha mai provati.',
    ],
    goal:
      'arrivare in prima pagina su queste ricerche. È il numero da riguardare fra tre mesi: se la posizione media non si muove, il contenuto non ha funzionato e si cambia strada.',
  },
  {
    service: 'Turisti che cercano in inglese',
    href: '/en',
    terms: [
      'best gelato rome', 'best ice cream rome', 'gelato near me rome', 'where to eat gelato rome',
      'artisanal gelato rome', 'best gelato in rome', 'gelateria rome',
    ],
    pitch:
      'Il sito è già tradotto in quattro lingue, segno che i turisti contano. Ma le pagine tradotte si posizionano solo se qualcuno le collega al modo in cui un turista cerca davvero: in inglese, vicino a un monumento, prima di partire.',
    solution: [
      'Rendere la versione inglese una pagina che risponde alla domanda del turista — quanto dista dalla stazione, cosa ordinare la prima volta — invece della traduzione parola per parola di quella italiana.',
      'Collegarla ai punti di riferimento che i turisti cercano per nome, perché è così che si scrive la ricerca.',
    ],
    needed: [
      'Sapere da quali paesi arrivano più clienti, se avete un\'idea anche approssimativa.',
    ],
    goal:
      'far salire i clic sulle versioni non italiane. Oggi sono una frazione del totale: il confronto si fa fra tre mesi sulle stesse ricerche.',
  },
  {
    service: 'Gelato per esigenze alimentari',
    href: '/',
    terms: [
      'gelato senza lattosio', 'gelato vegano', 'gelato senza glutine', 'gelato per celiaci',
      'gelato senza uova', 'gelato vegano roma', 'gelato senza lattosio roma',
    ],
    pitch:
      "Chi cerca così ha un vincolo, non una preferenza: sceglie il posto che glielo dice chiaramente e ci torna. Se in gelateria queste varianti ci sono ma il sito non le nomina, la ricerca la intercetta qualcun altro.",
    solution: [
      'Dire in pagina, in modo esplicito e cercabile, quali gusti rispondono a quale esigenza.',
      'Una sezione breve che spieghi come vengono preparati e tenuti separati: è la domanda che si fa chi ha un\'intolleranza seria.',
    ],
    needed: [
      'L\'elenco reale di cosa è senza lattosio, vegano o senza glutine, confermato da chi produce.',
      'Sapere se la separazione in laboratorio regge una dichiarazione pubblica: su questo non si improvvisa.',
    ],
    goal:
      'comparire su queste ricerche, dove oggi il sito non esiste. Si misura in impression: da zero a qualche decina al mese è già il segnale che funziona.',
  },
  {
    service: 'Torte gelato e occasioni',
    href: '/',
    terms: [
      'torta gelato', 'torta gelato roma', 'semifreddo roma', 'torta gelato compleanno',
      'torta gelato su ordinazione', 'semifreddo artigianale',
    ],
    pitch:
      'È la ricerca con il valore per scontrino più alto e con più intenzione: chi la fa sta già organizzando qualcosa e vuole sapere se può ordinare e con quanto preavviso.',
    solution: [
      'Una pagina che risponda alle tre domande che bloccano l\'ordine: quanto preavviso serve, quanto costa, come si ordina.',
      'Qualche fotografia di torte vere fatte da voi, non immagini di repertorio.',
    ],
    needed: [
      'I tempi di preavviso reali e le fasce di prezzo che siete disposti a pubblicare.',
      'Fotografie di torte già consegnate, anche scattate col telefono.',
    ],
    goal:
      'intercettare chi ordina per una festa. Il numero da guardare sono i clic su questo gruppo di ricerche, oggi quasi zero.',
  },
];

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GENERIC_TERMS = [
  'roma', 'rome', 'italia', 'italy', 'centro', 'vicino', 'aperta', 'aperto', 'online',
  'gelato', 'gelati', 'gelateria', 'gelaterie', 'ice', 'cream', 'artigianale',
  'artigianali', 'crema', 'creme', 'frutta', 'gusto', 'gusti', 'cono', 'coppetta',
  'coppa', 'vaschetta', 'granita', 'sorbetto', 'semifreddo', 'torta', 'torte',
  'yogurt', 'latte', 'panna', 'fresco', 'fresca', 'naturale', 'migliore', 'migliori',
  'best', 'buono', 'tipico', 'bar', 'pasticceria', 'laboratorio', 'bottega',
  'termini', 'repubblica', 'colosseo', 'vaticano', 'trastevere', 'pantheon',
];

function serviceVocabulary(): Set<string> {
  const words = new Set<string>();
  for (const signal of SERVICE_SIGNALS) {
    for (const term of signal.terms) {
      for (const word of normalise(term).split(' ')) {
        if (word.length > 2) words.add(word);
      }
    }
  }
  for (const term of GENERIC_TERMS) words.add(term);
  return words;
}

export function portfolioMatcher(titles: string[]): (query: string) => boolean {
  const vocabulary = serviceVocabulary();
  const phrases = new Set<string>();
  for (const title of titles) {
    const tokens = normalise(title)
      .split(' ')
      .filter((token) => token.length > 1);
    for (let index = 0; index + 1 < tokens.length; index += 1) {
      const left = tokens[index];
      const right = tokens[index + 1];
      if (vocabulary.has(left) && vocabulary.has(right)) continue;
      phrases.add(`${left} ${right}`);
    }
    for (const token of tokens) {
      if (token.length >= 5 && !vocabulary.has(token)) phrases.add(token);
    }
  }
  return (query: string) => {
    const haystack = normalise(query);
    for (const phrase of phrases) {
      if (haystack === phrase || haystack.includes(phrase)) return true;
    }
    return false;
  };
}

function expectedCtr(position: number): number {
  const index = Math.max(0, Math.round(position) - 1);
  if (index < CTR_BY_POSITION.length) return CTR_BY_POSITION[index];
  if (position <= 20) return 0.012;
  return 0.004;
}

export function isBranded(query: string): boolean {
  const normalised = normalise(query);
  return BRAND_TERMS.some((term) => normalised.includes(normalise(term)));
}

export function strikingDistance(
  queries: QueryRow[],
  accept: (query: string) => boolean = () => true,
): Opportunity[] {
  return queries
    .filter(
      (row) =>
        !isBranded(row.query) &&
        accept(row.query) &&
        row.position > 3.5 &&
        row.position <= 20 &&
        row.impressions >= 5,
    )
    .map((row) => {
      const target = Math.max(3, Math.floor(row.position) - 3);
      const potential = Math.max(0, row.impressions * (expectedCtr(target) - row.ctr));
      return {
        query: row.query,
        impressions: row.impressions,
        clicks: row.clicks,
        position: row.position,
        ctr: row.ctr,
        potentialClicks: potential,
        reason: `Sei in posizione ${row.position.toFixed(1)}: Google ti mostra già, ma quasi nessuno arriva così in basso.`,
        action:
          row.position <= 10
            ? 'Sei in prima pagina. Rinforza la pagina che si posiziona: titolo più vicino a questa ricerca, un paragrafo che risponda esattamente alla domanda.'
            : 'Sei in seconda pagina. Serve contenuto dedicato: una sezione o una pagina che tratti solo questo argomento.',
      };
    })
    .sort((left, right) => right.potentialClicks - left.potentialClicks)
    .slice(0, 12);
}

export function invisibleQueries(
  queries: QueryRow[],
  accept: (query: string) => boolean = () => true,
): Opportunity[] {
  return queries
    .filter((row) => !isBranded(row.query) && accept(row.query) && row.position > 20 && row.impressions >= 3)
    .map((row) => ({
      query: row.query,
      impressions: row.impressions,
      clicks: row.clicks,
      position: row.position,
      ctr: row.ctr,
      potentialClicks: row.impressions * expectedCtr(5),
      reason: `Google ti considera pertinente (posizione ${row.position.toFixed(0)}), ma nessuno ti vede.`,
      action: 'Qui non hai ancora contenuto vero. Se è un servizio che vuoi vendere, scrivici una pagina dedicata.',
    }))
    .sort((left, right) => right.impressions - left.impressions)
    .slice(0, 12);
}

export function zeroClickQueries(queries: QueryRow[]): QueryRow[] {
  return queries
    .filter((row) => row.clicks === 0 && row.impressions >= 20 && row.position <= 12)
    .sort((left, right) => right.impressions - left.impressions)
    .slice(0, 6);
}

function buildUpsellPrompt(service: string, periodLabel: string, matched: QueryRow[]): string {
  const lines = matched.map(
    (row) =>
      `- "${row.query}" — ${formatNumber(row.impressions)} viste, ${formatNumber(row.clicks)} clic, posizione media ${formatDecimal(row.position, 1)}`,
  );
  return [
    `Sul sito c'è domanda di ricerca su "${service}" che oggi non stiamo intercettando bene.`,
    '',
    `Dati reali del periodo ${periodLabel}, da Google Search Console:`,
    ...lines,
    '',
    'Cosa voglio da te, in quest\'ordine:',
    '1. Trova nel repository le pagine che oggi parlano di questo tema e dimmi cosa manca rispetto a quello che la gente sta cercando.',
    '2. Decidi se conviene rinforzare una pagina esistente o crearne una dedicata, e motiva la scelta.',
    '3. Proponi title, meta description e struttura dei contenuti usando le parole esatte delle ricerche qui sopra, senza forzarle.',
    '4. Elenca i link interni da aggiungere dalle pagine più visitate del sito.',
    '',
    'Fermati prima di scrivere codice: voglio approvare l\'impostazione.',
  ].join('\n');
}

export function upsellSignals(
  queries: QueryRow[],
  periodLabel: string,
  accept: (query: string) => boolean = () => true,
): UpsellSignal[] {
  const signals: UpsellSignal[] = [];
  for (const signal of SERVICE_SIGNALS) {
    const matched = queries.filter((row) => {
      if (!accept(row.query)) return false;
      const padded = ` ${row.query.toLowerCase()} `;
      return signal.terms.some((term) => padded.includes(term));
    });
    if (matched.length === 0) continue;
    const impressions = matched.reduce((sum, row) => sum + row.impressions, 0);
    const clicks = matched.reduce((sum, row) => sum + row.clicks, 0);
    if (impressions < 3) continue;
    const top = [...matched]
      .sort((left, right) => right.impressions - left.impressions)
      .slice(0, 5);
    const weighted = matched.reduce((sum, row) => sum + row.position * row.impressions, 0);
    signals.push({
      service: signal.service,
      href: signal.href,
      impressions,
      clicks,
      position: impressions > 0 ? weighted / impressions : 0,
      queries: top,
      pitch: signal.pitch,
      solution: signal.solution,
      needed: signal.needed,
      goal: signal.goal,
      prompt: buildUpsellPrompt(signal.service, periodLabel, top),
    });
  }
  return signals.sort((left, right) => right.impressions - left.impressions);
}

export function demandGap(
  queries: QueryRow[],
  accept: (query: string) => boolean,
  topic: string,
): DemandGap | null {
  const rows = queries.filter((row) => !isBranded(row.query) && accept(row.query));
  if (rows.length === 0) return null;
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  if (impressions === 0) return null;
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const weighted = rows.reduce((sum, row) => sum + row.position * row.impressions, 0);
  return {
    impressions,
    clicks,
    position: weighted / impressions,
    topic,
    queries: [...rows].sort((left, right) => right.impressions - left.impressions).slice(0, 6),
  };
}

export function buildHeadline(
  gap: DemandGap | null,
  leads: number,
  leadsTracked: boolean,
): string {
  if (gap !== null && gap.impressions >= 40) {
    const shown = formatNumber(gap.impressions);
    const entered =
      gap.clicks === 0
        ? 'Non è entrato nessuno.'
        : gap.clicks === 1
          ? 'È entrata una persona sola.'
          : `Sono entrate in ${formatNumber(gap.clicks)}.`;
    return `Google vi ha mostrato ${shown} volte a chi non vi conosceva ancora. ${entered} È qui che si gioca la partita, non nel numero delle visite.`;
  }
  if (leads > 0) {
    return `${formatNumber(leads)} ${leads === 1 ? 'persona ha' : 'persone hanno'} provato a contattarvi in questo periodo.`;
  }
  if (!leadsTracked) {
    return 'Troppo poco volume da Google per leggerci una direzione in questo periodo.';
  }
  return 'Nessun contatto in questo periodo, e nessuna ricerca abbastanza forte da indicare una direzione.';
}

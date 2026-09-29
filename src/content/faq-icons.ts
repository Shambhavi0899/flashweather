/**
 * The line icon an FAQ sets beside a question. A question can name its own
 * (`icon` on the entry); one that does not gets the icon of its subject,
 * read from its wording, so an FAQ needs no icon data to look the part.
 */
export type FaqIcon =
  | 'download'
  | 'layers'
  | 'bolt'
  | 'pin'
  | 'pin-plus'
  | 'code'
  | 'document'
  | 'thermometer'
  | 'phone'
  | 'calendar'
  | 'flag'
  | 'clock'
  | 'shield'
  | 'bell'
  | 'question';

/** First match wins, so the narrower subjects come first. */
const subjects: [RegExp, FaqIcon][] = [
  [/\bagent\b/, 'bolt'],
  [/\bapi\b|webhook|developer|integrat|endpoint|\bsdk\b|\btools?\b|work with/, 'code'],
  [/data go|privacy|secur|permission|without asking|by itself|consent|tenant/, 'shield'],
  [/wbgt|heat|temperature|thermom/, 'thermometer'],
  [/install|hardware|sensor|set ?up|deploy|maintain|calibrat|connection/, 'download'],
  [/horn|strobe|siren|alert|alarm|trigger|notif/, 'bell'],
  [/\bapp\b|mobile|phone|\bsms\b|free tier/, 'phone'],
  [/add (a |more )?sites?|second site|more locations/, 'pin-plus'],
  [/pilot|trial/, 'flag'],
  [/\bcontract\b|renew|annual/, 'calendar'],
  [/pric|cost|quote|procure|budget|policy|insur|claim|report|audit|liab|document|threshold/, 'document'],
  [/how (long|far|early|soon|often|fast|fresh)|minutes|lead time|refresh|all.clear|timer|return.to.play/, 'clock'],
  [/accura|99\.6|grid|resolution|model|parameter|product|forecast|predict|detect|radar|size class|dataset|comput|crop|command center/, 'layers'],
  [/lightning|strike|hail|storm/, 'bolt'],
  [/site|location|field|campus|course|venue|cover|radius|\bmap\b|metro|canada|mexico|countr/, 'pin'],
];

export function faqIconFor(question: string): FaqIcon {
  const q = question.toLowerCase();
  return subjects.find(([subject]) => subject.test(q))?.[1] ?? 'question';
}

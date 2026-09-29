/**
 * Blog posts, as data.
 *
 * One template at `app/resources/blog/[slug]/` renders every entry; the
 * route, metadata, Article schema and sitemap entry all derive from here.
 * Slugs are permanent.
 *
 * A post body is structured data -- sections of headings and blocks -- not
 * JSX, so the template owns the markup and a new post is an entry here.
 */

/** A run of text, optionally a link. Internal hrefs must be built routes. */
export type Inline = string | { text: string; href: string };
/** A paragraph as a list of runs, so links can sit inside running text. */
export type Rich = Inline[];

export type Image = {
  /** Path under /public. */
  src: string;
  /** From the SEO panel. */
  alt: string;
  width: number;
  height: number;
};

export type Block =
  | { type: 'paragraph'; text: Rich }
  | {
      type: 'stats';
      /** Accessible label for the strip as a whole. */
      label: string;
      items: { value: string; label: string; emphasis?: boolean }[];
    }
  | { type: 'figure'; image: Image; badge: string; overlay: string }
  | { type: 'quote'; text: string; cite: string }
  | {
      type: 'comparison';
      caption: string;
      /** Column headings, first is the row-label column (may be empty). */
      columns: string[];
      /** Index into `columns` of the column to emphasise. */
      emphasis: number;
      rows: { label: string; cells: string[] }[];
    }
  | { type: 'definitions'; items: { term: string; href?: string; text: string }[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'bullets'; items: string[] }
  | { type: 'links'; items: { label: string; href: string }[] };

export type Section = {
  /** The fragment id; permanent once linked. */
  id: string;
  /** The <h2>. Omitted for opening paragraphs that sit under the H1. */
  heading?: string;
  /** Shorter label for the table of contents, when it differs. */
  tocLabel?: string;
  blocks: Block[];
};

/**
 * A post. The designed article fills every field; a plain news post needs
 * only the core ones (slug, title, description, headline, published, author,
 * cover, sections). Optional fields that are absent are simply not rendered --
 * never fill one with an empty string or a guess.
 */
export type Post = {
  slug: string;
  /** The <title>, 40 characters or fewer (the layout appends the brand). */
  title: string;
  /** Meta description, 140–158 characters. */
  description: string;
  /** The <h1>. */
  headline: string;
  /** Shorter headline for cards and the OG image. */
  shortHeadline?: string;
  /** ISO dates. `modified` feeds dateModified and the sitemap. */
  published: string;
  modified?: string;
  author: string;
  authorRole?: string;
  /** Initials for the avatar disc. */
  authorInitials?: string;
  /** One line under the byline, verbatim from the design. */
  reviewNote?: string;
  authorBio?: string;
  category?: string;
  readingMinutes?: number;
  /** The card summary on the blog index. */
  summary?: string;
  cover: Image;
  /** Badge over the article cover. */
  coverBadge?: string;
  /** The standfirst, before the first section. */
  lead?: string;
  sections: Section[];
  faqs?: { question: string; answer: string }[];
  sources?: string[];
  /**
   * A post about people hurt or killed by lightning. No product promotion
   * around it: no related-products rail, no closing sales band.
   */
  noPromotion?: boolean;
  /** A small product image beside the author box. */
  authorFigure?: { image: Image; label: string };
};

export const posts: Post[] = [
  {
    slug: 'lightning-prediction-vs-detection',
    title: 'Lightning prediction vs detection',
    description:
      "Lightning detection logs strikes that already happened. How AI prediction gives up to 60 minutes of lead time, and how to check a vendor's accuracy claim.",
    headline:
      'Lightning prediction vs detection: why your weather app warns you too late (and what to use instead)',
    shortHeadline: 'Lightning prediction vs detection: why your weather app warns you too late',
    published: '2026-07-14',
    modified: '2026-09-21',
    author: 'Jason Deese',
    authorRole: 'Founder & Chief Meteorologist',
    authorInitials: 'JD',
    reviewNote: 'Reviewed by the Flash Meteorology Desk against the Accuracy Method page',
    authorBio:
      'Founder of Flash Weather AI in Canton, Georgia, built to replace the "strike already happened" alert with one you can still act on. Reviewed against the Flash Accuracy Method on 21 Sep 2026.',
    category: 'Lightning decisions',
    readingMinutes: 9,
    summary:
      'The alert on your phone was for a strike that already hit the ground. Detection reports the past; prediction gives you up to 60 minutes. What that changes for the person who has to clear the field.',
    cover: {
      src: '/images/blog/lightning-prediction-vs-detection-og.png',
      alt: 'Long-exposure lightning bolt over a dark rural horizon in navy and indigo with one warm gold streak — Flash Weather AI article cover for Lightning prediction vs detection',
      width: 1376,
      height: 768,
    },
    coverBadge: 'Up to 60 minutes ahead · 1 km cell · Refreshed every 2 minutes',
    lead: 'Most weather apps forward alerts from a lightning detection network. That network is excellent at one thing: telling you, within seconds, that a cloud-to-ground strike has just happened and where. The word that matters is "happened".',
    sections: [
      {
        id: 'already-happened',
        heading: 'The alert you got was for a strike that already happened',
        tocLabel: 'The alert was for a strike that already happened',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'The first strike of a storm cell is on the ground before the first alert leaves the server. If that strike is inside your radius, the notification is a report, not a warning — and the people on the field learned about it from the sky. Apps that "warn" from detection apply a distance rule to those reports: a strike inside the radius you chose triggers the push. That works when a storm approaches from a distance. It fails when the cell builds overhead.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              "That is the gap this article is about: the difference between being told a strike occurred and being told one is coming. The rest of it explains what the three technologies you will be sold actually measure, how much lead time each can give, and how to check a vendor's accuracy claim before you sign anything.",
            ],
          },
        ],
      },
      {
        id: 'detection-networks',
        heading: 'How detection networks work',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'A detection network — NLDN is the reference in the United States, and the ground truth we score against — listens for the electromagnetic signature of a discharge. Several stations time-stamp the same pulse; the differences in arrival time fix the location. The result is a precise map of where a storm has been, updated as each strike lands.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Because the network reports what has already discharged, its lead time for the first strike at your site is zero. Its real value is in the minutes after: it confirms the storm is active, shows where the cell is tracking, and — through the all-clear rule the NWS still teaches — starts the clock for the all-clear. A detection feed is a superb record. It is not a forecast.',
            ],
          },
        ],
      },
      {
        id: 'electrostatic-sensors',
        heading: 'Why electrostatic "prediction" sensors are a different thing',
        tocLabel: "Why electrostatic 'prediction' sensors are different",
        blocks: [
          {
            type: 'paragraph',
            text: [
              'An electric-field mill — the sensor some vendors sell as "prediction" — measures the atmospheric electric field at the point where it is mounted. A rising field means charge is building nearby, and the unit sounds when the field crosses a threshold. It is a real physical measurement, and it can fire before the first strike.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Its limits are physical too. It sees one point. It needs a mast, power, calibration and a clear site. The field can rise without a strike following, which is where its false alarms come from. And it has to be bought, installed and maintained at every site you want covered — for a district with many schools, that is a mast, a calibration schedule and a replacement plan at every one of them.',
            ],
          },
        ],
      },
      {
        id: 'ai-prediction',
        heading: 'What AI prediction does',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Flash starts from the other end. The prediction engine ingests over 100 atmospheric parameters — radar, satellite, surface observations, model fields — and distils them into 15+ proprietary prediction products for every 1 × 1 km cell across the continental U.S., Canada and Mexico. The model re-runs every 2 minutes and outputs, per cell, the likelihood of a strike over the next 60 minutes, with a 6-hour planning outlook alongside. No mast, no site visit: your site is a pin on the map with a radius and a policy.',
            ],
          },
          {
            type: 'stats',
            label:
              'Flow from over 100 atmospheric parameters to 15+ proprietary prediction products per 1 km cell to a 60-minute lightning prediction, refreshed every 2 minutes',
            items: [
              { value: '100+', label: 'atmospheric parameters in' },
              { value: '15+', label: 'proprietary prediction products' },
              { value: '1 km', label: 'grid cell, refreshed every 2 min' },
              { value: '60 min', label: 'strike-level prediction horizon', emphasis: true },
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Measured against NLDN ground-truth strikes, the one-hour prediction window scores 99.6%. The supporting metrics — first-strike detection, false-alarm ratio, all-clear precision and median lead time — are published on the ',
              { text: 'accuracy method page', href: '/why-flash/accuracy-method/' },
              ' with the arithmetic behind each one.',
            ],
          },
          {
            type: 'figure',
            image: {
              src: '/images/blog/flash-storm-shelf-cloud-before-first-strike.png',
              alt: 'A storm shelf cloud rolling over an empty field at dusk before any lightning has struck, the window a prediction fills and a detection network cannot',
              width: 1376,
              height: 768,
            },
            badge: 'The hour before',
            overlay: 'A detection network has nothing to report here yet. A prediction does.',
          },
          {
            type: 'quote',
            text: '"Detection tells you where lightning has been. Prediction tells you where it is about to be. Only one of those is a decision you can still make."',
            cite: 'Jason Deese, Founder & Chief Meteorologist',
          },
        ],
      },
      {
        id: 'comparison',
        heading: 'Detection vs sensor vs prediction',
        blocks: [
          {
            type: 'comparison',
            caption: 'Detection network, electrostatic sensor and AI prediction compared',
            columns: ['', 'Detection network', 'Electrostatic sensor', 'AI prediction (Flash)'],
            emphasis: 3,
            rows: [
              {
                label: 'Lead time',
                cells: [
                  'None for the first strike; confirms strikes after the fact',
                  'Minutes, at the mounted point, once the field rises',
                  'Up to 60 minutes per 1 × 1 km cell, refreshed every 2 minutes',
                ],
              },
              {
                label: 'What it measures',
                cells: [
                  'The radio pulse of a discharge that has occurred',
                  'The local electric field at one point',
                  'Over 100 parameters distilled into 15+ prediction products per cell',
                ],
              },
              {
                label: 'False alarms',
                cells: [
                  'Rare for strike reports; the "warning" is only a radius rule',
                  'The field can rise without a strike; site-dependent',
                  'False-alarm ratio published on the method page, with the arithmetic',
                ],
              },
              {
                label: 'Install',
                cells: [
                  'None on site; an app or a feed',
                  'Mast, power, calibration — one per site',
                  'None; software only, sites live in days',
                ],
              },
            ],
          },
          {
            type: 'links',
            items: [{ label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' }],
          },
        ],
      },
      {
        id: 'customers',
        heading: 'What Troon, the Big 12, Syngenta and the NAIA do with the extra minutes',
        tocLabel: 'What Troon, the Big 12, Syngenta and the NAIA do with the minutes',
        blocks: [
          {
            type: 'definitions',
            items: [
              {
                term: 'Troon',
                href: '/case-studies/troon/',
                text: "Lightning alerts across Troon's golf properties. The extra minutes are the difference between a horn that clears the back nine in time and a horn that follows the strike.",
              },
              {
                term: 'Big 12',
                text: 'Game-day lightning decisions for conference venues: when to hold the kick-off, when to move fans under cover, and when the all-clear clock has genuinely run out.',
              },
              {
                term: 'Syngenta',
                text: "Turf agronomy forecasts inside Turf Assistant: the same model feeds spray windows and frost planning, so the superintendent's weather call and the agronomist's are the same call.",
              },
              {
                term: 'NAIA',
                text: 'Official weather-safety partner for championships: one alert policy across host sites that have never had a sensor on a mast.',
              },
            ],
          },
        ],
      },
      {
        id: 'vendor-accuracy',
        heading: "How to check a vendor's accuracy claim",
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Every vendor will show you a percentage. Before you accept it, ask the four questions we answer for our own numbers on the ',
              { text: 'accuracy method page', href: '/why-flash/accuracy-method/' },
              '.',
            ],
          },
          {
            type: 'numbered',
            items: [
              'What is the window? A 60-minute prediction is a different claim from a claim with no stated horizon at all.',
              "What is the ground truth? We score against NLDN strikes. A claim scored against the vendor's own alerts is circular.",
              'What is the period? Ours is stated on the accuracy method page and restated each time the window moves.',
              'What are the misses? Ask for first-strike detection and false-alarm ratio, not just the headline percentage.',
            ],
          },
          {
            type: 'links',
            items: [
              { label: 'Read the accuracy method', href: '/why-flash/accuracy-method/' },
              { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is a weather app's lightning alert enough for a school field?",
        answer:
          'Only if you accept zero lead time on the first strike. The app forwards a detection report and applies a radius; the first strike inside that radius is what triggers it.',
      },
      {
        question: 'Do I still need the all-clear timer if I use prediction?',
        answer:
          'Yes. The all-clear clock after the last strike is a return-to-play rule, not a detection rule. Prediction moves the first decision earlier; it does not shorten the all-clear.',
      },
      {
        question: 'Does prediction replace the detection network?',
        answer:
          'No — it uses it. NLDN strikes are the ground truth every prediction is scored against, and confirmed strikes still drive the all-clear timer.',
      },
      {
        question: 'How far ahead is "up to 60 minutes" in practice?',
        answer:
          'It depends on the storm: the model refreshes every 2 minutes, so the number for your cell updates as the cell develops. The median lead time is published on the accuracy method page.',
      },
    ],
    sources: [
      'NLDN — National Lightning Detection Network, ground-truth strike data',
      'NWS — lightning safety guidance and the all-clear rule',
      'Flash Accuracy Method — one-hour window, NLDN ground truth, stated period',
    ],
    authorFigure: {
      image: {
        src: '/images/blog/flash-lightning-suite-prediction-render.png',
        alt: 'The Flash Lightning Suite screen showing predicted strike cells and first-strike timing, the product this article describes',
        width: 1920,
        height: 1080,
      },
      label: 'Lightning Suite',
    },
  },

  // ── Posts carried over from the live WordPress site. Body text verbatim;
  // root URLs 301 here (next.config.ts). Authors publish no role or bio.

  {
    slug: 'blog-violent-week-midwest-storms-ohio-lightning',
    title: 'Midwest storm deaths, an Ohio near miss',
    description:
      'Three died in Midwest storms on August 11, days after lightning struck a man under a tree on a Cincinnati golf course. What the NWS safety guidance says.',
    headline: 'A Violent Week of Weather: Three Dead in the Midwest, a Near Miss in Ohio',
    shortHeadline: 'A Violent Week of Weather: Three Dead in the Midwest, a Near Miss in Ohio',
    published: '2026-08-12',
    modified: '2026-08-12',
    author: 'Dave Downey',
    authorInitials: 'DD',
    category: 'Lightning Strikes',
    readingMinutes: 4,
    summary:
      'From shelf clouds in Chicago to widespread severe storm damage and lightning strikes in Ohio, August is off to a fast start.',
    cover: {
      src: '/images/blog/posts/midwest-storm-downed-tree-on-house.jpg',
      alt: 'A large tree brought down by a severe storm lying across the roof and garage of a house, its branches covering the driveway',
      width: 2560,
      height: 1920,
    },
    lead: 'Severe weather swept across the Midwest on Tuesday, August 11. Three people were killed. Storms brought hurricane force wind gusts, widespread power outages, and flooding, leaving utility crews and emergency officials working through the damage for days.',
    sections: [
      {
        id: 'three-dead-in-the-midwest',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Details are still coming in as of this writing, and we are not going to speculate ahead of the reporting. What is known: three confirmed deaths, wind gusts topping 100 mph, more than a million customers at one point without power, and flooding left behind across the region.',
            ],
          },
        ],
      },
      {
        id: 'days-earlier-in-ohio',
        heading: 'Days earlier, in Ohio',
        blocks: [
          { type: 'paragraph', text: ['Just a few days before, a previous bout of storms produced a story with a very different ending.'] },
          {
            type: 'paragraph',
            text: [
              'On a golf course in Cincinnati, a man was filming his friends as they tried to free a golf cart stuck on a wet incline. It was raining. A thunderstorm was overhead. He was standing under a tree, next to a golf bag with an umbrella in it, laughing at the cart rolling backwards.',
            ],
          },
          { type: 'paragraph', text: ['The video ends with a bang and a flash.'] },
          {
            type: 'paragraph',
            text: [
              'He was struck on the arm. His injuries were not life threatening and he is recovering. He later told meteorologist Matt Devitt that he was “unbelievably lucky,” which is an accurate description of what happened to him. OutKick reported the incident on August 10.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Devitt’s response to the video was the standard guidance, and it is worth repeating: when thunder roars, go indoors.',
            ],
          },
        ],
      },
      {
        id: 'what-the-safety-guidance-says',
        heading: 'What the Safety Guidance Actually Says',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Both events are ordinary in the sense that matters most. Neither involved an exotic storm or a failure of the forecast. They involved common summer weather meeting people who were outdoors.',
            ],
          },
          {
            type: 'paragraph',
            text: ['The core guidance from the National Weather Service has not changed and does not need to:'],
          },
          {
            type: 'bullets',
            items: [
              'There is no safe place outdoors during a thunderstorm. Not under a tree, not in a dugout, not in a shelter that is open on any side.',
              'A tree is about the worst option possible. Lightning that strikes a tree can travel through the ground and through the trunk to anyone nearby.',
              'A fully enclosed building or a hardtop vehicle with the windows up is the goal. Get to one and stay there.',
              'Metal objects held or carried, including umbrellas and golf clubs, do not attract lightning, but they offer no protection and can make a bad position worse.',
              'When thunder roars, go indoors, and stay there until well after the storm has passed.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'If you are outside, that list is the whole job. The Cincinnati golfer broke most of it and survived anyway. That is luck, not a lesson in what is survivable.',
            ],
          },
        ],
      },
      {
        id: 'where-prediction-fits',
        heading: 'Where Prediction Fits',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Flash Weather AI builds predictive lightning technology, so we will be direct about the limits of what that does and does not address. The Midwest fatalities involved wind, flooding, and the damage that follows them, and nothing about lightning prediction speaks to those outcomes. What it does address is the window before a storm arrives: FirstStrike™ forecasts when and where lightning will occur up to an hour before the first strike, with 99.6% verified 1-hour accuracy at 1 kilometer resolution, refreshed every 2 minutes. For an operator responsible for a course, a field, or a job site, that is time to move people while the walk back is still easy, rather than after the first bolt has already landed. It is one piece of a safety plan, not a substitute for one, and it does not do anything on its own. Someone still has to make the call.',
            ],
          },
        ],
      },
      {
        id: 'the-week-in-perspective',
        heading: 'The Week in Perspective',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Severe weather season is not over, especially with the building super El Nino. The fall severe weather season (and even dragging into winter) will be active, and the storms that kill people are usually not the ones that make national news for a week. They are the ordinary ones that catch someone outside.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'If you run a business where people are outdoors, this is a great week to reread your severe weather plan and ask one question, plus a follow up about it: what event triggers the first action, and how much time does that leave everyone? If the answer is thunder, or a strike inside a radius, your plan begins at the last available moment.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Our thoughts are with the families of the three people killed in the Midwest this week, and with the communities still without power and dealing with flood damage.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'remembering-kenya-and-kennedi-glasgow',
    noPromotion: true,
    title: 'Remembering Kenya and Kennedi Glasgow',
    description:
      'Kenya Glasgow, 31, and her daughter Kennedi, 2, were killed by lightning in Margate, Florida, on August 23. Remembering them, and how to support their family.',
    headline: 'Remembering Kenya and Kennedi Glasgow',
    shortHeadline: 'Remembering Kenya and Kennedi Glasgow',
    published: '2026-08-27',
    modified: '2026-08-27',
    author: 'Madison Deese',
    authorInitials: 'MD',
    category: 'Lightning Strikes',
    readingMinutes: 3,
    summary:
      'Lightning took two innocent lives in Florida, turning an ordinary day into a tragedy. Learn how to donate to the Glasgow family here.',
    cover: {
      src: '/images/blog/posts/remembering-kenya-and-kennedi-glasgow-lightning.png',
      alt: 'Black-and-white photograph of lightning bolts striking the sea beneath heavy storm clouds at night',
      width: 1280,
      height: 720,
    },
    lead: 'On Sunday afternoon, August 23, a family arrived at a relative’s house in Margate, Florida for dinner. The weather turned while they were getting out of the car. They ran for the front door.',
    sections: [
      {
        id: 'august-23',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Kenya Glasgow, 31, and her two-year-old daughter Kennedi did not make it inside. They were struck by lightning on the sidewalk, on the 7900 block of Northwest 1st Street, at around 2:30 in the afternoon. Margate Police and fire rescue crews found them and began CPR. Both died shortly after arriving at the hospital.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Kameron Glasgow, Kenya’s husband and Kennedi’s father, was standing a few feet away. He was close enough to feel the electricity travel through his legs. He turned around and saw them.',
            ],
          },
          { type: 'paragraph', text: ['Kennedi’s twin sister, Kensli, was still in the car.'] },
          { type: 'paragraph', text: ['Kameron and Kenya would have celebrated their fourth wedding anniversary in November.'] },
        ],
      },
      {
        id: 'the-family',
        heading: 'The Family',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'In a post shared the next day, Kameron wrote that he had lost his best friend, and that his surviving daughter had lost hers. He asked people who had known his wife and daughter to hold onto what they brought into their lives. He ended with a line that has stayed with us: it doesn’t take much to be kind.',
            ],
          },
          { type: 'paragraph', text: ['Kameron described Kennedi as having the biggest heart in the world.'] },
          {
            type: 'paragraph',
            text: [
              'He also said something about Kensli that is difficult to read. A two-year-old cannot understand that her twin is gone. He knows he has to be okay, because she is still here.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'We are quoting him only briefly and only because he chose to share it publicly. The rest belongs to his family.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'If you’d like to support Kameron and Kensli, you can find the family’s GoFundMe ',
              { text: 'here', href: 'https://www.gofundme.com/f/love-support-for-kensli-jade' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'what-the-sky-was-doing',
        heading: 'What the Sky was Doing',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Neighbors claimed they had seen thunder and lightning that afternoon and assumed it was an ordinary summer South Florida storm, until a strike hit close enough to shake their houses.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'The National Weather Service reported five cloud-to-ground strikes within a single mile of where the Glasgows were hit.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'The odds of any one person being struck in Florida are around one in 500,000. Kenya and Kennedi are the third and fourth lightning deaths in Florida this year.',
            ],
          },
        ],
      },
      {
        id: 'why-we-do-what-we-do',
        heading: 'Why we do what we do',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'Lightning kills people who are doing completely ordinary things. Walking to the front door, loading a trunk, standing in a yard, it is the most common severe weather threat in the country and the one people take least seriously, right up until it takes someone from them. Every few weeks, another family finds that out.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Everyone here chose to spend their career on this. Most of us can name the moment that put us in this field: a close call, a warning that came too late, years spent in forecasting watching these same headlines come around every summer. Our founder spent twenty years at the National Weather Service before starting this company. Nobody ends up doing this work by accident.',
            ],
          },
          {
            type: 'paragraph',
            text: ['This is why we do what we do. For the seconds. For the chance that somebody, somewhere, gets enough of them.'],
          },
          {
            type: 'paragraph',
            text: ['Our hearts are with Kameron, with Kensli, and with everyone who loved Kenya and Kennedi Glasgow.'],
          },
        ],
      },
    ],
  },
  {
    slug: 'michigan-man-tragically-dies-after-lightning-strike-in-osceola-county',
    noPromotion: true,
    title: 'Lightning strike death in Osceola County',
    description:
      'Matthew Eric Jenkins, 20, of Shelby Township, Michigan, was killed by lightning in Celebration, Florida. Remembering him and the strangers who tried to help.',
    headline: 'Michigan Man Tragically Dies After Lightning Strike in Osceola County',
    shortHeadline: 'Michigan Man Tragically Dies After Lightning Strike in Osceola County',
    published: '2026-09-10',
    modified: '2026-09-10',
    author: 'Madison Deese',
    authorInitials: 'MD',
    /** The live post is filed under "Uncategorized"; its two siblings use "Lightning Strikes". */
    category: 'Lightning Strikes',
    readingMinutes: 2,
    summary:
      'A tribute to Matthew Jenkins, a 20-year-old Disney College Program participant who tragically lost his life to a Florida lightning strike, and a reflection on weather safety.',
    cover: {
      src: '/images/blog/posts/matthew-eric-jenkins-osceola-county.jpg',
      alt: 'Matthew Eric Jenkins smiling in sunglasses under a tree, holding an “I’m Celebrating my Disney Program” button',
      width: 720,
      height: 340,
    },
    lead: 'Matthew Eric Jenkins was 20 years old and had been living in Central Florida for about a week. Originally from Shelby Township, Michigan, he had moved south to begin the Disney College Program to start an exciting new chapter in his life.',
    sections: [
      {
        id: 'celebration-florida',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'On a Tuesday evening, a typical summer storm moved over Celebration. Matthew was walking along a path behind a hotel on Bloom Street when lightning struck nearby. Though people nearby had stepped off the path to seek shelter from the rain, they quickly realized someone had fallen.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Deputies with the Osceola County Sheriff’s Office responded to the scene at approximately 6:25 p.m., around the same time a severe strike was recorded in the immediate area. Matthew was transported to AdventHealth Celebration, where he was pronounced dead.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'In the moments immediately following the strike, strangers did everything they could. Felipe Costa, who was nearby, ran to help the moment he realized what had happened. A woman joined him to administer CPR, and others stayed by their side in the rain until emergency responders arrived. Matthew’s father later shared his family’s deep gratitude for everyone who tried to save his son. Afterward, Costa returned to the path to leave a flower near the spot.',
            ],
          },
        ],
      },
      {
        id: 'what-we-aim-to-prevent',
        heading: 'What We Aim to Prevent',
        blocks: [
          {
            type: 'paragraph',
            text: [
              'In Central Florida, summer thunderstorms are a near-daily routine. They build, pass, and are usually waited out under an awning or in a car. Yet lightning doesn’t arrive with days of warning or a forecasted path. It arrives inside an ordinary evening rain shower.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Lightning often strikes people who are doing nothing wrong. It’s usually people who are simply walking a path, crossing a parking lot, or waiting out a brief shower. It remains one of the severe weather threats taken least seriously, yet it repeatedly leaves families grieving.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Moments like this reflect the heart of our work. No forecast can undo a tragedy, but the work that matters most is what happens beforehand, quietly, and in time for someone to reach safety. We share this story because we hope for a day when these tragic loss-of-life events no longer occur.',
            ],
          },
          {
            type: 'paragraph',
            text: [
              'Our thoughts are with Matthew’s family in Shelby Township, his friends, and every stranger who stopped to help him.',
            ],
          },
        ],
      },
    ],
  },

];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * "14 Jul 2026", the design's date format. Built by hand rather than with
 * toLocaleDateString, whose en-GB output ("Sept") varies with the ICU build.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/**
 * The blog index hubs.
 *
 * The design lays out five topic hubs of three cards each. Only a card whose
 * `slug` is a post in `posts` renders as a link; the rest are shown as
 * forthcoming titles without a link, so the index never points at a URL that
 * does not exist. Give a card a `slug` when its article is written.
 */
export type HubCard = {
  /** Set only when the article exists in `posts`. */
  slug?: string;
  title: string;
  summary: string;
  byline: string;
  badge: string;
  overlay: string;
  image: Image;
};

export type Hub = {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards: HubCard[];
};

const thumb = (src: string, alt: string, width = 1376, height = 768): Image => ({ src, alt, width, height });

export const hubs: Hub[] = [
  {
    id: 'lightning-decisions',
    eyebrow: 'Lightning decisions',
    heading: 'When do I clear the field?',
    intro: 'Lead time, radius, the all-clear — and who makes the call.',
    cards: [
      {
        title: 'The all-clear rule, and what a 60-minute forecast changes',
        summary:
          'Why the timer starts at the last strike, not the last rumble — and how prediction moves the first decision earlier.',
        byline: 'Jason Deese · 18 Sep 2026 · 7 min read',
        badge: 'All-clear',
        overlay: 'The timer starts at the last strike',
        image: thumb(
          '/images/blog/flash-lightning-open-ground-all-clear-rule.png',
          'Cloud-to-ground lightning over open ground at dusk, the strike that starts the all-clear timer',
        ),
      },
      {
        title: 'What a 1 km grid cell actually means for a large site',
        summary:
          'A course, a campus or a yard spans several cells. How alerts are scored across them, and which cell wakes the horn.',
        byline: 'Flash Meteorology Desk · 9 Sep 2026 · 6 min read',
        badge: '1×1 km grid',
        overlay: 'A course spans several cells',
        image: thumb(
          '/images/blog/flash-golf-course-rain-1km-grid-cells.webp',
          'A rain-swept golf fairway, a site that spans several 1×1 km forecast cells',
          1920,
          1080,
        ),
      },
      {
        title: 'Radius vs cell: choosing a lightning policy your trainers will actually follow',
        summary: 'A wide radius, a tight radius, or the cell next door — the trade-offs in false alarms and lost minutes.',
        byline: 'Jason Deese · 26 Aug 2026 · 8 min read',
        badge: 'Policy',
        overlay: 'A rule trainers will actually follow',
        image: thumb(
          '/images/blog/flash-school-athletic-field-lightning-policy.png',
          'A school athletic field at dusk, where a radius or cell policy decides when trainers clear play',
        ),
      },
    ],
  },
  {
    id: 'heat-and-wbgt',
    eyebrow: 'Heat & WBGT planning',
    heading: 'How do I plan a heat day?',
    intro: 'Turning a WBGT outlook into a practice schedule that survives the afternoon.',
    cards: [
      {
        title: 'WBGT forecast vs on-site reading: which one makes the call?',
        summary: 'The reading decides compliance. The forecast decides whether you still have a practice to run.',
        byline: 'Jason Deese · 15 Sep 2026 · 6 min read',
        badge: 'WBGT',
        overlay: 'Forecast plans, reading records',
        image: thumb(
          '/images/blog/flash-wbgt-heat-haze-forecast-vs-reading.png',
          'Heat haze over an open field, the conditions a WBGT forecast and an on-site reading each describe',
        ),
      },
      {
        title: 'Georgia, Florida, Texas: five state heat policies in one table',
        summary: "Same instrument, different bands. What travels between states and what doesn't.",
        byline: 'Flash Meteorology Desk · 2 Sep 2026 · 5 min read',
        badge: 'State by state',
        overlay: 'Same instrument, different bands',
        image: thumb(
          '/images/blog/flash-running-track-heat-state-policies.png',
          "An empty sun-scorched running track and bleachers under a pale hot sky, where each state's WBGT bands apply",
        ),
      },
      {
        title: 'Why 87.0 arrives earlier on the practice field than the town forecast says',
        summary: 'Surface, shade and wind: three reasons the globe thermometer reads hotter than the airport.',
        byline: 'Flash Meteorology Desk · 20 Aug 2026 · 5 min read',
        badge: 'Surface and shade',
        overlay: 'The turf runs hotter than the town',
        image: thumb(
          '/images/blog/flash-turf-surface-heat-practice-field.png',
          'Close turf under hard midday sun, the surface that pushes WBGT higher than the town reading',
        ),
      },
    ],
  },
  {
    id: 'hail-and-property',
    eyebrow: 'Hail & property',
    heading: 'Is hail about to hit my roofs, lots or crops?',
    intro: 'Up to 55 minutes of warning, and what each industry does with it.',
    cards: [
      {
        title: 'How we validated Predictive Hail: four years of CONUS storm data',
        summary: 'Size classes, lead time and misses, scored against ground reports from 2021 through 2024.',
        byline: 'Jason Deese · 28 Jul 2026 · 9 min read',
        badge: 'Method',
        overlay: 'Four years of CONUS storm data',
        image: thumb(
          '/images/blog/flash-supercell-hail-core-conus-validation.png',
          'A supercell storm anvil with a green-tinged hail core over open plains, the storms Predictive Hail was validated against',
        ),
      },
      {
        title: 'A dealership hail playbook: what to move first when the alert says damaging-class hail',
        summary:
          'Up to 55 minutes of warning. The order of operations for the lot, the service bay and the delivery truck.',
        byline: 'Flash Meteorology Desk · 12 Aug 2026 · 6 min read',
        badge: 'Playbook',
        overlay: 'What moves under cover first',
        image: thumb(
          '/images/blog/flash-vehicle-lot-hail-sky-dealership-playbook.png',
          'Rows of parked vehicles under a bruised hail sky, the inventory a dealership moves under cover first',
        ),
      },
      {
        title: 'What the hail size classes mean for a roofing estimate',
        summary: 'Severe, damaging, destructive — and what adjusters look for after each.',
        byline: 'Flash Meteorology Desk · 30 Jun 2026 · 5 min read',
        badge: 'Roofing',
        overlay: 'Size class, and what adjusters look for',
        image: thumb(
          '/images/blog/flash-roof-hail-damage-size-class-estimate.png',
          'A residential roof under a hail-bearing sky, the surface a size class turns into an estimate',
        ),
      },
    ],
  },
  {
    id: 'accuracy-and-methods',
    eyebrow: 'Accuracy & methods',
    heading: "How do I check a vendor's accuracy claim?",
    intro:
      'Every number we publish comes with its window, its ground truth and its period. Ask the same of everyone.',
    cards: [
      {
        title: 'How we score 99.6%: window, ground truth, period',
        summary: 'A one-hour window, NLDN strikes as truth, a stated period. Here is the arithmetic.',
        byline: 'Jason Deese · 5 Sep 2026 · 8 min read',
        badge: 'Scoring',
        overlay: 'Window, ground truth, period',
        image: thumb(
          '/images/blog/flash-prediction-network-accuracy-scoring.png',
          'An abstract network of glowing nodes over dark terrain, the grid on which 99.6% lightning prediction accuracy is scored',
        ),
      },
      {
        title: 'False-alarm ratio, first-strike detection, all-clear precision: one method',
        summary: "What each metric measures, what it can't, and why the window matters more than the headline.",
        byline: 'Flash Meteorology Desk · 21 Aug 2026 · 7 min read',
        badge: 'Metrics',
        overlay: "What each number can and can't say",
        image: thumb(
          '/images/blog/flash-control-room-screens-forecast-metrics.png',
          'A darkened operations control room with glowing screens, where false-alarm ratio and all-clear precision are read',
        ),
      },
      {
        title: 'Prediction vs sensors vs detection: a plain-language field guide',
        summary: 'Three technologies, three different questions answered. Which one your policy actually needs.',
        byline: 'Jason Deese · 10 Jul 2026 · 6 min read',
        badge: 'Field guide',
        overlay: 'Prediction, sensors, detection',
        image: thumb(
          '/images/blog/flash-command-center-prediction-vs-detection.png',
          'The Weather Command Center map showing predicted cells beside what detection reports after the fact',
          1600,
          900,
        ),
      },
    ],
  },
  {
    id: 'agentic-weather',
    eyebrow: 'Agentic weather',
    heading: 'What can I ask Flash?',
    intro:
      'Plain-language questions, answers or actions in the tools you already run — and where the guardrails sit.',
    cards: [
      {
        title: 'The questions superintendents ask Flash on a storm day',
        summary:
          'From "which site sees lightning first?" to "who was warned?" — the questions, the answers and the tools each one landed in.',
        byline: 'Flash Meteorology Desk · 19 Sep 2026 · 8 min read',
        badge: 'Storm day',
        overlay: "Ask it the way you'd ask a colleague",
        image: thumb(
          '/images/blog/flash-mobile-app-storm-day-questions.png',
          'The Flash mobile app showing a storm-day forecast, the screen a superintendent asks questions from',
          1920,
          1080,
        ),
      },
      {
        title: 'How the agent decides when to act — and when to ask you',
        summary:
          'Permissions per connector, a log for every action, and a person confirming before any schedule or record changes.',
        byline: 'Jason Deese · 12 Sep 2026 · 7 min read',
        badge: 'Permissions',
        overlay: 'When it acts, and when it asks',
        image: thumb(
          '/images/blog/flash-surfaces-agent-permissions-log.png',
          'Flash on a laptop and a phone, the surfaces where Flash Agent asks for permission before it acts',
          898,
          501,
        ),
      },
      {
        title: 'Connecting Flash to Procore and Google Calendar in an afternoon',
        summary:
          'Two connectors, one afternoon: what to authorise, what gets written where, and how to read the audit file afterwards.',
        byline: 'Flash Meteorology Desk · 4 Sep 2026 · 6 min read',
        badge: 'Connectors',
        overlay: 'Into the tools the yard already runs',
        image: thumb(
          '/images/blog/flash-construction-site-agent-connectors.png',
          'A construction site under a darkening sky, the yard whose calendar and project tools Flash Agent connects to',
        ),
      },
    ],
  },
];

/** The evergreen pages the index sends every buyer to first. */
export const startHere = [
  {
    number: '01',
    title: 'Accuracy method',
    body: 'How we score 99.6%: a one-hour window, NLDN ground-truth strikes and a stated period — plus first-strike detection, false-alarm ratio, all-clear precision and median lead time.',
    cta: 'Read the method',
    href: '/why-flash/accuracy-method/',
  },
  {
    number: '02',
    title: 'Prediction vs sensors vs detection',
    body: 'Three technologies that answer three different questions. Which one your lightning policy actually needs, in plain language.',
    cta: 'Read the explainer',
    href: '/why-flash/prediction-vs-sensors-vs-detection/',
  },
  {
    number: '03',
    title: 'Everyone else vs Flash',
    body: 'A dated, sourced comparison: what detection-based tools measure, how each is priced, and what "real-time" means once the strike has already happened.',
    cta: 'Read the comparison',
    href: '/why-flash/everyone-else-vs-flash/',
  },
];

/** Products an article's side rail points to. */
export const relatedProducts = [
  {
    name: 'Flash Lightning Prediction',
    body: 'Strike-level prediction up to 60 minutes ahead on a 1 × 1 km cell, refreshed every 2 minutes.',
    href: '/products/lightning-prediction/',
  },
  {
    name: 'Flash Weather Command Center',
    body: 'Every site on one map, horn and strobe relays, and the alert log your safety officer signs off.',
    href: '/products/weather-command-center/',
  },
];

/** Writes the demo content as an NDJSON file for `sanity dataset import`.
 *
 *  Every restaurant here is invented — it exists so the site looks alive and so
 *  there are worked examples to learn from in the Studio. Delete these documents
 *  as real reviews replace them.
 *
 *  Usage, from the studio folder:
 *    node scripts/seed-sample-content.mjs > seed.ndjson
 *    npx sanity dataset import seed.ndjson production
 */

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

/** One paragraph / heading / quote of rich text. */
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

const body = (parts) => parts.map(([style, text]) => block(text, style));

const salads = [
  {
    slug: 'bistro-rosemary',
    restaurant: 'ביסטרו רוזמרין',
    city: 'תל אביב',
    address: 'שדרות רוטשילד 42',
    location: { lat: 32.0645, lng: 34.7748 },
    score: 9,
    subScores: { dressing: 10, lettuce: 9, croutons: 8, parmesan: 9, protein: 8, value: 7 },
    price: 74,
    visitedAt: '2026-06-14',
    verdict: 'הרוטב הכי מדויק שפגשתי השנה. אנשובי אמיתי, בלי התנצלויות.',
    tags: ['אנשובי', 'קרוטונים ביתיים', 'ארוחת צהריים'],
    wouldReturn: true,
    featured: true,
    body: [
      ['normal', 'יש רגע שבו את טועמת רוטב קיסר ומבינה שמישהו במטבח באמת אוהב את מה שהוא עושה. זה היה הרגע הזה. חמיצות מדודה, שום שנוכח אבל לא צועק, ואנשובי שמרגישים בו — לא כרמז, כעובדה.'],
      ['normal', 'החסה קרה ופריכה, חתוכה בגודל שאפשר לאכול בלי סכין. הקרוטונים ביתיים, קצת שמן זית מדי לטעמי, אבל אני סולחת. הפרמזן מגורד גס, וזו תמיד הבחירה הנכונה.'],
      ['blockquote', 'אם היו מגישים לי רק את הרוטב עם כף, הייתי מזמינה שוב.'],
      ['normal', 'המחיר גבוה, וזה מה שמנע ממנו את העשר.'],
    ],
  },
  {
    slug: 'miznon-hatsedef',
    restaurant: 'מזנון הצדף',
    city: 'יפו',
    address: 'נמל יפו',
    location: { lat: 32.0525, lng: 34.7519 },
    score: 8.5,
    subScores: { dressing: 8, lettuce: 9, croutons: 9, parmesan: 7, protein: 9 },
    price: 68,
    visitedAt: '2026-05-30',
    verdict: 'הקרוטונים פריכים בצורה שגורמת לשולחן שלידך להסתכל.',
    tags: ['נוף לים', 'דגים', 'סוף שבוע'],
    wouldReturn: true,
    body: [
      ['normal', 'ישבתי מול הים, וזה כנראה הוסיף חצי נקודה. אבל גם בלי הים — הסלט הזה יודע מה הוא רוצה להיות.'],
      ['normal', 'הדג שהוסיפו במקום עוף הפתיע אותי לטובה. הרוטב קצת עדין מדי, ואני אוהבת שהוא נושך.'],
    ],
  },
  {
    slug: 'cafe-louise',
    restaurant: 'קפה לואיז',
    city: 'תל אביב',
    address: 'שבזי 18, נווה צדק',
    location: { lat: 32.0616, lng: 34.7639 },
    score: 7.5,
    subScores: { dressing: 7, lettuce: 8, croutons: 6, parmesan: 8, value: 8 },
    price: 56,
    visitedAt: '2026-05-11',
    verdict: 'סלט הגון של שכונה טובה. לא מרגש, אבל אף פעם לא מאכזב.',
    tags: ['שכונתי', 'מחיר הוגן'],
    wouldReturn: true,
    body: [
      ['normal', 'יש מקומות שאת חוזרת אליהם בגלל הכיסא ליד החלון. זה אחד מהם. הסלט טוב, המנה גדולה, והמחיר הוגן.'],
      ['normal', 'הקרוטונים מהשקית. אני יודעת, גם הם יודעים, וכולנו ממשיכים בחיינו.'],
    ],
  },
  {
    slug: 'terza',
    restaurant: 'טרצה',
    city: 'ירושלים',
    address: 'מחנה יהודה',
    location: { lat: 31.7854, lng: 35.2124 },
    score: 8,
    subScores: { dressing: 9, lettuce: 7, croutons: 8, parmesan: 8, protein: 7, value: 8 },
    price: 62,
    visitedAt: '2026-04-22',
    verdict: 'רוטב אמיץ, חסה עייפה. יחד הם עדיין מסתדרים.',
    tags: ['שוק', 'רוטב חזק'],
    wouldReturn: true,
    body: [
      ['normal', 'הגעתי בשעה שאף אחד לא מגיע, וקיבלתי סלט שהורכב באהבה בשביל אדם אחד. הרוטב חזק, לימוני, עם חרדל שמרגישים.'],
      ['normal', 'החסה, לעומת זאת, כבר ראתה ימים טובים יותר. חבל.'],
    ],
  },
  {
    slug: 'emilia-corner',
    restaurant: 'הפינה של אמיליה',
    city: 'רמת גן',
    address: 'ביאליק 31',
    location: { lat: 32.0823, lng: 34.8103 },
    score: 6,
    subScores: { dressing: 5, lettuce: 7, croutons: 7, parmesan: 4, value: 6 },
    price: 52,
    visitedAt: '2026-03-08',
    verdict: 'פרמזן שהוא בעצם גבינה צהובה. נו, באמת.',
    tags: ['אכזבה קטנה'],
    wouldReturn: false,
    body: [
      ['normal', 'אני מוכנה לסלוח על הרבה דברים, אבל לא על פרמזן מזויף. כל השאר היה סביר לגמרי, ודווקא בגלל זה זה מעצבן.'],
    ],
  },
  {
    slug: 'salat-vahetsi',
    restaurant: 'סלט וחצי',
    city: 'הרצליה',
    address: 'מדינת היהודים 60',
    location: { lat: 32.1624, lng: 34.8065 },
    score: 4.5,
    subScores: { dressing: 3, lettuce: 6, croutons: 5, parmesan: 4, value: 4 },
    price: 64,
    visitedAt: '2026-02-19',
    verdict: 'מיונז שמתחזה לרוטב קיסר. התחזות לא משכנעת.',
    tags: ['לא שוב'],
    wouldReturn: false,
    body: [
      ['normal', 'לא כל דבר לבן שנמרח על חסה הוא רוטב קיסר. זה נכתב מתוך אהבה, ומתוך רצון שמישהו שם יקרא ויתקן.'],
    ],
  },
];

const posts = [
  {
    slug: 'why-caesar',
    title: 'למה דווקא קיסר',
    publishedAt: '2026-06-02',
    excerpt: 'כי סלט קיסר הוא מבחן. חמישה מרכיבים, שום מקום להתחבא.',
    tags: ['מחשבות', 'אוכל'],
    body: [
      ['normal', 'אנשים שואלים אותי למה אני מזמינה תמיד את אותו הדבר. התשובה היא שסלט קיסר הוא לא מנה, הוא בדיקה.'],
      ['normal', 'יש בו חמישה מרכיבים. חסה, רוטב, קרוטונים, פרמזן, ומשהו שמוסיפים כדי להצדיק את המחיר. אין רוטב חריף שיכסה, אין רוטב מתוק שיסיח את הדעת. או שהמטבח יודע מה הוא עושה, או שלא.'],
      ['h2', 'מה אני בעצם בודקת'],
      ['normal', 'קודם כל את הרוטב. אחר כך את הטמפרטורה של החסה — סלט קיסר פושר הוא סלט קיסר מובס. ורק בסוף את הקרוטונים, שהם החלק שהכי קל לזייף בו ושהכי קל גם לעשות נכון.'],
      ['normal', 'וזהו. זה כל הסוד.'],
    ],
  },
  {
    slug: 'morning-at-the-market',
    title: 'בוקר אחד בשוק',
    publishedAt: '2026-05-18',
    excerpt: 'לא כתבתי על אוכל. כתבתי על אישה שמכרה לי עגבניות.',
    tags: ['מחשבות'],
    body: [
      ['normal', 'היא שקלה את העגבניות פעמיים, לא בגלל שהמאזניים טעו אלא בגלל שהיא רצתה שאני אראה.'],
      ['normal', 'יש אנשים שעושים את העבודה שלהם כאילו מישהו מסתכל תמיד. אני חושבת שזה הדבר הכי קרוב לאמונה שראיתי השבוע.'],
    ],
  },
  {
    slug: 'anchovy',
    title: 'על זה שכולם מפחדים מאנשובי',
    publishedAt: '2026-04-05',
    excerpt: 'הדג הקטן הזה הוא ההבדל בין רוטב לבין מים עם שמנת.',
    tags: ['אוכל', 'דעות'],
    body: [
      ['normal', 'כשאני שואלת מלצרים אם יש אנשובי ברוטב, רובם עונים "לא, לא, אל תדאגי". הם חושבים שהם מרגיעים אותי.'],
      ['normal', 'אני רוצה להגיד להם: זה בדיוק מה שחיפשתי.'],
    ],
  },
];

const documents = [
  ...salads.map((salad) => ({
    _id: `sample-salad-${salad.slug}`,
    _type: 'salad',
    restaurant: salad.restaurant,
    slug: { _type: 'slug', current: salad.slug },
    city: salad.city,
    address: salad.address,
    location: { _type: 'geopoint', lat: salad.location.lat, lng: salad.location.lng },
    score: salad.score,
    subScores: salad.subScores,
    price: salad.price,
    visitedAt: salad.visitedAt,
    verdict: salad.verdict,
    tags: salad.tags,
    wouldReturn: salad.wouldReturn,
    ...(salad.featured ? { featured: true } : {}),
    body: body(salad.body),
  })),

  ...posts.map((post) => ({
    _id: `sample-post-${post.slug}`,
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    tags: post.tags,
    body: body(post.body),
  })),

  {
    _id: 'settings',
    _type: 'settings',
    title: 'הקיסרית',
    tagline: 'מדריך אישי לסלטי קיסר, ולעוד כמה דברים שעוברים לי בראש',
    heroText: 'אני אוכלת סלט קיסר בכל מקום שאני מגיעה אליו, ומדרגת. בין סלט לסלט אני גם כותבת.',
    aboutTitle: 'קצת עליי',
    about: body([
      ['normal', 'שלום, אני כאן כדי לדרג סלטי קיסר. התחלתי כי חבר אמר לי שאין הבדל אמיתי בין אחד לשני, והמשכתי כי התברר שהוא טעה מאוד.'],
      ['normal', 'בין דירוג לדירוג אני כותבת על דברים אחרים לגמרי. זה החלק שאני הכי אוהבת.'],
    ]),
    scaleNote: 'הדירוג הוא מ־1 עד 10, ואין בו שום דבר מדעי. זה הטעם שלי.',
  },
];

for (const doc of documents) {
  process.stdout.write(`${JSON.stringify(doc)}\n`);
}

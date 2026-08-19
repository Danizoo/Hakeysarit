import { defineField, defineType } from 'sanity';

/** One Caesar salad, at one restaurant. */
export const salad = defineType({
  name: 'salad',
  title: 'סלט קיסר',
  type: 'document',
  fields: [
    defineField({
      name: 'restaurant',
      title: 'שם המסעדה',
      type: 'string',
      validation: (rule) => rule.required().error('צריך למלא שם מסעדה'),
    }),

    defineField({
      name: 'score',
      title: 'הציון (1 עד 10)',
      description: 'אפשר גם חצאים, למשל 8.5',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(10).error('הציון צריך להיות בין 1 ל־10'),
    }),

    defineField({
      name: 'verdict',
      title: 'שורת המחץ',
      description: 'משפט אחד קצר שמופיע בכרטיס של הסלט ברשימה ובמפה',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(180).warning('כדאי לקצר — זה מוצג בכרטיס קטן'),
    }),

    defineField({
      name: 'photos',
      title: 'תמונות',
      description: 'התמונה הראשונה היא זו שתופיע בכרטיס. אפשר לגרור כדי לשנות סדר.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'תיאור התמונה',
              description: 'למי שלא רואה את התמונה, ולגוגל',
              type: 'string',
            },
          ],
        },
      ],
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'city',
      title: 'עיר',
      description: 'משמש לסינון לפי עיר בדף הסלטים',
      type: 'string',
    }),

    defineField({
      name: 'address',
      title: 'כתובת',
      description: 'רחוב ומספר. מספיק כדי שנמצא את המקום על המפה.',
      type: 'string',
    }),

    defineField({
      name: 'mapsUrl',
      title: 'קישור מגוגל מפות',
      description:
        'לא חובה. אם המקום קשה למצוא לפי הכתובת, פשוט חפשי אותו בגוגל מפות, לחצי "שיתוף" והדביקי כאן את הקישור.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),

    defineField({
      name: 'location',
      title: 'מיקום מדויק',
      description: 'מתמלא לבד לפי הכתובת. אין צורך לגעת בזה.',
      type: 'geopoint',
    }),

    defineField({
      name: 'price',
      title: 'מחיר בשקלים',
      type: 'number',
      validation: (rule) => rule.min(0).max(1000),
    }),

    defineField({
      name: 'visitedAt',
      title: 'תאריך הביקור',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),

    defineField({
      name: 'body',
      title: 'הביקורת המלאה',
      description: 'כאן אפשר לכתוב חופשי, להוסיף כותרות, ציטוטים, קישורים ותמונות',
      type: 'richText',
    }),

    defineField({
      name: 'subScores',
      title: 'ציונים לפי מרכיב',
      description: 'לא חובה. כל מה שממלאים מופיע כגרף קטן בעמוד הסלט.',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'dressing', title: 'הרוטב', type: 'number', validation: (r) => r.min(1).max(10) },
        { name: 'lettuce', title: 'החסה', type: 'number', validation: (r) => r.min(1).max(10) },
        { name: 'croutons', title: 'הקרוטונים', type: 'number', validation: (r) => r.min(1).max(10) },
        { name: 'parmesan', title: 'הפרמזן', type: 'number', validation: (r) => r.min(1).max(10) },
        { name: 'protein', title: 'התוספת (עוף, דג, וכו׳)', type: 'number', validation: (r) => r.min(1).max(10) },
        { name: 'value', title: 'תמורה למחיר', type: 'number', validation: (r) => r.min(1).max(10) },
      ],
    }),

    defineField({
      name: 'wouldReturn',
      title: 'אחזור לשם?',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'featured',
      title: 'להבליט באתר',
      description: 'סלטים מובלטים מקבלים סימון מיוחד וקופצים לראש דף הבית',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'tags',
      title: 'תגיות',
      description: 'למשל: אנשובי, נוף לים, ארוחת צהריים',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    defineField({
      name: 'slug',
      title: 'כתובת הדף',
      description: 'נוצר לבד משם המסעדה. אחרי שהעמוד עלה עדיף לא לשנות אותו.',
      type: 'slug',
      options: {
        source: 'restaurant',
        maxLength: 80,
        slugify: (input) =>
          input
            .trim()
            .toLowerCase()
            .replace(/["'׳״]/g, '')
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80),
      },
      validation: (rule) => rule.required().error('צריך ללחוץ על "Generate" כדי ליצור כתובת לדף'),
    }),
  ],

  orderings: [
    { name: 'scoreDesc', title: 'ציון — מהגבוה לנמוך', by: [{ field: 'score', direction: 'desc' }] },
    { name: 'recent', title: 'תאריך ביקור — מהחדש לישן', by: [{ field: 'visitedAt', direction: 'desc' }] },
    { name: 'name', title: 'שם המסעדה', by: [{ field: 'restaurant', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'restaurant', city: 'city', score: 'score', media: 'photos.0' },
    prepare: ({ title, city, score, media }) => ({
      title: title ?? 'ללא שם',
      subtitle: [score != null ? `${score}/10` : 'בלי ציון', city].filter(Boolean).join(' · '),
      media,
    }),
  },
});

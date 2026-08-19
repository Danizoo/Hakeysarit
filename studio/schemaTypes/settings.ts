import { defineField, defineType } from 'sanity';

/** A single document that holds the texts appearing around the whole site. */
export const settings = defineType({
  name: 'settings',
  title: 'הגדרות האתר',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'שם האתר',
      type: 'string',
      initialValue: 'הקיסרית',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'שורת תיאור',
      description: 'מופיעה בגוגל ובשיתופים בוואטסאפ',
      type: 'string',
      initialValue: 'מדריך אישי לסלטי קיסר, ולעוד כמה דברים שעוברים לי בראש',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'heroText',
      title: 'הטקסט בראש דף הבית',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'aboutTitle',
      title: 'כותרת עמוד "עליי"',
      type: 'string',
      initialValue: 'קצת עליי',
    }),

    defineField({
      name: 'about',
      title: 'תוכן עמוד "עליי"',
      type: 'richText',
    }),

    defineField({
      name: 'portrait',
      title: 'תמונה שלך',
      description: 'מופיעה בעמוד "עליי"',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'תיאור התמונה', type: 'string' }],
    }),

    defineField({
      name: 'scaleNote',
      title: 'הסבר על שיטת הדירוג',
      description: 'מופיע בתחתית כל עמוד ובראש דף הסלטים',
      type: 'text',
      rows: 2,
      initialValue: 'הדירוג הוא מ־1 עד 10, ואין בו שום דבר מדעי. זה הטעם שלי.',
    }),

    defineField({
      name: 'email',
      title: 'אימייל ליצירת קשר',
      description: 'לא חובה. אם ממלאים, מופיע כפתור "כתבו לי".',
      type: 'string',
    }),

    defineField({
      name: 'instagram',
      title: 'קישור לאינסטגרם',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],

  preview: {
    prepare: () => ({ title: 'הגדרות האתר' }),
  },
});

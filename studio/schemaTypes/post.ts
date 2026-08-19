import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'כתבה',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'כותרת',
      type: 'string',
      validation: (rule) => rule.required().error('צריך כותרת'),
    }),

    defineField({
      name: 'excerpt',
      title: 'תקציר',
      description: 'שתיים־שלוש שורות שמופיעות ברשימת הכתבות ובתצוגה המקדימה בוואטסאפ',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(220).warning('כדאי לקצר'),
    }),

    defineField({
      name: 'cover',
      title: 'תמונה ראשית',
      description: 'לא חובה',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'תיאור התמונה', type: 'string' }],
    }),

    defineField({
      name: 'body',
      title: 'הכתבה',
      type: 'richText',
    }),

    defineField({
      name: 'publishedAt',
      title: 'תאריך פרסום',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'תגיות',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    defineField({
      name: 'slug',
      title: 'כתובת הדף',
      description: 'נוצרת לבד מהכותרת. אחרי שהכתבה עלתה עדיף לא לשנות.',
      type: 'slug',
      options: {
        source: 'title',
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
    { name: 'recent', title: 'תאריך — מהחדש לישן', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],

  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'cover' },
    prepare: ({ title, date, media }) => ({
      title: title ?? 'ללא כותרת',
      subtitle: date ? new Date(date).toLocaleDateString('he-IL') : 'בלי תאריך',
      media,
    }),
  },
});

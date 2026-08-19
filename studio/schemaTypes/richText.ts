import { defineArrayMember, defineType } from 'sanity';

/** The writing area used by reviews, posts and the about page.
 *  Deliberately small: only the formatting the site actually renders. */
export const richText = defineType({
  name: 'richText',
  title: 'טקסט',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'טקסט רגיל', value: 'normal' },
        { title: 'כותרת', value: 'h2' },
        { title: 'כותרת משנה', value: 'h3' },
        { title: 'ציטוט', value: 'blockquote' },
      ],
      lists: [
        { title: 'רשימה', value: 'bullet' },
        { title: 'רשימה ממוספרת', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'מודגש', value: 'strong' },
          { title: 'נטוי', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'קישור',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'כתובת הקישור',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }).required(),
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'image',
      title: 'תמונה',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'תיאור התמונה', type: 'string' },
        { name: 'caption', title: 'כיתוב מתחת לתמונה', type: 'string' },
      ],
    }),
  ],
});

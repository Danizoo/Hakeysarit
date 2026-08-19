import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'hakeysarit',
  title: 'הקיסרית',
  projectId,
  dataset,

  plugins: [
    structureTool({
      name: 'content',
      title: 'התוכן',
      structure: (S) =>
        S.list()
          .title('התוכן של האתר')
          .items([
            S.listItem()
              .title('🥗 סלטים')
              .child(S.documentTypeList('salad').title('סלטים').defaultOrdering([{ field: 'visitedAt', direction: 'desc' }])),

            S.listItem()
              .title('✍️ כתבות')
              .child(S.documentTypeList('post').title('כתבות').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),

            S.divider(),

            // One settings document, always the same one.
            S.listItem()
              .title('⚙️ הגדרות האתר')
              .id('settings')
              .child(S.document().schemaType('settings').documentId('settings').title('הגדרות האתר')),
          ]),
    }),
    visionTool({ title: 'שאילתות' }),
  ],

  schema: {
    types: schemaTypes,
    // Nobody should be able to create a second settings document.
    templates: (templates) => templates.filter((template) => template.schemaType !== 'settings'),
  },

  document: {
    newDocumentOptions: (previous) => previous.filter((item) => item.templateId !== 'settings'),
    actions: (actions, context) =>
      context.schemaType === 'settings'
        ? actions.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : actions,
  },
});
